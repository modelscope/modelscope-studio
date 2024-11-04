import os

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


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


def render_docs(items: list):
    for item in items:
        if "children" in item:
            render_docs(item["children"])
        elif "key" in item:
            key = item["key"].replace("-", "_")
            if key in docs:
                with antd.Tabs.Item(key=key):
                    docs[key].docs.render()


def on_menu_select(e: gr.EventData):
    selected_menu = e._data["payload"][0]["key"]
    return gr.update(selected_keys=[selected_menu]), gr.update(
        active_key=selected_menu)


with gr.Blocks(css="""
.gradio-container {
  max-width: 100% !important;
  padding: 0 !important;
}
""") as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Layout(elem_style=dict(
                    height=
                    "calc(100vh - var(--size-4) - var(--body-text-size) * 1.5)"
            )):
                with antd.Layout.Sider(elem_style=dict(
                        height="100vh", overflow="auto", position="relative")):
                    with antd.Flex(
                            justify="center",
                            elem_style=dict(
                                position="sticky",
                                top=0,
                                padding="8px 4px",
                                marginBottom=8,
                                borderBottom="1px solid rgba(255,255,255,0.2)")
                    ):
                        antd.Image(os.path.join(os.path.dirname(__file__),
                                                "./resources/modelscope.png"),
                                   preview=False,
                                   width="100%")
                    layout_menu = antd.Menu(
                        default_selected_keys=[default_active_key],
                        mode="inline",
                        theme="dark",
                        items=layout_menu_items)
                with antd.Layout():
                    with antd.Layout.Content(
                            elem_style=dict(padding=12, overflow="auto")):
                        with antd.Tabs(
                                default_active_key=default_active_key,
                                render_tab_bar="() => null") as layout_tabs:
                            render_docs(layout_menu_items)
    layout_menu.select(fn=on_menu_select, outputs=[layout_menu, layout_tabs])

demo.launch()
