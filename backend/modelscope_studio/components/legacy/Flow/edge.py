from typing import Optional, Union

from gradio.data_classes import GradioModel


class EdgePort(GradioModel):
    attr: Optional[str] = None
    attrItemIndex: Optional[int] = None
    handleIndex: Optional[int] = None


class Edge(GradioModel):
    id: Optional[str] = None
    source: str
    target: str
    sourcePort: Optional[Union[EdgePort, dict]] = None
    targetPort: Optional[Union[EdgePort, dict]] = None
