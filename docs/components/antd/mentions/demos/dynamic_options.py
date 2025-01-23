import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_search(e: gr.EventData):
    prefix = e._data['payload'][1]
    if prefix == '@':
        return gr.update(options=[{
            "value": "modelscope",
            "label": "modelscope"
        }, {
            "value": "gradio",
            "label": "gradio"
        }, {
            "value": "ant design",
            "label": "ant design"
        }])
    elif prefix == '#':
        return gr.update(options=[{
            "value": "1.0",
            "label": "1.0"
        }, {
            "value": "2.0",
            "label": "2.0"
        }, {
            "value": "3.0",
            "label": "3.0"
        }])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            mentions = antd.Mentions(
                elem_style=dict(width='100%'),
                prefix=['@', "#"],
                placeholder="input @ to mention people, # to mention tag")
            mentions.search(fn=on_search, outputs=[mentions])

if __name__ == "__main__":
    demo.queue().launch()
