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

    def _render_docs(self, items: list, tab: dict):
        docs_tabs = []
        for item in items:
            if "children" in item:
                docs_tabs.extend(self._render_docs(item["children"], tab))
            elif "key" in item:
                key = item["key"].replace("-", "_")
                tab_docs = self.docs.get(tab["key"], {})
                if key in tab_docs:
                    with antd.Tabs.Item(
                            key=key,
                            visible=True if tab.get("default_active_key")
                            == key else False) as docs_tab:
                        docs_tabs.append(docs_tab)
                        tab_docs[key].render()
        return docs_tabs

    def render(self):

        def on_tab_menu_select(e: gr.EventData):
            selected_tab = e._data["payload"][0]["key"]
            item = next(
                (item for item in tab_components if item.key == selected_tab),
                tab_components[0])

            return {
                tab_menu: gr.update(selected_keys=[selected_tab]),
                tabs: gr.update(active_key=selected_tab),
                item: gr.update(visible=True)
            }

        with gr.Blocks(css="""
.gradio-container {
  max-width: 100% !important;
  padding: 0 !important;
}
.docs-layout-sider {
  width: 100% !important;
  max-width: 100% !important;
}
""") as demo:
            with ms.Application() as app:
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
                                    selected_keys=[self.default_active_tab],
                                    items=self.tabs,
                                    elem_style=dict(flex=1, minWidth=0))
                        with ms.AutoLoading(show_mask=True):
                            with antd.Tabs(
                                    active_key=self.default_active_tab,
                                    render_tab_bar="() => null",
                            ) as tabs:
                                tab_components = []
                                for tab in self.tabs:
                                    with antd.Tabs.Item(
                                            key=tab["key"],
                                            elem_style=dict(
                                                height=
                                                "calc(100vh - var(--size-4) - var(--body-text-size) * 1.5 - 64px)"
                                            ),
                                            visible=True
                                            if self.default_active_tab
                                            == tab["key"] else
                                            False) as tab_item:
                                        tab_components.append(tab_item)
                                        if "content" in tab:
                                            # custom render
                                            with ms.Div(elem_style=dict(
                                                    maxHeight="100%",
                                                    overflow="auto")):
                                                tab["content"].render()
                                        elif "menus" in tab:
                                            # menus render
                                            with antd.Layout(elem_style=dict(
                                                    height='100%')):
                                                with antd.Splitter():
                                                    with antd.Splitter.Panel(
                                                            default_size=213,
                                                            max="50%",
                                                            min=82,
                                                            elem_style=dict(
                                                                backgroundColor=
                                                                "var(--ms-gr-ant-color-bg-container)"
                                                            )) as sider_panel:
                                                        with antd.Layout.Sider(
                                                                breakpoint="sm",
                                                                trigger=None,
                                                                elem_classes=
                                                                "docs-layout-sider",
                                                                elem_style=dict(
                                                                    # height=
                                                                    # "calc(100vh - 64px)",
                                                                    # overflow=
                                                                    # "auto",
                                                                    position=
                                                                    "relative",
                                                                    backgroundColor
                                                                    ="var(--ms-gr-ant-color-bg-container)"
                                                                )):
                                                            sider_menu = antd.Menu(
                                                                selected_keys=[
                                                                    tab.get(
                                                                        "default_active_key",
                                                                        None)
                                                                ],
                                                                mode="inline",
                                                                items=tab.get(
                                                                    "menus",
                                                                    []))
                                                            if "extra_menu_footer" in tab:
                                                                if callable(tab[
                                                                        "extra_menu_footer"]
                                                                            ):
                                                                    tab["extra_menu_footer"](
                                                                    )
                                                                else:
                                                                    tab["extra_menu_footer"].render(
                                                                    )
                                                    with antd.Splitter.Panel():
                                                        with antd.Layout(
                                                                elem_style=dict(
                                                                    width="100%"
                                                                )):
                                                            with antd.Layout.Content(
                                                                    elem_style=
                                                                    dict(
                                                                        padding=
                                                                        '12px 28px',
                                                                        overflow
                                                                        ="auto"
                                                                    )):
                                                                with antd.Tabs(
                                                                        active_key
                                                                        =tab.
                                                                        get(
                                                                            "default_active_key",
                                                                            None
                                                                        ),
                                                                        render_tab_bar
                                                                        ="() => null"
                                                                ) as layout_content_tabs:
                                                                    docs_tabs = self._render_docs(
                                                                        tab.
                                                                        get(
                                                                            "menus",
                                                                            []
                                                                        ), tab)

                                        def on_layout_menu_select_wrapper(
                                                tabs, sider_menu,
                                                layout_content_tabs):

                                            def on_layout_menu_select(
                                                    e: gr.EventData):
                                                selected_menu = e._data[
                                                    "payload"][0]["key"]

                                                item = next(
                                                    (item for item in tabs
                                                     if item.key ==
                                                     selected_menu), tabs[0])

                                                return {
                                                    sider_menu:
                                                    gr.update(selected_keys=[
                                                        selected_menu
                                                    ]),
                                                    layout_content_tabs:
                                                    gr.update(
                                                        active_key=selected_menu
                                                    ),
                                                    item:
                                                    gr.update(visible=True)
                                                }

                                            return on_layout_menu_select

                                    sider_menu.select(
                                        fn=on_layout_menu_select_wrapper(
                                            docs_tabs, sider_menu,
                                            layout_content_tabs),
                                        outputs=[
                                            sider_menu, layout_content_tabs,
                                            *docs_tabs
                                        ])

                                    def on_app_mount(e: gr.EventData):
                                        screen_width = e._data["screen"][
                                            "width"]
                                        return gr.update(
                                            default_size=82 if screen_width <
                                            576 else 213)

                                    app.mount(on_app_mount,
                                              outputs=[sider_panel])

                        tab_menu.select(
                            fn=on_tab_menu_select,
                            outputs=[tab_menu, tabs, *tab_components])
        return demo
