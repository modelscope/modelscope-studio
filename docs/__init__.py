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

default_active_key = "button"

layout_menu_items = [{
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

site = Site(menus=layout_menu_items,
            docs=docs,
            default_active_key=default_active_key,
            logo=antd.Image(os.path.join(os.path.dirname(__file__),
                                         "./resources/modelscope.png"),
                            preview=False,
                            width="100%"))
demo = site.render()

if __name__ == "__main__":
    demo.launch()
