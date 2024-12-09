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


def on_selection_change(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.Table(data_source=data):
            # add selection config
            with ms.Slot("rowSelection"):
                selection = antd.Table.RowSelection()
            antd.Table.Column(title="Name", data_index="name", key="name")
            antd.Table.Column(title="Age", data_index="age", key="age")
            antd.Table.Column(title="Address",
                              data_index="address",
                              key="address")
            selection.change(on_selection_change)
        antd.Divider("Custom selection")
        with antd.Table(data_source=data):
            # add selection config
            with ms.Slot("rowSelection"):
                with antd.Table.RowSelection():
                    with ms.Slot("selections"):
                        antd.Table.RowSelection.Selection(
                            built_in_selection='SELECT_ALL')
                        antd.Table.RowSelection.Selection(
                            built_in_selection='SELECT_INVERT')
                        antd.Table.RowSelection.Selection(
                            built_in_selection='SELECT_NONE')
            antd.Table.Column(title="Name", data_index="name", key="name")
            antd.Table.Column(title="Age", data_index="age", key="age")
            antd.Table.Column(title="Address",
                              data_index="address",
                              key="address")
if __name__ == "__main__":
    demo.queue().launch()
