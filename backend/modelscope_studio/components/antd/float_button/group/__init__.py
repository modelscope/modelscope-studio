from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdFloatButtonGroup(ModelScopeLayoutComponent):
    """
    A button that floats at the top of the page.

    - For global functionality on the site.
    - Buttons that can be seen wherever you browse.
    """
    EVENTS = [
        EventListener(
            "click",
            callback=lambda block: block._internal.update(bind_click_event=True
                                                          ),
            doc=
            "Set the handler to handle click event (only work in Menu mode)."),
        EventListener(
            "open_change",
            callback=lambda block: block._internal.update(bind_openChange_event
                                                          =True),
            doc=
            "Callback executed when active menu is changed, use it with trigger."
        )
    ]

    # supported slots
    SLOTS = ['icon', 'closeIcon', 'description', 'tooltip', 'badge.count']

    def __init__(
            self,
            props: dict | None = None,
            *,
            icon: str | None = None,
            description: str | None = None,
            tooltip: str | None = None,
            type: Literal['default', 'primary'] = 'default',
            shape: Literal['circle', 'square'] = 'circle',
            href: str | None = None,
            href_target: str | None = None,
            html_type: Literal['submit', 'reset', 'button'] | None = 'button',
            badge: dict | None = None,
            trigger: Literal['hover', 'click'] | None = None,
            as_item: str | None = None,
            open: bool | None = None,
            close_icon: str | None = None,
            placement: Literal['left', 'right', 'top', 'bottom']
        | None = 'top',
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        """
        Parameters:
            icon: Set the icon component of button.
            description:	Text and other.
            tooltip: The text shown in the tooltip.
            type: Setting button type.
            shape: Setting button shape.
            href_target: The target of hyperlink.
            target: Specifies where to display the linked URL	string.
            htmlType: Set the original html type of button.
            badge: Attach Badge to FloatButton. status and other props related are not supported.
            trigger: Which action can trigger menu open/close.
            open: Whether the menu is visible or not, use it with trigger.
            closeIcon: Customize close button icon.
            placement: Customize menu animation placement.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.icon = icon
        self.description = description
        self.tooltip = tooltip
        self.type = type
        self.shape = shape
        self.href = href
        self.href_target = href_target
        self.html_type = html_type
        self.badge = badge
        self.trigger = trigger
        self.open = open
        self.close_icon = close_icon
        self.placement = placement

    FRONTEND_DIR = resolve_frontend_dir("float-button", "group")

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
