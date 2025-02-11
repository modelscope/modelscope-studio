import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def upload_file(attachments_value):
    print(attachments_value)


default_fullscreen_drop = False

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antd.Flex(vertical=True,
                           gap="middle",
                           align="flex-start",
                           elem_id="attachments-container"):
                fullscreen_drop_switch = antd.Switch(
                    value=default_fullscreen_drop,
                    checked_children="Full screen drop",
                    un_checked_children="Full screen drop")
                with antdx.Sender():
                    with ms.Slot("prefix"):
                        with antdx.Attachments(
                                placeholder=dict(
                                    title="Drag & Drop files here",
                                    description=
                                    "Support file type: image, video, audio, document, etc."
                                ),
                                get_drop_container=
                                "() => document.querySelector('#attachments-container')",
                        ) as attachments:
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("LinkOutlined")
                            with ms.Slot("placeholder.icon"):
                                antd.Icon("CloudUploadOutlined")

                attachments.change(fn=upload_file, inputs=[attachments])
                fullscreen_drop_switch.change(fn=lambda x: gr.update(
                    get_drop_container="() => document.body" if x else
                    "() => document.querySelector('#attachments-container')",
                ),
                                              inputs=[fullscreen_drop_switch],
                                              outputs=[attachments])

if __name__ == "__main__":
    demo.queue().launch()
