import os
import time

import gradio as gr
import modelscope_studio as mgr

conversation = [
    [
        None,
        {
            # The first message of bot closes the typewriter.
            "text": "Hello I'm a chatbot",
            "flushing": False
        }
    ],
]


def submit(_input, _chatbot):
    _chatbot.append([_input, None])
    yield gr.update(interactive=False, value=None), _chatbot
    time.sleep(2)
    _chatbot[-1][1] = {"text": _input.text + '!'}
    yield {
        chatbot: _chatbot,
    }


def flushed():
    return gr.update(interactive=True)


with gr.Blocks() as demo:
    chatbot = mgr.Chatbot(
        value=conversation,
        avatar_images=[
            os.path.join(os.path.dirname(__file__), "../resources/user.jpeg"),
            {
                "name":
                "bot",
                "avatar":
                os.path.join(os.path.dirname(__file__),
                             "../resources/bot.jpeg")
            }
        ],
        height=600,
    )

    input = mgr.MultimodalInput()
    input.submit(fn=submit, inputs=[input, chatbot], outputs=[input, chatbot])
    chatbot.flushed(fn=flushed, outputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
