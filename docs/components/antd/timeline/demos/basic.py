import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Timeline():
                with antd.Timeline.Item():
                    ms.Text("Create a services site 2015-09-01")
                with antd.Timeline.Item():
                    ms.Text("Solve initial network problems 2015-09-01")
                with antd.Timeline.Item():
                    ms.Text("Technical testing 2015-09-01")
                with antd.Timeline.Item():
                    ms.Text("Network problems being solved 2015-09-01")
            antd.Divider("Alternate")
            with antd.Timeline(mode="alternate"):
                with antd.Timeline.Item():
                    ms.Text("Create a services site 2015-09-01")
                with antd.Timeline.Item(color="green"):
                    ms.Text("Solve initial network problems 2015-09-01")
                with antd.Timeline.Item():
                    ms.Text(
                        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
                    )
                    with ms.Slot("dot"):
                        antd.Icon("ClockCircleOutlined",
                                  elem_style=dict(fontSize=16))
                with antd.Timeline.Item(color="red"):
                    ms.Text("Network problems being solved 2015-09-01")
                with antd.Timeline.Item():
                    ms.Text("Create a services site 2015-09-01")
                with antd.Timeline.Item():
                    with ms.Slot("dot"):
                        antd.Icon("ClockCircleOutlined",
                                  elem_style=dict(fontSize=16))
                    ms.Text("Technical testing 2015-09-01")
if __name__ == "__main__":
    demo.queue().launch()
