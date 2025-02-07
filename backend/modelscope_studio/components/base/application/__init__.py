from __future__ import annotations

from typing import Any

from gradio.data_classes import GradioModel
from gradio.events import EventListener

from ....utils.dev import (AppContext, ModelScopeDataLayoutComponent,
                           resolve_frontend_dir)


class ApplicationPageScreenData(GradioModel):
    width: float
    height: float
    scrollX: float
    scrollY: float


class ApplicationPageData(GradioModel):
    screen: ApplicationPageScreenData
    language: str
    theme: str
    userAgent: str


class ModelScopeApplication(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener(
            "custom",
            doc=
            "This listener is triggered when the `window.ms_globals.dispatch` is called in javascript.",
            callback=lambda block: block._internal.update(bind_custom_event=
                                                          True)),
        EventListener(
            "mount",
            doc=
            "This listener is triggered when the application initially mount in the browser.",
            callback=lambda block: block._internal.update(bind_mount_event=True
                                                          )),
        EventListener(
            "resize",
            doc=
            "This listener is triggered when the user resizes the browser window.",
            callback=lambda block: block._internal.update(bind_resize_event=
                                                          True)),
        EventListener(
            "unmount",
            doc="This listener is triggered when the user leaves the page.",
            callback=lambda block: block._internal.update(bind_unmount_event=
                                                          True)),
    ]

    # supported slots
    SLOTS = []

    def __init__(
            self,
            value: ApplicationPageData | dict | None = None,
            *,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            key: int | str | None = None,
            render: bool = True,
            **kwargs):
        AppContext.set_app(self)
        super().__init__(value=value,
                         visible=visible,
                         render=render,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         elem_style=elem_style,
                         key=key,
                         **kwargs)

    FRONTEND_DIR = resolve_frontend_dir("application", type="base")

    data_model = ApplicationPageData

    def preprocess(
        self, payload: ApplicationPageData | dict | None
    ) -> ApplicationPageData | dict | None:
        return payload

    def postprocess(
        self, value: ApplicationPageData | dict | None
    ) -> ApplicationPageData | dict | None:

        return value

    def example_payload(self) -> Any:
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

    def example_value(self) -> Any:
        return None
