import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

tree_data = [{
    "value":
    "parent 1",
    "title":
    "parent 1",
    "children": [{
        "value":
        "parent 1-0",
        "title":
        "parent 1-0",
        "children": [{
            "value": "leaf1",
            "title": "leaf1"
        }, {
            "value": "leaf2",
            "title": "leaf2"
        }, {
            "value": "leaf3",
            "title": "leaf3"
        }, {
            "value": "leaf4",
            "title": "leaf4"
        }, {
            "value": "leaf5",
            "title": "leaf5"
        }, {
            "value": "leaf6",
            "title": "leaf6"
        }]
    }, {
        "value": "parent 1-1",
        "title": "parent 1-1",
        "children": [{
            "value": "leaf11",
            "title": "leaf11"
        }]
    }]
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.TreeSelect(show_search=True,
                            elem_style=dict(width="100%"),
                            dropdown_style=dict(maxHeight=400,
                                                overflow="auto"),
                            multiple=True,
                            placeholder="Please Select",
                            tree_checkable=True,
                            show_checked_strategy="SHOW_PARENT",
                            tree_default_expand_all=True,
                            tree_data=tree_data)
            antd.Divider("Custom TreeNode")
            with antd.TreeSelect(tree_line=True,
                                 tree_icon=True,
                                 elem_style=dict(width=300)):
                with ms.Slot("treeData"):
                    with antd.TreeSelect.TreeNode(value="parent 1",
                                                  title="parent 1"):
                        with ms.Slot("icon"):
                            antd.Icon("CarryOutOutlined")
                        with antd.TreeSelect.TreeNode(value="parent 1-0",
                                                      title="parent 1-0"):
                            with ms.Slot("icon"):
                                antd.Icon("CarryOutOutlined")
                            with antd.TreeSelect.TreeNode(value="leaf1",
                                                          title="leaf1"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                            with antd.TreeSelect.TreeNode(value="leaf2",
                                                          title="leaf2"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                            with antd.TreeSelect.TreeNode(value="leaf3",
                                                          title="leaf3"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                        with antd.TreeSelect.TreeNode(
                                value="parent 1-1",
                                title="parent 1-1",
                        ):
                            with ms.Slot("icon"):
                                antd.Icon("CarryOutOutlined")
                            with antd.TreeSelect.TreeNode(value="leaf11"):
                                with ms.Slot("title"):
                                    antd.Typography.Text("leaf11",
                                                         type="success")
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
if __name__ == "__main__":
    demo.queue().launch()
