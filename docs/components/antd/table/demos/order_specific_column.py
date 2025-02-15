import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "key":
    1,
    "name":
    "John Brown",
    "age":
    32,
    "address":
    "New York No. 1 Lake Park",
    "description":
    "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
}, {
    "key":
    2,
    "name":
    "Jim Green",
    "age":
    42,
    "address":
    "London No. 1 Lake Park",
    "description":
    "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
}, {
    "key": 3,
    "name": "Not Expandable",
    "age": 29,
    "address": "Jiangsu No. 1 Lake Park",
    "description": "This not expandable"
}, {
    "key":
    4,
    "name":
    "Joe Black",
    "age":
    32,
    "address":
    "Sydney No. 1 Lake Park",
    "description":
    "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park."
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Table(data_source=data):
                with ms.Slot("rowSelection"):
                    selection = antd.Table.RowSelection()
                with ms.Slot("expandable"):
                    with antd.Table.Expandable(
                            row_expandable=
                            """(record) => record.name !== 'Not Expandable'"""
                    ):
                        with ms.Slot(
                                "expandedRowRender",
                                """(record) => ({ value: record.description })"""
                        ):
                            antd.Typography.Text(type="success")

                antd.Table.Column(title="Name", data_index="name", key="name")
                antd.Table.Column(built_in_column="EXPAND_COLUMN")
                antd.Table.Column(title="Age", data_index="age", key="age")
                antd.Table.Column(built_in_column="SELECTION_COLUMN")
                antd.Table.Column(title="Address",
                                  data_index="address",
                                  key="address")
if __name__ == "__main__":
    demo.queue().launch()
