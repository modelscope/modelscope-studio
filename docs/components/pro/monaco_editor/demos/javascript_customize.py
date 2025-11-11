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
        # pass a javascript function string to the after_mount prop
        after_mount="""(editor) => {
        editor.updateOptions({
            readOnly: true,
            minimap: {
                enabled: false,
            },
        })
}""")

if __name__ == "__main__":
    demo.queue().launch()
