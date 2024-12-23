import json

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

# echarts options, see: https://echarts.apache.org/en/index.html
option1 = {
    "xAxis": {
        "type": 'category',
        "data": ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    "yAxis": {
        "type": 'value',
    },
    "series": [
        {
            "data": [150, 230, 224, 218, 135, 147, 260],
            "type": 'line',
        },
    ],
}

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(f"""
Chart:
<chart options='{json.dumps(option1)}'></chart>
""")

if __name__ == "__main__":
    demo.queue().launch()
