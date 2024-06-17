import gradio as gr
from api.app import docs as api_docs
from components.Chatbot.app import docs as chatbot_docs
from components.Docs import Docs
from components.Flow.app import docs as flow_docs
from components.Lifecycle.app import docs as lifecycle_docs
from components.Markdown.app import docs as markdown_docs
from components.MultimodalInput.app import docs as multimodel_input_docs
from components.WaterfallGallery.app import docs as waterfall_gallery_docs

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

with gr.Blocks() as demo:
    with gr.Tabs() as components_tabs:
        for doc in docs:
            with gr.TabItem(doc[0], id=doc[0]):
                doc[1].render(components_tabs)

demo.queue().launch()
