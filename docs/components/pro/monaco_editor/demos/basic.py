import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro


def change(editor_value):
    print(editor_value)


with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    editor = pro.MonacoEditor(
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
    )
    editor.change(fn=change, inputs=[editor])

if __name__ == "__main__":
    demo.queue().launch()
