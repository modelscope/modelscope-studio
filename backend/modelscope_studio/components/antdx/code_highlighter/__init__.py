from __future__ import annotations

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXCodeHighlighter(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/code-highlighter
    """
    EVENTS = []

    # supported slots
    SLOTS = ['header']

    def __init__(
            self,
            value: str | None = None,
            *,
            lang: str | None = None,
            header: str | bool | None = None,
            highlight_props: dict | None = None,
            prism_light_mode: bool | None = None,
            styles: dict | str | None = None,
            class_names: dict | str | None = None,
            additional_props: dict | None = None,
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
        self.additional_props = additional_props
        self.styles = styles
        self.class_names = class_names
        self.root_class_name = root_class_name
        self.value = value
        self.lang = lang
        self.header = header
        self.highlight_props = highlight_props
        self.prism_light_mode = prism_light_mode

    FRONTEND_DIR = resolve_frontend_dir("code-highlighter", type="antdx")

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
