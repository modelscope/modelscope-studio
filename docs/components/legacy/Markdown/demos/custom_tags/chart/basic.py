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

option2 = {
    "tooltip": {
        "trigger": 'item'
    },
    "legend": {
        "top": '5%',
        "left": 'center'
    },
    "series": [{
        "name":
        'Access From',
        "type":
        'pie',
        "radius": ['40%', '70%'],
        "avoidLabelOverlap":
        False,
        "itemStyle": {
            "borderRadius": 10,
            "borderColor": '#fff',
            "borderWidth": 2
        },
        "label": {
            "show": False,
            "position": 'center'
        },
        "emphasis": {
            "label": {
                "show": True,
                "fontSize": 40,
                "fontWeight": 'bold'
            }
        },
        "labelLine": {
            "show": False
        },
        "data": [{
            "value": 1048,
            "name": 'Search Engine'
        }, {
            "value": 735,
            "name": 'Direct'
        }, {
            "value": 580,
            "name": 'Email'
        }, {
            "value": 484,
            "name": 'Union Ads'
        }, {
            "value": 300,
            "name": 'Video Ads'
        }]
    }]
}

with gr.Blocks() as demo, ms.Application():
    chatbot = mgr.Markdown(f"""<chart options='{json.dumps(option1)}'></chart>

<chart options='{json.dumps(option2)}'></chart>
""")
if __name__ == "__main__":
    demo.queue().launch()
