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

model = "Qwen/Qwen2.5-72B-Instruct"


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


def format_history(history):
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for item in history:
        if item["role"] == "user":
            messages.append({
                "role":
                "user",
                "content": [{
                    "type": "text",
                    "text": item["content"]
                }]
            })
        elif item["role"] == "assistant":
            # ignore thought message
            messages.append({"role": "assistant", "content": item["content"]})
    return messages


def submit(input_value, chatbot_value):
    if input_value is not None:
        chatbot_value.append({
            "role": "user",
            "content": input_value["text"],
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


def close_copilot():
    return gr.update(md=24), gr.update(md=0), gr.update(elem_style=dict(
        display=""))


def open_copilot():
    return gr.update(md=16), gr.update(md=8), gr.update(elem_style=dict(
        display="none"))


def resize_window(e: gr.EventData):
    screen_width = e._data["screen"]["width"]
    is_mobile = screen_width < 768
    return gr.update(visible=False if is_mobile else True), gr.update(
        visible=False if is_mobile else True)


css = """
.copilot-container {
    height: calc(100vh - 32px - 21px - 16px);
}

.copilot-container .copilot {
    height: 100%;
    padding: 10px;
    background: var(--background-fill-secondary);
    border-top: 1px solid var(--border-color-primary);
    border-right: 1px solid var(--border-color-primary);
    border-bottom: 1px solid var(--border-color-primary);
}


.copilot-container .content-body {
    height: 100%;
    overflow: auto;
}

@media (max-width: 768px) {
    .copilot-container {
        height: auto;
    }
    .copilot-container .copilot {
        height: 600px;
        border-left: 1px solid var(--border-color-primary);
    }
    .copilot-container .content-body {
        height: auto;
        max-height: 400px;
    }
}
"""

with gr.Blocks(css=css) as demo, ms.Application() as app, antdx.XProvider():
    with antd.Row(elem_classes="copilot-container", wrap=True):
        # Content column
        with antd.Col(md=16, xs=24,
                      elem_style=dict(height="100%")) as content_col:
            with ms.AutoLoading(elem_style=dict(height="100%")):
                with antd.Card(elem_style=dict(height="100%",
                                               borderRadius=0,
                                               display="flex",
                                               flexDirection="column"),
                               class_names=dict(body="content-body")):
                    # Title
                    with ms.Slot("title"):
                        with antd.Typography.Title(level=1,
                                                   elem_style=dict(
                                                       margin=0,
                                                       textAlign="center",
                                                       fontSize=30)):
                            ms.Text("🤖 Copilot Template")

                    # Copilot button
                    with ms.Slot("extra"):
                        copilot_open_btn = antd.Button(
                            "✨ AI Copilot",
                            shape="round",
                            variant='filled',
                            color="primary",
                            elem_style=dict(display="none"))

                    # Content
                    ms.Markdown("""
<img src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp" style="width: 100%;" />
<h4>What is the RICH design paradigm?</h4>
<div>
RICH is an AI interface design paradigm we propose, similar to how the WIMP paradigm
relates to graphical user interfaces.
</div>
<br />
<div>
The ACM SIGCHI 2005 (the premier conference on human-computer interaction) defined
that the core issues of human-computer interaction can be divided into three levels:
</div>
<ul>
<li>
    Interface Paradigm Layer: Defines the design elements of human-computer
    interaction interfaces, guiding designers to focus on core issues.
</li>
<li>
    User model layer: Build an interface experience evaluation model to measure the
    quality of the interface experience.
</li>
<li>
    Software framework layer: The underlying support algorithms and data structures
    for human-computer interfaces, which are the contents hidden behind the front-end
    interface.
</li>
</ul>
<div>
The interface paradigm is the aspect that designers need to focus on and define the
most when a new human-computer interaction technology is born. The interface
paradigm defines the design elements that designers should pay attention to, and
based on this, it is possible to determine what constitutes good design and how to
achieve it.
</div>
""")

        # Copilot column
        with antd.Col(md=8, xs=24,
                      elem_style=dict(height="100%")) as copilot_col:
            with ms.AutoLoading(elem_style=dict(height="100%")):
                with antd.Flex(
                        vertical=True,
                        gap="small",
                        elem_classes="copilot",
                ):
                    with antd.Flex(justify="space-between", align="center"):
                        antd.Typography.Title("✨ AI Copilot",
                                              level=4,
                                              elem_style=dict(margin=0))
                        with antd.Flex(align="center", gap="small"):
                            with antd.Button(
                                    variant="text",
                                    color="default") as copilot_close_btn:
                                with ms.Slot("icon"):
                                    antd.Icon("CloseOutlined")
                    antd.Divider(size="small")
                    chatbot = pro.Chatbot(
                        # for flex=1 to fill the remaining space
                        height=0,
                        elem_style=dict(flex=1),
                        welcome_config=ChatbotWelcomeConfig(
                            variant="filled",
                            title="👋🏻 Hello, I'm AI Copilot",
                            description="Enter a prompt to get started",
                            prompts=ChatbotPromptsConfig(
                                title="I can help: ",
                                vertical=True,
                                items=[{
                                    "description":
                                    "Help me with a plan to start a business"
                                }, {
                                    "description":
                                    "Help me with a plan to achieve my goals"
                                }, {
                                    "description":
                                    "Help me with a plan for a successful interview"
                                }])),
                        user_config=dict(
                            avatar=
                            "https://api.dicebear.com/7.x/miniavs/svg?seed=3"),
                        bot_config=ChatbotBotConfig(
                            header="Copilot",
                            actions=["copy", "retry"],
                            avatar=
                            "https://api.dicebear.com/7.x/miniavs/svg?seed=2"),
                    )

                    with pro.MultimodalInput(
                            upload_config=MultimodalInputUploadConfig(
                                allow_upload=False)) as input:
                        with ms.Slot("prefix"):
                            with antd.Button(value=None,
                                             color="default",
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
        copilot_open_btn.click(
            fn=open_copilot,
            outputs=[content_col, copilot_col, copilot_open_btn])
        copilot_close_btn.click(
            fn=close_copilot,
            outputs=[content_col, copilot_col, copilot_open_btn])
        gr.on([app.mount, app.resize],
              fn=resize_window,
              outputs=[copilot_open_btn, copilot_close_btn])
if __name__ == "__main__":
    demo.queue().launch()
