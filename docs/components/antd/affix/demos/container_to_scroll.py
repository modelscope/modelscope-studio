import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with ms.Div(elem_id="affix_container",
                        elem_style={
                            "width": '100%',
                            "height": 100,
                            "overflow": 'auto',
                            "boxShadow": '0 0 0 1px #1677ff',
                            "scrollbarWidth": 'thin',
                            "scrollbarGutter": 'stable',
                        }):
                with ms.Div(elem_style=dict(width="100%", height=1000)):
                    with antd.Affix(
                            get_target=
                            "() => document.querySelector('#affix_container')"
                    ):
                        antd.Button("Fixed at the top of container",
                                    type="primary")

if __name__ == "__main__":
    demo.queue().launch()
