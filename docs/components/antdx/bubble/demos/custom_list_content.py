import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

items = [
    {
        "key": '1',
        "role": "ai-markdown",
        "content": "`Hello, world!`"
    },
    {
        "key": '2',
        "role": "ai-error-message",
        "content": "Error message"
    },
    {
        "key":
        '3',
        "role":
        'ai-suggestion',
        "content": [
            {
                "key": '1',
                "description":
                'How to rest effectively after long hours of work?',
            },
            {
                "key":
                '2',
                "description":
                'What are the secrets to maintaining a positive mindset?',
            },
            {
                "key": '3',
                "description": 'How to stay calm under immense pressure?',
            },
        ],
    },
    {
        "key":
        '4',
        "role":
        'ai-file',
        "content": [
            {
                "uid": '1',
                "name": 'excel-file.xlsx',
                "size": 111111,
                "description": 'Checking the data',
            },
            {
                "uid": '2',
                "name": 'word-file.docx',
                "size": 222222,
                "status": 'uploading',
                "percent": 23,
            },
        ],
    },
]

with gr.Blocks() as demo:

    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph(
                "Customize the content of the bubble list, which is very useful for personalized customization scenarios."
            )
            with antdx.Bubble.List(items=items) as bubble_list:
                # Define Roles
                with ms.Slot("roles"):
                    with antdx.Bubble.List.Role(role="ai-markdown",
                                                placement="start"):
                        with ms.Slot("avatar"):
                            with antd.Avatar(elem_style=dict(
                                    backgroundColor="#fde3cf")):
                                with ms.Slot("icon"):
                                    antd.Icon("UserOutlined")
                        with ms.Slot("messageRender",
                                     params_mapping="(content) => content"):
                            ms.Markdown()
                    with antdx.Bubble.List.Role(role="ai-error-message",
                                                placement="start"):
                        with ms.Slot("avatar"):
                            with antd.Avatar(elem_style=dict(
                                    backgroundColor="#fde3cf")):
                                with ms.Slot("icon"):
                                    antd.Icon("UserOutlined")
                        with ms.Slot("messageRender",
                                     params_mapping="(content) => content"):
                            antd.Typography.Text(type="danger")
                    with antdx.Bubble.List.Role(
                            role="ai-suggestion",
                            placement="start",
                            variant="borderless",
                            avatar=dict(style=dict(visibility='hidden'))):
                        with ms.Slot("messageRender",
                                     params_mapping="(items) => ({ items })"):
                            prompts = antdx.Prompts(vertical=True)

                    with antdx.Bubble.List.Role(
                            role="ai-file",
                            placement="start",
                            variant="borderless",
                            avatar=dict(style=dict(visibility='hidden'))):
                        with ms.Slot("messageRender",
                                     params_mapping="""(content) => {
                                            return {
                                                each: content?.map(item => ({ item }))
                                            }
}"""):
                            with antd.Flex(vertical=True, gap="middle"):
                                with ms.Each(as_item="each"):
                                    antdx.Attachments.FileCard()

if __name__ == "__main__":
    demo.queue().launch()
