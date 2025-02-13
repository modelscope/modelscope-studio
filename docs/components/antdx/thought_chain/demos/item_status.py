import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def run_next(each_value):
    each_value.append({
        "title": f'Thought Chain Item - {len(each_value) + 1}',
        "status": 'pending',
        "description": 'status: pending',
        "icon": "LoadingOutlined",
        "key": str(len(each_value) + 1)
    })
    yield gr.update(value="Running", loading=True), gr.update(value=each_value)
    time.sleep(0.8)
    each_value[-1]["status"] = "error"
    each_value[-1]["description"] = 'status: error'
    each_value[-1]["icon"] = "InfoCircleOutlined"
    yield gr.skip(), gr.update(value=each_value)
    time.sleep(0.8)
    each_value[-1]["status"] = "pending"
    each_value[-1]["description"] = 'status: pending'
    each_value[-1]["icon"] = 'LoadingOutlined'
    yield gr.skip(), gr.update(value=each_value)
    time.sleep(0.8)
    each_value[-1]["status"] = "success"
    each_value[-1]["description"] = 'status: success'
    each_value[-1]["icon"] = "CheckCircleOutlined"
    yield gr.update(value="Run Next",
                    loading=False), gr.update(value=each_value)


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph(
                "The thought chain nodes support configuring the `status` property to clearly indicate the current execution status of the node."
            )
            with antd.Card():
                with antd.Flex(vertical=True, gap="middle"):
                    with ms.Div():
                        btn = antd.Button("Run Next")
                    with antdx.ThoughtChain():
                        with ms.Each(value=[
                            {
                                "title": 'Thought Chain Item - 1',
                                "status": 'success',
                                "description": 'status: success',
                                "icon": 'CheckCircleOutlined',
                                "key": "1"
                            },
                            {
                                "title": 'Thought Chain Item - 2',
                                "status": 'error',
                                "description": 'status: error',
                                "icon": 'InfoCircleOutlined',
                                "key": "2"
                            },
                        ]) as each:
                            with antdx.ThoughtChain.Item():
                                with ms.Slot("icon"):
                                    antd.Icon(as_item="icon")

            btn.click(fn=run_next, inputs=[each], outputs=[btn, each])

if __name__ == "__main__":
    demo.queue().launch()
