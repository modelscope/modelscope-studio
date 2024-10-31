from __future__ import annotations

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTabsItem(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/tabs
    """
    EVENTS = []

    # supported slots
    SLOTS = ['closeIcon', "icon", "label", "children"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            close_icon: str | None = None,
            destroy_inactive_tab_pane: bool | None = None,
            disabled: bool | None = None,
            force_render: bool | None = None,
            key: str | None = None,
            label: str | None = None,
            icon: str | None = None,
            closable: bool | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.close_icon = close_icon
        self.destroy_inactive_tab_pane = destroy_inactive_tab_pane
        self.disabled = disabled
        self.force_render = force_render
        self.key = key
        self.label = label
        self.icon = icon
        self.closable = closable

    FRONTEND_DIR = resolve_frontend_dir("tabs", "item")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
