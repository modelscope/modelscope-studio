import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def menu_click(e: gr.EventData):
    print(e._data["payload"])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antdx.Conversations(default_active_key="item1",
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
                                     }]) as conversations:
                with ms.Slot("menu.items"):
                    with antd.Menu.Item(label="Operation 1", key="o1"):
                        with ms.Slot("icon"):
                            antd.Icon("EditOutlined")
                    with antd.Menu.Item(label="Operation 2",
                                        key="o2",
                                        disabled=True):
                        with ms.Slot("icon"):
                            antd.Icon("StopOutlined")
                    with antd.Menu.Item(label="Operation 3",
                                        key="o3",
                                        danger=True):
                        with ms.Slot("icon"):
                            antd.Icon("DeleteOutlined")
            conversations.menu_click(fn=menu_click)

if __name__ == "__main__":
    demo.queue().launch()
