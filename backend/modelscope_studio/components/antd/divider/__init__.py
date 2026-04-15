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
            additional_props: dict | None = None,
            *,
            dashed: bool | None = None,
            variant: Literal["dashed", "dotted", "solid"] = "solid",
            orientation: Literal["horizontal", "vertical"] = "horizontal",
            orientation_margin: str | int | float | None = None,
            plain: bool | None = None,
            type: Literal["horizontal", "vertical"] = "horizontal",
            size: Literal["small", "middle", "large"] | None = None,
            title_placement: Literal["start", "end", "center"] | None = None,
            vertical: bool | None = None,
            root_class_name: str | None = None,
            class_names: dict | str | None = None,
            styles: dict | str | None = None,
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
        self.class_names = class_names
        self.styles = styles
        self.value = value
        self.additional_props = additional_props
        self.dashed = dashed
        self.variant = variant
        self.orientation = orientation
        self.orientation_margin = orientation_margin
        self.title_placement = title_placement
        self.vertical = vertical
        self.plain = plain
        self.type = type
        self.size = size
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
