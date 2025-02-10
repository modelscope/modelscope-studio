import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def active_change(e: gr.EventData):
    print(e._data["payload"])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            conversations1 = antdx.Conversations(default_active_key="item1",
                                                 items=[{
                                                     "key": "item1",
                                                     "label": "Item1"
                                                 }, {
                                                     "key": "item2",
                                                     "label": "Item2",
                                                 }, {
                                                     "key": "item3",
                                                     "label": "Item3",
                                                 }, {
                                                     "key": "item4",
                                                     "label": "Item4",
                                                     "disabled": True
                                                 }])

            antd.Divider("Customized Item")

            with antdx.Conversations(
                    default_active_key="item1") as conversations2:
                with antdx.Conversations.Item(key="item1"):
                    with ms.Slot("label"):
                        antd.Typography.Text("Item1", type="success")
                    with ms.Slot("icon"):
                        antd.Icon()

                with antdx.Conversations.Item(key="item2"):
                    with ms.Slot("label"):
                        antd.Typography.Text("Item2", type="success")
                    with ms.Slot("icon"):
                        antd.Icon()
            conversations1.active_change(fn=active_change)
            conversations2.active_change(fn=active_change)

if __name__ == "__main__":
    demo.queue().launch()
