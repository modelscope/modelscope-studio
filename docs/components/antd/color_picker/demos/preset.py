import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.ColorPicker(value="#816DF8",
                                 presets=[{
                                     "label":
                                     "primary",
                                     "colors": [
                                         "#e6f4ff", "#bae0ff", "#91caff",
                                         "#69b1ff", "#4096ff", "#1677ff",
                                         "#0958d9", "#003eb3", "#002c8c",
                                         "#001d66"
                                     ]
                                 }, {
                                     "label":
                                     "red",
                                     "colors": [
                                         "#fff1f0", "#ffccc7", "#ffa39e",
                                         "#ff7875", "#ff4d4f", "#f5222d",
                                         "#cf1322", "#a8071a", "#820014",
                                         "#5c0011"
                                     ]
                                 }, {
                                     "label":
                                     "green",
                                     "colors": [
                                         "#f6ffed", "#d9f7be", "#b7eb8f",
                                         "#95de64", "#73d13d", "#52c41a",
                                         "#389e0d", "#237804", "#135200",
                                         "#092b00"
                                     ]
                                 }])
                with antd.ColorPicker(value="#816DF8"):
                    with ms.Slot("presets"):
                        with antd.ColorPicker.Preset(colors=[
                                "#e6f4ff", "#bae0ff", "#91caff", "#69b1ff",
                                "#4096ff", "#1677ff", "#0958d9", "#003eb3",
                                "#002c8c", "#001d66"
                        ]):
                            with ms.Slot("label"):
                                antd.Typography.Text("Primary", type="success")
                        antd.ColorPicker.Preset(colors=[
                            "#fff1f0", "#ffccc7", "#ffa39e", "#ff7875",
                            "#ff4d4f", "#f5222d", "#cf1322", "#a8071a",
                            "#820014", "#5c0011"
                        ],
                                                label="red")

if __name__ == "__main__":
    demo.queue().launch()
