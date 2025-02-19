import base64
import os
import uuid

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms
from openai import OpenAI

# =========== Configuration

# API KEY
MODELSCOPE_ACCESS_TOKEN = os.getenv('MODELSCOPE_ACCESS_TOKEN')

client = OpenAI(
    base_url='https://api-inference.modelscope.cn/v1/',
    api_key=MODELSCOPE_ACCESS_TOKEN,
)

model = "Qwen/Qwen2.5-VL-72B-Instruct"

# =========== Configuration

DEFAULT_PROMPTS = [{
    "category":
    "🖋 Make a plan",
    "prompts": [
        "Help me with a plan to start a business",
        "Help me with a plan to achieve my goals",
        "Help me with a plan for a successful interview"
    ]
}, {
    "category":
    "📅 Help me write",
    "prompts": [
        "Help me write a story with a twist ending",
        "Help me write a blog post on mental health",
        "Help me write a letter to my future self"
    ]
}]

DEFAULT_SUGGESTIONS = [{
    "label":
    'Make a plan',
    "value":
    "Make a plan",
    "children": [{
        "label": "Start a business",
        "value": "Help me with a plan to start a business"
    }, {
        "label": "Achieve my goals",
        "value": "Help me with a plan to achieve my goals"
    }, {
        "label": "Successful interview",
        "value": "Help me with a plan for a successful interview"
    }]
}, {
    "label":
    'Help me write',
    "value":
    "Help me write",
    "children": [{
        "label": "Story with a twist ending",
        "value": "Help me write a story with a twist ending"
    }, {
        "label": "Blog post on mental health",
        "value": "Help me write a blog post on mental health"
    }, {
        "label": "Letter to my future self",
        "value": "Help me write a letter to my future self"
    }]
}]

DEFAULT_CONVERSATIONS_HISTORY = [{"role": "placeholder"}]

DEFAULT_LOCALE = 'en_US'

DEFAULT_THEME = {
    "token": {
        "colorPrimary": "#6A57FF",
    }
}


class Gradio_Events:

    @staticmethod
    def submit(state_value):
        # Define your code here
        # The best way is to use the image url.
        def image_to_base64(image_path):
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(
                    image_file.read()).decode('utf-8')
            return f"data:image/jpeg;base64,{encoded_string}"

        def format_history(history):
            messages = [{
                "role": "system",
                "content": "You are a helpful and harmless assistant.",
            }]
            for item in history:
                if item["role"] == "user":
                    messages.append({
                        "role":
                        "user",
                        "content": [{
                            "type": "text",
                            "text": item["content"]["text"]
                        }] + [{
                            "type": "image_url",
                            "image_url": image_to_base64(file["path"])
                        } for file in item["content"]["files"]]
                    })
                elif item["role"] == "assistant":
                    messages.append(item)
            return messages

        history = state_value["conversations_histories"][
            state_value["conversation_id"]]
        history_messages = format_history(history)

        history.append({
            "role": "assistant",
            "content": "",
            "meta": {},
            "loading": True,
        })

        yield {
            chatbot: gr.update(items=history),
            state: gr.update(value=state_value),
        }
        try:
            response = client.chat.completions.create(
                model=model,  # ModelScope Model-Id
                messages=history_messages,
                stream=True)
            for chunk in response:
                history[-1]["content"] += chunk.choices[0].delta.content
                history[-1]["loading"] = False
                yield {
                    chatbot: gr.update(items=history),
                    state: gr.update(value=state_value)
                }
            history[-1]["meta"]["end"] = True
            yield {
                chatbot: gr.update(items=history),
                state: gr.update(value=state_value),
            }
        except Exception as e:
            history[-1]["loading"] = False
            history[-1]["content"] = ""
            history[-1]["role"] = "assistant-error"
            yield {
                chatbot: gr.update(items=history),
                state: gr.update(value=state_value)
            }
            raise e

    @staticmethod
    def preprocess_submit(sender_value, attachments_value, state_value):
        if not state_value["conversation_id"]:
            random_id = str(uuid.uuid4())
            history = []
            state_value["conversation_id"] = random_id
            state_value["conversations_histories"][random_id] = history
            state_value["conversations"].append({
                "label": sender_value,
                "key": random_id
            })

        history = state_value["conversations_histories"][
            state_value["conversation_id"]]
        history.append({
            "role":
            "user",
            "content":
            dict(text=sender_value,
                 files=[
                     dict(path=f, size=os.path.getsize(f))
                     for f in attachments_value
                 ])
        })
        return {
            add_conversation_btn:
            gr.update(disabled=True),
            sender:
            gr.update(value=None, loading=True),
            attachments:
            gr.update(value=[]),
            attachments_badge:
            gr.update(dot=False),
            clear_btn:
            gr.update(disabled=True),
            conversations:
            gr.update(active_key=state_value["conversation_id"],
                      items=list(
                          map(
                              lambda item: {
                                  **item,
                                  "disabled":
                                  True if item["key"] != state_value[
                                      "conversation_id"] else False,
                              }, state_value["conversations"]))),
            conversation_delete_menu_item:
            gr.update(disabled=True),
            state:
            gr.update(value=state_value),
        }

    @staticmethod
    def postprocess_submit(state_value):
        return {
            sender: gr.update(loading=False),
            conversation_delete_menu_item: gr.update(disabled=False),
            clear_btn: gr.update(disabled=False),
            conversations: gr.update(items=state_value["conversations"]),
            add_conversation_btn: gr.update(disabled=False)
        }

    @staticmethod
    def cancel(state_value):
        history = state_value["conversations_histories"][
            state_value["conversation_id"]]
        history[-1]["loading"] = False
        history[-1]["meta"]["end"] = True
        return {
            **Gradio_Events.postprocess_submit(state_value),
            chatbot:
            gr.update(items=state_value["conversations_histories"][
                state_value["conversation_id"]]),
            state:
            gr.update(value=state_value),
        }

    @staticmethod
    def select_suggestion(sender_value, e: gr.EventData):
        return gr.update(value=sender_value[:-1] + e._data["payload"][0])

    @staticmethod
    def apply_prompt(e: gr.EventData):
        return gr.update(value=e._data["payload"][0]["data"]["description"])

    @staticmethod
    def new_chat(state_value):
        if not state_value["conversation_id"]:
            return gr.skip()
        state_value["conversation_id"] = ""
        return gr.update(active_key=state_value["conversation_id"]), gr.update(
            items=DEFAULT_CONVERSATIONS_HISTORY), gr.update(value=state_value)

    @staticmethod
    def select_conversation(state_value, e: gr.EventData):
        active_key = e._data["payload"][0]
        if state_value["conversation_id"] == active_key or (
                active_key not in state_value["conversations_histories"]):
            return gr.skip()
        state_value["conversation_id"] = active_key
        return gr.update(active_key=active_key), gr.update(
            items=state_value["conversations_histories"]
            [active_key]), gr.update(value=state_value)

    @staticmethod
    def click_conversation_menu(state_value, e: gr.EventData):
        conversation_id = e._data["payload"][0]["key"]
        operation = e._data["payload"][1]["key"]
        if operation == "delete":
            del state_value["conversations_histories"][conversation_id]

            state_value["conversations"] = [
                item for item in state_value["conversations"]
                if item["key"] != conversation_id
            ]

            if state_value["conversation_id"] == conversation_id:
                state_value["conversation_id"] = ""
                return gr.update(
                    items=state_value["conversations"],
                    active_key=state_value["conversation_id"]), gr.update(
                        items=DEFAULT_CONVERSATIONS_HISTORY), gr.update(
                            value=state_value)
            else:
                return gr.update(
                    items=state_value["conversations"]), gr.skip(), gr.update(
                        value=state_value)
        return gr.skip()

    @staticmethod
    def clear_conversation_history(state_value):
        if not state_value["conversation_id"]:
            return gr.skip()
        state_value["conversations_histories"][
            state_value["conversation_id"]] = []
        return gr.update(items=DEFAULT_CONVERSATIONS_HISTORY), gr.update(
            value=state_value)

    @staticmethod
    def toggle_attachments(state_value, attachments_value):
        state_value["attachments_open"] = not state_value["attachments_open"]
        return gr.update(open=state_value["attachments_open"]), gr.update(
            dot=len(attachments_value) > 0
            and not state_value["attachments_open"]), gr.update(
                value=state_value)

    @staticmethod
    def paste_file(attachments_value, state_value, e: gr.EventData):
        state_value["attachments_open"] = True
        return gr.update(value=attachments_value +
                         e._data["payload"][0]), gr.update(
                             open=True), gr.update(value=state_value)


css = """
#chatbot {
  height: calc(100vh - 32px - 21px - 16px);
}

#chatbot .chatbot-conversations {
  height: 100%;
  background-color: var(--ms-gr-ant-color-bg-layout);
}

#chatbot .chatbot-conversations .chatbot-conversations-list {
  padding-left: 0;
  padding-right: 0;
}

#chatbot .chatbot-chat {
  padding: 32px;
  height: 100%;
}

@media (max-width: 768px) {
  #chatbot .chatbot-chat {
      padding: 0;
  }
}

#chatbot .chatbot-chat .chatbot-chat-messages {
  flex: 1;
}
#chatbot .chatbot-sender-actions .ms-gr-ant-sender-actions-btn-loading-button {
  color: var(--ms-gr-ant-color-primary);
}
"""


def logo():
    with antd.Typography.Title(level=1,
                               elem_style=dict(fontSize=24,
                                               padding=8,
                                               margin=0)):
        with antd.Flex(align="center", gap="small", justify="center"):
            antd.Image(
                "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original",
                preview=False,
                alt="logo",
                width=24,
                height=24)
            ms.Span("Chatbot")


with gr.Blocks(css=css) as demo:
    state = gr.State({
        "conversations_histories": {},
        "conversations": [],
        "conversation_id": "",
        "attachments_open": False,
    })
    with ms.Application(), antdx.XProvider(
            theme=DEFAULT_THEME, locale=DEFAULT_LOCALE), ms.AutoLoading():
        with antd.Row(gutter=[20, 20], wrap=False, elem_id="chatbot"):
            # Left Column
            with antd.Col(md=dict(flex="0 0 260px", span=24, order=0),
                          span=0,
                          order=1,
                          elem_classes="chatbot-conversations"):
                with antd.Flex(vertical=True,
                               gap="small",
                               elem_style=dict(height="100%")):
                    # Logo
                    logo()

                    # New Conversation Button
                    with antd.Button(color="primary",
                                     variant="filled",
                                     block=True) as add_conversation_btn:
                        ms.Text("New Conversation")
                        with ms.Slot("icon"):
                            antd.Icon("PlusOutlined")

                    # Conversations List
                    with antdx.Conversations(
                            elem_classes="chatbot-conversations-list",
                    ) as conversations:
                        with ms.Slot('menu.items'):
                            with antd.Menu.Item(
                                    label="Delete", key="delete", danger=True
                            ) as conversation_delete_menu_item:
                                with ms.Slot("icon"):
                                    antd.Icon("DeleteOutlined")
            # Right Column
            with antd.Col(flex=1, elem_style=dict(height="100%")):
                with antd.Flex(vertical=True, elem_classes="chatbot-chat"):
                    # Chatbot
                    with antdx.Bubble.List(
                            items=DEFAULT_CONVERSATIONS_HISTORY,
                            elem_classes="chatbot-chat-messages") as chatbot:
                        # Define Chatbot Roles
                        with ms.Slot("roles"):
                            # Placeholder Role
                            with antdx.Bubble.List.Role(
                                    role="placeholder",
                                    styles=dict(content=dict(width="100%")),
                                    variant="borderless"):
                                with ms.Slot("messageRender"):
                                    with antd.Space(
                                            direction="vertical",
                                            size=16,
                                            elem_style=dict(width="100%")):
                                        antdx.Welcome(
                                            styles=dict(icon=dict(
                                                flexShrink=0)),
                                            variant="borderless",
                                            icon=
                                            "https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp",
                                            title=f"Hello, I'm {model}",
                                            description=
                                            "You can upload images and text to get started.",
                                        )
                                        with antdx.Prompts(
                                                title=
                                                "How can I help you today?",
                                                styles={
                                                    "list": {
                                                        "width": '100%',
                                                    },
                                                    "item": {
                                                        "flex": 1,
                                                    },
                                                }) as prompts:
                                            for item in DEFAULT_PROMPTS:
                                                with antdx.Prompts.Item(
                                                        label=item["category"]
                                                ):
                                                    for prompt in item[
                                                            "prompts"]:
                                                        antdx.Prompts.Item(
                                                            description=prompt,
                                                        )

                            # User Role
                            with antdx.Bubble.List.Role(
                                    role="user",
                                    placement="end",
                                    styles=dict(content=dict(
                                        maxWidth="100%",
                                        overflow='auto',
                                    ))):
                                with ms.Slot("avatar"):
                                    with antd.Avatar():
                                        with ms.Slot("icon"):
                                            antd.Icon("UserOutlined")
                                with ms.Slot("messageRender",
                                             params_mapping="""(content) => {
                                          if (typeof content === 'string') {
                                            return { content, files: [], files_container: { style: { display: 'none' }} }
                                          }
                                          return { content: content.text, files_container: content.files?.length > 0 ? undefined : { style: { display: 'none' }}, files: (content.files || []).map(file => ({ item: file }))}
                                        }"""):
                                    with antd.Flex(vertical=True,
                                                   gap="middle"):
                                        with antd.Flex(
                                                gap="middle",
                                                wrap=True,
                                                as_item="files_container"):
                                            with ms.Each(as_item="files"):
                                                antdx.Attachments.FileCard()
                                        ms.Markdown(as_item="content")
                            # Chatbot Role
                            with antdx.Bubble.List.Role(
                                    role="assistant",
                                    placement="start",
                                    styles=dict(content=dict(
                                        maxWidth="100%", overflow='auto'))):
                                with ms.Slot("avatar"):
                                    with antd.Avatar():
                                        with ms.Slot("icon"):
                                            antd.Icon("RobotOutlined")
                                with ms.Slot(
                                        "messageRender",
                                        params_mapping=
                                        "(content) => ({ value: content })"):
                                    ms.Markdown()
                                with ms.Slot("footer",
                                             params_mapping="""(bubble) => {
                                            return bubble?.meta?.end ? { copyable: { text: bubble.content, tooltips: false } } : { style: { display: 'none' } }
                                        }"""):
                                    with antd.Typography.Text(copyable=dict(
                                            tooltips=False)):
                                        with ms.Slot("copyable.icon"):
                                            with antd.Button(value=None,
                                                             size="small",
                                                             color="default",
                                                             variant="text"):
                                                with ms.Slot("icon"):
                                                    antd.Icon("CopyOutlined")
                                            with antd.Button(value=None,
                                                             size="small",
                                                             color="default",
                                                             variant="text"):
                                                with ms.Slot("icon"):
                                                    antd.Icon("CheckOutlined")
                            # Error Chatbot Role
                            with antdx.Bubble.List.Role(
                                    role="assistant-error",
                                    placement="start",
                                    styles=dict(content=dict(
                                        maxWidth="100%", overflow='auto'))):
                                with ms.Slot("avatar"):
                                    with antd.Avatar():
                                        with ms.Slot("icon"):
                                            antd.Icon("RobotOutlined")
                                with ms.Slot("messageRender"):
                                    antd.Typography.Text(
                                        "Failed to respond, please try again.",
                                        type="danger")
                    # Sender
                    with antdx.Suggestion(
                            items=DEFAULT_SUGGESTIONS,
                            # onKeyDown Handler in Javascript
                            should_trigger="""(e, { onTrigger, onKeyDown }) => {
                      switch(e.key) {
                        case '/':
                          onTrigger()
                          break
                        case 'ArrowRight':
                        case 'ArrowLeft':
                        case 'ArrowUp':
                        case 'ArrowDown':
                          break;
                        default:
                          onTrigger(false)
                      }
                      onKeyDown(e)
                    }""") as suggestion:
                        with ms.Slot("children"):
                            with antdx.Sender(
                                    class_names=dict(
                                        actions="chatbot-sender-actions"),
                                    placeholder="Enter / to get suggestions"
                            ) as sender:
                                with ms.Slot("prefix"):
                                    # Attachments Button
                                    with antd.Tooltip(
                                            title="Upload Attachments"):
                                        with antd.Badge(dot=False
                                                        ) as attachments_badge:
                                            with antd.Button(
                                                    value=None, type="text"
                                            ) as attachments_btn:
                                                with ms.Slot("icon"):
                                                    antd.Icon("LinkOutlined")
                                    # Clear Button
                                    with antd.Tooltip(
                                            title="Clear Conversation History"
                                    ):
                                        with antd.Button(
                                                value=None,
                                                type="text") as clear_btn:
                                            with ms.Slot("icon"):
                                                antd.Icon("ClearOutlined")
                                # Attachments
                                with ms.Slot("header"):
                                    with antdx.Sender.Header(
                                            title="Attachments",
                                            open=False,
                                            styles={
                                                "content": {
                                                    "padding": 0,
                                                },
                                            }) as sender_header:
                                        with antdx.Attachments(
                                                max_count=6,
                                                accept="image/*",
                                                multiple=True) as attachments:
                                            with ms.Slot(
                                                    "placeholder.title",
                                                    params_mapping=
                                                    """(type) => type === 'drop' ? 'Drop file here' : 'Upload files'"""
                                            ):
                                                ms.Span()
                                            with ms.Slot(
                                                    "placeholder.description",
                                                    params_mapping=
                                                    "(type) => ({ style: { display: type === 'drop'? 'none' : undefined } })"
                                            ):
                                                ms.Span(
                                                    "Click or drag files to this area to upload"
                                                )
                                            with ms.Slot(
                                                    "placeholder.icon",
                                                    params_mapping=
                                                    "(type) => ({ style: { display: type === 'drop'? 'none' : undefined } })"
                                            ):
                                                antd.Icon(
                                                    "CloudUploadOutlined")

    # Events Handler
    add_conversation_btn.click(fn=Gradio_Events.new_chat,
                               inputs=[state],
                               outputs=[conversations, chatbot, state])
    conversations.active_change(fn=Gradio_Events.select_conversation,
                                inputs=[state],
                                outputs=[conversations, chatbot, state])
    conversations.menu_click(fn=Gradio_Events.click_conversation_menu,
                             inputs=[state],
                             outputs=[conversations, chatbot, state])
    prompts.item_click(fn=Gradio_Events.apply_prompt, outputs=[sender])

    attachments_btn.click(fn=Gradio_Events.toggle_attachments,
                          inputs=[state, attachments],
                          outputs=[sender_header, attachments_badge, state])
    clear_btn.click(fn=Gradio_Events.clear_conversation_history,
                    inputs=[state],
                    outputs=[chatbot, state])
    sender_header.open_change(
        fn=Gradio_Events.toggle_attachments,
        inputs=[state, attachments],
        outputs=[sender_header, attachments_badge, state])
    suggestion.select(fn=Gradio_Events.select_suggestion,
                      inputs=[sender],
                      outputs=[sender])

    sender.paste_file(fn=Gradio_Events.paste_file,
                      inputs=[attachments, state],
                      outputs=[attachments, sender_header, state])

    submit_event = sender.submit(fn=Gradio_Events.preprocess_submit,
                                 inputs=[sender, attachments, state],
                                 outputs=[
                                     sender, attachments, attachments_badge,
                                     clear_btn, conversation_delete_menu_item,
                                     add_conversation_btn, conversations, state
                                 ]).then(fn=Gradio_Events.submit,
                                         inputs=[state],
                                         outputs=[chatbot, state])
    submit_event.then(fn=Gradio_Events.postprocess_submit,
                      inputs=[state],
                      outputs=[
                          sender, conversation_delete_menu_item, clear_btn,
                          conversations, add_conversation_btn
                      ])
    sender.cancel(fn=None, cancels=[submit_event])
    sender.cancel(fn=Gradio_Events.cancel,
                  inputs=[state],
                  outputs=[
                      sender, conversation_delete_menu_item, clear_btn,
                      conversations, add_conversation_btn, chatbot, state
                  ])

if __name__ == "__main__":
    demo.queue().launch(ssr_mode=False)
