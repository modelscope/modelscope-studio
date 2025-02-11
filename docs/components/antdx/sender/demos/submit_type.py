import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def submit():
    return gr.update(loading=True, read_only=True)


def cancel():
    return gr.update(loading=False, read_only=False)


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antd.Flex(vertical=True, gap="middle"):
                sender = antdx.Sender(
                    submit_type="shiftEnter",
                    placeholder="Press Shift + Enter to send message")

            sender.submit(fn=submit, outputs=[sender])
            sender.cancel(fn=cancel, outputs=[sender])

if __name__ == "__main__":
    demo.queue().launch()
