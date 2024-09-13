import json

import gradio as gr
import modelscope_studio as mgr

# `label` will display on the page, and `value` is the actual selected value.
options = [{"label": "A", "value": "a"}, "b", "c"]

conversation = [[
    None, f"""
Single Select: <select-box options='{json.dumps(options)}' select-once></select-box>

Multiple Select：<select-box type="checkbox" options='{json.dumps(options)}' select-once submit-text="Submit"></select-box>

Vertical Direction：

<select-box direction="vertical" type="checkbox" options='{json.dumps(options)}' select-once submit-text="Submit"></select-box>

Card Shape:

<select-box shape="card" options='{json.dumps(options)}' select-once equal-height></select-box>


<select-box shape="card" columns="2" options='{json.dumps(options)}' select-once  equal-height></select-box>


<select-box shape="card" direction="vertical" options='{json.dumps(options)}' select-once  equal-height></select-box>
"""
]]


# The custom data must be marked by `gr.EventData`
def fn(data: gr.EventData):
    print(data._data)


with gr.Blocks() as demo:
    chatbot = mgr.Chatbot(
        value=conversation,
        flushing=False,
        height=600,
    )
    # All custom tags will trigger the custom event
    chatbot.custom(fn=fn)

if __name__ == "__main__":
    demo.queue().launch()
