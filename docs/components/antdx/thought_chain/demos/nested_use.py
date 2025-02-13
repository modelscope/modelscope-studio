import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antd.Card():
                with antdx.ThoughtChain(collapsible=True):
                    with antdx.ThoughtChain.Item(
                            title="1 - Thought Chain Item",
                            description="description"):
                        with ms.Slot("extra"):
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("MoreOutlined")
                        with ms.Slot("content"):
                            with antdx.ThoughtChain():
                                with antdx.ThoughtChain.Item(
                                        title="1-1 - Thought Chain Item",
                                        description="description"):
                                    with ms.Slot("extra"):
                                        with antd.Button(value=None,
                                                         type="text"):
                                            with ms.Slot("icon"):
                                                antd.Icon("MoreOutlined")
                                with antdx.ThoughtChain.Item(
                                        title="1-2 - Thought Chain Item",
                                        description="description"):
                                    with ms.Slot("extra"):
                                        with antd.Button(value=None,
                                                         type="text"):
                                            with ms.Slot("icon"):
                                                antd.Icon("MoreOutlined")
                        with ms.Slot("footer"):
                            antd.Button("1 - Thought Chain Item Footer")
                    with antdx.ThoughtChain.Item(
                            title="2 - Thought Chain Item",
                            description="description"):
                        with ms.Slot("extra"):
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("MoreOutlined")
                        with ms.Slot("content"):
                            with antdx.ThoughtChain():
                                with antdx.ThoughtChain.Item(
                                        title="2-1 - Thought Chain Item",
                                        description="description"):
                                    with ms.Slot("extra"):
                                        with antd.Button(value=None,
                                                         type="text"):
                                            with ms.Slot("icon"):
                                                antd.Icon("MoreOutlined")
                                with antdx.ThoughtChain.Item(
                                        title="2-2 - Thought Chain Item",
                                        description="description"):
                                    with ms.Slot("extra"):
                                        with antd.Button(value=None,
                                                         type="text"):
                                            with ms.Slot("icon"):
                                                antd.Icon("MoreOutlined")
                        with ms.Slot("footer"):
                            antd.Button("2 - Thought Chain Item Footer")

if __name__ == "__main__":
    demo.queue().launch()
