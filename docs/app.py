import gradio as gr
from components.Chatbot.app import docs as chatbot_docs
from components.Docs import Docs
from components.Markdown.app import docs as markdown_docs
from components.MultimodalInput.app import docs as multimodel_input_docs

readme_docs = Docs(__file__)

docs = [
    ["Quick Start", readme_docs],
    ["Chatbot", chatbot_docs],
    ["Markdown", markdown_docs],
    ["MultimodalInput", multimodel_input_docs],
]

with gr.Blocks() as demo:
    with gr.Tabs() as components_tabs:
        for doc in docs:
            with gr.TabItem(doc[0], id=doc[0]):
                doc[1].render(components_tabs)

demo.queue().launch()
