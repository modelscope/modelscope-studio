import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    "text": 'Racing car sprays burning fuel into crowd.',
}, {
    "text": 'Japanese princess to wed commoner.',
}, {
    "text": 'Australian walks 100km after outback crash.',
}, {
    "text": 'Man charged over missing wedding girl.',
}, {
    "text": 'Los Angeles battles huge wildfires.',
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Divider("Static Render")
            with antd.List(header="Header", footer="Footer", bordered=True):
                for item in data:
                    with antd.List.Item():
                        antd.Typography.Text("[ITEM]", mark=True)
                        ms.Text(item["text"])

            antd.Divider("Dynamic Render")
            with antd.List(header="Header", footer="Footer", bordered=True):
                with ms.Each(value=data):
                    with antd.List.Item():
                        antd.Typography.Text("[ITEM]", mark=True)
                        ms.Text(as_item="text")
            antd.Divider("Dynamic Render with JavaScript")
            antd.List(header="Header",
                      footer="Footer",
                      bordered=True,
                      data_source=data,
                      render_item="""(item) => {
  const React = window.ms_globals.React;
  const antd = window.ms_globals.antd;
  return React.createElement(
    antd.List.Item,
    null,
    React.createElement(antd.Typography.Text, { mark: true }, '[ITEM]'),
    React.createElement(antd.Typography.Text, null, item.text)
  );
};
""")

if __name__ == "__main__":
    demo.queue().launch()
