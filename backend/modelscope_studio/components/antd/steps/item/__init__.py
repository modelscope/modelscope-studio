from __future__ import annotations

from typing import Literal

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdStepsItem(ModelScopeLayoutComponent):
    """
    """
    EVENTS = []

    # supported slots
    SLOTS = ['description', "icon", "subTitle", "title"]

    def __init__(
            self,
            props: dict | None = None,
            *,
            description: str | None = None,
            disabled: bool | None = False,
            icon: str | None = None,
            status: Literal['wait', 'process', 'finish', 'error']
        | None = None,
            sub_title: str | None = None,
            title: str | None = None,
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
        self.description = description
        self.disabled = disabled
        self.icon = icon
        self.status = status
        self.sub_title = sub_title
        self.title = title

    FRONTEND_DIR = resolve_frontend_dir("steps", "item")

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
