import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

default_collapsible = False


def mock_content():
    with antd.Typography.Paragraph():
        antd.Typography.Paragraph(
            "In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the efficiency of development."
        )
        with antd.Typography.Paragraph():
            ms.Text(
                "After massive project practice and summaries, Ant Design, a design language for background applications, is refined by Ant UED Team, which aims to "
            )
            antd.Typography.Text(
                "uniform the user interface specs for internal background projects, lower the unnecessary cost of design differences and implementation and liberate the resources of design and front-end development",
                strong=True,
            )


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            collapsible = antd.Switch(default_collapsible,
                                      checked_children="Collapsible",
                                      un_checked_children="Not Collapsible")
            with antd.Card():
                with antdx.ThoughtChain(
                        collapsible=default_collapsible) as thought_chain:
                    with antdx.ThoughtChain.Item(
                            title="Thought Chain Item Title 1",
                            description="description",
                            status="success"):
                        with ms.Slot("extra"):
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("MoreOutlined")
                        with ms.Slot("content"):
                            mock_content()
                        with ms.Slot("footer"):
                            antd.Button("Thought Chain Item Footer",
                                        block=True)
                    with antdx.ThoughtChain.Item(
                            title="Thought Chain Item Title 2",
                            description="description",
                            status="error"):
                        with ms.Slot("extra"):
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("MoreOutlined")
                        with ms.Slot("content"):
                            mock_content()
                        with ms.Slot("footer"):
                            antd.Button("Thought Chain Item Footer",
                                        block=True)
                    with antdx.ThoughtChain.Item(
                            title="Thought Chain Item Title 3",
                            description="description",
                            status="pending"):
                        with ms.Slot("extra"):
                            with antd.Button(value=None, type="text"):
                                with ms.Slot("icon"):
                                    antd.Icon("MoreOutlined")
                        with ms.Slot("content"):
                            mock_content()
                        with ms.Slot("footer"):
                            antd.Button("Thought Chain Item Footer",
                                        block=True)
            collapsible.change(fn=lambda x: gr.update(collapsible=x),
                               inputs=[collapsible],
                               outputs=[thought_chain])
if __name__ == "__main__":
    demo.queue().launch()
