#!/usr/bin/env python3
"""
Ring lounge camera announcement script.

Detects the first human motion of the day from a Ring stickup cam (the lounge camera),
fetches the studio terms & rules from the website, synthesizes speech with gTTS,
and plays the audio locally (on the machine where this script runs).
It also flashes Nanoleaf lights as a visual cue.

Idempotent: stores the date of the last announcement in /opt/data/.last_ring_announce
so it only triggers once per calendar day.

Prerequisites:
- `ring-doorbell` library (v0.9.14+), `requests`, `beautifulsoup4`, `gtts`
- Ring auth token in ~/.ring/token.json (set up via `ring-setup.py`)
- Nanoleaf relay running on the local network (see smart-home skill) for optional light cue.
- `ffplay` from ffmpeg (or another audio player) available in PATH.
"""
import asyncio, json, os, sys
from datetime import datetime
from pathlib import Path
import requests
from bs4 import BeautifulSoup
from gtts import gTTS
import subprocess

# --- Configuration ---
RING_CAMERA_NAME = "Lounge"  # substring to match the Ring stickup cam name
STUDIO_RULES_URL = "https://mohikontok.com/studio-rules"  # URL to fetch terms
ANNOUNCE_STATE_FILE = Path("/opt/data/.last_ring_announce")
AUDIO_OUTPUT = Path("/tmp/lounge_announce.mp3")
# Nanoleaf relay endpoint (optional) – adjust if you have a relay running
NANOLEAF_RELAY_URL = "http://localhost:9999/"  # POST JSON actions
# -----------------------------------------------------------------

def load_last_date() -> str:
    if ANNOUNCE_STATE_FILE.exists():
        return ANNOUNCE_STATE_FILE.read_text().strip()
    return ""

def save_last_date(date_str: str):
    ANNOUNCE_STATE_FILE.write_text(date_str)

def fetch_studio_rules() -> str:
    try:
        resp = requests.get(STUDIO_RULES_URL, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        main = soup.find("main") or soup.body
        text = main.get_text(separator=" ", strip=True)
        return text
    except Exception as e:
        print(f"[RingAnnounce] Failed to fetch studio rules: {e}", file=sys.stderr)
        return "Welcome to Mohikontok Sound Lab. Please enjoy your session."

def synthesize_speech(text: str):
    try:
        tts = gTTS(text=text, lang="en")
        tts.save(str(AUDIO_OUTPUT))
    except Exception as e:
        print(f"[RingAnnounce] gTTS failed: {e}", file=sys.stderr)
        raise

def play_audio():
    try:
        subprocess.run(["ffplay", "-nodisp", "-autoexit", str(AUDIO_OUTPUT)], check=False)
    except FileNotFoundError:
        print("[RingAnnounce] ffplay not found – cannot play audio", file=sys.stderr)

def flash_nanoleaf():
    if not NANOLEAF_RELAY_URL:
        return
    try:
        requests.post(NANOLEAF_RELAY_URL, json={"action": "on", "brightness": 80, "ct": 4000}, timeout=5)
        asyncio.sleep(5)
        requests.post(NANOLEAF_RELAY_URL, json={"action": "off"}, timeout=5)
    except Exception as e:
        print(f"[RingAnnounce] Nanoleaf relay error: {e}", file=sys.stderr)

async def main():
    from ring_doorbell import Auth, Ring

    def token_updater(tok):
        token_path = Path.home() / ".ring" / "token.json"
        token_path.write_text(json.dumps(tok, indent=2))
        os.chmod(token_path, 0o600)

    auth = Auth("RingAutomation/1.0", None, token_updater)
    token_file = Path.home() / ".ring" / "token.json"
    if token_file.exists():
        auth._token = json.loads(token_file.read_text())
    await auth.async_refresh_token()

    ring = Ring(auth)
    await ring.async_update_data()
    devices = ring.devices()
    cam = None
    for d in getattr(devices, "stickup_cams", []):
        if RING_CAMERA_NAME.lower() in d.name.lower():
            cam = d
            break
    if not cam:
        print(f"[RingAnnounce] Could not find a stickup cam named '{RING_CAMERA_NAME}'", file=sys.stderr)
        return

    today_str = datetime.now().strftime("%Y-%m-%d")
    if load_last_date() == today_str:
        return

    alerts = cam.active_alerts()
    if not any(a.get("kind") == "motion" for a in alerts):
        return

    print("[RingAnnounce] Motion detected – announcing studio rules")
    rules_text = fetch_studio_rules()
    synthesize_speech(rules_text)
    play_audio()
    try:
        flash_nanoleaf()
    except Exception:
        pass
    save_last_date(today_str)

if __name__ == "__main__":
    asyncio.run(main())
