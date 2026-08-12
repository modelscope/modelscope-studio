import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def on_right_click(e: gr.EventData):
    print("right clicked:", e._data["payload"])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("Shared Context Menu")
            # `context_menu` applies to all nodes, a node can override it
            # with its own `context_menu` (pass False to disable).
            with antdx.Folder(default_expand_all=True,
                              context_menu=[{
                                  "key": "rename",
                                  "label": "Rename"
                              }, {
                                  "key": "delete",
                                  "label": "Delete",
                                  "danger": True
                              }]) as folder:
                with antdx.Folder.TreeNode(title="src", path="/src"):
                    antdx.Folder.TreeNode(title="index.ts",
                                          path="/src/index.ts",
                                          content="export * from './app';")
                    # disable the context menu for this node only
                    antdx.Folder.TreeNode(title="app.ts",
                                          path="/src/app.ts",
                                          content="console.log('Hello');",
                                          context_menu=False)
                antdx.Folder.TreeNode(
                    title="package.json",
                    path="/package.json",
                    content='{\n  "name": "my-project"\n}',
                    # override the shared menu for this node
                    context_menu=[{
                        "key": "copy_path",
                        "label": "Copy Path"
                    }])

            antd.Divider("Dynamic Context Menu")
            # `context_menu` also accepts a Javascript function string,
            # which receives the node data and its full path key.
            antdx.Folder(
                default_expand_all=True,
                context_menu=
                "(node, key) => node.children ? [{ key: 'new_file', label: 'New File' }] : [{ key: 'open', label: 'Open ' + key }]",
                tree_data=[{
                    "title":
                    "project",
                    "path":
                    "/project",
                    "children": [{
                        "title": "main.py",
                        "path": "/project/main.py",
                        "content": "print('Hello, World!')"
                    }]
                }])

            folder.right_click(fn=on_right_click)

if __name__ == "__main__":
    demo.queue().launch()
