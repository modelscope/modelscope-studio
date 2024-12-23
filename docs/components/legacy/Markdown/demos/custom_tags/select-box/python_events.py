import json

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

options = [{"label": "A", "value": "a"}, "b", "c"]


def fn(data: gr.EventData):
    custom_data = data._data
    if (custom_data["tag"] == "select-box"):
        print(custom_data["value"]
              )  # 'a' or 'b' or 'c', the value set in the options.


with gr.Blocks() as demo, ms.Application():
    md = mgr.Markdown(
        f"<select-box options='{json.dumps(options)}' select-once></select-box>"
    )
    md.custom(fn=fn)

if __name__ == "__main__":
    demo.queue().launch()
