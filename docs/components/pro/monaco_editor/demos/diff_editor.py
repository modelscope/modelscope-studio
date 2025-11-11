import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro


def change(editor_value):
    print(editor_value)


def readonly_change(switch_value):
    return gr.update(read_only=switch_value)


with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider(
), ms.AutoLoading():
    with antd.Flex(gap="small", elem_style=dict(marginBottom=10)):
        ms.Text("Readonly")
        switch = antd.Switch(value=False)
    editor = pro.MonacoEditor.DiffEditor(
        original="import gradio as gr",
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
    switch.change(fn=readonly_change, inputs=[switch], outputs=[editor])

if __name__ == "__main__":
    demo.queue().launch()
