from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    url: str


class AskRequest(BaseModel):
    session_id: str
    question: str


class AskResponse(BaseModel):
    answer: str
    confidence: str
    sources: list[str]
    follow_up: str | None


class SessionInfo(BaseModel):
    session_id: str
    title: str
    created_at: str
