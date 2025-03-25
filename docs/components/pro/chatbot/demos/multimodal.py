import base64
import os
import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.chatbot import (ChatbotBotConfig,
                                                      ChatbotPromptsConfig,
                                                      ChatbotWelcomeConfig)
from modelscope_studio.components.pro.multimodal_input import \
  MultimodalInputUploadConfig
from openai import OpenAI

client = OpenAI(
    base_url='https://api-inference.modelscope.cn/v1/',
    api_key=os.getenv("MODELSCOPE_ACCESS_TOKEN"),  # ModelScope Token
)

model = "Qwen/Qwen2.5-VL-72B-Instruct"


def prompt_select(input_value, e: gr.EventData):
    input_value["text"] = e._data["payload"][0]["value"]["description"]
    return gr.update(value=input_value)


def clear():
    return gr.update(value=None)


def cancel(chatbot_value):
    chatbot_value[-1]["loading"] = False
    chatbot_value[-1]["status"] = "done"
    chatbot_value[-1]["footer"] = "Chat completion paused"

    return gr.update(value=chatbot_value), gr.update(loading=False), gr.update(
        disabled=False)


def retry(chatbot_value, e: gr.EventData):
    index = e._data["payload"][0]["index"]
    chatbot_value = chatbot_value[:index]

    yield gr.update(loading=True), gr.update(value=chatbot_value), gr.update(
        disabled=True)
    for chunk in submit(None, chatbot_value):
        yield chunk


def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    return f"data:image/jpeg;base64,{encoded_string}"


def format_history(history):
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for item in history:
        if item["role"] == "user":
            messages.append({
                "role":
                "user",
                "content": [{
                    "type": "image_url",
                    "image_url": image_to_base64(file)
                } for file in item["content"][0]["content"]
                            if os.path.exists(file)] +
                [{
                    "type": "text",
                    "text": item["content"][1]["content"]
                }]
            })
        elif item["role"] == "assistant":
            # ignore thought message
            messages.append({"role": "assistant", "content": item["content"]})
    return messages


def submit(input_value, chatbot_value):
    if input_value is not None:
        chatbot_value.append({
            "role":
            "user",
            "content": [{
                "type": "file",
                "content": [f for f in input_value["files"]]
            }, {
                "type": "text",
                "content": input_value["text"]
            }],
        })
    history_messages = format_history(chatbot_value)
    chatbot_value.append({
        "role": "assistant",
        "content": "",
        "loading": True,
        "status": "pending"
    })
    yield {
        input: gr.update(value=None, loading=True),
        clear_btn: gr.update(disabled=True),
        chatbot: gr.update(value=chatbot_value)
    }

    try:
        response = client.chat.completions.create(model=model,
                                                  messages=history_messages,
                                                  stream=True)
        start_time = time.time()

        for chunk in response:
            chatbot_value[-1]["content"] += chunk.choices[0].delta.content
            chatbot_value[-1]["loading"] = False

            yield {chatbot: gr.update(value=chatbot_value)}

        chatbot_value[-1]["footer"] = "{:.2f}".format(time.time() -
                                                      start_time) + 's'
        chatbot_value[-1]["status"] = "done"
        yield {
            clear_btn: gr.update(disabled=False),
            input: gr.update(loading=False),
            chatbot: gr.update(value=chatbot_value),
        }
    except Exception as e:
        chatbot_value[-1]["loading"] = False
        chatbot_value[-1]["status"] = "done"
        chatbot_value[-1]["content"] = "Failed to respond, please try again."
        yield {
            clear_btn: gr.update(disabled=False),
            input: gr.update(loading=False),
            chatbot: gr.update(value=chatbot_value),
        }
        raise e


with gr.Blocks() as demo, ms.Application(), antdx.XProvider(), ms.AutoLoading(
):
    with antd.Flex(vertical=True, gap="middle", elem_style=dict(height=800)):
        chatbot = pro.Chatbot(
            # for flex=1 to fill the remaining space
            height=0,
            elem_style=dict(flex=1),
            welcome_config=ChatbotWelcomeConfig(
                variant="borderless",
                icon=
                "https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.44/static/favicon.png",
                title=f"Hello, I'm {model}",
                description="You can upload images and text to get started.",
                prompts=ChatbotPromptsConfig(
                    title="How can I help you today?",
                    styles={
                        "list": {
                            "width": '100%',
                        },
                        "item": {
                            "flex": 1,
                        },
                    },
                    items=[{
                        "label":
                        "📅 Make a plan",
                        "children": [{
                            "description":
                            "Help me with a plan to start a business"
                        }, {
                            "description":
                            "Help me with a plan to achieve my goals"
                        }, {
                            "description":
                            "Help me with a plan for a successful interview"
                        }]
                    }, {
                        "label":
                        "🖋 Help me write",
                        "children": [{
                            "description":
                            "Help me write a story with a twist ending"
                        }, {
                            "description":
                            "Help me write a blog post on mental health"
                        }, {
                            "description":
                            "Help me write a letter to my future self"
                        }]
                    }])),
            user_config=dict(
                avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=3"),
            bot_config=ChatbotBotConfig(
                header=model,
                actions=["copy", "retry"],
                avatar=
                "https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.44/static/favicon.png"
            ),
        )

        with pro.MultimodalInput(upload_config=MultimodalInputUploadConfig(
                max_count=4, multiple=True, accept="image/*")) as input:
            with ms.Slot("prefix"):
                with antd.Button(value=None, color="default",
                                 variant="text") as clear_btn:
                    with ms.Slot("icon"):
                        antd.Icon("ClearOutlined")
        clear_btn.click(fn=clear, outputs=[chatbot])
        submit_event = input.submit(fn=submit,
                                    inputs=[input, chatbot],
                                    outputs=[input, chatbot, clear_btn])
        input.cancel(fn=cancel,
                     inputs=[chatbot],
                     outputs=[chatbot, input, clear_btn],
                     cancels=[submit_event],
                     queue=False)
        chatbot.retry(fn=retry,
                      inputs=[chatbot],
                      outputs=[input, chatbot, clear_btn])
        chatbot.welcome_prompt_select(fn=prompt_select,
                                      inputs=[input],
                                      outputs=[input])
if __name__ == "__main__":
    demo.queue().launch()
