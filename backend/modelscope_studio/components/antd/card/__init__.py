from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .grid import AntdCardGrid
from .meta import AntdCardMeta


class AntdCard(ModelScopeLayoutComponent):
    """
    A container for displaying information.
    A card can be used to display content related to a single subject. The content can consist of multiple elements of varying types and sizes.
    """
    Grid = AntdCardGrid
    Meta = AntdCardMeta
    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("tab_change",
                      callback=lambda block: block._internal.update(
                          bind_tabChange_event=True))
    ]

    # supported slots
    SLOTS = [
        "actions",
        'cover',
        'extra',
        'tabBarExtraContent',
        'title',
    ]

    def __exit__(self, *args, **kwargs):
        self._internal.update(contains_grid=any(
            isinstance(child, AntdCardGrid) for child in self.children))
        super().__exit__(*args, **kwargs)

    def __init__(
            self,
            props: dict | None = None,
            *,
            actions: str | None = None,
            active_tab_key: str | None = None,
            bordered: bool = True,
            cover: str | None = None,
            default_active_tab_key: str | None = None,
            extra: str | None = None,
            hoverable: bool = False,
            loading: bool = False,
            size: Literal["default", "small"] = "default",
            tab_bar_extra_content: str | None = None,
            tab_list: list[str] | str | None = None,
            tab_props: str | None = None,
            title: str | None = None,
            type: str | None = None,
            class_names: dict | None = None,
            styles: dict | None = None,
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
            actions:  The action list, shows at the bottom of the Card.
            active_tab_key:  Current TabPane's key.
            bordered:  Toggles rendering of the border around the card.
            cover:  Card cover.
            default_active_tab_key:  Initial active TabPane's key, if activeTabKey is not set.
            extra:  Content to render in the top-right corner of the card.
            hoverable:  Lift up when hovering card.
            loading:  Shows a loading indicator while the contents of the card are being fetched.
            size:  Size of card.
            tab_bar_extra_content:  Extra content in tab bar.
            title:  Card title.
            type:  Card style type, can be set to inner or not set.
            class_names:  Config Card build-in module's className.
            styles:  Config Card build-in module's style.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.actions = actions
        self.active_tab_key = active_tab_key
        self.bordered = bordered
        self.cover = cover
        self.default_active_tab_key = default_active_tab_key
        self.extra = extra
        self.hoverable = hoverable
        self.loading = loading
        self.size = size
        self.tab_bar_extra_content = tab_bar_extra_content
        self.tab_list = tab_list
        self.tab_props = tab_props
        self.title = title
        self.type = type
        self.class_names = class_names
        self.styles = styles

    FRONTEND_DIR = resolve_frontend_dir("card")

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
