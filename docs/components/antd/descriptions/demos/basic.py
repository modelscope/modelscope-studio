import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_bordered = False

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            bordered = antd.Switch(value=default_bordered,
                                   checked_children="Border",
                                   un_checked_children="No Border")
            with antd.Descriptions(title="User Info",
                                   bordered=default_bordered) as descriptions:
                with antd.Descriptions.Item(label="Product"):
                    ms.Text("Cloud Database")
                with antd.Descriptions.Item(label="Billing Mode"):
                    ms.Text("Prepaid")

                with antd.Descriptions.Item(label="Automatic Renewal"):
                    ms.Text("YES")

                with antd.Descriptions.Item(label="Order time"):
                    ms.Text("2018-04-24 18:00:00")

                with antd.Descriptions.Item(label="Usage Time", span=2):
                    ms.Text("2019-04-24 18:00:00")

                with antd.Descriptions.Item(label="Status", span=3):
                    antd.Badge(status="processing", text="Running")

                with antd.Descriptions.Item(label="Negotiated Amount"):
                    ms.Text("$80.00")

                with antd.Descriptions.Item(label="Discount"):
                    ms.Text("$20.00")

                with antd.Descriptions.Item(label="Official Receipts"):
                    ms.Text("$60.00")

                with antd.Descriptions.Item(label="Config Info"):
                    gr.HTML("""Data disk type: MongoDB
<br />
Database version: 3.4
<br />
Package: dds.mongo.mid
<br />
Storage space: 10 GB
<br />
Replication factor: 3
<br />
Region: East China 1
<br />""")
                bordered.change(fn=lambda x: gr.update(bordered=x),
                                inputs=[bordered],
                                outputs=[descriptions])
if __name__ == "__main__":
    demo.queue().launch()
