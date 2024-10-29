from __future__ import annotations

from typing import Any

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdSliderMark(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/slider
    """

    EVENTS = []

    # supported slots
    SLOTS = [
        'label',
    ]

    def __init__(
            self,
            number: float | int | None = None,
            label: str | None = None,
            props: dict | None = None,
            *,
            title: str | None = None,
            disabled: bool | None = None,
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
        self.number = number
        self.label = label
        self.disabled = disabled
        self.title = title

    FRONTEND_DIR = resolve_frontend_dir("slider", "mark")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
