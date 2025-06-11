import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def on_click(e: gr.EventData):
    keyPath = ','.join(e._data["payload"][0]["keyPath"])
    key = e._data["payload"][0]["key"]
    gr.Info('keyPath: ' + keyPath + ', key: ' + key)


def on_delete():
    gr.Success("Delete success")


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antdx.Actions() as actions:
                with antdx.Actions.Item(key="retry", label="Retry"):
                    with ms.Slot("icon"):
                        antd.Icon("RedoOutlined")
                with antdx.Actions.Item(key="copy", label="Copy"):
                    with ms.Slot("icon"):
                        antd.Icon("CopyOutlined")
            antd.Divider("More Menu Items")
            with antdx.Actions() as actions2:
                with antdx.Actions.Item(key="retry", label="Retry"):
                    with ms.Slot("icon"):
                        antd.Icon("RedoOutlined")
                with antdx.Actions.Item(key="copy", label="Copy"):
                    with ms.Slot("icon"):
                        antd.Icon("CopyOutlined")
                with antdx.Actions.Item(key="more"):
                    with antdx.Actions.Item(key="share", label="Share"):
                        with ms.Slot("icon"):
                            antd.Icon("ShareAltOutlined")
                        antdx.Actions.Item(key="qq", label="QQ")
                        antdx.Actions.Item(key="wechat", label="WeChat")
                    antdx.Actions.Item(key="import", label="Import")
                    with antdx.Actions.Item(
                            key="delete", label="Delete",
                            danger=True) as actions_delete_item:
                        with ms.Slot("icon"):
                            antd.Icon("DeleteOutlined")
                with antdx.Actions.Item(key="clear", label="Clear"):
                    with ms.Slot("icon"):
                        antd.Icon("ClearOutlined")

    actions.click(fn=on_click)
    actions2.click(fn=on_click)
    actions_delete_item.item_click(fn=on_delete)

if __name__ == "__main__":
    demo.queue().launch()
