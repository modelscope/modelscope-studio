import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [
    {
        "key": '1',
        "name": 'Mike',
        "age": 32,
        "address": '10 Downing Street',
    },
    {
        "key": '2',
        "name": 'John',
        "age": 42,
        "address": '10 Downing Street',
    },
]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Table(data_source=data):
                antd.Table.Column(title="Name", data_index="name", key="name")
                antd.Table.Column(title="Age", data_index="age", key="age")
                antd.Table.Column(title="Address",
                                  data_index="address",
                                  key="address")
if __name__ == "__main__":
    demo.queue().launch()
