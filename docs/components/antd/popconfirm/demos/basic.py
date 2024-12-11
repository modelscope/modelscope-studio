import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Popconfirm(
                    title="Delete the task",
                    description="Are you sure to delete this task?",
                    ok_text="Yes",
                    cancel_text="No") as popconfirm:
                antd.Button("Delete", danger=True)
            popconfirm.confirm(lambda: print("confirm"))
            popconfirm.cancel(lambda: print("cancel"))

if __name__ == "__main__":
    demo.queue().launch()
