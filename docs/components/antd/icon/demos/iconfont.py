import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            # If you are using [iconfont.cn](https://www.iconfont.cn/), you can use the icons in your project gracefully.
            with antd.Icon.IconfontProvider(script_url=[
                    "//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js",
                    "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js"
            ]):
                with antd.Space():
                    antd.Icon("icon-python")
                    antd.Icon("icon-tuichu")
                    antd.Icon("icon-facebook",
                              elem_style=dict(color="#1877F2"))
                    antd.Icon("icon-twitter")

if __name__ == "__main__":
    demo.queue().launch()
