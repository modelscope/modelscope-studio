from __future__ import annotations

from gradio.events import EventListener

from .....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class AntdXSenderSwitch(ModelScopeDataLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/sender
    """
    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
    ]

    # supported slots
    SLOTS = ['checkedChildren', 'unCheckedChildren', 'icon']

    def __init__(
            self,
            value: bool | None = None,
            *,
            checked_children: str | None = None,
            un_checked_children: str | None = None,
            icon: str | None = None,
            disabled: bool | None = None,
            loading: bool | None = None,
            default_value: bool | None = None,
            styles: dict | str | None = None,
            class_names: dict | str | None = None,
            root_class_name: str | None = None,
            additional_props: dict | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(value=value,
                         visible=visible,
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
        self.checked_children = checked_children
        self.un_checked_children = un_checked_children
        self.icon = icon
        self.disabled = disabled
        self.loading = loading
        self.default_value = default_value

    FRONTEND_DIR = resolve_frontend_dir("sender", 'switch', type="antdx")

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
