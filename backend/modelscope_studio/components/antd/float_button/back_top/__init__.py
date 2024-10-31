from __future__ import annotations

from typing import Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdFloatButtonBackTop(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/float-button

    A button that floats at the top of the page.

    When to use:
    - For global functionality on the site.
    - Buttons that can be seen wherever you browse.
    """

    EVENTS = [
        EventListener(
            "click",
            callback=lambda block: block._internal.update(bind_click_event=True
                                                          ),
            doc=
            "A callback function, which can be executed when you click the button."
        )
    ]

    # supported slots
    SLOTS = ['icon', 'description', 'tooltip', 'badge.count']

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
            html_type: Literal['submit', 'reset', 'button'] | None = 'button',
            badge: dict | None = None,
            duration: int | float = 450,
            elem_target: str | None = None,
            visibility_height: int | float = 400,
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
        """
        Parameters:
            icon: Set the icon component of button.
            description:	Text and other.
            tooltip: The text shown in the tooltip.
            type: Setting button type.
            shape: Setting button shape.
            target: Specifies where to display the linked URL	string.
            htmlType: Set the original html type of button.
            badge: Attach Badge to FloatButton. status and other props related are not supported.
            duration: Time to return to top（ms）.
            elem_target: Specifies the scrollable area dom node.
            visibility_height: The BackTop button will not show until the scroll height reaches this value.
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
        self.html_type = html_type
        self.badge = badge
        self.duration = duration
        self.visibility_height = visibility_height
        self.elem_target = elem_target
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("float-button", "back-top")

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
