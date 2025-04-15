import sys
import subprocess
import threading
import time
import cv2
import numpy as np
from flask import Flask, render_template, Response, request
# If you're on a Raspberry Pi, picamera2 will work – on macOS, we bypass it.
try:
    from picamera2 import Picamera2
    picam2 = Picamera2()
except ImportError:
    picam2 = None

app = Flask(__name__)

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
    return render_template('index.html')


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
