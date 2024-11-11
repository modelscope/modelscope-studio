import os
from typing import Literal

from helper.env import is_modelscope_studio
from helper.Site import Site
from legacy_app import legacy_demo

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def get_text(text: str, cn_text: str):
    if is_modelscope_studio:
        return cn_text
    return text


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
    "label": get_text("Overview", "概览"),
    "key": "overview"
}, {
    "label":
    get_text("Core", "核心"),
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
    get_text("Layout", "布局"),
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
    get_text("Render", "渲染"),
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
    "label": get_text("Overview", "概览"),
    "key": "overview"
}, {
    "label":
    get_text("General", "通用"),
    "type":
    "group",
    "children": [{
        "label": get_text("Button", "Button 按钮"),
        "key": "button"
    }, {
        "label": get_text("FloatButton", "FloatButton 悬浮按钮"),
        "key": "float_button"
    }, {
        "label": get_text("Icon", "Icon 图标"),
        "key": "icon"
    }, {
        "label": get_text("Typography", "Typography 排版"),
        "key": "typography"
    }]
}, {
    "label":
    get_text("Layout", "布局"),
    "type":
    "group",
    "children": [{
        "label": get_text("Divider", "Divider 分割线"),
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
        ms.Text(get_text("More Components", "更多组件"))

        with ms.Slot("icon"):
            antd.Icon("ExportOutlined")


tabs = [
    {
        "label": get_text("Base Components", "基础组件"),
        "key": "base",
        "default_active_key": "overview",
        "menus": base_menu_items
    },
    {
        "label": get_text("Antd Components", "Antd 组件"),
        "key": "antd",
        "default_active_key": "overview",
        "menus": antd_menu_items,
        "extra_menu_footer": more_components
    },
    {
        "label": get_text("Version 0.x", "0.x 版本"),
        "key": "legacy",
        "content": legacy_demo
    },
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
