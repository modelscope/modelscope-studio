import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "key": f"{i}",
    "name": f'Item {i}',
    "age": 32,
    "address": '10 Downing Street',
} for i in range(20)]


def on_change(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.Table(data_source=data,
                        pagination=dict(pageSize=4)) as table:
            antd.Table.Column(title="Name", data_index="name", key="name")
            antd.Table.Column(title="Age", data_index="age", key="age")
            antd.Table.Column(title="Address",
                              data_index="address",
                              key="address")
        table.change(fn=on_change)
if __name__ == "__main__":
    demo.queue().launch()
