import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

tree_data = [{
    "title":
    "parent 0",
    "key":
    "0-0",
    "children": [{
        "title": "leaf 0-0",
        "key": "0-0-0",
        "isLeaf": True
    }, {
        "title": "leaf 0-1",
        "key": "0-0-1",
        "isLeaf": True
    }]
}, {
    "title":
    "parent 1",
    "key":
    "0-1",
    "children": [{
        "title": "leaf 1-0",
        "key": "0-1-0",
        "isLeaf": True
    }, {
        "title": "leaf 1-1",
        "key": "0-1-1",
        "isLeaf": True
    }]
}]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Tree.DirectoryTree(draggable=True,
                                    multiple=True,
                                    default_expand_all=True,
                                    tree_data=tree_data)

if __name__ == "__main__":
    demo.queue().launch()
