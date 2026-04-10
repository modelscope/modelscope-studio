import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

card_contents = [
    ("Card 1", 120),
    ("Card 2", 80),
    ("Card 3", 160),
    ("Card 4", 100),
    ("Card 5", 140),
    ("Card 6", 90),
    ("Card 7", 110),
    ("Card 8", 130),
]

default_columns = 3

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle", vertical=True):
                ms.Div("Select number of columns:")
                columns_segmented = antd.Segmented(default_columns,
                                                   options=[
                                                       dict(label="1 Column",
                                                            value=1),
                                                       dict(label="2 Columns",
                                                            value=2),
                                                       dict(label="3 Columns",
                                                            value=3),
                                                       dict(label="4 Columns",
                                                            value=4),
                                                   ])
                with antd.Masonry(columns=default_columns,
                                  gutter=16) as masonry:
                    for title, height in card_contents:
                        with antd.Masonry.Item():
                            with antd.Card(title=title,
                                           elem_style=dict(marginBottom=0)):
                                ms.Div(elem_style=dict(height=height,
                                                       background='#f0f5ff',
                                                       borderRadius=4))
                columns_segmented.change(
                    fn=lambda _columns: gr.update(columns=_columns),
                    inputs=[columns_segmented],
                    outputs=[masonry])

if __name__ == "__main__":
    demo.queue().launch()
