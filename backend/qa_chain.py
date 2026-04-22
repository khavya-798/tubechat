import os
from typing import Optional
from pydantic import BaseModel, Field
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter

FAISS_BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "faiss_index")


class QAResponse(BaseModel):
    answer: str = Field(description="Direct, factual answer to the user's question.")
    confidence: str = Field(description="Confidence level: 'high', 'medium', or 'low'.")
    sources: list[str] = Field(
        description="Verbatim excerpts from the transcript supporting the answer.",
        default_factory=list,
    )
    follow_up: Optional[str] = Field(
        default=None,
        description="A suggested follow-up question the user might find interesting.",
    )


_SYSTEM_PROMPT = """You are an expert assistant answering questions about a YouTube video.
Use ONLY the transcript excerpts below. If the answer is not in the excerpts, say so clearly.

Transcript excerpts:
{context}"""


def _chunk_transcript(transcript: str) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_text(transcript)
    return [Document(page_content=c, metadata={"chunk_index": i}) for i, c in enumerate(chunks)]


def _build_embeddings() -> AzureOpenAIEmbeddings:
    return AzureOpenAIEmbeddings(
        azure_deployment=os.environ.get("AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT", "text-embedding-3-small"),
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_KEY"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
    )


def _build_llm() -> AzureChatOpenAI:
    return AzureChatOpenAI(
        azure_deployment=os.environ.get("AZURE_OPENAI_CHAT_DEPLOYMENT", "gpt-4o"),
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_key=os.environ["AZURE_OPENAI_KEY"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-12-01-preview"),
        temperature=0,
    )


class QABot:
    def __init__(self, transcript: str, session_id: str, force_rebuild: bool = False):
        index_dir = os.path.join(FAISS_BASE_DIR, session_id)
        embeddings = _build_embeddings()
        llm = _build_llm()

        if not force_rebuild and os.path.exists(index_dir):
            store = FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)
        else:
            documents = _chunk_transcript(transcript)
            store = FAISS.from_documents(documents, embeddings)
            os.makedirs(index_dir, exist_ok=True)
            store.save_local(index_dir)

        retriever = store.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 5, "fetch_k": 20},
        )
        structured_llm = llm.with_structured_output(QAResponse)
        prompt = ChatPromptTemplate.from_messages([
            ("system", _SYSTEM_PROMPT),
            ("human", "{question}"),
        ])

        def format_docs(docs: list[Document]) -> str:
            return "\n\n---\n\n".join(d.page_content for d in docs)

        self._chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | structured_llm
        )

    def ask(self, question: str) -> QAResponse:
        return self._chain.invoke(question)
