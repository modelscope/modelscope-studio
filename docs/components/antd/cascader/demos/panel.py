import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Cascader.Panel(options=[
                {
                    "value": 'zhejiang',
                    "label": 'Zhejiang',
                    "children": [{
                        "value": 'hangzhou',
                        "label": 'Hangzhou'
                    }],
                }, {
                    "value": 'jiangsu',
                    "label": 'Jiangsu',
                    "children": [{
                        "value": 'nanjing',
                        "label": 'Nanjing'
                    }],
                }, {
                    "value": 'shanghai',
                    "label": 'Shanghai',
                    "disabled": True
                }
            ])

if __name__ == "__main__":
    demo.queue().launch()
