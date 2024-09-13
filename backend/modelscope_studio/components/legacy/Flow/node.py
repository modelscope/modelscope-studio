from typing import Optional, Union

from gradio.data_classes import GradioModel


class NodePosition(GradioModel):
    x: Optional[int] = 0
    y: Optional[int] = 0


class Node(GradioModel):
    id: Optional[str] = None
    name: str
    title: Optional[str] = None
    position: Optional[Union[NodePosition, dict]] = None
    data: Optional[dict] = None
