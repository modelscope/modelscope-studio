import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

fooAvatar = {
    "color": '#f56a00',
    "backgroundColor": '#fde3cf',
}

barAvatar = {
    "color": '#fff',
    "backgroundColor": '#87d068',
}

hideAvatar = {
    "visibility": 'hidden',
}

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():

            antdx.Bubble("Hello World!")

            antd.Divider("Placement and avatar")
            with antd.Flex(gap="middle", vertical=True):
                with antdx.Bubble(placement="start",
                                  content="Good morning, how are you?"):
                    with ms.Slot("avatar"):
                        with antd.Avatar(elem_style=fooAvatar):
                            with ms.Slot("icon"):
                                antd.Icon("UserOutlined")
                antdx.Bubble(placement="start",
                             content="What a beautiful day!",
                             avatar=dict(),
                             styles={"avatar": hideAvatar})
                with antdx.Bubble(placement="end",
                                  content="Hi, good morning, I'm fine!"):
                    with ms.Slot("avatar"):
                        with antd.Avatar(elem_style=barAvatar):
                            with ms.Slot("icon"):
                                antd.Icon("UserOutlined")
                antdx.Bubble(placement="end",
                             content="Thank you!",
                             avatar=dict(),
                             styles={"avatar": hideAvatar})

            antd.Divider("Header and footer")

            with antdx.Bubble(
                    "Hello, welcome to use Ant Design X! Just ask if you have any questions.",
                    header="Ant Design X"):
                with ms.Slot("avatar.icon"):
                    antd.Icon("UserOutlined")
                with ms.Slot("footer"):
                    with antd.Space(size="small"):
                        with antd.Button(value=None,
                                         color="default",
                                         variant="text",
                                         size="small"):
                            with ms.Slot("icon"):
                                antd.Icon("SyncOutlined")
                        with antd.Button(value=None,
                                         color="default",
                                         variant="text",
                                         size="small"):
                            with ms.Slot("icon"):
                                antd.Icon("CopyOutlined")

            antd.Divider("Loading")
            with antd.Space():
                ms.Span("Loading State")
                loading_switch = antd.Switch(value=False)
            with antdx.Bubble("hello world !") as loading_bubble:
                with ms.Slot("avatar.icon"):
                    antd.Icon("UserOutlined")

            loading_switch.change(fn=lambda x: gr.update(loading=x),
                                  inputs=[loading_switch],
                                  outputs=[loading_bubble])
            antd.Divider("Markdown")
            with antdx.Bubble():
                with ms.Slot("avatar.icon"):
                    antd.Icon("UserOutlined")
                with ms.Slot("content"):
                    ms.Markdown("Hello `Markdown`!")

if __name__ == "__main__":
    demo.queue().launch()
