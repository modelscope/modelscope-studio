import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.InputNumber()
                antd.InputNumber(min=1, max=10, keyboard=True)
                antd.InputNumber(value=100, addon_after="$", addon_before="+")
                with antd.InputNumber(value=100):
                    with ms.Slot("addonBefore"):
                        antd.Select(value="add",
                                    elem_style=dict(width=60),
                                    options=[{
                                        "value": "add",
                                        "label": "+"
                                    }, {
                                        "value": "minus",
                                        "label": "-"
                                    }])
                    with ms.Slot("addonAfter"):
                        antd.Select(value="USD",
                                    elem_style=dict(width=60),
                                    options=[{
                                        "value": "USD",
                                        "label": "$"
                                    }, {
                                        "value": "EUR",
                                        "label": "€"
                                    }, {
                                        "value": "GBP",
                                        "label": "£"
                                    }, {
                                        "value": "CNY",
                                        "label": "¥"
                                    }])

if __name__ == "__main__":
    demo.queue().launch()
