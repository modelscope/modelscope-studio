import os
from typing import Literal

from helper.Site import Site
from legacy_app import legacy_demo

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def get_docs(file_path: str, type: Literal["antd", "base"]):
    import importlib.util

    components = []
    components_dir = os.path.join(os.path.dirname(file_path), "components",
                                  type)
    for dir in os.listdir(components_dir):
        abs_dir = os.path.join(components_dir, dir)
        if os.path.isdir(abs_dir):
            app_file = os.path.join(abs_dir, "app.py")
            if os.path.exists(app_file):
                components.append(dir)

    docs = {}
    for component in components:
        spec = importlib.util.spec_from_file_location(
            "doc", os.path.join(components_dir, component, "app.py"))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        docs[component] = module
    return docs


base_docs = get_docs(__file__, "base")
antd_docs = get_docs(__file__, "antd")

default_active_tab = "antd"

base_menu_items = [{"label": "Application", "key": "application"}]

antd_menu_items = [{
    "label":
    "General",
    "type":
    "group",
    "children": [{
        "label": "Button",
        "key": "button"
    }, {
        "label": "FloatButton",
        "key": "float_button"
    }]
}, {
    "label": "Layout",
    "type": "group",
    "children": [{
        "label": "Divider",
        "key": "divider"
    }]
}]

tabs = [
    {
        "label": "Base",
        "key": "base",
        "default_active_key": "application",
        "menus": base_menu_items
    },
    {
        "label": "Antd",
        "key": "antd",
        "default_active_key": "button",
        "menus": antd_menu_items
    },
    {
        "label": "Legacy",
        "key": "legacy",
        "content": legacy_demo
    },
]


def logo():
    with antd.Flex(align='center', gap=8):
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/modelscope.png"),
                   preview=False,
                   height=32)
        ms.Span('✖️')
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/gradio.png"),
                   preview=False,
                   height=64)


site = Site(tabs=tabs,
            docs={
                **antd_docs,
                **base_docs
            },
            default_active_tab=default_active_tab,
            logo=logo)

demo = site.render()

if __name__ == "__main__":
    demo.launch()
