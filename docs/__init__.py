import os

from helper.Site import Site

import modelscope_studio.components.antd as antd


def get_docs(file_path: str):
    import importlib.util

    components = []
    antd_dir = os.path.join(os.path.dirname(file_path), "components", "antd")
    for dir in os.listdir(antd_dir):
        abs_dir = os.path.join(antd_dir, dir)
        if os.path.isdir(abs_dir):
            app_file = os.path.join(abs_dir, "app.py")
            if os.path.exists(app_file):
                components.append(dir)

    docs = {}
    for component in components:
        spec = importlib.util.spec_from_file_location(
            "doc", os.path.join(antd_dir, component, "app.py"))
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        docs[component] = module
    return docs


docs = get_docs(__file__)

default_active_tab = "antd"

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
}]

base_menu_items = [{
    "label": "Layout",
    "type": "group",
    "children": [{
        "label": "Divider",
        "key": "divider"
    }]
}]
tabs = [{
    "label": "Base",
    "key": "base",
    "default_active_key": "divider",
    "menus": base_menu_items
}, {
    "label": "Antd",
    "key": "antd",
    "default_active_key": "button",
    "menus": antd_menu_items
}]

site = Site(tabs=tabs,
            docs=docs,
            default_active_tab=default_active_tab,
            logo=antd.Image(os.path.join(os.path.dirname(__file__),
                                         "./resources/modelscope.png"),
                            preview=False,
                            width="100%"))
demo = site.render()

if __name__ == "__main__":
    demo.launch()
