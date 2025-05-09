from __future__ import annotations

from typing import Any, Dict, Literal, Optional, TypedDict, Union

from ....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class SandboxFileData(TypedDict):
    code: str
    is_entry: Optional[bool]


class ModelScopeProWebSandbox(ModelScopeLayoutComponent):
    """
    """

    def __init__(
            self,
            value: Dict[str, Union[str, SandboxFileData]] | None = None,
            *,
            template: Literal['react', 'html'] = 'react',
            show_iframe_error: bool = True,
            import_map: Dict[str, str] | None = None,
            height: str | int | float | None = 400,
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
                         elem_style=elem_style,
                         **kwargs)
        self.value = value
        self.show_iframe_error = show_iframe_error
        self.template = template
        self.import_map = import_map
        self.height = height

    FRONTEND_DIR = resolve_frontend_dir("web-sandbox", type='pro')

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
