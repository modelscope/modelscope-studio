import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms


def item_click(e: gr.EventData):
    payload = e._data["payload"]
    gr.Info("You clicked on item " + payload[0]["data"]["key"])


with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider(theme=dict(algorithm=dict(dark=False))):
            with antd.Card(elem_style=dict(borderRadius=0, border=0)):
                with antdx.Prompts(
                        title="Do you want?",
                        wrap=True,
                        styles=dict(item={
                            "flex": 'none',
                            "width": 'calc(30% - 6px)',
                            "backgroundImage":
                            "linear-gradient(137deg, #e5f4ff 0%, #efe7ff 100%)",
                            "border": 0,
                        },
                                    subItem={
                                        "background": 'rgba(255,255,255,0.45)',
                                        "border": '1px solid #FFF',
                                    })) as prompts:
                    with antdx.Prompts.Item(
                            key='1',
                            description='What are you interested in?',
                    ):
                        with ms.Slot("label"):
                            with antd.Space():
                                antd.Icon("FireOutlined",
                                          elem_style={"color": '#FF4D4F'})
                                ms.Text("Hot Topics")
                        antdx.Prompts.Item(key="1-1",
                                           description="What's new in X?")
                        antdx.Prompts.Item(key="1-2",
                                           description="What's AGI?")
                        antdx.Prompts.Item(key="1-3",
                                           description="Where is the doc?")
                    with antdx.Prompts.Item(
                            key='2',
                            description='How to design a good product?',
                    ):
                        with ms.Slot("label"):
                            with antd.Space():
                                antd.Icon("ReadOutlined",
                                          elem_style={"color": '#1890FF'})
                                ms.Text("Design Guide")
                        with antdx.Prompts.Item(key="2-1",
                                                description="Know the well"):
                            with ms.Slot("icon"):
                                antd.Icon("HeartOutlined")
                        with antdx.Prompts.Item(key="2-2",
                                                description="Set the AI role"):
                            with ms.Slot("icon"):
                                antd.Icon("SmileOutlined")
                        with antdx.Prompts.Item(
                                key="2-3", description="Express the feeling"):
                            with ms.Slot("icon"):
                                antd.Icon("CommentOutlined")
                    with antdx.Prompts.Item(
                            key='3',
                            description='How to start a new project?',
                    ):
                        with ms.Slot("label"):
                            with antd.Space():
                                antd.Icon("RocketOutlined",
                                          elem_style={"color": '#722ED1'})
                                ms.Text("Start Creating")
                        antdx.Prompts.Item(key="3-1",
                                           label='Fast Start',
                                           description="Install Ant Design X")
                        antdx.Prompts.Item(
                            key="3-2",
                            label='Online Playground',
                            description="Play on the web without installing")

                prompts.item_click(fn=item_click)

if __name__ == "__main__":
    demo.queue().launch()
