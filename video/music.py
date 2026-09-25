"""
Original, royalty-free score + SFX for the Bloomi intro (v2), synthesised from
scratch, no samples:

- Ukulele via Karplus-Strong plucked-string synthesis (sounds like a real string)
- Glockenspiel, bass, hand claps, shaker; stereo panning + synthetic reverb
- Arranged to the picture: intro swell -> band enters exactly on the bloom (1.2 s)
  -> petal chimes on the beat, rising a note each time -> ta-da on full bloom (7.2 s)
  -> gentle outro under the end card.

Usage: .venv/bin/python music.py
"""
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
OUT = Path(__file__).parent / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)
LENGTH = 12.0
BLOOM = 1.2          # band downbeat (frame 36)
BEAT = 0.5           # 120 BPM
PETALS = [4.2, 4.7, 5.2, 5.7, 6.2]
CELEBRATE = 7.2
rng = np.random.default_rng(11)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def t_axis(d):
    return np.arange(int(d * SR)) / SR


def ks_pluck(freq, dur=1.2, bright=0.5, decay=0.996):
    """Karplus-Strong plucked string (ukulele-like)."""
    n = int(dur * SR)
    period = max(2, int(SR / freq))
    buf = rng.uniform(-1, 1, period)
    # brightness: low-pass the initial excitation
    for _ in range(int((1 - bright) * 4)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = decay * 0.5 * (buf[i % period] + buf[(i + 1) % period])
    return out * np.exp(-np.arange(n) / SR * 1.6)


def glock(freq, dur=1.4, vel=1.0):
    t = t_axis(dur)
    env = np.exp(-t * 3.0) * (1 - np.exp(-t * 3000))
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(2 * np.pi * freq * 2.76 * t) * np.exp(-t * 9) + 0.12 * np.sin(2 * np.pi * freq * 5.4 * t) * np.exp(-t * 20)) * env * vel


def bass(freq, dur=0.45, vel=1.0):
    t = t_axis(dur)
    env = np.exp(-t * 5) * (1 - np.exp(-t * 300))
    return (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * env * vel


def clap(vel=1.0):
    out = np.zeros(int(0.2 * SR))
    for k, off in enumerate([0, 0.011, 0.022]):  # a clap is several quick bursts
        t = t_axis(0.18)
        burst = rng.standard_normal(len(t)) * np.exp(-t * (90 if k < 2 else 28))
        i = int(off * SR)
        out[i:i + len(burst)] += burst[: len(out) - i]
    sos = butter(2, [900, 5000], btype="band", fs=SR, output="sos")
    return sosfilt(sos, out) * vel


def shaker(vel=1.0):
    t = t_axis(0.07)
    sos = butter(2, 6000, btype="high", fs=SR, output="sos")
    return sosfilt(sos, rng.standard_normal(len(t))) * np.exp(-t * 55) * vel


def kick(vel=1.0):
    t = t_axis(0.25)
    return np.sin(2 * np.pi * (45 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 14) * vel


class Stereo:
    def __init__(self, dur):
        self.L = np.zeros(int(dur * SR))
        self.R = np.zeros(int(dur * SR))

    def add(self, sig, at, pan=0.0, gain=1.0):
        i = int(at * SR)
        if i >= len(self.L):
            return
        j = min(len(self.L), i + len(sig))
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.L[i:j] += sig[: j - i] * gain * l
        self.R[i:j] += sig[: j - i] * gain * r


def reverb(x, seconds=1.3, mix=0.18):
    t = t_axis(seconds)
    ir = rng.standard_normal(len(t)) * np.exp(-t * 4.2)
    sos = butter(1, 5500, btype="low", fs=SR, output="sos")
    ir = sosfilt(sos, ir)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix * 0.9


def strum(mix, chord, at, pan, down=True, gain=0.22):
    notes = chord if down else chord[::-1]
    for k, m in enumerate(notes):
        mix.add(ks_pluck(hz(m), 1.0, bright=0.6 if down else 0.45), at + k * 0.012, pan, gain * (1 if down else 0.7))


# ────────────────────────── Score ──────────────────────────
mix = Stereo(LENGTH)

# Intro (0-1.2 s): twinkly glock arpeggio swelling up to the bloom.
for i, m in enumerate([84, 88, 91, 96, 91, 96, 100]):
    mix.add(glock(hz(m), 1.2), 0.1 + i * 0.15, pan=0.3 * np.sin(i), gain=0.10 + 0.03 * i)

# Chord progression from the bloom: C | F | G | C | Am | F | G | C  (one per bar = 2 s)... compressed to fit
UKE = {  # ukulele voicings (GCEA-ish, midi)
    "C": [67, 72, 76, 84], "F": [69, 72, 77, 81], "G": [67, 74, 79, 83], "Am": [69, 72, 76, 81],
}
prog = ["C", "F", "G", "C", "Am", "G"]  # 6 half-bars? use 1 chord per 2 beats to stay lively
bar_len = 4 * BEAT
chords_at = [BLOOM + i * 2 * BEAT for i in range(10)]
seq = ["C", "C", "F", "F", "G", "G", "C", "C", "F", "G"]  # 2 beats each
strum_pattern = [(0, True), (0.5, True), (0.75, False), (1.25, False), (1.5, True), (1.75, False)]  # in beats

for ci, (at, name) in enumerate(zip(chords_at, seq)):
    if at >= LENGTH - 1.0:
        break
    for off, down in strum_pattern:
        if off >= 2:
            continue
        t0 = at + off * BEAT
        if CELEBRATE - 0.05 < t0 < CELEBRATE + 0.6 and off > 0:
            continue  # leave room for the ta-da
        strum(mix, UKE[name], t0, pan=-0.25, down=down, gain=0.2)

# Final chord under the end card, let it ring.
strum(mix, UKE["C"], 10.2, pan=-0.2, gain=0.24)
strum(mix, [60, 64, 67, 72], 10.22, pan=0.2, gain=0.12)

# Bass on beats 1 & 3 of each 2-beat chord.
ROOT = {"C": 48, "F": 41, "G": 43, "Am": 45}
for at, name in zip(chords_at, seq):
    if at >= 10.2:
        break
    mix.add(bass(hz(ROOT[name]), 0.45), at, 0, 0.5)
    mix.add(bass(hz(ROOT[name] + 7), 0.3), at + BEAT, 0, 0.28)
mix.add(bass(hz(36), 1.4), 10.2, 0, 0.55)

# Drums: soft kick on beats, claps on off-beats (2 & 4), shaker 8ths; start at the bloom.
k = 0
t = BLOOM
while t < 10.2:
    beat_in_bar = k % 4
    if beat_in_bar in (0, 2):
        mix.add(kick(), t, 0, 0.35)
    else:
        mix.add(clap(), t, 0.1, 0.22)
    mix.add(shaker(), t, 0.5, 0.05)
    mix.add(shaker(), t + BEAT / 2, 0.5, 0.08)
    t += BEAT
    k += 1

# Glock melody over the petal section (answers the chimes, sits lower).
melody = [(2.2, 76), (2.45, 79), (2.7, 81), (3.2, 79), (3.7, 76), (7.7, 88), (7.95, 91), (8.2, 96), (8.95, 91), (9.2, 93), (9.7, 91)]
for at, m in melody:
    mix.add(glock(hz(m), 1.0), at, 0.35, 0.09)

L = reverb(mix.L)
R = reverb(mix.R)
fade = np.ones_like(L)
f0 = int((LENGTH - 1.0) * SR)
fade[f0:] = np.linspace(1, 0, len(L) - f0) ** 1.5
stereo = np.stack([L * fade, R * fade], axis=1)
stereo /= np.max(np.abs(stereo)) + 1e-9
sf.write(OUT / "music.wav", (stereo * 0.85).astype(np.float32), SR)

# ────────────────────────── SFX ──────────────────────────
def save(name, sig, gain=0.8):
    sig = sig / (np.max(np.abs(sig)) + 1e-9)
    sf.write(OUT / f"{name}.wav", (sig * gain).astype(np.float32), SR)


# Slide whistle up (bud growing): sine with rising pitch + vibrato.
t = t_axis(0.9)
f = 500 + 1100 * (t / t[-1]) ** 1.6
phase = 2 * np.pi * np.cumsum(f * (1 + 0.012 * np.sin(2 * np.pi * 6 * t))) / SR
save("slide", np.sin(phase) * np.minimum(1, t * 12) * np.minimum(1, (t[-1] - t) * 20), 0.35)

# Bloom burst: pop + shimmering glock cluster.
t = t_axis(0.15)
pop = np.sin(2 * np.pi * (1100 * np.exp(-t * 20) + 220) * t) * np.exp(-t * 30)
burst = np.zeros(int(1.4 * SR))
burst[: len(pop)] += pop
for i, m in enumerate([96, 100, 103, 108, 112]):
    g = glock(hz(m), 1.2, 0.5)
    s = int((0.02 + i * 0.04) * SR)
    burst[s:s + len(g)] += g[: len(burst) - s]
save("bloom", reverb(burst, 1.0, 0.25), 0.7)

# Boing (spring landing).
t = t_axis(0.45)
f = 180 + 220 * np.exp(-t * 6) * (1 + 0.35 * np.sin(2 * np.pi * 14 * t))
save("boing", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7), 0.45)

# Whoosh for flying tiles.
t = t_axis(0.4)
noise = rng.standard_normal(len(t))
lo = sosfilt(butter(2, [600, 3500], btype="band", fs=SR, output="sos"), noise)
save("whoosh", lo * np.sin(np.pi * t / t[-1]) ** 2, 0.4)

# Petal chimes, rising C6 D6 E6 G6 A6 (pentatonic = always pleasant).
for i, m in enumerate([84, 86, 88, 91, 93]):
    c = glock(hz(m), 1.1, 1.0)
    c[: int(0.8 * SR)] += 0.4 * glock(hz(m + 12), 0.8, 1.0)
    save(f"chime{i}", reverb(c, 0.9, 0.2), 0.55)

# Ta-da: bright stacked chord strum + shimmer.
tada = Stereo(2.0)
for k2, m in enumerate([60, 64, 67, 72, 76, 79, 84]):
    tada.add(ks_pluck(hz(m), 1.8, 0.8), k2 * 0.018, 0, 0.3)
for k2, m in enumerate([96, 100, 103, 108]):
    tada.add(glock(hz(m), 1.4), 0.08 + k2 * 0.05, 0, 0.25)
save("tada", reverb(tada.L, 1.2, 0.25), 0.8)

# Swish for the flower wipe.
t = t_axis(0.5)
noise = rng.standard_normal(len(t))
sw = sosfilt(butter(2, [1500, 7000], btype="band", fs=SR, output="sos"), noise)
save("swish", sw * np.sin(np.pi * (t / t[-1]) ** 0.6) ** 2, 0.35)

print("score + sfx written to", OUT)
