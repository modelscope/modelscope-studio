import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def item_click(e: gr.EventData):
    payload = e._data["payload"]
    gr.Info("You clicked on item " + payload[0]["data"]["key"])


default_vertical = False
default_wrap = False

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            vertical = antd.Switch(value=default_vertical,
                                   checked_children="Vertical",
                                   un_checked_children="Horizontal")
            wrap = antd.Switch(value=default_wrap,
                               checked_children="Wrap",
                               un_checked_children="No Wrap")
            with antdx.Prompts(
                    title="✨ Inspirational Sparks and Marvelous Tips",
                    wrap=default_wrap,
                    vertical=default_vertical) as prompts:
                with antdx.Prompts.Item(
                        key='1',
                        label='Ignite Your Creativity',
                        description='Got any sparks for a new project?',
                        disabled=True):
                    with ms.Slot("icon"):
                        antd.Icon("BulbOutlined",
                                  elem_style={"color": '#FFD700'})
                with antdx.Prompts.Item(
                        key='2',
                        label='Uncover Background Info',
                        description=
                        'Help me understand the background of this topic.',
                ):
                    with ms.Slot("icon"):
                        antd.Icon("InfoCircleOutlined",
                                  elem_style={"color": '#1890FF'})
                with antdx.Prompts.Item(
                        key='3',
                        label='Efficiency Boost Battle',
                        description='How can I work faster and better?',
                ):
                    with ms.Slot("icon"):
                        antd.Icon("RocketOutlined",
                                  elem_style={"color": '#722ED1'})
                with antdx.Prompts.Item(
                        key='4',
                        label='Tell me a Joke',
                        description=
                        'Why do not ants get sick? Because they have tiny ant-bodies!',
                ):
                    with ms.Slot("icon"):
                        antd.Icon("SmileOutlined",
                                  elem_style={"color": '#52C41A'})
                with antdx.Prompts.Item(
                        key='5',
                        label='Common Issue Solutions',
                        description=
                        'How to solve common issues? Share some tips!',
                ):
                    with ms.Slot("icon"):
                        antd.Icon("WarningOutlined",
                                  elem_style={"color": '#FF4D4F'})

            prompts.item_click(fn=item_click)
            vertical.change(fn=lambda x: gr.update(vertical=x),
                            inputs=[vertical],
                            outputs=[prompts])
            wrap.change(fn=lambda x: gr.update(wrap=x),
                        inputs=[wrap],
                        outputs=[prompts])

if __name__ == "__main__":
    demo.queue().launch()
