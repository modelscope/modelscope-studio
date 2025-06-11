from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXActionsItem


class AntdXActions(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/actions
    """

    Item = AntdXActionsItem

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True),
                      doc="Callback function when an action item is clicked."),
    ]

    # supported slots
    SLOTS = ['items']

    def __init__(
            self,
            props: dict | None = None,
            *,
            items: list[dict] | None = None,
            variant: Literal['borderless', 'border'] | None = None,
            block: bool | None = None,
            prefix_cls: str | None = None,
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
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.items = items
        self.prefix_cls = prefix_cls
        self.variant = variant
        self.block = block
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("actions", type="antdx")

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
