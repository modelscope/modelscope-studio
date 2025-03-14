import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro


def submit(input_value, chatbot_value):
    chatbot_value.append({
        "role":
        "user",
        "content": [{
            "type": "text",
            "content": input_value["text"]
        }, {
            "type": "file",
            "content": [file for file in input_value["files"]]
        }]
    })
    chatbot_value.append({
        "role": "assistant",
        "loading": True,
        "status": "pending"
    })
    yield gr.update(value=None, loading=True), gr.update(value=chatbot_value)
    time.sleep(2)
    chatbot_value[-1]["loading"] = False
    chatbot_value[-1]["content"] = "Hello"
    chatbot_value[-1]["status"] = "done"
    yield gr.update(loading=False), gr.update(value=chatbot_value)


def cancel(chatbot_value):
    chatbot_value[-1]["loading"] = False
    chatbot_value[-1]["footer"] = "canceled"
    chatbot_value[-1]["status"] = "done"
    return gr.update(loading=False), gr.update(value=chatbot_value)


def clear():
    return gr.update(value=None)


with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    with antd.Flex(elem_style=dict(height=300), vertical=True):
        chatbot = pro.Chatbot(height=0,
                              elem_style=dict(flex=1),
                              value=[{
                                  "role": "user",
                                  "content": "Hello"
                              }, {
                                  "role": "assistant",
                                  "content": "Hello"
                              }])
        with pro.MultimodalInput(upload_config=dict(
                upload_button_tooltip="Attachments")) as input:
            with ms.Slot("prefix"):
                with antd.Tooltip("Clear History"):
                    with antd.Button(value=None,
                                     variant="text",
                                     color="default") as clear_btn:
                        with ms.Slot("icon"):
                            antd.Icon("ClearOutlined")
    submit_event = input.submit(fn=submit,
                                inputs=[input, chatbot],
                                outputs=[input, chatbot])
    input.cancel(fn=cancel,
                 cancels=[submit_event],
                 inputs=[chatbot],
                 outputs=[input, chatbot],
                 queue=False)
    clear_btn.click(fn=clear, outputs=[chatbot])

if __name__ == "__main__":
    demo.queue().launch()
