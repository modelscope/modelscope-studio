import json
import os

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

# Card shape supports setting `imgSrc` as the cover.
options = [{
    "label":
    "A",
    "imgSrc":
    os.path.join(os.path.dirname(__file__),
                 '../../../../resources/screen.jpeg'),
    "value":
    "a"
}, "b", "c", "d"]

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        f"""<select-box shape="card" options='{json.dumps(options)}' select-once equal-height></select-box>

Custom Columns:

<select-box shape="card" columns="2" options='{json.dumps(options)}' select-once  equal-height></select-box>

Vertical Direction:

<select-box shape="card" direction="vertical" options='{json.dumps(options)}' select-once  equal-height></select-box>
""")

if __name__ == "__main__":
    demo.queue().launch()
