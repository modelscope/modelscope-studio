from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdLayoutSider(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/layout

    Handling the overall layout of a page.

    Component overview:
    - Layout: The layout wrapper, in which Header Sider Content Footer or Layout itself can be nested, and can be placed in any parent container.
    - Header: The top layout with the default style, in which any element can be nested, and must be placed in Layout.
    - Sider: The sidebar with default style and basic functions, in which any element can be nested, and must be placed in Layout.
    - Content: The content layout with the default style, in which any element can be nested, and must be placed in Layout.
    - Footer: The bottom layout with the default style, in which any element can be nested, and must be placed in Layout.
    """
    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener(
            "breakpoint",
            callback=lambda block: block._internal.update(bind_breakpoint_event
                                                          =True),
            doc="The callback function, executed when breakpoints changed."),
        EventListener(
            "collapse",
            callback=lambda block: block._internal.update(bind_collapse_event=
                                                          True),
            doc=
            "The callback function, executed by clicking the trigger or activating the responsive layout."
        ),
    ]

    SLOTS = ['trigger']

    def __init__(
            self,
            props: dict | None = None,
            *,
            breakpoint: Literal['xs', 'sm', 'md', 'lg', 'xl', 'xxl']
        | None = None,
            collapsed: bool | None = None,
            collapsed_width: int | float = 80,
            collapsible: bool = False,
            default_collapsed: bool = False,
            reverse_arrow: bool = False,
            theme: Literal['light', 'dark'] | None = None,
            trigger: str | None = 'default',
            width: int | float | str = 200,
            zero_width_trigger_style: dict | None = None,
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
            breakpoint: Breakpoints of the responsive layout.
            collapsed: To set the current status.
            collapsed_width: Width of the collapsed sidebar, by setting to 0 a special trigger will appear.
            collapsible: Whether can be collapsed.
            default_collapsed: To set the initial status.
            reverse_arrow: Reverse direction of arrow, for a sider that expands from the right.
            theme: Color theme of the sidebar.
            trigger: Specify the customized trigger, set to null to hide the trigger.
            width: Width of the sidebar.
            zero_width_trigger_style: To customize the styles of the special trigger that appears when collapsed_width is 0.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.breakpoint = breakpoint
        self.collapsed = collapsed
        self.collapsed_width = collapsed_width
        self.collapsible = collapsible
        self.default_collapsed = default_collapsed
        self.reverse_arrow = reverse_arrow
        self.theme = theme
        self.trigger = trigger
        self.width = width
        self.zero_width_trigger_style = zero_width_trigger_style

    FRONTEND_DIR = resolve_frontend_dir("layout", 'sider')

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
