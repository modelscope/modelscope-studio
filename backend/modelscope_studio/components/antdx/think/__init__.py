from __future__ import annotations

from gradio.events import EventListener

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXThink(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/think
    """
    EVENTS = [
        EventListener("expand",
                      callback=lambda block: block._internal.update(
                          bind_expand_event=True)),
    ]

    # supported slots
    SLOTS = ['loading', 'icon', 'title']

    def __init__(
            self,
            additional_props: dict | None = None,
            *,
            icon: str | None = None,
            styles: dict | str | None = None,
            class_names: dict | str | None = None,
            loading: str | bool = None,
            title: str | None = None,
            root_class_name: str | None = None,
            default_expanded: bool | None = None,
            expanded: bool | None = None,
            blink: bool | None = None,
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
        self.additional_props = additional_props
        self.icon = icon
        self.styles = styles
        self.class_names = class_names
        self.loading = loading
        self.default_expanded = default_expanded
        self.expanded = expanded
        self.blink = blink
        self.title = title
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("think", type="antdx")

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
