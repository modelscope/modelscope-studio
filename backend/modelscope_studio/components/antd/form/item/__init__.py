from __future__ import annotations

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .rule import AntdFormItemRule


class AntdFormItem(ModelScopeDataLayoutComponent):
    """
    """
    Rule = AntdFormItemRule
    EVENTS = []

    # supported slots
    SLOTS = [
        'extra', 'help', 'label', 'tooltip', 'tooltip.title', 'tooltip.icon'
    ]

    def __init__(
            self,
            label: str | None = None,
            props: dict | None = None,
            *,
            form_name: str | int | float | list[str | int | float]
        | None = None,
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
        self.label = label
        self.form_name = form_name
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("form", "item")

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
