import os
import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.chatbot import (ChatbotBotConfig,
                                                      ChatbotPromptsConfig,
                                                      ChatbotUserConfig,
                                                      ChatbotWelcomeConfig)
from openai import OpenAI

client = OpenAI(
    base_url='https://api-inference.modelscope.cn/v1/',
    api_key=os.getenv("MODELSCOPE_ACCESS_TOKEN"),  # ModelScope Token
)

model = "Qwen/QwQ-32B"


def prompt_select(e: gr.EventData):
    return gr.update(value=e._data["payload"][0]["value"]["description"])


def clear():
    return gr.update(value=None)


def retry(chatbot_value, e: gr.EventData):
    index = e._data["payload"][0]["index"]
    chatbot_value = chatbot_value[:index]

    yield gr.update(loading=True), gr.update(value=chatbot_value), gr.update(
        disabled=True)
    for chunk in submit(None, chatbot_value):
        yield chunk


def cancel(chatbot_value):
    chatbot_value[-1]["loading"] = False
    chatbot_value[-1]["status"] = "done"
    chatbot_value[-1]["footer"] = "Chat completion paused"
    return gr.update(value=chatbot_value), gr.update(loading=False), gr.update(
        disabled=False)


def format_history(history):
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for item in history:
        if item["role"] == "user":
            messages.append({"role": "user", "content": item["content"]})
        elif item["role"] == "assistant":
            # ignore thought message
            messages.append({
                "role": "assistant",
                "content": item["content"][-1]["content"]
            })
    return messages


def submit(sender_value, chatbot_value):
    if sender_value is not None:
        chatbot_value.append({
            "role": "user",
            "content": sender_value,
        })
    history_messages = format_history(chatbot_value)
    chatbot_value.append({
        "role": "assistant",
        "content": [],
        "loading": True,
        "status": "pending"
    })
    yield {
        sender: gr.update(value=None, loading=True),
        clear_btn: gr.update(disabled=True),
        chatbot: gr.update(value=chatbot_value)
    }

    try:
        response = client.chat.completions.create(model=model,
                                                  messages=history_messages,
                                                  stream=True)
        thought_done = False
        start_time = time.time()
        message_content = chatbot_value[-1]["content"]
        # thought content
        message_content.append({
            "copyable": False,
            "editable": False,
            "type": "tool",
            "content": "",
            "options": {
                "title": "Thinking..."
            }
        })
        # content
        message_content.append({
            "type": "text",
            "content": "",
        })
        for chunk in response:
            reasoning_content = chunk.choices[0].delta.reasoning_content
            content = chunk.choices[0].delta.content
            chatbot_value[-1]["loading"] = False
            message_content[-2]["content"] += reasoning_content or ""
            message_content[-1]["content"] += content or ""

            if content and not thought_done:
                thought_done = True
                thought_cost_time = "{:.2f}".format(time.time() - start_time)
                message_content[-2]["options"][
                    "title"] = f"End of Thought ({thought_cost_time}s)"
                message_content[-2]["options"]["status"] = "done"

            yield {chatbot: gr.update(value=chatbot_value)}

        chatbot_value[-1]["footer"] = "{:.2f}".format(time.time() -
                                                      start_time) + 's'
        chatbot_value[-1]["status"] = "done"
        yield {
            clear_btn: gr.update(disabled=False),
            sender: gr.update(loading=False),
            chatbot: gr.update(value=chatbot_value),
        }
    except Exception as e:
        chatbot_value[-1]["loading"] = False
        chatbot_value[-1]["status"] = "done"
        chatbot_value[-1]["content"] = "Failed to respond, please try again."
        yield {
            clear_btn: gr.update(disabled=False),
            sender: gr.update(loading=False),
            chatbot: gr.update(value=chatbot_value),
        }
        raise e


with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    with antd.Flex(vertical=True, gap="middle"):
        chatbot = pro.Chatbot(
            height=600,
            welcome_config=ChatbotWelcomeConfig(
                variant="borderless",
                icon=
                "https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.44/static/favicon.png",
                title=f"Hello, I'm {model}",
                description="You can input text to get started.",
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
            user_config=ChatbotUserConfig(
                avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=3"),
            bot_config=ChatbotBotConfig(
                header=model,
                avatar=
                "https://assets.alicdn.com/g/qwenweb/qwen-webui-fe/0.0.44/static/favicon.png",
                actions=["copy", "retry"]),
        )

        with antdx.Sender() as sender:
            with ms.Slot("prefix"):
                with antd.Button(value=None, color="default",
                                 variant="text") as clear_btn:
                    with ms.Slot("icon"):
                        antd.Icon("ClearOutlined")
        clear_btn.click(fn=clear, outputs=[chatbot])
        submit_event = sender.submit(fn=submit,
                                     inputs=[sender, chatbot],
                                     outputs=[sender, chatbot, clear_btn])
        sender.cancel(fn=cancel,
                      inputs=[chatbot],
                      outputs=[chatbot, sender, clear_btn],
                      cancels=[submit_event],
                      queue=False)
        chatbot.retry(fn=retry,
                      inputs=[chatbot],
                      outputs=[sender, chatbot, clear_btn])
        chatbot.welcome_prompt_select(fn=prompt_select, outputs=[sender])

if __name__ == "__main__":
    demo.queue().launch()
