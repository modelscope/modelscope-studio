from __future__ import annotations

from typing import Any

from gradio.components.base import Component
from gradio.data_classes import GradioModel
from gradio.events import EventListener
from gradio_client.documentation import document, set_documentation_group

from ...utils import resolve_frontend_dir

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
            config_data=lambda: {"_bind_mount_event": False},
            callback=lambda block: setattr(block, "_bind_mount_event", True),
        ),
        EventListener(
            "resize",
            doc=
            "This listener is triggered when the user resizes the browser window.",
            config_data=lambda: {"_bind_resize_event": False},
            callback=lambda block: setattr(block, "_bind_resize_event", True),
        ),
        EventListener(
            "unmount",
            doc="This listener is triggered when the user leaves the page.",
            config_data=lambda: {"_bind_unmount_event": False},
            callback=lambda block: setattr(block, "_bind_unmount_event", True),
        ),
    ]
    data_model = LifecycleData

    def __init__(
        self,
        *,
        every: float | None = None,
        _bind_mount_event: bool | None = None,
        _bind_resize_event: bool | None = None,
        _bind_unmount_event: bool | None = None,
    ):
        """
        Parameters:
            every: If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. Queue must be enabled. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.
        """
        self._bind_mount_event = _bind_mount_event
        self._bind_resize_event = _bind_resize_event
        self._bind_unmount_event = _bind_unmount_event
        super().__init__(every=every)

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
