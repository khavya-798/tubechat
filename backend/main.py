import os
import uuid
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

from models import AnalyzeRequest, AnalyzeResponse, AskRequest, AskResponse, SessionInfo
from downloader import download_audio
from transcriber import transcribe_audio
from qa_chain import QABot

app = FastAPI(title="Tubechat API")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store
_sessions: dict[str, dict] = {}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    try:
        audio_path, title = download_audio(req.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Download failed: {e}")

    try:
        transcript = transcribe_audio(audio_path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")

    session_id = str(uuid.uuid4())

    try:
        bot = QABot(transcript=transcript, session_id=session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build Q&A chain: {e}")

    _sessions[session_id] = {
        "bot": bot,
        "title": title,
        "created_at": datetime.utcnow().isoformat(),
        "transcript_length": len(transcript),
    }

    return AnalyzeResponse(
        session_id=session_id,
        title=title,
        transcript_length=len(transcript),
    )


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
