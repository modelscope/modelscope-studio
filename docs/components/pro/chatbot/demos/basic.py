import os

import gradio as gr
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
import modelscope_studio.components.pro as pro
from modelscope_studio.components.pro.chatbot import (
    ChatbotDataMessage, ChatbotDataMessageContent,
    ChatbotDataSuggestionContentItem, ChatbotDataSuggestionContentOptions)

with gr.Blocks() as demo, ms.Application(), antdx.XProvider():
    pro.Chatbot(
        value=[
            ChatbotDataMessage(role="user", content="Hello"),
            {
                "role": "assistant",
                "content": "World"
            },
            ChatbotDataMessage(
                role="user",
                # other content type
                content=ChatbotDataMessageContent(
                    type="file",
                    content=[
                        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
                        os.path.join(os.path.dirname(__file__),
                                     "../resources/scenery.jpeg")
                    ])),
            ChatbotDataMessage(role="assistant",
                               content=ChatbotDataMessageContent(
                                   type="tool",
                                   content="Tool content",
                                   options={"title": "Tool"})),
            ChatbotDataMessage(role="assistant",
                               content=ChatbotDataMessageContent(
                                   type="suggestion",
                                   content=[
                                       ChatbotDataSuggestionContentItem(
                                           description="Option 1"),
                                       ChatbotDataSuggestionContentItem(
                                           description="Option 2"),
                                       ChatbotDataSuggestionContentItem(
                                           description="Option 3")
                                   ],
                                   options=ChatbotDataSuggestionContentOptions(
                                       title="Suggestion"))),
            ChatbotDataMessage(
                role="assistant",
                # multiple content type
                content=[
                    ChatbotDataMessageContent(type="tool",
                                              content="Thought content",
                                              options={"title": "Thinking"}),
                    ChatbotDataMessageContent(type="text",
                                              content="Hello World"),
                    ChatbotDataMessageContent(
                        type="suggestion",
                        content=[
                            ChatbotDataSuggestionContentItem(
                                description="Option 1"),
                            ChatbotDataSuggestionContentItem(
                                description="Option 2"),
                            ChatbotDataSuggestionContentItem(
                                description="Option 3")
                        ],
                        options=ChatbotDataSuggestionContentOptions(
                            title="Suggestion"))
                ]),
        ],
        height=600)

if __name__ == "__main__":
    demo.queue().launch()
