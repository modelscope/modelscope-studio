import json
import os

import gradio as gr

import modelscope_studio as mgr

options = ["a", "b", "c"]


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


with open(resolve_assets("./custom_components/custom_select.js"), 'r') as f:
    custom_select_js = f.read()

with gr.Blocks() as demo:
    mgr.Markdown(value=f"""
custom tag: <custom-select options='{json.dumps(options)}'></custom-select>
""",
                 custom_components={
                     "custom-select": {
                         "props": ["options"],
                         "js": custom_select_js,
                     }
                 })

if __name__ == "__main__":
    demo.queue().launch()
