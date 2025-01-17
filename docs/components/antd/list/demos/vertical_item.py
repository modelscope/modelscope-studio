import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    'avatar':
    f'https://api.dicebear.com/7.x/miniavs/svg?seed={i}',
    "link": {
        "href": "https://ant.design",
        "value": f"ant design part {i}"
    },
    "meta": {
        'description':
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    },
    'content':
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
} for i in range(10)]

page_size = 3


def IconText(icon: str, text: str):
    with antd.Space():
        antd.Icon(icon)
        ms.Text(text)


def on_pagination_change(e: gr.EventData):
    current = e._data["payload"][0]
    return gr.update(value=data[(current - 1) * 3:current * 3])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.List(item_layout="vertical",
                           size="large",
                           pagination=dict(total=len(data),
                                           pageSize=page_size)) as list:
                with ms.Slot("footer"):
                    with ms.Div():
                        antd.Typography.Text('ant design', strong=True)
                        ms.Text("footer part")
                with ms.Each(value=data[0:3]) as list_items:
                    with antd.List.Item():
                        with ms.Slot("actions"):
                            IconText('StarOutlined', 156)
                            IconText('LikeOutlined', 156)
                            IconText('MessageOutlined', 2)
                        with ms.Slot("extra"):
                            antd.Image(
                                "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
                                preview=False,
                                alt="logo",
                                width=272)
                        with antd.List.Item.Meta(as_item="meta"):
                            with ms.Slot("avatar"):
                                antd.Avatar(as_item="avatar")
                            with ms.Slot("title"):
                                antd.Typography.Link(as_item="link")
                        ms.Text(as_item="content")
            list.pagination_change(fn=on_pagination_change,
                                   outputs=[list_items])
if __name__ == "__main__":
    demo.queue().launch()
