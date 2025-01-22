import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "key": "1",
    "name": "John Brown",
    "age": 32,
    "address": "New York No. 1 Lake Park",
    "tags": ["nice", "developer"]
}, {
    "key": "2",
    "name": "Jim Green",
    "age": 42,
    "address": "London No. 1 Lake Park",
    "tags": ["loser"]
}, {
    "key": "3",
    "name": "Joe Black",
    "age": 32,
    "address": "Sydney No. 1 Lake Park",
    "tags": ["cool", "teacher"]
}]


def on_invite(e: gr.EventData):
    print(e._data)


def on_delete(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Table(data_source=data):
                with antd.Table.Column(
                        title="Name",
                        data_index="name",
                        key="name",
                ):
                    with ms.Slot("render",
                                 params_mapping="(text) => ({ value: text })"):
                        antd.Typography.Link(href="#")
                antd.Table.Column(title="Age", data_index="age", key="age")
                antd.Table.Column(title="Age", data_index="age", key="age")
                antd.Table.Column(title="Address",
                                  data_index="address",
                                  key="address")
                antd.Table.Column(title="Tags",
                                  data_index="tags",
                                  key="tags",
                                  column_render="""(_, { tags }) => {
  const React = window.ms_globals.React;
  const antd = window.ms_globals.antd;
  return tags.map((tag) => {
    let color = tag.length > 5 ? 'geekblue' : 'green';
    if (tag === 'loser') {
      color = 'volcano';
    }
    return React.createElement(antd.Tag, { color, key: tag }, tag.toUpperCase());
  });
}""")

                with antd.Table.Column(
                        title="Action",
                        key="action",
                ):
                    with ms.Slot(
                            "render",
                            "(_, record, index) => ({ invite: { value: 'Invite ' + record.name, index }, delete: { index }})"
                    ):
                        with antd.Space(size="middle"):
                            antd.Button(type="primary",
                                        as_item="invite").click(fn=on_invite)
                            antd.Button('Delete',
                                        type="primary",
                                        danger=True,
                                        as_item="delete").click(fn=on_delete)

if __name__ == "__main__":
    demo.queue().launch()
