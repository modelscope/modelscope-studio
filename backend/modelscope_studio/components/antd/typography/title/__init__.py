from __future__ import annotations

from typing import Any, Literal

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTypographyTitle(ModelScopeLayoutComponent):
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
        EventListener("ellipsis_ellipsis",
                      callback=lambda block: block._internal.update(
                          bind_ellipsis_ellipsis_event=True),
                      doc="Called when enter or leave ellipsis state."),
        EventListener(
            "ellipsis_tooltip_open_change",
            callback=lambda block: block._internal.update(
                bind_ellipsis_tooltip_openChange_event=True),
            doc=
            "Callback executed when visibility of the tooltip card is changed."
        ),
        EventListener("ellipsis_expand",
                      callback=lambda block: block._internal.update(
                          bind_ellipsis_expand_event=True),
                      doc="Called when expand content."),
    ]

    # supported slots
    SLOTS = [
        'copyable.icon',
        'copyable.tooltips',
        'editable.icon',
        'editable.tooltip',
        'editable.enterIcon',
        'ellipsis.symbol',
        'ellipsis.tooltip',
        'ellipsis.tooltip.title',
    ]

    def __init__(
            self,
            value: str | None = "",
            props: dict | None = None,
            *,
            code: bool | None = None,
            copyable: bool | dict = False,
            delete: bool | None = None,
            disabled: bool | None = None,
            editable: bool | dict = False,
            ellipsis: bool | dict = False,
            level: Literal[1, 2, 3, 4, 5] = 1,
            mark: bool | None = None,
            italic: bool | None = None,
            type: Literal['secondary', 'success', 'warning', 'danger']
        | None = None,
            underline: bool | None = None,
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
            ellipsis: Display ellipsis when text overflows, can configure rows and expandable by using object.
            level: Set content importance. Match with h1, h2, h3, h4, h5.
            mark: Marked style.
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
        self.level = level
        self.mark = mark
        self.italic = italic
        self.type = type
        self.underline = underline
        self.root_class_name = root_class_name

    FRONTEND_DIR = resolve_frontend_dir("typography", "title")

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
