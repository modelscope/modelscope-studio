import os
import re
from typing import Callable

import gradio as gr
import modelscope_studio as mgr
from helper.env import is_modelscope_studio

from .parse_markdown import parse_markdown

with open(os.path.join(os.path.dirname(__file__), "tab-link.js")) as f:
    tab_link_js = f.read()

custom_components = {
    "tab-link": {
        "props": ["tab", "component-tab"],
        "js": tab_link_js
    }
}


def remove_formatter(markdown_text):
    pattern = r"^ *---[\s\S]*?---"

    replaced_text = re.sub(pattern, "", markdown_text)

    return replaced_text


def list_demos(dir_path: str, prefix=''):
    result = []
    if (not os.path.isdir(dir_path)):
        return result
    for name in os.listdir(dir_path):
        path = os.path.join(dir_path, name)

        if os.path.isfile(path):
            result.append(prefix + name)
        elif os.path.isdir(path):
            sub_prefix = prefix + name + '/'
            result.extend(list_demos(path, sub_prefix))

    return result


def get_demo_modules(file_path: str):
    import importlib.util

    demos = [
        demo for demo in list_demos(
            os.path.join(os.path.dirname(file_path), "demos"))
        if demo.endswith(".py") and not demo.startswith("__")
    ]
    demo_modules = {}
    for demo in demos:
        demo_name = demo.split(".")[0]
        spec = importlib.util.spec_from_file_location(
            "demo", os.path.join(os.path.dirname(file_path), "demos", demo))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        demo_modules[demo_name] = module
    return demo_modules


class Docs:

    def __init__(self, file_path: str, markdown_files: list = None):
        self.file_path = file_path
        self.demo_modules = get_demo_modules(file_path)
        # default current directory
        self.markdown_files = markdown_files if markdown_files else [
            filename for filename in os.listdir(os.path.dirname(file_path))
            if filename.endswith(".md")
        ]
        if is_modelscope_studio:
            self.markdown_files = list(
                filter(
                    lambda x: x.endswith("-zh_CN.md") or
                    (f"{'.'.join(x.split('.')[:-1])}-zh_CN.md" not in self.
                     markdown_files), self.markdown_files))
        else:
            self.markdown_files = list(
                filter(lambda x: not x.endswith("-zh_CN.md"),
                       self.markdown_files))

        self.tabs = None

    def read_file(self, relative_path: str):
        with open(os.path.join(os.path.dirname(self.file_path), relative_path),
                  "r") as f:
            return f.read()

    def render_demo(self,
                    demo_name,
                    code_position='left',
                    prefix='',
                    suffix=''):
        content = self.read_file(f"./demos/{demo_name}.py")
        module = self.demo_modules[demo_name]
        with gr.Accordion("Show Demo", open=False):

            def render_code():
                mgr.Markdown(f"""{prefix}
````python
{content}
````
{suffix}""",
                             header_links=True,
                             custom_components=custom_components)

            if code_position == 'top':
                with gr.Row():
                    with gr.Column():
                        render_code()
            with gr.Row():
                if code_position == 'left':
                    with gr.Column():
                        render_code()
                with gr.Column():
                    module.demo.render()
                if code_position == 'right':
                    with gr.Column():
                        render_code()
            if code_position == 'bottom':
                with gr.Row():
                    with gr.Column():
                        render_code()

    def render_markdown(self,
                        markdown_file,
                        on_tab_link_click: Callable = None,
                        components_tabs=None):
        items = parse_markdown(remove_formatter(self.read_file(markdown_file)),
                               read_file=self.read_file)
        for item in items:
            if item["type"] == "text":
                md = mgr.Markdown(item["value"],
                                  header_links=True,
                                  custom_components=custom_components,
                                  preview=False)
                deps = [dep for dep in [components_tabs, self.tabs] if dep]
                if len(deps) > 0:
                    md.custom(fn=on_tab_link_click, outputs=deps)
            elif item["type"] == "demo":
                self.render_demo(item["name"],
                                 prefix=item["prefix"],
                                 suffix=item["suffix"],
                                 code_position=item["code_position"])

    def render(self, components_tabs=None):

        def tab_link_click(data: gr.EventData):
            tab: str = data._data.get("value", {}).get("tab", '')
            component_tab: str = data._data["value"].get("component_tab", '')
            if tab and tabs:
                return {tabs: gr.update(selected=tab)}
            elif components_tabs and component_tab:
                return {components_tabs: gr.update(selected=component_tab)}

        with gr.Blocks() as demo:

            if len(self.markdown_files) > 1:
                with gr.Tabs() as tabs:
                    self.tabs = tabs

                    for markdown_file in self.markdown_files:
                        tab_name = ".".join(markdown_file.split(".")[:-1])
                        tab_name = tab_name.split("-zh_CN")[0]
                        with gr.TabItem(tab_name, id=tab_name):
                            self.render_markdown(
                                markdown_file,
                                on_tab_link_click=tab_link_click,
                                components_tabs=components_tabs)
            elif (len(self.markdown_files) == 1):
                self.render_markdown(self.markdown_files[0],
                                     on_tab_link_click=tab_link_click,
                                     components_tabs=components_tabs)
        return demo
