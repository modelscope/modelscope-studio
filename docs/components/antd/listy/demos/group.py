import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

categories = ["Fruit", "Vegetable", "Drink", "Snack"]

items = [{
    "key": f"item-{i}",
    "title": f"Item {i}",
    "category": categories[i % len(categories)],
} for i in range(400)]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Listy(items=items,
                            row_key="key",
                            height=360,
                            sticky=True,
                            virtual=True,
                            group=dict(key="(item) => item.category"),
                            elem_style=dict(border="1px solid #f0f0f0",
                                            borderRadius=8)):
                with ms.Slot(
                        "group.title",
                        params_mapping=
                        "(groupKey, items) => ({ value: groupKey + ' (' + items.length + ')' })"
                ):
                    ms.Div(elem_style=dict(fontWeight=600))
                with ms.Slot(
                        "itemRender",
                        params_mapping="(item) => ({ value: item.title })"):
                    ms.Div(elem_style=dict(padding="0 16px"))

if __name__ == "__main__":
    demo.queue().launch()
