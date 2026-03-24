from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .action_item import AntdXActionsActionItem
from .audio import AntdXActionsAudio
from .copy import AntdXActionsCopy
from .feedback import AntdXActionsFeedback
from .item import AntdXActionsItem


class AntdXActions(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/actions
    """

    ActionItem = AntdXActionsActionItem
    Item = AntdXActionsItem
    Feedback = AntdXActionsFeedback
    Copy = AntdXActionsCopy
    Audio = AntdXActionsAudio

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True),
                      doc="Callback function when an action item is clicked."),
        EventListener("dropdown_open_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_openChange_event=True)),
        EventListener("dropdown_menu_click",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_click_event=True)),
        EventListener("dropdown_menu_deselect",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_deselect_event=True)),
        EventListener("dropdown_menu_open_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_openChange_event=True)),
        EventListener("dropdown_menu_select",
                      callback=lambda block: block._internal.update(
                          bind_dropdownProps_menu_select_event=True))
    ]

    # supported slots
    SLOTS = [
        'items',
        "dropdownProps.dropdownRender",
        "dropdownProps.popupRender",
        "dropdownProps.menu.expandIcon",
        'dropdownProps.menu.overflowedIndicator',
        "dropdownProps.menu.items",
    ]

    def __init__(
            self,
            additional_props: dict | None = None,
            *,
            items: list[dict] | None = None,
            variant: Literal["borderless", "outlined", "filled"] | None = None,
            dropdown_props: dict | None = None,
            fade_in: bool | None = None,
            fade_in_left: bool | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.additional_props = additional_props
        self.items = items
        self.variant = variant
        self.dropdown_props = dropdown_props
        self.fade_in = fade_in
        self.fade_in_left = fade_in_left

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
