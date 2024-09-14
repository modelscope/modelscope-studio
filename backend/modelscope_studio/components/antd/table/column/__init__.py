from __future__ import annotations

from gradio.events import EventListener

from .....utils.dev import ModelScopeLayoutComponent, resolve_frontend_dir


class AntdTableColumn(ModelScopeLayoutComponent):
    """
    """
    EVENTS = [
        EventListener("filter_dropdown_open_change",
                      callback=lambda block: block._internal.update(
                          bind_filterDropdownOpenChange_event=True)),
    ]

    # supported slots
    SLOTS = [
        'filterDropdown', 'filterIcon', 'title', 'sortIcon',
        'showSorterTooltip.title'
    ]

    def __init__(
            self,
            props: dict | None = None,
            built_in_column: str | None = None,
            *,
            as_item: str | None = None,
            _internal: None = None,
            # gradio properties
            visible: bool = True,
            elem_id: str | None = None,
            elem_classes: list[str] | str | None = None,
            elem_style: dict | None = None,
            render: bool = True,
            **kwargs):
        super().__init__(visible=visible,
                         elem_id=elem_id,
                         elem_classes=elem_classes,
                         render=render,
                         as_item=as_item,
                         elem_style=elem_style,
                         **kwargs)
        self.props = props
        self.built_in_column = built_in_column

    FRONTEND_DIR = resolve_frontend_dir("table", "column")

    @property
    def skip_api(self):
        return True

    def preprocess(self, payload: None) -> None:
        return payload

    def postprocess(self, value: None) -> None:

        return value

    def example_payload(self) -> None:
        return None

    def example_value(self) -> None:
        return None