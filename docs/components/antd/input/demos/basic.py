import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical"):
                antd.Input()
                antd.Input.Password()
                antd.Input.Textarea(
                    placeholder=
                    "Autosize height with minimum and maximum number of lines",
                    auto_size={
                        "minRows": 2,
                        "maxRows": 6
                    })
                antd.Input.Search(placeholder="Input search text",
                                  addon_before="https://",
                                  allow_clear=True)
                with antd.Input.Search(enter_button="Search",
                                       placeholder="input search text",
                                       size="large"):
                    with ms.Slot("suffix"):
                        antd.Icon("AudioOutlined",
                                  elem_style=dict(fontSize=16,
                                                  color="#1677ff"))
                antd.Input.OTP()
if __name__ == "__main__":
    demo.queue().launch()
