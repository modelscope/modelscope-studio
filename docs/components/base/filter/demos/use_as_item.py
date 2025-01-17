import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "title": "Card Title",
    "btn": {
        "value": "Hello"
    }
}, {
    "title": "Card Title",
    "btn": {
        "value": "World"
    }
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.Space(direction="vertical"):
            with ms.Each(value=data):
                with antd.Card():
                    with ms.Filter(as_item="btn"):
                        antd.Button()

if __name__ == "__main__":
    demo.queue().launch()
