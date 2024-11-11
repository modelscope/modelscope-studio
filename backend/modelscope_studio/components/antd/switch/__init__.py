from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


# as inputs, outputs
class AntdSwitch(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/switch
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
    ]

    # supported slots
    SLOTS = ['checkedChildren', 'unCheckedChildren']

    def __init__(
            self,
            value: bool | None = False,
            props: dict | None = None,
            *,
            auto_focus: bool | None = None,
            checked: bool | None = None,
            checked_children: str | None = None,
            default_checked: bool | None = None,
            disabled: bool | None = None,
            loading: bool | None = None,
            size: Literal['default', 'small'] | None = None,
            un_checked_children: str | None = None,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.auto_focus = auto_focus
        self.checked = checked
        self.checked_children = checked_children
        self.default_checked = default_checked
        self.disabled = disabled
        self.loading = loading
        self.size = size
        self.un_checked_children = un_checked_children
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("switch")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "boolean"}

    def preprocess(self, payload: None | str) -> None | bool:
        return payload

    def postprocess(self, value: None | bool) -> None | bool:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
