from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdXSuggestionItem


class AntdXSuggestion(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/suggestion
    """

    Item = AntdXSuggestionItem

    EVENTS = [
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True),
                      doc="Callback when the suggestion item is selected."),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True),
                      doc="Callback when the panel open state changes."),
    ]

    # supported slots
    SLOTS = ['items', 'children']

    def __init__(
            self,
            props: dict | None = None,
            *,
            items: list[dict] | None = None,
            block: bool | None = None,
            open: bool | None = None,
            should_trigger: str | None = None,
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
        self.block = block
        self.open = open
        self.should_trigger = should_trigger
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("suggestion", type="antdx")

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
