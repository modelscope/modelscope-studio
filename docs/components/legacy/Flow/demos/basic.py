import json
import os

import gradio as gr
import modelscope_studio as mgr
import modelscope_studio.components.base as ms
from modelscope_studio.components.legacy.Flow import Edge, Node

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


with gr.Blocks() as demo, ms.Application():
    flow = mgr.Flow(value=data, schema=schema, sync_on_data_change=True)
    flow.data_change(fn=on_data_change, inputs=[flow])

if __name__ == "__main__":
    demo.queue().launch()
