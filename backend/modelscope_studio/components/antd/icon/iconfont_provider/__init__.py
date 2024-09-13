from __future__ import annotations

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdIconfontProvider(ModelScopeLayoutComponent):
    """
    """
    EVENTS = []

    # supported slots
    SLOTS = []

    def __init__(
            self,
            script_url: str | list[str] | None = None,
            props: dict | None = None,
            *,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         render=render,
                         as_item=as_item,
                         **kwargs)
        self.script_url = script_url
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("icon", "iconfont-provider")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return "GithubOutlined"

    def example_value(self) -> None:
        return "GithubOutlined"
