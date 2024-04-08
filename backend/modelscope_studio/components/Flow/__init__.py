from __future__ import annotations

from typing import Any, Callable, Dict, List

from gradio import processing_utils
from gradio.components.base import Component
from gradio.data_classes import GradioModel
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
                 show_sidebar: bool | None = None,
                 show_minimap: bool | None = None,
                 show_controls: bool | None = None,
                 background_props: dict | None = None,
                 min_zoom: float | int | None = 0.1,
                 max_zoom: float | int | None = 2,
                 custom_components: dict | None = None):
        """
        Parameters:
            value: FlowData or dict
            height: Height of the Flow
        """
        self.height = height
        self.custom_components = custom_components
        self.show_sidebar = show_sidebar
        self.show_minimap = show_minimap
        self.show_controls = show_controls
        self.background_props = background_props
        self.min_zoom = min_zoom
        self.max_zoom = max_zoom

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
        self.schema = self._process_schema(schema)

    def _process_schema(self, schema: dict | None):
        if isinstance(schema, dict):
            nodes = schema.get('nodes', [])
            for node in nodes:
                icon_url = node.get('icon')
                if isinstance(icon_url, str):
                    node[
                        "icon"] = processing_utils.move_resource_to_block_cache(
                            icon_url, self)
        return schema

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
