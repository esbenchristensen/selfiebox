import sys
import subprocess
import threading
import time
import cv2
from flask import Flask, render_template, Response, request
from picamera2 import Picamera2

# ------------------- Flask & Camera Setup -------------------

app = Flask(__name__)

# Initialize the camera (global instance).
picam2 = Picamera2()

def initialize_preview():
    # Configure the camera for live preview (800x480, RGB888).
    preview_config = picam2.create_preview_configuration(main={"size": (800, 480), "format": "RGB888"})
    picam2.configure(preview_config)

# Start the preview.
initialize_preview()
picam2.start()

def gen_frames():
    """Video streaming generator function."""
    while True:
        frame = picam2.capture_array()  # Capture frame as a NumPy array.
        ret, buffer = cv2.imencode('.jpg', frame)  # Encode the frame as JPEG.
        if not ret:
            continue
        frame_bytes = buffer.tobytes()
        # Yield the frame in MJPEG multipart format.
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    # Render the main HTML page.
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    # Return the MJPEG streaming response.
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/capture', methods=['POST'])
def capture():
    """
    Capture a still image:
      1. Stop the preview.
      2. Reconfigure the camera for a still capture.
      3. Capture the image.
      4. Restore the preview configuration.
      5. Return the JPEG image.
    """
    # Stop the live preview.
    picam2.stop()

    # Configure the camera for still capture.
    still_config = picam2.create_still_configuration(main={"size": (800, 480)})
    picam2.configure(still_config)

    # Capture a still frame.
    frame = picam2.capture_array()
    ret, buffer = cv2.imencode('.jpg', frame)
    if not ret:
        return "Error capturing image", 500
    image_data = buffer.tobytes()

    # Restore the live preview.
    initialize_preview()
    picam2.start()

    return Response(image_data, mimetype='image/jpeg')

# ------------------- Kiosk Mode Launcher -------------------

def open_browser_kiosk():
    """
    Opens the default web browser in kiosk mode pointing to the Flask server URL.
    Adjust the command-line based on the operating system.
    """
    # Give the server a moment to start.
    time.sleep(2)
    url = "http://localhost:5000"
    try:
        if sys.platform.startswith('linux'):
            # For Linux (e.g., Raspberry Pi with Chromium)
            subprocess.Popen(['chromium-browser', '--noerrdialogs', '--kiosk', url, '--incognito'])
        elif sys.platform.startswith('win'):
            # For Windows ? adjust the path if necessary.
            subprocess.Popen([r"C:\Program Files\Google\Chrome\Application\chrome.exe", '--kiosk', url, '--incognito'])
        elif sys.platform.startswith('darwin'):
            # For macOS ? use the open command.
            subprocess.Popen(['open', '-a', 'Google Chrome', '--args', '--kiosk', url])
        else:
            # Fallback: open with the default browser.
            import webbrowser
            webbrowser.open(url)
    except Exception as e:
        print("Error launching the browser in kiosk mode:", e)
        import webbrowser
        webbrowser.open(url)

# ------------------- Main -------------------

if __name__ == '__main__':
    # Launch the kiosk-mode browser in a separate thread.
    threading.Thread(target=open_browser_kiosk, daemon=True).start()
    # Start the Flask server.
    app.run(host='0.0.0.0', port=5000, threaded=True)
