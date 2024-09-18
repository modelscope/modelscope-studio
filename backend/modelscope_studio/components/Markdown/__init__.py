from __future__ import annotations

import inspect
from typing import Any, Callable, Dict, List

from gradio.components.base import Component
from gradio.events import Events
from gradio_client.documentation import document, set_documentation_group

from ...utils import CustomComponentDict, process_links, resolve_frontend_dir

set_documentation_group("component")


@document()
class ModelScopeMarkdown(Component):
    """
    Used to render arbitrary Markdown output. Can also render latex enclosed by dollar signs.
    Preprocessing: this component does *not* accept input.
    Postprocessing: expects a valid {str} that can be rendered as Markdown.

    Demos: blocks_hello, blocks_kinematics
    Guides: key-features
    """
    FRONTEND_DIR = resolve_frontend_dir("Markdown")
    EVENTS = [Events.change, "custom"]

    @staticmethod
    def data_postprocess(component_instance, value):
        return value

    @staticmethod
    def data_preprocess(component_instance, value):
        return value

    def __init__(
        self,
        value: str | Callable = "",
        *,
        label: str | None = None,
        every: float | None = None,
        show_label: bool | None = None,
        rtl: bool = False,
        visible: bool = True,
        elem_id: str | None = None,
        elem_classes: List[str] | str | None = None,
        render: bool = True,
        sanitize_html: bool = True,
        line_breaks: bool = False,
        header_links: bool = False,
        enable_base64: bool = False,
        enable_latex: bool = True,
        latex_single_dollar_delimiter: bool = True,
        latex_delimiters: list[dict[str, str | bool]] | None = None,
        preview: bool = True,
        data_postprocess: Callable | None = None,
        data_preprocess: Callable | None = None,
        custom_components: Dict[str, CustomComponentDict] | None = None,
    ):
        """
        Parameters:
            value: Value to show in Markdown component. If callable, the function will be called whenever the app loads to set the initial value of the component.
            label: The label for this component. Is used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.
            every: If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. Queue must be enabled. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.
            show_label: This parameter has no effect.
            rtl: If True, sets the direction of the rendered text to right-to-left. Default is False, which renders text left-to-right.
            enable_latex: If True, will enable LaTeX rendering.
            latex_single_dollar_delimiter: If True, will enable single dollar delimiter for LaTeX rendering.
            latex_delimiters: A list of dicts of the form {"left": open delimiter (str), "right": close delimiter (str), "display": whether to display in newline (bool), "inline": whether to render inline (bool)} that will be used to render LaTeX expressions. For more information, see the [KaTeX documentation](https://katex.org/docs/autorender.html).
            elem_id: An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.
            elem_classes: An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.
            render: If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.
            sanitize_html: If False, will disable HTML sanitization when converted from markdown. This is not recommended, as it can lead to security vulnerabilities.
            line_breaks: If True, will enable Github-flavored Markdown line breaks in chatbot messages. If False (default), single new lines will be ignored.
            enable_base64: Enable base64 encoding for markdown rendering.
            preview: If True (default), will enable image preview.
            header_links: If True, will automatically create anchors for headings, displaying a link icon on hover.
            custom_components: Define custom tags for markdown rendering.
        """
        self.rtl = rtl
        self.enable_latex = enable_latex
        self.latex_single_dollar_delimiter = latex_single_dollar_delimiter
        self.latex_delimiters = latex_delimiters
        self.sanitize_html = sanitize_html
        self.preview = preview
        self.line_breaks = line_breaks
        self.header_links = header_links
        self.enable_base64 = enable_base64
        self.preview = preview
        self.custom_components = custom_components
        self.data_preprocess = data_preprocess
        self.data_postprocess = data_postprocess

        super().__init__(
            label=label,
            every=every,
            show_label=show_label,
            visible=visible,
            elem_id=elem_id,
            elem_classes=elem_classes,
            render=render,
            value=value,
        )

    def postprocess(self, value: str | None) -> str | None:
        if self.data_postprocess:
            value = self.data_postprocess(self, value)
        value = self.__class__.data_postprocess(self, value)
        if value is None:
            return None
        unindented_y = inspect.cleandoc(value)
        return process_links(unindented_y, self)

    def as_example(self, input_data: str | None) -> str:
        postprocessed = self.postprocess(input_data)
        return postprocessed if postprocessed else ""

    def preprocess(self, payload: str | None) -> str | None:
        if self.data_preprocess:
            payload = self.data_preprocess(self, payload)
        payload = self.__class__.data_preprocess(self, payload)
        return payload

    def example_inputs(self) -> Any:
        return "# Hello!"

    def api_info(self) -> Dict[str, Any]:
        return {"type": "string"}
