import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr


def mount(_lifecycle, _state):
    _state["theme"] = _lifecycle.theme
    yield _state


def fn(_state):
    theme = _state["theme"]
    color = '000/fff' if theme == 'dark' else 'fff/000'
    yield gr.update(
        value=f"https://dummyimage.com/200x100/{color}.png&text={theme}")


with gr.Blocks() as demo, ms.Application():
    lifecycle = mgr.Lifecycle()
    state = gr.State({"theme": "light"})
    btn = gr.Button()
    image = gr.Image()

    lifecycle.mount(fn=mount, inputs=[lifecycle, state], outputs=[state])
    btn.click(fn=fn, inputs=[state], outputs=[image])

if __name__ == "__main__":
    demo.queue().launch()
