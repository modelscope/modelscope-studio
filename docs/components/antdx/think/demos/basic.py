import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

thinking_content = """I need to analyze the user's question carefully.

First, let me consider the context and requirements.
Then, I'll formulate a comprehensive response based on my analysis.
Finally, I'll present the answer in a clear and concise manner."""

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("Basic Think")
            with antdx.Think(title="Thinking...", default_expanded=True):
                ms.Span(thinking_content)

            antd.Divider("Loading State")
            with antd.Space():
                ms.Span("Loading State")
                loading_switch = antd.Switch(value=True)
            with antdx.Think(title="Thinking...", blink=True) as think_loading:
                ms.Span(thinking_content)

            antd.Divider("Expanded Control")
            with antd.Space():
                ms.Span("Expanded")
                expanded_switch = antd.Switch(value=True)
            with antdx.Think(title="Think Result",
                             expanded=True) as think_expanded:
                ms.Span(thinking_content)

    loading_switch.change(fn=lambda x: gr.update(loading=x, blink=x),
                          inputs=[loading_switch],
                          outputs=[think_loading])
    expanded_switch.change(fn=lambda x: gr.update(expanded=x),
                           inputs=[expanded_switch],
                           outputs=[think_expanded])

if __name__ == "__main__":
    demo.queue().launch()
