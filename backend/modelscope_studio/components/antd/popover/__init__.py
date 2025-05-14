from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdPopover(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/popover
    """
    EVENTS = [
        EventListener("open_change",
                      callback=lambda block: block._internal.update(
                          bind_openChange_event=True)),
    ]

    # supported slots
    SLOTS = ['title', "content"]

    def __init__(
            self,
            content: str | None = None,
            title: str | None = None,
            props: dict | None = None,
            *,
            align: dict | None = None,
            arrow: bool | dict | None = None,
            auto_adjust_overflow: bool | None = None,
            color: str | None = None,
            default_open: bool | None = None,
            destroy_tooltip_on_hide: bool | None = None,
            destroy_on_hidden: bool | None = None,
            fresh: bool | None = None,
            get_popup_container: str | None = None,
            mouse_enter_delay: float | int | None = None,
            mouse_leave_delay: float | int | None = None,
            overlay_class_name: str | None = None,
            overlay_style: dict | None = None,
            overlay_inner_style: dict | None = None,
            placement: Literal[
                'top',
                'left',
                'right',
                'bottom',
                'topLeft',
                'topRight',
                'bottomLeft',
                'bottomRight',
                'leftTop',
                'leftBottom',
                'rightTop',
                'rightBottom',
            ] = 'top',
            trigger: Literal['hover', 'focus', 'click', 'contextMenu']
        | list[Literal['hover', 'focus', 'click', 'contextMenu']]
        | None = None,
            open: bool | None = None,
            z_index: int | None = None,
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
        self.title = title
        self.content = content
        self.props = props
        self.align = align
        self.arrow = arrow
        self.auto_adjust_overflow = auto_adjust_overflow
        self.color = color
        self.default_open = default_open
        self.destroy_tooltip_on_hide = destroy_tooltip_on_hide
        self.destroy_on_hidden = destroy_on_hidden
        self.fresh = fresh
        self.get_popup_container = get_popup_container
        self.mouse_enter_delay = mouse_enter_delay
        self.mouse_leave_delay = mouse_leave_delay
        self.overlay_class_name = overlay_class_name
        self.overlay_style = overlay_style
        self.overlay_inner_style = overlay_inner_style
        self.placement = placement
        self.trigger = trigger
        self.open = open
        self.z_index = z_index
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("popover")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> str:
        return "Popover"

    def example_value(self) -> str:
        return "Popover"
