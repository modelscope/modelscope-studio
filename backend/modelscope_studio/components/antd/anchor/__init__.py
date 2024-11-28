from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .item import AntdAnchorItem


class AntdAnchor(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/anchor
    Hyperlinks to scroll on one page.

    When to use:
    For displaying anchor hyperlinks on page and jumping between them.
    """
    Item = AntdAnchorItem
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True),
                      doc="Listening for anchor link change"),
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True),
                      doc="Set the handler to handle click event."),
        EventListener('affix_change',
                      callback=lambda block: block._internal.update(
                          bind_affix_change_event=True),
                      doc="Callback for when Affix state is changed")
    ]

    # supported slots
    SLOTS = ['items']

    def __init__(
            self,
            props: dict | None = None,
            *,
            affix: bool | dict = True,
            bounds: int | float = 5,
            get_container: str | None = None,
            get_current_anchor: str | None = None,
            offset_top: int | float = 0,
            show_ink_in_fixed: bool | None = None,
            target_offset: int | float | None = None,
            items: list[dict] | None = None,
            direction: Literal['vertical', 'horizontal'] = 'vertical',
            replace: bool | None = None,
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
            affix: Fixed mode of Anchor.
            bounds: Bounding distance of anchor area.
            get_container: Scrolling container.
            get_current_anchor: Customize the anchor highlightL.
            offset_top: Pixels to offset from top when calculating position of scroll.
            show_ink_in_fixed: Whether show ink-square when affix=False.
            target_offset: Anchor scroll offset, default as offsetTop.
            items: Data configuration option content, support nesting through children.
            direction: Set Anchor direction.
            replace: Replace items' href in browser history instead of pushing it.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.affix = affix
        self.bounds = bounds
        self.get_container = get_container
        self.get_current_anchor = get_current_anchor
        self.offset_top = offset_top
        self.show_ink_in_fixed = show_ink_in_fixed
        self.target_offset = target_offset
        self.items = items
        self.direction = direction
        self.replace = replace
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("anchor")

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
