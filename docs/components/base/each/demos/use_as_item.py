import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "card": {
        "title": "Success Card Title",
    },
    "each": {
        "value": [{
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }]
    }
}, {
    "card": {
        "title": "Info Card Title",
    },
    "each": {
        "value": [{
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }]
    }
}, {
    "card": {
        "title": "Warning Card Title",
    },
    "each": {
        "value": [{
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }]
    }
}, {
    "card": {
        "title": "Error Card Title",
    },
    "each": {
        "value": [{
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }, {
            "value": "Card Content"
        }]
    }
}]

with gr.Blocks() as demo:
    with ms.Application():
        with ms.Each(value=data):
            with antd.Card(as_item="card"):
                # Inner loop
                with ms.Each(as_item="each"):
                    antd.Typography.Paragraph()

if __name__ == "__main__":
    demo.queue().launch()
