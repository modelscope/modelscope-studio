from __future__ import annotations

from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdModal(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/modal
    """
    EVENTS = [
        EventListener("ok",
                      callback=lambda block: block._internal.update(
                          bind_cancel_event=True)),
        EventListener("cancel",
                      callback=lambda block: block._internal.update(
                          bind_cancel_event=True))
    ]

    # supported slots
    SLOTS = [
        'closeIcon', 'cancelButtonProps.icon', 'cancelText',
        'closable.closeIcon', 'closeIcon', 'footer', 'title',
        'okButtonProps.icon', 'okText', 'modalRender'
    ]

    def __init__(
            self,
            props: dict | None = None,
            *,
            after_close: str | None = None,
            class_names: dict | None = None,
            styles: dict | None = None,
            cancel_button_props: dict | None = None,
            cancel_text: str | None = None,
            centered: bool | None = None,
            closable: bool | dict | None = None,
            close_icon: str | None = None,
            confirm_loading: bool | None = None,
            destroy_on_close: bool | None = None,
            focus_trigger_after_close: bool | None = None,
            footer: str | None = None,
            force_render: bool | None = None,
            get_container: str | None = None,
            keyboard: bool | None = None,
            mask: bool | None = None,
            mask_closable: bool | None = None,
            modal_render: str | None = None,
            ok_text: str | None = None,
            ok_type: str | None = None,
            ok_button_props: dict | None = None,
            loading: bool | None = None,
            title: str | None = None,
            open: bool | None = None,
            width: int | float | str | None = None,
            wrap_class_name: str | None = None,
            z_index: int | None = None,
            after_open_change: str | None = None,
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
        self.after_close = after_close
        self.class_names = class_names
        self.styles = styles
        self.cancel_button_props = cancel_button_props
        self.cancel_text = cancel_text
        self.centered = centered
        self.closable = closable
        self.close_icon = close_icon
        self.confirm_loading = confirm_loading
        self.destroy_on_close = destroy_on_close
        self.focus_trigger_after_close = focus_trigger_after_close
        self.footer = footer
        self.force_render = force_render
        self.get_container = get_container
        self.keyboard = keyboard
        self.mask = mask
        self.mask_closable = mask_closable
        self.modal_render = modal_render
        self.ok_text = ok_text
        self.ok_type = ok_type
        self.ok_button_props = ok_button_props
        self.loading = loading
        self.title = title
        self.open = open
        self.width = width
        self.wrap_class_name = wrap_class_name
        self.z_index = z_index
        self.after_open_change = after_open_change
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("modal")

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
