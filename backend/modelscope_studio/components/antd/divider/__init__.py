from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdDivider(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/divider

    A divider line separates different content.

    When to use:
    - Divide sections of an article.
    - Divide inline text and links such as the operation column of table.
    """

    EVENTS = []

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            dashed: bool | None = None,
            variant: Literal["dashed", "dotted", "solid"] = "solid",
            orientation: Literal["left", "right", "center"] = "center",
            orientation_margin: str | int | float | None = None,
            plain: bool | None = None,
            type: Literal["horizontal", "vertical"] = "horizontal",
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
            value: The wrapped title.
            dashed: Whether line is dashed.
            variant: Whether line is dashed, dotted or solid.
            orientation: The position of title inside divider.
            orientation_margin: The margin-left/right between the title and its closest border, while the orientation must be left or right, If a numeric value of type string is provided without a unit, it is assumed to be in pixels (px) by default.
            plain: Divider text show as plain style.
            type: The direction type of divider.
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
        self.dashed = dashed
        self.variant = variant
        self.orientation = orientation
        self.orientation_margin = orientation_margin
        self.plain = plain
        self.type = type
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("divider")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return None

    def example_value(self) -> Any:
        return None
