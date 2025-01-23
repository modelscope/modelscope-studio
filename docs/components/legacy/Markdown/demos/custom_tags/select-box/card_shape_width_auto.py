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
        # item-width="auto"
        f"""
<select-box shape="card" direction="vertical" options='{json.dumps(options)}' select-once item-width="auto"></select-box>
""", )

if __name__ == "__main__":
    demo.queue().launch()
