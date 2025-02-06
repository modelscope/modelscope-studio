from __future__ import annotations

from typing import Any, Literal

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdXXProvider(ModelScopeLayoutComponent):
    """
    Ant Design X: https://x.ant.design/components/x-provider
    """
    EVENTS = []

    # see https://ant.design/components/config-provider, pass slot like 'spin.indicator'.
    SLOTS = ["renderEmpty"]

    def __init__(self,
                 props: dict | None = None,
                 *,
                 component_disabled: bool | None = None,
                 component_size: Literal['small', 'middle', 'large']
                 | None = None,
                 csp: dict | None = None,
                 direction: Literal['ltr', 'rtl'] | None = None,
                 get_popup_container: str | None = None,
                 get_target_container: str | None = None,
                 icon_prefix_cls: str | None = None,
                 locale: str | None = None,
                 popup_match_select_width: bool | int | float | None = None,
                 popup_overflow: Literal['viewport', 'scroll'] | None = None,
                 prefix_cls: str | None = None,
                 render_empty: str | None = None,
                 theme: dict | None = None,
                 variant: Literal['outlined', 'filled', 'borderless']
                 | None = None,
                 virtual: bool | None = None,
                 warning: dict | None = None,
                 as_item: str | None = None,
                 _internal: None = None,
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
        self.component_disabled = component_disabled
        self.component_size = component_size
        self.csp = csp
        self.direction = direction
        self.get_popup_container = get_popup_container
        self.get_target_container = get_target_container
        self.icon_prefix_cls = icon_prefix_cls
        self.locale = locale
        self.popup_match_select_width = popup_match_select_width
        self.popup_overflow = popup_overflow
        self.prefix_cls = prefix_cls
        self.render_empty = render_empty
        self.theme = theme
        self.variant = variant
        self.virtual = virtual
        self.warning = warning

    FRONTEND_DIR = resolve_frontend_dir("x-provider", type="antdx")

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
