#!/bin/bash
if ! command -v ffmpeg &> /dev/null; then
    apt-get install -y ffmpeg -q
fi
exec gunicorn -w 2 -k uvicorn.workers.UvicornWorker main:app --timeout 120
