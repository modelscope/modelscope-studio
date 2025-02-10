import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            conversations1 = antdx.Conversations(default_active_key="item1",
                                                 groupable=True,
                                                 items=[{
                                                     "key": "item1",
                                                     "label": "Item1",
                                                     "group": "Group1"
                                                 }, {
                                                     "key": "item2",
                                                     "label": "Item2",
                                                     "group": "Group1"
                                                 }, {
                                                     "key": "item3",
                                                     "label": "Item3",
                                                     "group": "Group2"
                                                 }, {
                                                     "key": "item4",
                                                     "label": "Item4",
                                                     "group": "Group2",
                                                     "disabled": True
                                                 }])

if __name__ == "__main__":
    demo.queue().launch()
