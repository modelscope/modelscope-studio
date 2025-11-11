import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro

with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    pro.MonacoEditor(
        value="""import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro

with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    pro.MonacoEditor(
        value="Hello World",
        height=400,
    )

if __name__ == "__main__":
    demo.queue().launch()
""",
        language="python",
        height=400,
        options={
            "minimap": {
                "enabled": False
            },
            "lineNumbers": False
        },
    )

if __name__ == "__main__":
    demo.queue().launch()
