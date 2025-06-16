from __future__ import annotations

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir
from .iconfont_provider import AntdIconIconfontProvider


class AntdIcon(ModelScopeDataLayoutComponent):
    """
    Ant Design: https://ant.design/components/icon

    Semantic vector graphics.
    """

    IconfontProvider = AntdIconIconfontProvider

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True))
    ]

    # supported slots
    SLOTS = ["component"]

    def __init__(
            self,
            value: str | None = "GithubOutlined",
            props: dict | None = None,
            *,
            spin: bool | None = None,
            rotate: int | float | None = None,
            two_tone_color: str | None = None,
            component: str | None = None,
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
            rotate: Rotate by n degrees (not working in IE9).
            spin: Rotate icon with animation.
            two_tone_color: Only supports the two-tone icon. Specify the primary color.
            component: The component used for the root node.
        """
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.spin = spin
        self.rotate = rotate
        self.component = component
        self.two_tone_color = two_tone_color

    FRONTEND_DIR = resolve_frontend_dir("icon")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> str:
        return "GithubOutlined"

    def example_value(self) -> str:
        return "GithubOutlined"
