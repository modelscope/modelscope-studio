from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir
from .group import AntdButtonGroup


class AntdButton(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/button

    To trigger an operation.

    When to use:
    A button means an operation (or a series of operations). Clicking a button will trigger its corresponding business logic.

    In Ant Design we provide 5 types of button.

    - Primary button: used for the main action, there can be at most one primary button in a section.
    - Default button: used for a series of actions without priority.
    - Dashed button: commonly used for adding more actions.
    - Text button: used for the most secondary action.
    - Link button: used for external links.

    And 4 other properties additionally.

    - danger: used for actions of risk, like deletion or authorization.
    - ghost: used in situations with complex background, home pages usually.
    - disabled: used when actions are not available.
    - loading: adds a loading spinner in button, avoids multiple submits too.
    """
    Group = AntdButtonGroup

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True),
                      doc="Set the handler to handle click event.")
    ]

    # supported slots
    SLOTS = ['icon']

    def __init__(
            self,
            value: str | None = "Run",
            props: dict | None = None,
            *,
            auto_insert_space: bool = True,
            block: bool = False,
            class_names: dict | None = None,
            danger: bool = False,
            disabled: bool = False,
            ghost: bool = False,
            href: str | None = None,
            html_type: Literal["button", "submit", "reset"] | None = "button",
            icon: str | None = None,
            icon_position: Literal["start", "end"] | None = "start",
            loading: bool = False,
            shape: Literal["default", "circle", "round"] | None = "default",
            size: Literal["large", "middle", "small"] | None = None,
            styles: dict | None = None,
            href_target: str | None = None,
            type: Literal["primary", "dashed", "link", "text", "default"]
        | None = "default",
            variant: Literal["outlined", "dashed", "solid", "filled", "text",
                             "link"] | None = None,
            color: Literal['default', 'primary', 'danger'] | None = None,
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
            auto_insert_space: We add a space between two Chinese characters by default, which can be removed by setting auto_Insert_Space to false.
            block: Option to fit button width to its parent width.
            class_names: Semantic DOM class.
            danger: Set the danger status of button.
            disabled: Disabled state of button.
            ghost: Make background transparent and invert text and border colors.
            href: Redirect url of link button.
            html_type: Set the original html type of button, see: MDN.
            icon: Set the icon component of button.
            icon_position:  Set the icon position of button.
            loading:  Set the loading status of button.
            shape:  Can be set button shape.
            size:  Set the size of button.
            styles:  Semantic DOM style.
            href_target:  Same as target attribute of a, works when href is specified.
            type:  Set button type.
            variant: Set button variant.
            color: Set button color.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.value = value
        self.props = props
        self.auto_insert_space = auto_insert_space
        self.block = block
        self.class_names = class_names
        self.danger = danger
        self.disabled = disabled
        self.ghost = ghost
        self.href = href
        self.html_type = html_type
        self.icon = icon
        self.icon_position = icon_position
        self.loading = loading
        self.shape = shape
        self.size = size
        self.styles = styles
        self.href_target = href_target
        self.type = type
        self.variant = variant
        self.color = color
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("button")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return "Run"

    def example_value(self) -> Any:
        return "Run"
