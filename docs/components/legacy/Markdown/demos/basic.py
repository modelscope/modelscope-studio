import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        "This _example_ was **written** in [Markdown](https://en.wikipedia.org/wiki/Markdown)\n"
    )

if __name__ == "__main__":
    demo.queue().launch()
