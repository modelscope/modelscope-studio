import os

import gradio as gr

import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


def fn(data: gr.EventData):
    print(data._data)


with gr.Blocks() as demo, ms.Application():
    gallery = mgr.WaterfallGallery(
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
        action_label="Click Me!",
        columns=2,
        height=600)
    gallery.like(fn=fn)
    gallery.click(fn=fn)

if __name__ == "__main__":
    demo.queue().launch()
