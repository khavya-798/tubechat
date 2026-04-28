import os
import uuid
import threading
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

try:
    load_dotenv() 
except:
    pass

from models import AnalyzeRequest, AskRequest, AskResponse, SessionInfo
from downloader import download_audio
from transcriber import transcribe_audio
from qa_chain import QABot

app = FastAPI(title="Tubechat API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores
_sessions: dict[str, dict] = {}
_jobs: dict[str, dict] = {}  # job_id → {status, session_id, title, error, step}


def _run_analyze(job_id: str, url: str):
    try:
        _jobs[job_id]["step"] = "Downloading audio..."
        audio_path, title = download_audio(url)

        _jobs[job_id]["step"] = "Transcribing with Whisper..."
        transcript = transcribe_audio(audio_path)

        session_id = str(uuid.uuid4())

        _jobs[job_id]["step"] = "Building vector index..."
        bot = QABot(transcript=transcript, session_id=session_id)

        _sessions[session_id] = {
            "bot": bot,
            "title": title,
            "created_at": datetime.utcnow().isoformat(),
            "transcript_length": len(transcript),
        }

        _jobs[job_id].update({
            "status": "done",
            "session_id": session_id,
            "title": title,
            "step": "Ready",
        })

    except Exception as e:
        _jobs[job_id].update({
            "status": "error",
            "error": str(e),
            "step": "Failed",
        })


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze")
def analyze(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    _jobs[job_id] = {
        "status": "processing",
        "step": "Starting...",
        "session_id": None,
        "title": None,
        "error": None,
    }
    background_tasks.add_task(_run_analyze, job_id, req.url)
    return {"job_id": job_id, "status": "processing"}


@app.get("/api/status/{job_id}")
def job_status(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.post("/api/ask", response_model=AskResponse)
def ask(req: AskRequest):
    session = _sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    try:
        result = session["bot"].ask(req.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Q&A failed: {e}")

    return AskResponse(
        answer=result.answer,
        confidence=result.confidence,
        sources=result.sources,
        follow_up=result.follow_up,
    )


@app.get("/api/sessions", response_model=list[SessionInfo])
def list_sessions():
    return [
        SessionInfo(
            session_id=sid,
            title=data["title"],
            created_at=data["created_at"],
        )
        for sid, data in reversed(list(_sessions.items()))
    ]
