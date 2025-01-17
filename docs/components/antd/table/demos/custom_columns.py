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


def on_custom(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application() as app:
        with antd.Table(data_source=data):
            antd.Table.Column(title="Name",
                              data_index="name",
                              key="name",
                              column_render="""(text) => {
  const React = window.ms_globals.React;
  return React.createElement('a', null, text);
}""")
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
            antd.Table.Column(title="Action",
                              key="action",
                              column_render="""(_, record) => {
  const React = window.ms_globals.React;
  const antd = window.ms_globals.antd;
  const dispatch = window.ms_globals.dispatch;
  return React.createElement(
    antd.Space,
    { size: 'middle' },
    React.createElement(
      antd.Button,
      {
        type: 'primary',
        onClick: () => {
          dispatch({
            type: 'custom_table',
            action: 'invite',
            payload: record,
          });
        },
      },
      'Invite ',
      record.name
    ),
    React.createElement(
      antd.Button,
      {
        type: 'primary',
        danger: true,
        onClick: () => {
          dispatch({
            type: 'custom_table',
            action: 'delete',
            payload: record,
          });
        },
      },
      'Delete'
    )
  );
}""")

    app.custom(fn=on_custom)

if __name__ == "__main__":
    demo.queue().launch()
