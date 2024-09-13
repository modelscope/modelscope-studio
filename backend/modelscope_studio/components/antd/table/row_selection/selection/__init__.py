from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ......utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTableRowSelectionSelection(ModelScopeLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
    ]

    # supported slots
    SLOTS = [
        'text',
    ]

    def __init__(
            self,
            text: str | None = None,
            built_in_selection: Literal["SELECT_ALL", "SELECT_INVERT",
                                        "SELECT_NONE"] | None = None,
            props: dict | None = None,
            *,
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
        self.text = text
        self.built_in_selection = built_in_selection

    FRONTEND_DIR = resolve_frontend_dir("table",
                                        ["row-selection", 'selection'])

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
