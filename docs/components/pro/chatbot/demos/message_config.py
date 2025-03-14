import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.chatbot import (ChatbotActionConfig,
                                                      ChatbotBotConfig,
                                                      ChatbotDataMessage,
                                                      ChatbotUserConfig)

with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    pro.Chatbot(
        value=[
            ChatbotDataMessage(role="user", content="Hello"),
            ChatbotDataMessage(role="assistant", content="World"),
            ChatbotDataMessage(role="assistant",
                               content="Liked message",
                               meta=dict(feedback="like")),
            ChatbotDataMessage(role="assistant",
                               content="Message only has copy button",
                               actions=["copy"]),
            ChatbotDataMessage(
                role="assistant",
                content="Pending message will not show action buttons",
                status="pending"),
            ChatbotDataMessage(
                role="assistant",
                content="Bot 1",
                header="bot1",
                avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=1"),
            ChatbotDataMessage(
                role="assistant",
                content="Bot 2",
                header="bot2",
                avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=2"),
        ],
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
                "copy", "like", "dislike", "edit",
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

if __name__ == "__main__":
    demo.queue().launch()
