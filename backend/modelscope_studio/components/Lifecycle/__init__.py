from __future__ import annotations

from typing import Any

from gradio.components.base import Component
from gradio.data_classes import GradioModel
from gradio.events import EventListener
from gradio_client.documentation import document, set_documentation_group

from modelscope_studio.utils import resolve_frontend_dir

set_documentation_group("component")


class LifecycleScreenData(GradioModel):
    width: float
    height: float
    scrollX: float
    scrollY: float


class LifecycleData(GradioModel):
    screen: LifecycleScreenData
    language: str
    theme: str
    userAgent: str


@document()
class ModelScopeLifecycle(Component):
    FRONTEND_DIR = resolve_frontend_dir("Lifecycle")

    EVENTS = [
        EventListener(
            "mount",
            doc=
            "This listener is triggered when the {{ component }} initially mount in the browser.",
        ),
        EventListener(
            "resize",
            doc=
            "This listener is triggered when the user resizes the browser window.",
        ),
        EventListener(
            "unmount",
            doc="This listener is triggered when the user leaves the page.",
        ),
    ]
    data_model = LifecycleData

    def __init__(self):
        super().__init__()

    def preprocess(
            self, payload: LifecycleData | dict | None
    ) -> LifecycleData | dict | None:
        return payload

    def postprocess(
            self,
            value: LifecycleData | dict | None) -> LifecycleData | dict | None:
        return value

    def example_inputs(self) -> Any:
        return {
            "screen": {
                "width": 1920,
                "height": 1080,
                "scrollX": 0,
                "scrollY": 0,
            },
            "theme":
            "light",
            "language":
            "en",
            "userAgent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        }
