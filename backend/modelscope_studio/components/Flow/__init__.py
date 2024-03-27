from __future__ import annotations

from typing import Any, Callable, Dict, List, Union

from gradio.components.base import Component
from gradio.data_classes import FileData, GradioModel
from gradio.events import Events
from gradio_client.documentation import document

from modelscope_studio.utils import resolve_frontend_dir


class FlowData(GradioModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


@document()
class ModelScopeFlow(Component):
    data_model = FlowData
    FRONTEND_DIR = resolve_frontend_dir("Flow")
    EVENTS = [Events.change, 'data_change', 'custom']

    def __init__(self,
                 value: dict | FlowData | Callable | None = None,
                 *,
                 label: str | None = None,
                 info: str | None = None,
                 every: float | None = None,
                 show_label: bool | None = None,
                 container: bool = True,
                 scale: int | None = None,
                 min_width: int = 160,
                 interactive: bool | None = None,
                 visible: bool = True,
                 elem_id: str | None = None,
                 elem_classes: list[str] | str | None = None,
                 render: bool = True,
                 height: int | None = 600,
                 schema: dict | None = None,
                 show_sidebar: bool | None = True,
                 show_minimap: bool | None = True,
                 show_controls: bool | None = True,
                 min_zoom: float | int | None = 0.1,
                 max_zoom: float | int | None = 2,
                 custom_components: dict | None = None,
                 hide_attribution: bool | None = False):
        """
        Parameters:
            value: FlowData or dict
            hide_attribution: This component is made with react-flow. By default, we render a small attribution in the corner of your flows that links back to the react-flow. The reason: https://reactflow.dev/learn/troubleshooting/remove-attribution
        """
        self.height = height
        self.schema = schema
        self.custom_components = custom_components
        self.show_sidebar = show_sidebar
        self.show_minimap = show_minimap
        self.show_controls = show_controls
        self.min_zoom = min_zoom
        self.max_zoom = max_zoom
        self.hide_attribution = hide_attribution

        super().__init__(
            label=label,
            info=info,
            every=every,
            show_label=show_label,
            container=container,
            scale=scale,
            min_width=min_width,
            interactive=interactive,
            visible=visible,
            elem_id=elem_id,
            elem_classes=elem_classes,
            render=render,
            value=value,
        )

    def preprocess(self, payload: FlowData | dict | None) -> dict | None:
        if payload is None:
            return FlowData()
        if isinstance(payload, dict):
            return FlowData(**payload)
        return payload

    def postprocess(self, value: FlowData | dict | None) -> dict | None:
        if value is None:
            return FlowData()
        if isinstance(value, dict):
            return FlowData(**value)
        return value

    def example_inputs(self) -> Any:
        return {"nodes": [], "edges": []}