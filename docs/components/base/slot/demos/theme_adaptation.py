import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def mount(e: gr.EventData, _state):
    _state["theme"] = e._data["theme"]
    yield _state


def fn(_state):
    theme = _state["theme"]
    color = '000/fff' if theme == 'dark' else 'fff/000'
    yield gr.update(
        value=f"https://dummyimage.com/200x100/{color}.png&text={theme}")


with gr.Blocks() as demo:
    with ms.Application() as app:
        state = gr.State({"theme": "light"})
        btn = antd.Button(
            "Run",
            type="primary",
            block=True,
        )
        image = antd.Image()

        app.mount(fn=mount, inputs=[state], outputs=[state])
        btn.click(fn=fn, inputs=[state], outputs=[image])

if __name__ == "__main__":
    demo.queue().launch()
