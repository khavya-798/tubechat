# Tubechat — Chat with Any YouTube Video

A multimodal AI web application that lets you have a conversation with any YouTube video. Paste a link, and get answers grounded in the transcript — with source excerpts and a confidence score.

Built as part of the **Building Multimodal AI Applications with LangChain & the OpenAI API** project (July 2025).

---

## What It Does

- Paste any YouTube URL and click **Analyze**
- The app downloads the audio, transcribes it using **Azure Whisper**
- The transcript is chunked, embedded with **Azure text-embedding-3-small**, and stored in a **FAISS** vector store
- Ask questions in natural language — **Azure GPT-4o** retrieves the most relevant transcript chunks and returns a structured answer with confidence level and source excerpts
- Session history is shown in the collapsible sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Backend | FastAPI, Python |
| Transcription | Azure OpenAI Whisper |
| Embeddings | Azure OpenAI text-embedding-3-small |
| Vector Store | FAISS (local) |
| LLM | Azure OpenAI GPT-4o |
| Orchestration | LangChain |
| Audio Download | yt-dlp |

---

## Project Structure

```
tubechat/
├── backend/
│   ├── main.py           # FastAPI app — API routes
│   ├── models.py         # Pydantic request/response schemas
│   ├── downloader.py     # yt-dlp YouTube audio download
│   ├── transcriber.py    # Azure Whisper transcription
│   ├── qa_chain.py       # LangChain FAISS + GPT-4o Q&A chain
│   ├── requirements.txt
│   ├── .env.example      # Environment variable template
│   └── Procfile          # Render deployment
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── config.js
    │   └── components/
    │       ├── Sidebar.jsx
    │       ├── LandingPage.jsx
    │       ├── ChatPage.jsx
    │       ├── UrlInput.jsx
    │       ├── MessageBubble.jsx
    │       └── AnswerCard.jsx
    ├── .env.example       # Environment variable template
    └── vercel.json        # Vercel deployment config
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- FFmpeg on PATH — needed by yt-dlp for audio conversion
  ```bash
  # Windows
  winget install Gyan.FFmpeg
  ```
- An **Azure AI Foundry** project with three deployed models:
  - `gpt-4o`
  - `text-embedding-3-small`
  - `whisper`

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/khavya-798/tubechat.git
cd tubechat
```

### 2. Backend setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create your environment file
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux
```

Edit `backend/.env` and fill in your Azure credentials:

```
AZURE_OPENAI_KEY=your-key-here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT=text-embedding-3-small
AZURE_OPENAI_WHISPER_DEPLOYMENT=whisper
AZURE_OPENAI_API_VERSION=2024-12-01-preview
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`

---

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create your environment file
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux
```

The default `frontend/.env` works out of the box for local dev (Vite proxies `/api/*` to the backend automatically).

Start the frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## How to Use

1. Open `http://localhost:5173` in your browser
2. Paste any YouTube URL into the input bar
3. Click **Analyze** — the app downloads, transcribes, and indexes the video (takes 15–60 seconds depending on video length)
4. Once ready, the chat interface opens — ask anything about the video
5. Each answer shows a **confidence level** (high / medium / low) and **source excerpts** from the transcript

---

## Limitations

- Maximum video length: ~50 minutes (Azure Whisper 25 MB file limit)
- Sessions are in-memory — restart clears all sessions
- Transcript cache and FAISS index are stored locally and not persisted across server restarts on cloud free tiers

---


