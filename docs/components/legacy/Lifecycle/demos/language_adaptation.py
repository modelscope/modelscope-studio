import time

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

messages = {
    'en': {
        "hello": "Hello"
    },
    'en-US': {
        "hello": "Hello"
    },
    'zh-CN': {
        "hello": "你好"
    }
}

default_lang = "en"


def mount(_lifecycle, _state):
    lang = _lifecycle.language
    if (lang in messages):
        _state["current_lang"] = lang
    yield 'Switch Language...', _state
    time.sleep(2)
    yield messages[lang]["hello"], _state


with gr.Blocks() as demo, ms.Application():
    lifecycle = mgr.Lifecycle()
    state = gr.State({"current_lang": default_lang})
    markdown = gr.Markdown(value=messages[default_lang]["hello"])

    lifecycle.mount(fn=mount,
                    inputs=[lifecycle, state],
                    outputs=[markdown, state])

if __name__ == "__main__":
    demo.queue().launch()
