import gradio as gr
import modelscope_studio.components.base as ms
from api.app import docs as api_docs
from components.legacy.Chatbot.app import docs as chatbot_docs
from components.legacy.Docs import Docs
from components.legacy.Flow.app import docs as flow_docs
from components.legacy.Lifecycle.app import docs as lifecycle_docs
from components.legacy.Markdown.app import docs as markdown_docs
from components.legacy.MultimodalInput.app import docs as multimodel_input_docs
from components.legacy.WaterfallGallery.app import \
  docs as waterfall_gallery_docs

readme_docs = Docs(__file__)

docs = [
    ["Quick Start", readme_docs],
    ["API", api_docs],
    ["Chatbot", chatbot_docs],
    ["MultimodalInput", multimodel_input_docs],
    ["Markdown", markdown_docs],
    ["Lifecycle", lifecycle_docs],
    ["WaterfallGallery", waterfall_gallery_docs],
    ["Flow", flow_docs],
]

with gr.Blocks() as legacy_demo:
    with ms.Application():
        with gr.Tabs() as components_tabs:
            for doc in docs:
                with gr.TabItem(doc[0], id=doc[0]):
                    doc[1].render(components_tabs)

if __name__ == "__main__":
    legacy_demo.launch()
