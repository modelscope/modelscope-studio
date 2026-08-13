import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

items = [{
    "key": f"item-{i}",
    "title": f"Item {i}",
} for i in range(2000)]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Listy(items=items,
                            row_key="key",
                            height=360,
                            virtual=True,
                            elem_style=dict(border="1px solid #f0f0f0",
                                            borderRadius=8)):
                with ms.Slot(
                        "itemRender",
                        params_mapping="(item) => ({ value: item.title })"):
                    ms.Div(elem_style=dict(padding="0 16px"))

if __name__ == "__main__":
    demo.queue().launch()
