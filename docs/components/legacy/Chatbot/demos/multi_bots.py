import os
import time

import gradio as gr
import modelscope_studio as mgr
import modelscope_studio.components.base as ms


def resolve_assets(relative_path):
    return os.path.join(os.path.dirname(__file__), "../../resources",
                        relative_path)


conversation = [
    [None, {
        "text": "Hello I'm a chatbot",
        "flushing": False
    }],
]


def get_last_bot_message(chatbot):
    return chatbot[-1][1]


def create_music_bot_message(text: str):
    return {
        "text": text,
    }


def create_image_bot_message(text: str):
    return {
        "text": text,
    }


def submit(_input, _chatbot):
    _chatbot.append([_input, None])
    yield gr.update(interactive=False, value=None), _chatbot
    _chatbot[-1][1] = [
        "Hello",
        create_image_bot_message("Hello"),
        create_music_bot_message("Hello")
    ]

    time.sleep(2)
    get_last_bot_message(_chatbot)[1][
        "text"] = f"""Hello, I\'m a image bot\n![image]({resolve_assets("user.jpeg")})"""
    get_last_bot_message(_chatbot)[2][
        "text"] = f"""Hello, I\'m a music bot <audio src="{resolve_assets("audio.wav")}"></audio>"""
    yield {
        chatbot: _chatbot,
    }


def flushed():
    return gr.update(interactive=True)


with gr.Blocks() as demo, ms.Application():
    chatbot = mgr.Chatbot(
        value=conversation,
        avatar_image_width=40,
        avatar_images=[
            resolve_assets('user.jpeg'),
            # default bot avatar and name
            [{
                "name": "bot",
                "avatar": resolve_assets('bot.jpeg')
            }, {
                "name": "image bot",
                "avatar": resolve_assets('image-bot.jpeg')
            }, {
                "name": "music bot",
                "avatar": resolve_assets('music-bot.jpeg')
            }]
        ],
        height=600,
    )

    input = mgr.MultimodalInput()
    input.submit(fn=submit, inputs=[input, chatbot], outputs=[input, chatbot])
    chatbot.flushed(fn=flushed, outputs=[input])

if __name__ == "__main__":
    demo.queue().launch()
