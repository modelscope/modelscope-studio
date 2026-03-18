from __future__ import annotations

from typing import Any, Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXConversationsItem(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/conversations
    """

    EVENTS = []

    # supported slots
    SLOTS = [
        'label',
        'icon',
    ]

    def __init__(
            self,
            label: str | None = None,
            *,
            key: str | None = None,
            type: Literal['divider'] | None = None,
            group: str | None = None,
            icon: str | None = None,
            disabled: bool | None = None,
            dashed: bool | None = None,
            additional_props: dict | None = None,
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
        self.additional_props = additional_props
        self.label = label
        self.type = type
        self.dashed = dashed
        self.group = group
        self.icon = icon
        self.disabled = disabled
        self.key = key

    FRONTEND_DIR = resolve_frontend_dir("conversations", "item", type="antdx")

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
