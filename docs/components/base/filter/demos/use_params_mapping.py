import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "title": "Card Title",
    "desc": "Hello"
}, {
    "title": "Card Title",
    "desc": "World"
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                with ms.Each(value=data):
                    with antd.Card():
                        with ms.Filter(
                                params_mapping=
                                """(props) => ({ value: props.desc, type: props.desc === 'World' ? 'primary' : 'default' })"""
                        ):
                            antd.Button()

if __name__ == "__main__":
    demo.queue().launch()
