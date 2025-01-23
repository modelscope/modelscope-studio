import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "message": "Success Text",
    "description":
    "Success Description Success Description Success Description Success Description",
    "type": "success"
}, {
    "message": "Info Text",
    "description":
    "Info Description Info Description Info Description Info Description",
    "type": "info"
}, {
    "message": "Warning Text",
    "description":
    "Warning Description Warning Description Warning Description Warning Description",
    "type": "warning"
}, {
    "message": "Error Text",
    "description":
    "Error Description Error Description Error Description Error Description",
    "type": "error"
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                for item in data:
                    antd.Alert(message=item["message"],
                               description=item["description"],
                               type=item["type"],
                               closable=True,
                               show_icon=True)

if __name__ == "__main__":
    demo.queue().launch()
