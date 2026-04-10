import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

card_contents = [
    ("Nature", "The natural world is full of wonder and beauty.", 120),
    ("Technology", "Modern technology shapes how we live and work every day.",
     100),
    ("Travel",
     "Exploring new destinations broadens the mind and enriches the soul.",
     140),
    ("Food", "Culinary traditions reflect the culture and history of a place.",
     80),
    ("Science",
     "Scientific discoveries have transformed our understanding of the universe.",
     160),
    ("Art",
     "Artistic expression takes countless forms across different cultures and eras.",
     110),
]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Masonry(columns=3, gutter=16):
                for title, content, height in card_contents:
                    with antd.Masonry.Item():
                        with antd.Card(title=title,
                                       elem_style=dict(marginBottom=0)):
                            ms.Div(content,
                                   elem_style=dict(height=height,
                                                   display='flex',
                                                   alignItems='center'))

if __name__ == "__main__":
    demo.queue().launch()
