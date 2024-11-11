import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_custom(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application() as app:
        with antd.ConfigProvider():
            with antd.Table([
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
                    "address": '11 Downing Street',
                },
            ],
                            pagination=False):
                antd.Table.Column(title="Name", data_index="name", key="name")
                antd.Table.Column(title="Age", data_index="age", key="age")
                antd.Table.Column(title="Address",
                                  data_index="address",
                                  key="address")
                antd.Table.Column(title="Action",
                                  key="action",
                                  column_render="""(_, record) => {
                    const React = window.ms_globals.React;
                    const antd = window.ms_globals.antd;
                    const dispatch = window.ms_globals.dispatch;
                    return React.createElement(antd.Space, {
                        size: "middle",
                        children: [
                            React.createElement(antd.Button, {
                                type: "link",
                                onClick: () => {
                                    dispatch({
                                        type: "table_column_action",
                                        payload: {
                                            action: "invite",
                                            record,
                                        },
                                    });
                                },
                                children: "Invite " + record.name
                            }),
                            React.createElement(antd.Button, {
                                type: "link",
                                children: "Delete",
                                onClick: () => {
                                    dispatch({
                                        type: "table_column_action",
                                        payload: {
                                            action: "delete",
                                            record,
                                        },
                                    });
                                },
                            }),
                        ],
                    });
                }""")

    app.custom(on_custom)
if __name__ == "__main__":
    demo.queue().launch()
