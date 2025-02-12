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
                sender = antdx.Sender()
                antdx.Sender("Force as loading", loading=True, read_only=True)
                antdx.Sender("Set to disabled", disabled=True)

            sender.submit(fn=submit, outputs=[sender])
            sender.cancel(fn=cancel, outputs=[sender])

if __name__ == "__main__":
    demo.queue().launch()
