import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Checkbox():
                ms.Text("Checkbox")
            antd.Divider("Checkbox Group")
            with antd.Space(direction="vertical"):
                antd.Checkbox.Group(value=["Apple"],
                                    options=[
                                        {
                                            "label": 'Apple',
                                            "value": 'Apple'
                                        },
                                        {
                                            "label": 'Pear',
                                            "value": 'Pear'
                                        },
                                        {
                                            "label": 'Orange',
                                            "value": 'Orange',
                                            "disabled": True
                                        },
                                    ])
                with antd.Checkbox.Group(value=["Pear", "Apple"]):
                    with antd.Checkbox.Group.Option(value="Apple"):
                        with ms.Slot("label"):
                            antd.Typography.Text("Apple", type="success")
                    antd.Checkbox.Group.Option(value="Pear", label="Pear")
                    antd.Checkbox.Group.Option(value="Orange",
                                               disabled=True,
                                               label="Orange")
if __name__ == "__main__":
    demo.queue().launch()
