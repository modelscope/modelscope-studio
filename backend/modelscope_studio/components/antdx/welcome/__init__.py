from __future__ import annotations

from typing import Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXWelcome(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/welcome
    """
    EVENTS = []

    # supported slots
    SLOTS = ['extra', 'icon', 'description', 'title']

    def __init__(
            self,
            props: dict | None = None,
            *,
            extra: str | None = None,
            icon: str | None = None,
            styles: dict | None = None,
            class_names: dict | None = None,
            description: str | None = None,
            variant: Literal['filled', 'borderless'] | None = None,
            title: str | None = None,
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
        self.props = props
        self.extra = extra
        self.icon = self.serve_static_file(icon)
        self.styles = styles
        self.class_names = class_names
        self.description = description
        self.variant = variant
        self.title = title
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("welcome", type="antdx")

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
