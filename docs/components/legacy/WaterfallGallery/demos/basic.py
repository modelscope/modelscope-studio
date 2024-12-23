import os

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


with gr.Blocks() as demo, ms.Application():
    mgr.WaterfallGallery(
        value=[
            resolve_assets('modelscope.svg'),
            # pass a tuple
            [resolve_assets('bot.jpeg'), 'bot'],
            # pass a dict
            {
                "image": resolve_assets('user.jpeg'),
                "caption": "user",
            },
            resolve_assets('screen.jpeg'),
        ],
        columns=2,
        height=600)

if __name__ == "__main__":
    demo.queue().launch()
