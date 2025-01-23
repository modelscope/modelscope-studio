import gradio as gr
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

with gr.Blocks() as demo, ms.Application():
    mgr.Markdown(
        """
custom tag:<custom-tag value="aaa"></custom-tag>
""",
        custom_components={
            # Key is the tag name
            "custom-tag": {
                # The tag props.
                "props": ["value"],
                # The tag template, use `{prop}` as placeholder.
                "template": "<div>{value}</div>"
            }
        })

if __name__ == "__main__":
    demo.queue().launch()
