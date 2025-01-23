import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Row(gutter=20):
                with antd.Col(span=12):
                    antd.Statistic(value=112893, title="Active Users")
                with antd.Col(span=12):
                    antd.Statistic(value=112893,
                                   precision=2,
                                   title="Account Balance (CNY)")
                with antd.Col(span=12):
                    with antd.Statistic(value=1128,
                                        precision=2,
                                        title="Feedback"):
                        with ms.Slot("prefix"):
                            antd.Icon("LikeOutlined")
                with antd.Col(span=12):
                    antd.Statistic(value=93, suffix="/ 100", title="Unmerged")
if __name__ == "__main__":
    demo.queue().launch()
