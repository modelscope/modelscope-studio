from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTypographyLink(ModelScopeLayoutComponent):
    """
    Ant Design: https://ant.design/components/typography

    Basic text writing, including headings, body text, lists, and more.

    When to use:
    - When you need to display a title or paragraph contents in Articles/Blogs/Notes.
    - When you need copyable/editable/ellipsis texts.
    """

    EVENTS = [
        EventListener("click",
                      callback=lambda block: block._internal.update(
                          bind_click_event=True),
                      doc="Set the handler to handle click event."),
        EventListener("copyable_copy",
                      callback=lambda block: block._internal.update(
                          bind_copyable_copy_event=True),
                      doc="Called when copied text."),
        EventListener("editable_change",
                      callback=lambda block: block._internal.update(
                          bind_editable_change_event=True),
                      doc="Called when input at textarea."),
        EventListener("editable_cancel",
                      callback=lambda block: block._internal.update(
                          bind_editable_cancel_event=True),
                      doc="Called when type ESC to exit editable state."),
        EventListener("editable_start",
                      callback=lambda block: block._internal.update(
                          bind_editable_start_event=True),
                      doc="Called when enter editable state."),
        EventListener("editable_end",
                      callback=lambda block: block._internal.update(
                          bind_editable_end_event=True),
                      doc="Called when type ENTER to exit editable state."),
    ]

    # supported slots
    SLOTS = [
        'copyable.icon',
        'copyable.tooltips',
        'editable.icon',
        'editable.tooltip',
        'editable.enterIcon',
    ]

    def __init__(
            self,
            value: str | None = "",
            props: dict | None = None,
            *,
            href: str | None = None,
            href_target: str | None = None,
            code: bool = False,
            copyable: bool | dict = False,
            delete: bool = False,
            disabled: bool = False,
            editable: bool | dict = False,
            ellipsis: bool = False,
            keyboard: bool = False,
            mark: bool = False,
            strong: bool = False,
            italic: bool = False,
            type: Literal['secondary', 'success', 'warning', 'danger']
        | None = None,
            underline: bool = False,
            root_class_name: str | None = None,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        """
        Parameters:
            code: Code style.
            copyable: Whether to be copyable, customize it via setting an object.
            delete: Deleted line style.
            disabled: Disabled content.
            editable: If editable. Can control edit state when is object.
            ellipsis: Display ellipsis when text overflows.
            keyboard: Keyboard style.
            mark: Marked style.
            strong: Bold style.
            italic: Italic style.
            type: Content type.
            underline: Underlined style.
        """
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.value = value
        self.props = props
        self.code = code
        self.copyable = copyable
        self.delete = delete
        self.disabled = disabled
        self.editable = editable
        self.ellipsis = ellipsis
        self.keyboard = keyboard
        self.mark = mark
        self.strong = strong
        self.italic = italic
        self.type = type
        self.underline = underline
        self.href = href
        self.href_target = href_target
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("typography", "link")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: str | None) -> str | None:
        return payload

    def postprocess(self, value: str | None) -> str | None:

        return str(value)

    def example_payload(self) -> Any:
        return "Hello"

    def example_value(self) -> Any:
        return "Hello"
