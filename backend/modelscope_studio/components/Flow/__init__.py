from __future__ import annotations

from typing import (Any, Callable, Dict, List, Literal, Optional, Tuple,
                    TypedDict, Union)

from gradio import processing_utils
from gradio.components.base import Component
from gradio.data_classes import GradioModel
from gradio.events import Events
from gradio_client.documentation import document

from ...utils import CustomComponentDict, resolve_frontend_dir
from .edge import *
from .edge import Edge
from .node import *
from .node import Node
from .node_schema import *
from .node_schema import NodeSchemaDict


class FlowData(GradioModel):
    nodes: Optional[List[Union[Node, dict]]] = []
    edges: Optional[List[Union[Edge, dict]]] = []


class FlowSchemaDict(TypedDict):
    nodes: Optional[List[Union[NodeSchemaDict, dict]]] = []


class BackgroundPropsDict(TypedDict):
    color: Optional[str]
    bgColor: Optional[str]
    className: Optional[str]
    # The gap between patterns. Passing in a tuple allows you to control the x and y gap independently.
    gap: Optional[Union[int, Tuple[int, int]]]
    # The radius of each dot or the size of each rectangle if BackgroundVariant.Dots or BackgroundVariant.Cross is used. This defaults to 1 or 6 respectively, or ignored if BackgroundVariant.Lines is used.
    size: Optional[int]
    offset: Optional[int]
    lineWidth: Optional[int]
    variant: Optional[Literal['dots', 'lines', 'cross']]


@document()
class ModelScopeFlow(Component):
    data_model = FlowData
    FRONTEND_DIR = resolve_frontend_dir("Flow")
    EVENTS = [Events.change, 'data_change', 'custom']

    def __init__(
            self,
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
            elem_classes: List[str] | str | None = None,
            render: bool = True,
            sync_on_data_change: bool | None = None,
            height: int | str | None = 600,
            schema: Union[FlowSchemaDict, dict] | None = None,
            show_sidebar: bool | None = None,
            show_minimap: bool | None = None,
            show_controls: bool | None = None,
            background_props: Union[BackgroundPropsDict, dict,
                                    List[Union[BackgroundPropsDict, dict]]]
        | None = None,
            min_zoom: float | int | None = 0.1,
            max_zoom: float | int | None = 2,
            custom_components: Dict[str, CustomComponentDict] | None = None):
        """
        Parameters:
            value: FlowData or dict
            sync_on_data_change: Whether to sync the Python value of the flow only the data changed (eg: node attrs, node count, edge count, connection ports, exclude node position). If you want better page performance instead of full data synchronization, It should be set to True.
            height: The height of the flow component, specified in pixels if a number is passed, or in CSS units if a string is passed.
            schema: Define the nodes and edges for the flow.
            show_sidebar: Display the sidebar of the flow.
            show_minimap: Display the minimap of the flow.
            show_controls: Display the controls of the flow.
            background_props: Modify the background of the flow, accepting the following props: BackgroundPropsDict
            min_zoom: The minimum zoom level.
            max_zoom: The maximum zoom level.
            custom_components: Define the custom node types for the flow schema.
        """
        self.height = height
        self.custom_components = custom_components
        self.show_sidebar = show_sidebar
        self.show_minimap = show_minimap
        self.show_controls = show_controls
        self.sync_on_data_change = sync_on_data_change
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

    def _process_schema(self, schema: Union[FlowSchemaDict, dict] | None):
        if schema is not None:
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
