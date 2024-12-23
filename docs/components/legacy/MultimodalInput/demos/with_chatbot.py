import time

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def fn(input, chatbot):
    chatbot.append([{
        "text": input.text,
        "files": input.files,
    }, None])
    yield {
        user_input: mgr.MultimodalInput(interactive=False),
        user_chatbot: chatbot
    }
    time.sleep(2)
    chatbot[-1][1] = {"text": "Hello!"}
    yield {user_chatbot: chatbot}


# Triggered when the typewriter is ending.
def flushed():
    return mgr.MultimodalInput(interactive=True)


with gr.Blocks() as demo, ms.Application():
    user_chatbot = mgr.Chatbot()
    user_input = mgr.MultimodalInput()
    user_input.submit(fn=fn,
                      inputs=[user_input, user_chatbot],
                      outputs=[user_input, user_chatbot])
    user_chatbot.flushed(fn=flushed, outputs=[user_input])

if __name__ == "__main__":
    demo.queue().launch()
