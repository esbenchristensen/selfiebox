import tkinter as tk
from tkinter import Label, Button
from PIL import Image, ImageTk
from picamera2 import Picamera2, Preview
import threading, time, cv2, os

class SelfieApp:
    def __init__(self, root):
        self.root = root
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')
        self.root.bind('<Escape>', lambda e: root.destroy())

        self.picam2 = Picamera2()
        self.picam2.preview_configuration.main.size = (800, 480)
        self.picam2.preview_configuration.main.format = "RGB888"
        self.picam2.configure("preview")

        self.canvas = tk.Canvas(root, bg='black', highlightthickness=0)
        self.canvas.pack(fill="both", expand=True)

        self.frame = Label(root)
        self.frame.place(relx=0.5, rely=0.5, anchor='center')

        self.button_frame = tk.Frame(root, bg='black')
        self.button_frame.place(relx=0.5, rely=0.9, anchor='s')

        self.take_pic_btn = Button(self.button_frame, text="Take Picture", font=("Helvetica", 24), command=self.start_countdown, bg='green', fg='white')
        self.take_pic_btn.pack()

        self.countdown_label = Label(root, text="", font=("Helvetica", 200), fg='green', bg='black')
        self.countdown_label.place(relx=0.5, rely=0.5, anchor='center')

        self.image_label = Label(root, bg='black')
        self.image_label.place(relx=0.5, rely=0.5, anchor='center')
        self.new_pic_btn = Button(root, text="Take New Picture", font=("Helvetica", 24), command=self.reset_app, bg='green', fg='white')

        self.running = True
        self.show_preview()

    def show_preview(self):
        self.picam2.start()
        def update():
            while self.running:
                frame = self.picam2.capture_array()
                image = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
                image = Image.fromarray(image)
                image = ImageTk.PhotoImage(image)
                self.frame.configure(image=image)
                self.frame.image = image
        threading.Thread(target=update, daemon=True).start()

    def start_countdown(self):
        self.take_pic_btn.place_forget()
        self.button_frame.place_forget()
        self.countdown(3)

    def countdown(self, count):
        if count > 0:
            self.frame.place_forget()
            self.countdown_label.config(text=str(count))
            self.root.after(1000, lambda: self.countdown(count - 1))
        else:
            self.countdown_label.config(text="")
            self.capture_image()

    def capture_image(self):
        image_path = "/tmp/selfie.jpg"
        self.picam2.stop()
        self.picam2.switch_mode_and_capture_file(self.picam2.still_configuration, image_path)
        self.show_captured_image(image_path)

    def show_captured_image(self, path):
        self.frame.place_forget()
        self.image_label.place(relx=0.5, rely=0.5, anchor='center')
        image = Image.open(path)
        image = image.resize((800, 480))
        photo = ImageTk.PhotoImage(image)
        self.image_label.config(image=photo)
        self.image_label.image = photo
        self.new_pic_btn.place(relx=0.5, rely=0.9, anchor='s')
        self.inactivity_timer()

    def reset_app(self):
        self.image_label.place_forget()
        self.new_pic_btn.place_forget()
        self.frame.place(relx=0.5, rely=0.5, anchor='center')
        self.button_frame.place(relx=0.5, rely=0.9, anchor='s')
        self.take_pic_btn.place(relx=0.5, rely=0.5, anchor='s')
        self.show_preview()

    def inactivity_timer(self):
        self.root.after(10000, self.reset_app)

if __name__ == '__main__':
    root = tk.Tk()
    app = SelfieApp(root)
    root.mainloop()
