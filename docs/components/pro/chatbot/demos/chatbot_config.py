import time

import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.chatbot import (
    ChatbotActionConfig, ChatbotBotConfig, ChatbotMarkdownConfig,
    ChatbotPromptsConfig, ChatbotUserConfig, ChatbotWelcomeConfig)


def welcome_prompt_select(chatbot_value, e: gr.EventData):
    chatbot_value.append({
        "role":
        "user",
        "content":
        e._data["payload"][0]["value"]["description"]
    })
    chatbot_value.append({
        "role": "assistant",
        "loading": True,
        "status": "pending",
    })
    yield gr.update(value=chatbot_value)

    time.sleep(1)
    chatbot_value[-1]["loading"] = False
    chatbot_value[-1]["status"] = 'done'
    chatbot_value[-1]["content"] = """
<think>Thought Content</think>

Content
"""
    yield gr.update(value=chatbot_value)


def retry(chatbot_value, e: gr.EventData):
    index = e._data["payload"][0]["index"]
    chatbot_value[index]["content"] = "Regenerated Content"
    return gr.update(value=chatbot_value)


with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    chatbot = pro.Chatbot(
        markdown_config=ChatbotMarkdownConfig(allow_tags=["think"]),
        welcome_config=ChatbotWelcomeConfig(
            variant="borderless",
            icon=
            "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
            title="Hello I'm Chatbot",
            description="Let's start a conversation.",
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
            actions=[
                "copy", "edit",
                ChatbotActionConfig(
                    action="delete",
                    popconfirm=dict(
                        title="Delete the message",
                        description="Are you sure to delete this message?",
                        okButtonProps=dict(danger=True)))
            ],
            avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=3"),
        bot_config=ChatbotBotConfig(
            # custom actions
            actions=[
                "copy", "like", "dislike", "retry", "edit",
                ChatbotActionConfig(
                    action="delete",
                    popconfirm=dict(
                        title="Delete the message",
                        description="Are you sure to delete this message?",
                        okButtonProps=dict(danger=True)))
            ],
            avatar=
            "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        ),
        height=600)

    chatbot.welcome_prompt_select(fn=welcome_prompt_select,
                                  inputs=[chatbot],
                                  outputs=[chatbot])
    chatbot.retry(fn=retry, inputs=[chatbot], outputs=[chatbot])

if __name__ == "__main__":
    demo.queue().launch()
