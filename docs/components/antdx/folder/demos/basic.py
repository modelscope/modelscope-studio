import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def on_file_click(e: gr.EventData):
    print("file clicked:", e._data["payload"])


def on_folder_click(e: gr.EventData):
    print("folder clicked:", e._data["payload"])


def on_selected_file_change(e: gr.EventData):
    print("selected file changed:", e._data["payload"])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("Basic Folder Tree")
            with antdx.Folder(default_expand_all=True) as folder1:
                with antdx.Folder.TreeNode(title="src", path="/src"):
                    antdx.Folder.TreeNode(title="index.ts",
                                          path="/src/index.ts",
                                          content="export * from './app';")
                    antdx.Folder.TreeNode(
                        title="app.ts",
                        path="/src/app.ts",
                        content=
                        "// Application entry point\nconsole.log('Hello World');"
                    )
                    with antdx.Folder.TreeNode(title="components",
                                               path="/src/components"):
                        antdx.Folder.TreeNode(
                            title="Button.tsx",
                            path="/src/components/Button.tsx",
                            content=
                            "import React from 'react';\n\nexport const Button = () => <button>Click me</button>;"
                        )
                        antdx.Folder.TreeNode(
                            title="Input.tsx",
                            path="/src/components/Input.tsx",
                            content=
                            "import React from 'react';\n\nexport const Input = () => <input />;"
                        )
                    with antdx.Folder.TreeNode(title="utils",
                                               path="/src/utils"):
                        antdx.Folder.TreeNode(
                            title="helpers.ts",
                            path="/src/utils/helpers.ts",
                            content=
                            "export const add = (a: number, b: number) => a + b;"
                        )
                antdx.Folder.TreeNode(
                    title="package.json",
                    path="/package.json",
                    content=
                    '{\n  "name": "my-project",\n  "version": "1.0.0"\n}')
                antdx.Folder.TreeNode(
                    title="README.md",
                    path="/README.md",
                    content="# My Project\n\nA sample project.")

            antd.Divider("Using tree_data Prop")
            antdx.Folder(
                default_expand_all=True,
                tree_data=[{
                    "title":
                    "project",
                    "path":
                    "/project",
                    "children": [{
                        "title": "main.py",
                        "path": "/project/main.py",
                        "content": "print('Hello, World!')"
                    }, {
                        "title":
                        "utils.py",
                        "path":
                        "/project/utils.py",
                        "content":
                        "def greet(name):\n    return f'Hello, {name}!'"
                    }, {
                        "title":
                        "tests",
                        "path":
                        "/project/tests",
                        "children": [{
                            "title":
                            "test_main.py",
                            "path":
                            "/project/tests/test_main.py",
                            "content":
                            "import unittest\n\nclass TestMain(unittest.TestCase):\n    pass"
                        }]
                    }]
                }, {
                    "title": "requirements.txt",
                    "path": "/requirements.txt",
                    "content": "gradio\nmodelscope-studio"
                }])

            folder1.file_click(fn=on_file_click)
            folder1.folder_click(fn=on_folder_click)
            folder1.selected_file_change(fn=on_selected_file_change)

if __name__ == "__main__":
    demo.queue().launch()
