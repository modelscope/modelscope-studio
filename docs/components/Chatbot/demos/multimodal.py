import os

import gradio as gr
import modelscope_studio as mgr


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../resources",
                        relative_path)


conversation = [
    [
        None, {
            "text": f"""
Image

![image]({resolve_assets("bot.jpeg")})

<img src="{resolve_assets("user.jpeg")}" />

Video

<video src="{resolve_assets("dog.mp4")}"></video>

Audio

<audio src="{resolve_assets("audio.wav")}"></audio>
""",
            "flushing": False
        }
    ],
]

with gr.Blocks() as demo:
    mgr.Chatbot(
        value=conversation,
        height=600,
    )

if __name__ == "__main__":
    demo.queue().launch()
