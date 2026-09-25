"""
Bloomi voice-over + lip-sync data.

1. Kokoro TTS (Apache-2.0 model) renders each line.
2. ffmpeg pitch-shifts it up for a friendly mascot timbre (tempo preserved).
3. We export a per-frame loudness envelope (30 fps) so Bloomi's mouth can
   follow the voice in the Remotion composition.

Usage: .venv/bin/python voice.py [voice_name]
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

FPS = 30
HERE = Path(__file__).parent
OUT = HERE / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

VOICE = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
PITCH = 1.16  # +~2.5 semitones: brighter, character-like, still natural
SPEED = 1.05

LINES = [
    ("l1", "Hi! I'm Bloomi!"),
    ("l2", "Every time a child learns something new, I grow a petal!"),
    ("l3", "Come bloom with us, at Universal Blooming!"),
]

kokoro = Kokoro(str(HERE / "models/kokoro-v1.0.onnx"), str(HERE / "models/voices-v1.0.bin"))
meta = {}
for key, text in LINES:
    samples, sr = kokoro.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    raw = OUT / f"{key}.raw.wav"
    sf.write(raw, samples, sr)
    final = OUT / f"{key}.wav"
    # asetrate raises pitch (and speed); atempo brings the speed back.
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
         "-af", f"asetrate={sr}*{PITCH},aresample=44100,atempo={1/PITCH:.4f},"
                "highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=60,loudnorm=I=-16:TP=-1.5",
         "-ar", "44100", str(final)],
        check=True,
    )
    raw.unlink()
    audio, sr2 = sf.read(final)
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    hop = sr2 // FPS
    env = [float(np.sqrt(np.mean(audio[i:i + hop] ** 2))) for i in range(0, len(audio), hop)]
    peak = max(env) or 1
    # Word timings for karaoke captions: spread words across the *voiced* frames
    # in proportion to their length (a light-weight forced alignment).
    norm = [min(1, e / (peak * 0.7)) for e in env]
    voiced = [i for i, e in enumerate(norm) if e > 0.12]
    words = text.split()
    weights = [len(w.strip(",.!?")) + 2 for w in words]
    total = sum(weights)
    cursor, timings = 0.0, []
    for w, wt in zip(words, weights):
        a = voiced[min(len(voiced) - 1, int(cursor / total * len(voiced)))]
        cursor += wt
        b = voiced[min(len(voiced) - 1, int(cursor / total * len(voiced)) - 1)]
        timings.append({"w": w, "start": a, "end": max(a + 2, b)})
    meta[key] = {
        "words": timings,
        "text": text,
        "seconds": round(len(audio) / sr2, 3),
        "frames": len(env),
        "envelope": [round(min(1, e / (peak * 0.7)), 3) for e in env],
    }
    print(f"{key}: {meta[key]['seconds']}s  {text}")

(HERE / "src" / "voice.json").parent.mkdir(exist_ok=True)
(HERE / "src" / "voice.json").write_text(json.dumps(meta))
print("voice:", VOICE)
