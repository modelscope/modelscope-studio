import gradio as gr
from gradio.components.base import Component

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


class Site:

    def __init__(self,
                 menus: list,
                 docs: dict,
                 default_active_key: str | None = None,
                 logo: Component | None = None):
        self.menus = menus
        self.docs = docs
        self.default_active_key = default_active_key
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
                        with antd.Layout.Sider(
                                elem_style=dict(height="100vh",
                                                overflow="auto",
                                                position="relative")):
                            if self.logo:
                                with antd.Flex(
                                        justify="center",
                                        elem_style=dict(
                                            position="sticky",
                                            top=0,
                                            padding="8px 4px",
                                            marginBottom=8,
                                            borderBottom=
                                            "1px solid rgba(255,255,255,0.2)")
                                ):
                                    self.logo.render()

                            layout_menu = antd.Menu(default_selected_keys=[
                                self.default_active_key
                            ],
                                                    mode="inline",
                                                    theme="dark",
                                                    items=self.menus)
                        with antd.Layout():
                            with antd.Layout.Content(elem_style=dict(
                                    padding=12, overflow="auto")):
                                with antd.Tabs(default_active_key=self.
                                               default_active_key,
                                               render_tab_bar="() => null"
                                               ) as layout_tabs:
                                    self._render_docs(self.menus)
            layout_menu.select(fn=on_menu_select,
                               outputs=[layout_menu, layout_tabs])
        return demo
