import time

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def get_bubble_items(count):
    result = []
    for i in range(count):
        is_ai = i % 2 != 0
        content = 'Mock AI content. ' * 20 if is_ai else f'Mock User content `{i}`.'
        result.append({
            "role": "ai" if is_ai else "user",
            "content": content,
            "key": i - 1
        })
    time.sleep(2)
    return result


def add_bubble(state_value):
    state_value["history_count"] = state_value["history_count"] + 1
    return gr.update(value=state_value), gr.update(
        items=get_bubble_items(state_value["history_count"]))


with gr.Blocks() as demo:

    with ms.Application():
        state = gr.State({"history_count": 3})
        with antdx.XProvider(), ms.AutoLoading():
            antd.Typography.Paragraph(
                "Preset Bubble list. Support auto scroll. Use role to set default properties of Bubble."
            )
            with antd.Flex(gap="small", vertical=True):
                with antd.Flex(gap="small",
                               elem_style=dict(alignSelf="flex-end")):
                    add_bubble_btn = antd.Button("Add Bubble")
                with antdx.Bubble.List(
                        items=get_bubble_items(3),
                        elem_style={"height": 300},
                        class_names=dict(scroll="bubble-list")) as bubble_list:
                    # Define Role
                    with ms.Slot("role"):
                        with antdx.Bubble.List.Role(
                                role="ai",
                                placement="start",
                                typing=dict(step=5, interval=20),
                                elem_style=dict(maxWidth=600)):
                            with ms.Slot("avatar"):
                                with antd.Avatar(elem_style=dict(
                                        backgroundColor="#fde3cf")):
                                    with ms.Slot("icon"):
                                        antd.Icon("UserOutlined")
                            # use contentRender to render markdown content
                            with ms.Slot(
                                    "contentRender",
                                    params_mapping="""content => content"""):
                                ms.Markdown()

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
                                    "contentRender",
                                    params_mapping="(content) => content"):
                                ms.Markdown()
            add_bubble_btn.click(fn=add_bubble,
                                 inputs=[state],
                                 outputs=[state, bubble_list])

if __name__ == "__main__":
    demo.queue().launch()
