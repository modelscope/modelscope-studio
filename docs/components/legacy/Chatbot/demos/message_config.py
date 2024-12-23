import time

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def submit(_chatbot):
    _chatbot.append(["test user",
                     "test bot"])  # bot starts the typewriter by default
    yield _chatbot
    time.sleep(2)
    _chatbot.append(["test user", {
        "text": "test bot",
        "flushing": False
    }])  # both start the typewriter
    yield _chatbot
    time.sleep(2)
    _chatbot.append([{
        "text": "test user",
        "flushing": True
    }, {
        "text": "test bot",
        "flushing": False
    }])  # user starts the typewriter
    yield _chatbot


with gr.Blocks() as demo, ms.Application():
    chatbot = mgr.Chatbot(height=600, )
    button = gr.Button("Submit")
    button.click(fn=submit, inputs=[chatbot], outputs=[chatbot])

if __name__ == "__main__":
    demo.queue().launch()
