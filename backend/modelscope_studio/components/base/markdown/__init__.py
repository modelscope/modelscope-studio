from __future__ import annotations

import inspect
from typing import Any

from gradio.events import EventListener

from ....utils.dev import ModelScopeDataLayoutComponent, resolve_frontend_dir


class ModelScopeMarkdown(ModelScopeDataLayoutComponent):
    """
    """

    EVENTS = [
        EventListener("change",
                      callback=lambda block: block._internal.update(
                          bind_change_event=True)),
        EventListener("copy",
                      callback=lambda block: block._internal.update(
                          bind_copy_event=True)),
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True)),
        EventListener("dblclick",
                      callback=lambda block: block._internal.update(
                          bind_dblclick_event=True)),
        EventListener("mousedown",
                      callback=lambda block: block._internal.update(
                          bind_mousedown_event=True)),
        EventListener("mouseup",
                      callback=lambda block: block._internal.update(
                          bind_mouseup_event=True)),
        EventListener("mouseover",
                      callback=lambda block: block._internal.update(
                          bind_mouseover_event=True)),
        EventListener("mouseout",
                      callback=lambda block: block._internal.update(
                          bind_mouseout_event=True)),
        EventListener("mousemove",
                      callback=lambda block: block._internal.update(
                          bind_mousemove_event=True)),
        EventListener("scroll",
                      callback=lambda block: block._internal.update(
                          bind_scroll_event=True)),
    ]

    # supported slots
    SLOTS = [
        # list [copy, copied]
        "copyButtons"
    ]

    def __init__(
            self,
            value: str | None = None,
            props: dict | None = None,
            *,
            rtl: bool = False,
            latex_delimiters: list[dict[str, str | bool]] | None = None,
            sanitize_html: bool = True,
            line_breaks: bool = False,
            header_links: bool = False,
            allow_tags: list[str] | bool = False,
            show_copy_button: bool = False,
            copy_buttons: tuple[str | float | int, str | float | int]
        | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(value=value,
                         visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.rtl = rtl
        if latex_delimiters is None:
            latex_delimiters = [
                {
                    "left": "$$",
                    "right": "$$",
                    "display": True
                },
                {
                    "left": "$",
                    "right": "$",
                    "display": False
                },
                {
                    "left": "\\(",
                    "right": "\\)",
                    "display": False
                },
                {
                    "left": "\\begin{equation}",
                    "right": "\\end{equation}",
                    "display": True
                },
                {
                    "left": "\\begin{align}",
                    "right": "\\end{align}",
                    "display": True
                },
                {
                    "left": "\\begin{alignat}",
                    "right": "\\end{alignat}",
                    "display": True
                },
                {
                    "left": "\\begin{gather}",
                    "right": "\\end{gather}",
                    "display": True
                },
                {
                    "left": "\\begin{CD}",
                    "right": "\\end{CD}",
                    "display": True
                },
                {
                    "left": "\\[",
                    "right": "\\]",
                    "display": True
                },
            ]
        self.latex_delimiters = latex_delimiters
        self.sanitize_html = sanitize_html
        self.line_breaks = line_breaks
        self.header_links = header_links
        self.allow_tags = allow_tags if allow_tags else False
        self.show_copy_button = show_copy_button
        self.copy_buttons = copy_buttons
        self.props = props

    FRONTEND_DIR = resolve_frontend_dir("markdown", type="base")

    def preprocess(self, payload: str | None) -> str | None:
        """
        Parameters:
            payload: the `str` of Markdown corresponding to the displayed value.
        Returns:
            Passes the `str` of Markdown corresponding to the displayed value.
        """
        return payload

    def postprocess(self, value: str | None) -> str | None:
        """
        Parameters:
            value: Expects a valid `str` that can be rendered as Markdown.
        Returns:
            The same `str` as the input, but with leading and trailing whitespace removed.
        """
        if value is None:
            return None
        unindented_y = inspect.cleandoc(value)
        return unindented_y

    def example_payload(self) -> Any:
        return "# Hello!"

    def example_value(self) -> Any:
        return "# Hello!"

    def api_info(self) -> dict[str, Any]:
        return {"type": "string"}
