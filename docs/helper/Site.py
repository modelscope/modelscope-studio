from typing import Callable

import gradio as gr
from gradio.components.base import Component

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


class Site:

    def __init__(self,
                 tabs: list,
                 docs: dict,
                 default_active_tab: str | None = None,
                 logo: Component | Callable | None = None):
        self.tabs = tabs
        self.docs = docs
        self.default_active_tab = default_active_tab
        self.default_active_tab_item = next(
            (item for item in self.tabs if item["key"] == default_active_tab),
            {})
        self.logo = logo

    def _render_docs(self, items: list):
        for item in items:
            if "children" in item:
                self._render_docs(item["children"])
            elif "key" in item:
                key = item["key"].replace("-", "_")
                if key in self.docs:
                    with antd.Tabs.Item(key=key):
                        self.docs[key].docs.render()

    def render(self):

        def on_tab_menu_select(e: gr.EventData):
            selected_tab = e._data["payload"][0]["key"]
            item = next(
                (item for item in self.tabs if item["key"] == selected_tab),
                {})

            return gr.update(selected_keys=[selected_tab]), gr.update(
                selected_keys=[item["default_active_key"]],
                items=item["menus"]), gr.update(
                    active_key=item["default_active_key"])

        def on_layout_menu_select(e: gr.EventData):
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
                        with antd.Layout.Header(elem_style=dict(
                                padding='0 16px',
                                backgroundColor=
                                "var(--ms-gr-ant-color-bg-container)")):
                            with antd.Flex(align='center', gap=8):
                                if self.logo:
                                    with antd.Flex(
                                            justify="center",
                                            align='center',
                                            elem_style=dict(height='100%')):
                                        if callable(self.logo):
                                            self.logo()
                                        else:
                                            self.logo.render()
                                tab_menu = antd.Menu(
                                    mode="horizontal",
                                    default_selected_keys=[
                                        self.default_active_tab
                                    ],
                                    items=self.tabs,
                                    elem_style=dict(flex=1, minWidth=0))
                        with antd.Layout(elem_style=dict(
                                height="calc(100% - 64px)")):
                            with antd.Layout.Sider(elem_style=dict(
                                    height="calc(100vh - 64px)",
                                    overflow="auto",
                                    position="relative",
                                    backgroundColor=
                                    "var(--ms-gr-ant-color-bg-container)")):

                                layout_menu = antd.Menu(
                                    default_selected_keys=[
                                        self.default_active_tab_item[
                                            "default_active_key"]
                                    ],
                                    mode="inline",
                                    items=self.default_active_tab_item["menus"]
                                )
                            with antd.Layout():
                                with antd.Layout.Content(elem_style=dict(
                                        padding='12px 28px', overflow="auto")):
                                    with antd.Tabs(default_active_key=self.
                                                   default_active_tab_item[
                                                       "default_active_key"],
                                                   render_tab_bar="() => null"
                                                   ) as rendered_tabs:
                                        for tab in self.tabs:
                                            self._render_docs(tab["menus"])

                            layout_menu.select(
                                fn=on_layout_menu_select,
                                outputs=[layout_menu, rendered_tabs])
                        tab_menu.select(
                            fn=on_tab_menu_select,
                            outputs=[tab_menu, layout_menu, rendered_tabs])
        return demo
