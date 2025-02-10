import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def create_bubble_item(i: int):
    is_ai = i % 2 != 0
    content = 'Mock AI content. ' * 20 if is_ai else f'Mock User content `{i}`.'
    return {
        "role": "ai" if is_ai else "user",
        "content": content,
        "key": i - 1
    }


def add_bubble(state_value):
    history_len = len(state_value["history"])
    state_value["history"].append(create_bubble_item(history_len + 1))
    return gr.update(value=state_value), gr.update(
        items=state_value["history"])


def refresh(state_value, e: gr.EventData):
    clicked_key = e._data["component"]["key"]
    gr.Info(f"You clicked refresh button, item {clicked_key}")
    state_value["history"][clicked_key]["content"] = "Refreshed"
    return gr.update(value=state_value), gr.update(
        items=state_value["history"])


def like(state_value, e: gr.EventData):
    clicked_key = e._data["component"]["key"]
    gr.Info(f"You clicked like button, item {clicked_key}")
    state_value["history"][clicked_key]["meta"] = {
        "action": "like",
    }
    return gr.update(value=state_value), gr.update(
        items=state_value["history"])


def dislike(state_value, e: gr.EventData):
    clicked_key = e._data["component"]["key"]
    gr.Info(f"You clicked dislike button, item {clicked_key}")
    state_value["history"][clicked_key]["meta"] = {
        "action": "dislike",
    }
    return gr.update(value=state_value), gr.update(
        items=state_value["history"])


default_history = [
    create_bubble_item(1),
    create_bubble_item(2),
    create_bubble_item(3)
]

with gr.Blocks() as demo:

    with ms.Application():
        state = gr.State({"history": default_history})
        with antdx.XProvider():
            with antd.Flex(gap="small", vertical=True):
                with antd.Flex(gap="small",
                               elem_style=dict(alignSelf="flex-end")):
                    add_bubble_btn = antd.Button("Add Bubble")
                    scroll_btn = antd.Button("Scroll To First")
                with antdx.Bubble.List(items=default_history,
                                       elem_style=dict(maxHeight=500),
                                       elem_id="bubble-list") as bubble_list:
                    # Define Roles
                    with ms.Slot("roles"):
                        with antdx.Bubble.List.Role(
                                role="ai",
                                placement="start",
                                typing=dict(step=5, interval=20),
                                styles=dict(footer=dict(width="100%")),
                                elem_style=dict(maxWidth=600)):
                            with ms.Slot("avatar"):
                                with antd.Avatar(elem_style=dict(
                                        backgroundColor="#fde3cf")):
                                    with ms.Slot("icon"):
                                        antd.Icon("UserOutlined")
                            # use messageRender to render markdown content
                            with ms.Slot(
                                    "messageRender",
                                    params_mapping="""content => content"""):
                                ms.Markdown()

                            # render footer
                            with ms.Slot("footer",
                                         params_mapping="""(item) => {
                                            return { refresh: { key: item.key }, like: { key: item.key, color: item.meta?.action === "like" ? 'primary' : 'default' }, dislike: { key: item.key, color: item.meta?.action === "dislike" ? 'primary' : 'default' } }
                                         }"""):
                                with antd.Button(
                                        value=None,
                                        size="small",
                                        color="default",
                                        variant="text",
                                        as_item="refresh") as refresh_btn:
                                    with ms.Slot("icon"):
                                        antd.Icon("SyncOutlined")
                                refresh_btn.click(fn=refresh,
                                                  inputs=[state],
                                                  outputs=[state, bubble_list])
                                with antd.Button(value=None,
                                                 size="small",
                                                 variant="text",
                                                 as_item="like") as like_btn:
                                    with ms.Slot("icon"):
                                        antd.Icon("SmileOutlined")
                                like_btn.click(fn=like,
                                               inputs=[state],
                                               outputs=[state, bubble_list])
                                with antd.Button(
                                        value=None,
                                        size="small",
                                        variant="text",
                                        as_item="dislike") as dislike_btn:
                                    with ms.Slot("icon"):
                                        antd.Icon("FrownOutlined")
                                dislike_btn.click(fn=dislike,
                                                  inputs=[state],
                                                  outputs=[state, bubble_list])

                        with antdx.Bubble.List.Role(
                                role="user",
                                placement="end",
                        ):
                            with ms.Slot("avatar"):
                                with antd.Avatar(elem_style=dict(
                                        backgroundColor="#87d068")):
                                    with ms.Slot("icon"):
                                        antd.Icon("UserOutlined")
                            with ms.Slot(
                                    "messageRender",
                                    params_mapping="(content) => content"):
                                ms.Markdown()
            add_bubble_btn.click(fn=add_bubble,
                                 inputs=[state],
                                 outputs=[state, bubble_list])
            scroll_btn.click(fn=None,
                             js="""() => {
                const bubbleList = document.getElementById("bubble-list");
                bubbleList.scrollTo({ top:0, behavior:'smooth' });
}""")

if __name__ == "__main__":
    demo.queue().launch()
