import os
from openai import AzureOpenAI

MAX_WHISPER_BYTES = 25 * 1024 * 1024

# Whisper requires at minimum 2024-06-01 (GA). Use preview for latest Foundry support.
WHISPER_API_VERSION = "2024-12-01-preview"


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe audio using Azure Whisper. Caches result to <audio_path>.txt.
    """
    cache_path = audio_path + ".txt"
    if os.path.exists(cache_path):
        with open(cache_path, "r", encoding="utf-8") as f:
            return f.read()

    file_size = os.path.getsize(audio_path)
    if file_size > MAX_WHISPER_BYTES:
        raise ValueError(
            f"Audio file is {file_size / 1e6:.1f} MB, exceeding Whisper's 25 MB limit."
        )

    endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "").rstrip("/")
    api_key = os.environ.get("AZURE_OPENAI_KEY", "")
    deployment = os.environ.get("AZURE_OPENAI_WHISPER_DEPLOYMENT", "whisper")

    if not endpoint or not api_key:
        raise ValueError("AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY must be set in .env")

    client = AzureOpenAI(
        api_key=api_key,
        azure_endpoint=endpoint,
        api_version=WHISPER_API_VERSION,
    )

    with open(audio_path, "rb") as audio_file:
        response = client.audio.transcriptions.create(
            model=deployment,
            file=audio_file,
            response_format="text",
        )

    transcript: str = response if isinstance(response, str) else response.text

    with open(cache_path, "w", encoding="utf-8") as f:
        f.write(transcript)

    return transcript
