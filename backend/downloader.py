import os
import re
import glob
import yt_dlp

AUDIO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "audio")


def sanitize_filename(name: str) -> str:
    return re.sub(r'[\\/*?:"<>|]', "_", name).strip()


def download_audio(url: str) -> tuple[str, str]:
    """
    Download audio from a YouTube URL.
    Returns (audio_path, video_title).
    """
    os.makedirs(AUDIO_DIR, exist_ok=True)

    info_opts = {"quiet": True, "no_warnings": True}
    with yt_dlp.YoutubeDL(info_opts) as ydl:
        info = ydl.extract_info(url, download=False)
        title = info.get("title", "audio")

    safe_title = sanitize_filename(title)
    expected_path = os.path.join(AUDIO_DIR, f"{safe_title}.mp3")

    if os.path.exists(expected_path):
        return expected_path, title

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(AUDIO_DIR, f"{safe_title}.%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "64",
        }],
        "quiet": True,
        "no_warnings": True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    if not os.path.exists(expected_path):
        candidates = glob.glob(os.path.join(AUDIO_DIR, "*.mp3"))
        if not candidates:
            raise FileNotFoundError(f"Audio file not found in {AUDIO_DIR}")
        expected_path = max(candidates, key=os.path.getmtime)

    return expected_path, title
