import json
import os
import sys
import subprocess
import threading
import time
import cv2
import numpy as np
from flask import Flask, jsonify, render_template, Response, request
# If you're on a Raspberry Pi, picamera2 will work – on macOS, we bypass it.
try:
    from picamera2 import Picamera2
    picam2 = Picamera2()
except ImportError:
    picam2 = None

app = Flask(__name__)

# ------------------- Event theme -------------------
# Set SELFIEBOX_THEME=<id> to use static/themes/<id>/ (built by hardware/tools/theme_builder.py
# from themes/<id>/theme.json). The same theme drives the printed casing parts, so the
# screen, the photo frame and the casing always match.
THEME_ID = os.environ.get("SELFIEBOX_THEME", "")
THEME_DIR = os.path.join(app.static_folder, "themes", THEME_ID) if THEME_ID else ""


def load_theme():
    if not THEME_DIR or not os.path.isfile(os.path.join(THEME_DIR, "theme.json")):
        return None
    with open(os.path.join(THEME_DIR, "theme.json"), encoding="utf-8") as f:
        return json.load(f)


THEME = load_theme()
OVERLAY = None
if THEME and os.path.isfile(os.path.join(THEME_DIR, "overlay.png")):
    OVERLAY = cv2.imread(os.path.join(THEME_DIR, "overlay.png"), cv2.IMREAD_UNCHANGED)


def apply_overlay(frame):
    """Blend the theme's wave bands onto a captured BGR frame."""
    if OVERLAY is None or OVERLAY.shape[2] != 4:
        return frame
    h, w = frame.shape[:2]
    ov = cv2.resize(OVERLAY, (w, h), interpolation=cv2.INTER_AREA)
    alpha = ov[:, :, 3:4].astype(np.float32) / 255.0
    return (frame.astype(np.float32) * (1 - alpha) + ov[:, :, :3].astype(np.float32) * alpha).astype(np.uint8)

# ------------------- Camera Setup -------------------


def initialize_preview():
    """Configure the camera for live preview."""
    if picam2:
        preview_config = picam2.create_preview_configuration(
            main={"size": (800, 480), "format": "RGB888"})
        picam2.configure(preview_config)


if picam2:
    initialize_preview()
    picam2.start()


def gen_frames():
    """Video streaming generator function."""
    while True:
        if sys.platform.startswith('darwin') or not picam2:
            # On macOS or when picam2 is not available: generate a dummy frame.
            frame = np.zeros((480, 800, 3), dtype=np.uint8)
            cv2.putText(frame, "Dummy Stream", (50, 240), cv2.FONT_HERSHEY_SIMPLEX,
                        2, (255, 255, 255), 3, cv2.LINE_AA)
        else:
            # On Raspberry Pi: capture a frame from the camera.
            frame = picam2.capture_array()
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


@app.route('/')
def index():
    return render_template('index.html', theme=THEME, theme_id=THEME_ID)


@app.route('/theme.json')
def theme_json():
    """Active theme (ticker, texts, ring-light palette) for the UI and the LED driver."""
    return jsonify(THEME or {})


@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/capture', methods=['POST'])
def capture():
    """
    Capture a still image: stop preview, configure for capture, get image, restore preview.
    """
    # Stop the live preview.
    if picam2:
        picam2.stop()

    # For still capture, use same dimensions.
    if picam2:
        still_config = picam2.create_still_configuration(
            main={"size": (800, 480)})
        picam2.configure(still_config)
        frame = picam2.capture_array()
    else:
        # Generate a dummy still image on macOS.
        frame = np.zeros((480, 800, 3), dtype=np.uint8)
        cv2.putText(frame, "Dummy Capture", (50, 240), cv2.FONT_HERSHEY_SIMPLEX,
                    2, (255, 255, 255), 3, cv2.LINE_AA)

    frame = apply_overlay(frame)
    ret, buffer = cv2.imencode('.jpg', frame)
    if not ret:
        return "Error capturing image", 500
    image_data = buffer.tobytes()

    # Restore live preview if available.
    if picam2:
        initialize_preview()
        picam2.start()

    return Response(image_data, mimetype='image/jpeg')

# ------------------- Kiosk Mode Launcher -------------------


def open_browser_kiosk():
    """
    Open the default web browser in kiosk mode pointing to the Flask server URL.
    Adjust command-line based on the operating system.  
    Note: The URL now uses port 3001.
    """
    time.sleep(2)
    url = "http://localhost:3001"
    try:
        if sys.platform.startswith('linux'):
            subprocess.Popen(
                ['chromium-browser', '--noerrdialogs', '--kiosk', url, '--incognito'])
        elif sys.platform.startswith('win'):
            subprocess.Popen(
                [r"C:\Program Files\Google\Chrome\Application\chrome.exe", '--kiosk', url, '--incognito'])
        elif sys.platform.startswith('darwin'):
            subprocess.Popen(
                ['open', '-a', 'Google Chrome', '--args', '--kiosk', url])
        else:
            import webbrowser
            webbrowser.open(url)
    except Exception as e:
        print("Error launching the browser in kiosk mode:", e)
        import webbrowser
        webbrowser.open(url)

# ------------------- Main -------------------


if __name__ == '__main__':
    # Optionally launch kiosk mode in a separate thread.
    threading.Thread(target=open_browser_kiosk, daemon=True).start()
    # Run on port 3001.
    app.run(host='0.0.0.0', port=3001, threaded=True)
