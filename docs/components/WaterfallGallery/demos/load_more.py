import os
import time

import gradio as gr
import modelscope_studio as mgr


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


def load_more(_gallery):
    time.sleep(1)
    _gallery.append(resolve_assets('modelscope.svg'))
    _gallery.append(resolve_assets('bot.jpeg'))
    _gallery.append(resolve_assets('user.jpeg'))
    _gallery.append(resolve_assets('screen.jpeg'))
    has_more = True
    if (len(_gallery) > 10):
        has_more = False
    return gr.update(value=_gallery, has_more=has_more)


with gr.Blocks() as demo:
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
        has_more=True,
        columns=2,
        height=600)
    gallery.load_more(fn=load_more, inputs=[gallery], outputs=[gallery])

if __name__ == "__main__":
    demo.queue().launch()
