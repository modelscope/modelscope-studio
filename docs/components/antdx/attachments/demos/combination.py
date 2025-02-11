import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def toggle_open(state_value, attachments_value):
    state_value["open"] = not state_value["open"]
    return gr.update(open=state_value["open"]), gr.update(
        dot=len(attachments_value) > 0 and not state_value["open"]), gr.update(
            value=state_value)


def submit(sender_value, attachments_value):
    print(sender_value, attachments_value)
    return gr.update(value=None), gr.update(value=None), gr.update(dot=False)


with gr.Blocks() as demo:
    state = gr.State({"open": True})
    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph(
                "Work with Sender.Header to insert file into the conversation."
            )
            with antdx.Sender() as sender:
                with ms.Slot("prefix"):
                    with antd.Badge(dot=False) as prefix_badge:
                        with antd.Button(value=None) as prefix_button:
                            with ms.Slot("icon"):
                                antd.Icon("LinkOutlined")
                with ms.Slot("header"):
                    with antdx.Sender.Header(title="Attachments",
                                             open=True,
                                             styles={
                                                 "content": {
                                                     "padding": 0,
                                                 },
                                             }) as sender_header:
                        with antdx.Attachments() as attachments:
                            with ms.Slot(
                                    "placeholder.title",
                                    params_mapping=
                                    """(type) => type === 'drop' ? 'Drop file here' : 'Upload files'"""
                            ):
                                ms.Span()
                            with ms.Slot(
                                    "placeholder.description",
                                    params_mapping=
                                    "(type) => ({ style: { display: type === 'drop'? 'none' : undefined } })"
                            ):
                                ms.Span(
                                    "Click or drag files to this area to upload"
                                )
                            with ms.Slot(
                                    "placeholder.icon",
                                    params_mapping=
                                    "(type) => ({ style: { display: type === 'drop'? 'none' : undefined } })"
                            ):
                                antd.Icon("CloudUploadOutlined")

            sender_header.open_change(
                fn=toggle_open,
                inputs=[state, attachments],
                outputs=[sender_header, prefix_badge, state])
            prefix_button.click(fn=toggle_open,
                                inputs=[state, attachments],
                                outputs=[sender_header, prefix_badge, state])
            sender.submit(fn=submit,
                          inputs=[sender, attachments],
                          outputs=[sender, attachments, prefix_badge])

if __name__ == "__main__":
    demo.queue().launch()
