import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        "This _example_ was **written** in [Markdown](https://en.wikipedia.org/wiki/Markdown)\n"
    )

if __name__ == "__main__":
    demo.queue().launch()
