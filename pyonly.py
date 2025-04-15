import sys
import tkinter as tk
from tkinter import messagebox
import cv2
import numpy as np
from PIL import Image, ImageTk
import time

# Try to import Picamera2 if on a Raspberry Pi, otherwise use dummy stream.
try:
    from picamera2 import Picamera2
    picam2 = Picamera2()
    use_camera = True
except Exception as e:
    picam2 = None
    use_camera = False

# For Raspberry Pi, initialize the camera
if use_camera:
    # Configure for 800x480 preview; adjust as needed.
    preview_config = picam2.create_preview_configuration(
        main={"size": (800, 480), "format": "RGB888"})
    picam2.configure(preview_config)
    picam2.start()

# Global flag: are we showing live stream or a captured frame?
live_streaming = True
captured_frame = None


def get_frame():
    """Obtain a frame from the camera or generate a dummy frame on macOS."""
    global use_camera
    if use_camera:
        # Use the Picamera2 capture if available.
        frame = picam2.capture_array()
    else:
        # Create a dummy image: black background with "Dummy Stream" text.
        frame = np.zeros((480, 800, 3), dtype=np.uint8)
        cv2.putText(frame, "Dummy Stream", (50, 240), cv2.FONT_HERSHEY_SIMPLEX,
                    2, (255, 255, 255), 3, cv2.LINE_AA)
    return frame


def update_stream():
    """Update the image label with a new frame if we are in live streaming mode."""
    global live_streaming, captured_frame
    if live_streaming:
        frame = get_frame()
        # Convert the frame (which is in BGR for OpenCV) to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        # Convert to PIL Image
        pil_image = Image.fromarray(frame_rgb)
        # Convert to ImageTk
        tk_image = ImageTk.PhotoImage(image=pil_image)
        video_label.config(image=tk_image)
        video_label.image = tk_image  # Keep a reference.
    # Schedule the next frame update
    root.after(30, update_stream)  # roughly 33 ms ~ 30 FPS


def capture_frame():
    """Capture current frame and display it."""
    global live_streaming, captured_frame
    # Stop the live stream and save the current frame.
    live_streaming = False
    frame = get_frame()
    captured_frame = frame
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(frame_rgb)
    tk_image = ImageTk.PhotoImage(image=pil_image)
    video_label.config(image=tk_image)
    video_label.image = tk_image  # Keep a reference.
    # Toggle button states.
    capture_button.config(state=tk.DISABLED)
    new_capture_button.config(state=tk.NORMAL)


def new_capture():
    """Reset to live stream."""
    global live_streaming
    live_streaming = True
    capture_button.config(state=tk.NORMAL)
    new_capture_button.config(state=tk.DISABLED)


# Create the main application window.
root = tk.Tk()
root.title("Pure Python Selfie App")
# Set window size; adjust as necessary.
root.geometry("820x540")

# Video display (using a Label).
video_label = tk.Label(root)
video_label.pack(padx=10, pady=10)

# Buttons: Capture and New Capture.
button_frame = tk.Frame(root)
button_frame.pack(pady=10)

capture_button = tk.Button(
    button_frame, text="Capture", command=capture_frame, width=15, height=2)
capture_button.pack(side=tk.LEFT, padx=10)

new_capture_button = tk.Button(
    button_frame, text="New Capture", command=new_capture, width=15, height=2)
new_capture_button.pack(side=tk.LEFT, padx=10)
new_capture_button.config(state=tk.DISABLED)  # Disabled by default.

# Start the video stream update loop.
update_stream()

# Start the Tkinter main event loop.
root.mainloop()

# If using the camera on a Raspberry Pi, remember to stop it when closing.
if use_camera:
    picam2.stop()
