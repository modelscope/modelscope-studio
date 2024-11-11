from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdAutoCompleteOption


# as inputs, outputs
class AntdAutoComplete(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/auto-complete/
    """
    Option = AntdAutoCompleteOption

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("blur",
                      callback=lambda block: block._internal.update(
                          bind_blur_event=True)),
        EventListener("focus",
                      callback=lambda block: block._internal.update(
                          bind_focus_event=True)),
        EventListener("search",
                      callback=lambda block: block._internal.update(
                          bind_search_event=True)),
        EventListener("select",
                      callback=lambda block: block._internal.update(
                          bind_select_event=True)),
        EventListener("clear",
                      callback=lambda block: block._internal.update(
                          bind_clear_event=True)),
        EventListener("dropdown_visible_change",
                      callback=lambda block: block._internal.update(
                          bind_dropdownVisibleChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'allowClear.clearIcon', 'dropdownRender', 'children', 'notFoundContent'
    ]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | dict = False,
            auto_focus: bool = False,
            backfill: bool = False,
            default_active_first_option: bool = True,
            default_open: bool | None = None,
            default_value: str | None = None,
            disabled: bool = False,
            dropdown_render: str | None = None,
            popup_class_name: str | None = None,
            popup_match_select_width: bool | int | float = True,
            filter_option: bool | str = True,
            get_popup_container: str | None = None,
            not_found_content: str | None = None,
            open: bool | None = None,
            options: list[dict] | None = None,
            placeholder: str | None = None,
            placement: Literal['bottomLeft', 'bottomRight', 'topLeft',
                               'topRight'] | None = None,
            size: Literal['small', 'middle', 'large'] | None = None,
            status: Literal['error', 'warning'] | None = None,
            variant: Literal['outlined', 'borderless', 'filled']
        | None = 'outlined',
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
        self.allow_clear = allow_clear
        self.auto_focus = auto_focus
        self.backfill = backfill
        self.default_active_first_option = default_active_first_option
        self.default_open = default_open
        self.default_value = default_value
        self.disabled = disabled
        self.dropdown_render = dropdown_render
        self.popup_class_name = popup_class_name
        self.popup_match_select_width = popup_match_select_width
        self.filter_option = filter_option
        self.get_popup_container = get_popup_container
        self.not_found_content = not_found_content
        self.open = open
        self.options = options
        self.placeholder = placeholder
        self.status = status
        self.variant = variant
        self.placement = placement
        self.size = size
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("auto-complete")

    @property
    def skip_api(self):
        return False

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}

    def preprocess(self, payload: None | str) -> None | str:
        return payload

    def postprocess(self, value: None | str) -> None | str:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None
