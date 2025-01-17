import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Cascader(elem_style=dict(width=300),
                          options=[{
                              "value":
                              'zhejiang',
                              "label":
                              'Zhejiang',
                              "children": [{
                                  "value": 'hangzhou',
                                  "label": 'Hangzhou'
                              }],
                          }, {
                              "value":
                              'jiangsu',
                              "label":
                              'Jiangsu',
                              "children": [{
                                  "value": 'nanjing',
                                  "label": 'Nanjing'
                              }],
                          }, {
                              "value": 'shanghai',
                              "label": 'Shanghai',
                              "disabled": True
                          }])
            antd.Divider("Multiple")
            with antd.Cascader(elem_style=dict(width='100%'),
                               multiple=True,
                               max_tag_count="responsive"):
                antd.Cascader.Option(label="Light", value="light")
                with antd.Cascader.Option(label="Bamboo", value="bamboo"):
                    with antd.Cascader.Option(label="Little", value="little"):
                        antd.Cascader.Option(label="Toy Fish",
                                             value="fish",
                                             disabled=True)
                        antd.Cascader.Option(label="Toy Bird", value="bird")
                        with antd.Cascader.Option(value="cat"):
                            with ms.Slot("label"):
                                antd.Typography.Text("Toy Cat", type="success")
if __name__ == "__main__":
    demo.queue().launch()
