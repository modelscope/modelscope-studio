import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

items = [{
    "id": i,
    "title": f"Item {i}",
} for i in range(1000)]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            # both `row_key` and `item_render` accept a Javascript function string
            antd.Listy(
                items=items,
                row_key="(item) => item.id",
                item_render="(item, index) => `#${index} ${item.title}`",
                height=360,
                virtual=True,
                elem_style=dict(border="1px solid #f0f0f0", borderRadius=8))

if __name__ == "__main__":
    demo.queue().launch()
