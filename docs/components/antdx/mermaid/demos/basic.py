import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antdx.Mermaid(value="""graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[OK]
    B -->|No| D[Cancel]""")

if __name__ == "__main__":
    demo.queue().launch()
