import os
from typing import Literal

from helper.Site import Site

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

# from legacy_app import legacy_demo


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

default_active_tab = "base"

base_menu_items = [{
    "label": "Overview",
    "key": "overview"
}, {
    "label":
    "Core",
    "type":
    "group",
    "children": [{
        "label": "Application",
        "key": "application"
    }, {
        "label": "Slot",
        "key": "slot"
    }, {
        "label": "Fragment",
        "key": "fragment"
    }]
}, {
    "label":
    "Layout",
    "type":
    "group",
    "children": [{
        "label": "Div",
        "key": "div"
    }, {
        "label": "Span",
        "key": "span"
    }, {
        "label": "Text",
        "key": "text"
    }]
}, {
    "label":
    "Flow-Control",
    "type":
    "group",
    "children": [{
        "label": "Each",
        "key": "each"
    }, {
        "label": "Filter",
        "key": "filter"
    }]
}]

antd_menu_items = [{
    "label": "Overview",
    "key": "overview"
}, {
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
    }, {
        "label": "Icon",
        "key": "icon"
    }, {
        "label": "Typography",
        "key": "typography"
    }]
}, {
    "label": "Layout",
    "type": "group",
    "children": [{
        "label": "Divider",
        "key": "divider"
    }]
}]


def logo():
    with antd.Flex(align='center', gap=8):
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/modelscope.png"),
                   preview=False,
                   height=20)
        ms.Span('✖️')
        antd.Image(os.path.join(os.path.dirname(__file__),
                                "./resources/gradio.png"),
                   preview=False,
                   height=40)


def more_components():
    with antd.Button(type="link",
                     href="https://ant.design/components/overview/",
                     href_target="_blank"):
        ms.Text("More Components")

        with ms.Slot("icon"):
            antd.Icon("ExportOutlined")


tabs = [
    {
        "label": "Base",
        "key": "base",
        "default_active_key": "overview",
        "menus": base_menu_items
    },
    {
        "label": "Antd",
        "key": "antd",
        "default_active_key": "overview",
        "menus": antd_menu_items,
        "extra_menu_footer": more_components
    },
    # {
    #     "label": "Legacy",
    #     "key": "legacy",
    #     "content": legacy_demo
    # },
]

site = Site(
    tabs=tabs,
    docs={
        # match the key of tabs
        "antd": antd_docs,
        "base": base_docs
    },
    default_active_tab=default_active_tab,
    logo=logo)

demo = site.render()

if __name__ == "__main__":
    demo.launch()
