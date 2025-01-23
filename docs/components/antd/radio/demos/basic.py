import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Radio():
                ms.Text("Radio")
            antd.Divider("Radio Group")
            with antd.Radio.Group():
                with antd.Radio(group_value=1):
                    ms.Text("A")
                with antd.Radio(group_value=2):
                    ms.Text("B")
                with antd.Radio(group_value=3):
                    ms.Text("C")
                with antd.Radio(group_value=4):
                    ms.Text("D")
            antd.Divider("Configuring Options")
            antd.Radio.Group(option_type="button",
                             button_style="solid",
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
if __name__ == "__main__":
    demo.queue().launch()
