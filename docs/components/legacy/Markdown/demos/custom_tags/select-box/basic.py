import json

import gradio as gr
import modelscope_studio as mgr
import modelscope_studio.components.base as ms

options = [{"label": "A", "value": "a"}, "b", "c"]

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        f"""Single Select: <select-box options='{json.dumps(options)}' select-once></select-box>

Multiple Select: <select-box type="checkbox" options='{json.dumps(options)}' select-once submit-text="Submit"></select-box>

Vertical Direction:

<select-box direction="vertical" type="checkbox" options='{json.dumps(options)}' select-once submit-text="Submit"></select-box>
""", )

if __name__ == "__main__":
    demo.queue().launch()
