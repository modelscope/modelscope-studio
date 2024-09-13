from __future__ import annotations

from typing import Any, List

from gradio.data_classes import GradioModel
from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .item import AntdMenuItem


class MenuData(GradioModel):
    open_keys: List[str] = []
    selected_keys: List[str] = []


# as inputs, outputs
class AntdMenu(ModelScopeDataLayoutComponent):
    """
    """
    Item = AntdMenuItem

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("deselect",
                      callback=lambda block: block._internal.update(
                          bind_deselect_event=True)),
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
    ]

    # supported slots
    SLOTS = ["expandIcon", 'overflowedIndicator', "items"]
    data_model = MenuData

    def __init__(
            self,
            value: MenuData | dict | None = None,
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
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("menu")

    @property
    def skip_api(self):
        return False

    def preprocess(self, payload: dict | MenuData) -> dict | MenuData:
        return payload

    def postprocess(self, value: dict | MenuData | None) -> MenuData:
        if isinstance(value, dict):
            value = MenuData(**value)
        return value

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
