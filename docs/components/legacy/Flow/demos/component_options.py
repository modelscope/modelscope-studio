import json
import os

import gradio as gr
import modelscope_studio as mgr
import modelscope_studio.components.base as ms
from modelscope_studio.components.legacy.Flow import (BackgroundPropsDict,
                                                      Edge, Node)

with open((os.path.join(os.path.dirname(__file__),
                        "../schema/agents_schema.json"))) as f:
    schema = json.load(f)

# define the initial value of the flow
data = {
    "nodes": [
        Node(id="start-node", name="start", position=dict(x=0, y=0)),
        Node(id="initial-agent-node",
             name="agent",
             position=dict(x=200, y=0),
             data=dict(condition=['']))
    ],
    "edges": [Edge(source='start-node', target="initial-agent-node")],
}


def on_data_change(_flow):
    print(_flow)


flow_props = ["show_sidebar", "show_minimap", "show_controls"]


def on_change(_flow_config, _bgc_variant, _bgc_color, _bgc_bg_color, _bgc_gap,
              _bgc_size, _bgc_offset, _bgc_line_width):
    new_props = {}
    new_background_props = {
        "variant": _bgc_variant,
        "bgColor": _bgc_bg_color,
        "color": _bgc_color,
        "gap": _bgc_gap,
        "size": _bgc_size,
        "offset": _bgc_offset,
        'lineWidth': _bgc_line_width
    }
    for choice in flow_props:
        if choice in _flow_config:
            new_props[choice] = True
        else:
            new_props[choice] = False
    return gr.update(**new_props, background_props=new_background_props)


with gr.Blocks() as demo, ms.Application():
    with gr.Accordion(label="Flow Options"):
        flow_config = gr.CheckboxGroup(
            container=False,
            value=["show_sidebar", "show_minimap", "show_controls"],
            choices=flow_props)
        with gr.Accordion(label="Background Props"):
            with gr.Row():
                with gr.Column():
                    bgc_variant = gr.Radio(choices=["dots", "lines", "cross"],
                                           label="variant",
                                           value="dots")
                with gr.Column():
                    bgc_color = gr.ColorPicker(label="color", value="")
                with gr.Column():
                    bgc_bg_color = gr.ColorPicker(label="bgColor", value="")
                with gr.Column():
                    bgc_gap = gr.Slider(label="gap", value=28)
                with gr.Column():
                    bgc_size = gr.Slider(label="size",
                                         value=1,
                                         maximum=10,
                                         step=1)
                with gr.Column():
                    bgc_offset = gr.Slider(label="offset",
                                           value=1,
                                           step=1,
                                           maximum=10)
                with gr.Column():
                    bgc_line_width = gr.Slider(label="lineWidth",
                                               value=1,
                                               step=1,
                                               maximum=10)

    flow = mgr.Flow(value=data,
                    schema=schema,
                    show_controls=True,
                    show_minimap=True,
                    show_sidebar=True,
                    sync_on_data_change=True,
                    background_props=BackgroundPropsDict(variant='dots'))
    gr.on(triggers=[
        flow_config.change, bgc_variant.change, bgc_color.change,
        bgc_bg_color.change, bgc_gap.change, bgc_size.change,
        bgc_offset.change, bgc_line_width.change
    ],
          fn=on_change,
          inputs=[
              flow_config, bgc_variant, bgc_color, bgc_bg_color, bgc_gap,
              bgc_size, bgc_offset, bgc_line_width
          ],
          outputs=[flow])
    flow.data_change(fn=on_data_change, inputs=[flow])

if __name__ == "__main__":
    demo.queue().launch()
