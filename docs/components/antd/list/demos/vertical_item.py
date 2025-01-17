import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

data = [{
    'avatar': {
        "src": f'https://api.dicebear.com/7.x/miniavs/svg?seed={i}'
    },
    "link": {
        "href": "https://ant.design",
        "value": f"ant design part {i}"
    },
    "img": {
        "src":
        "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
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


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.List(item_layout="vertical",
                           size="large",
                           data_source=data,
                           pagination=dict(total=len(data),
                                           pageSize=page_size)) as list:
                with ms.Slot("footer"):
                    with ms.Div():
                        antd.Typography.Text('ant design', strong=True)
                        ms.Text("footer part")
                with ms.Slot("renderItem",
                             params_mapping="""(item) => item"""):
                    with antd.List.Item():
                        with ms.Slot("actions"):
                            IconText('StarOutlined', 156)
                            IconText('LikeOutlined', 156)
                            IconText('MessageOutlined', 3)
                        with ms.Slot("extra"):
                            antd.Image(preview=False,
                                       alt="logo",
                                       width=272,
                                       as_item="img")
                        with antd.List.Item.Meta(as_item="meta"):
                            with ms.Slot("avatar"):
                                antd.Avatar(as_item="avatar")
                            with ms.Slot("title"):
                                antd.Typography.Link(as_item="link")
                        ms.Span(as_item="content")

if __name__ == "__main__":
    demo.queue().launch()
