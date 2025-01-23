import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

tree_data = [{
    "title":
    "parent 1",
    "key":
    "0-0",
    "children": [{
        "title":
        "parent 1-0",
        "key":
        "0-0-0",
        "disabled":
        True,
        "children": [{
            "title": "leaf",
            "key": "0-0-0-0",
            "disableCheckbox": True
        }, {
            "title": "leaf",
            "key": "0-0-0-1"
        }]
    }, {
        "title": "parent 1-1",
        "key": "0-0-1",
        "children": [{
            "title": "sss",
            "key": "0-0-1-0"
        }]
    }]
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Tree(elem_style=dict(width="100%"),
                      checkable=True,
                      default_checked_keys=['0-0-0', '0-0-1'],
                      default_selected_keys=['0-0-0', '0-0-1'],
                      default_expanded_keys=['0-0-0', '0-0-1'],
                      tree_data=tree_data)
            antd.Divider("Custom TreeNode")
            with antd.Tree(show_line=True,
                           show_icon=True,
                           default_expanded_keys=['parent-1', 'parent-1-0'],
                           elem_style=dict(width=300)):
                with ms.Slot("treeData"):
                    with antd.Tree.TreeNode(key="parent-1", title="parent 1"):
                        with ms.Slot("icon"):
                            antd.Icon("CarryOutOutlined")
                        with antd.Tree.TreeNode(key="parent-1-0",
                                                title="parent 1-0"):
                            with ms.Slot("icon"):
                                antd.Icon("CarryOutOutlined")
                            with antd.Tree.TreeNode(key="leaf1",
                                                    title="leaf1"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                            with antd.Tree.TreeNode(key="leaf2",
                                                    title="leaf2"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                            with antd.Tree.TreeNode(key="leaf3",
                                                    title="leaf3"):
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
                        with antd.Tree.TreeNode(
                                key="parent-1-1",
                                title="parent 1-1",
                        ):
                            with ms.Slot("icon"):
                                antd.Icon("CarryOutOutlined")
                            with antd.Tree.TreeNode(key="leaf11"):
                                with ms.Slot("title"):
                                    antd.Typography.Text("leaf11",
                                                         type="success")
                                with ms.Slot("icon"):
                                    antd.Icon("CarryOutOutlined")
if __name__ == "__main__":
    demo.queue().launch()
