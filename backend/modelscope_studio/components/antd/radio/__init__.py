from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .button import AntdRadioButton
from .group import AntdRadioGroup


# as inputs, outputs
class AntdRadio(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/radio
    """
    Group = AntdRadioGroup
    Button = AntdRadioButton

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    def __init__(
            self,
            group_value: Any | None = None,
            value: bool | None = None,
            props: dict | None = None,
            *,
            auto_focus: bool | None = None,
            default_checked: bool | None = None,
            disabled: bool | None = None,
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
        self.group_value = group_value
        self.auto_focus = auto_focus
        self.default_checked = default_checked
        self.disabled = disabled
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("radio")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "boolean"}

    def preprocess(self, payload: None | bool) -> None | bool:
        return payload

    def postprocess(self, value: None | bool) -> None | bool:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
