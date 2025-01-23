from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .option import AntdMentionsOption


# as inputs, outputs
class AntdMentions(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/mentions
    """
    Option = AntdMentionsOption

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
        EventListener("resize",
                      callback=lambda block: block._internal.update(
                          bind_resize_event=True)),
        EventListener("popup_scroll",
                      callback=lambda block: block._internal.update(
                          bind_popupScroll_event=True)),
    ]

    # supported slots
    SLOTS = ['allowClear.clearIcon', 'notFoundContent', "options"]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            allow_clear: bool | dict | None = None,
            auto_focus: bool | None = None,
            auto_size: bool | dict | None = None,
            class_names: dict | None = None,
            default_value: str | None = None,
            filter_option: bool | str | None = None,
            disabled: bool | None = None,
            read_only: bool | None = None,
            get_popup_container: str | None = None,
            popup_class_name: str | None = None,
            not_found_content: str | None = None,
            options: list[dict] | None = None,
            loading: bool | None = None,
            placement: Literal['top', 'bottom'] | None = None,
            placeholder: str | None = None,
            prefix: str | list[str] | None = '@',
            split: str | None = None,
            status: Literal['error', 'warning'] | None = None,
            validate_search: str | None = None,
            variant: Literal['outlined', 'borderless', 'filled'] | None = None,
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
        self.auto_size = auto_size
        self.default_value = default_value
        self.filter_option = filter_option
        self.disabled = disabled
        self.read_only = read_only
        self.get_popup_container = get_popup_container
        self.popup_class_name = popup_class_name
        self.not_found_content = not_found_content
        self.options = options
        self.placeholder = placeholder
        self.loading = loading
        self.placement = placement
        self.class_names = class_names
        self.prefix = prefix
        self.split = split
        self.status = status
        self.validate_search = validate_search
        self.variant = variant
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("mentions")

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
