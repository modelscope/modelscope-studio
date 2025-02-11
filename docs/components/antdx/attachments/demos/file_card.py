import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

file_list = [
    {
        "uid": '1',
        "name": 'excel-file.xlsx',
        "size": 111111,
    },
    {
        "uid": '2',
        "name": 'word-file.docx',
        "size": 222222,
    },
    {
        "uid": '3',
        "name": 'image-file.png',
        "size": 333333,
    },
    {
        "uid": '4',
        "name": 'pdf-file.pdf',
        "size": 444444,
    },
    {
        "uid": '5',
        "name": 'ppt-file.pptx',
        "size": 555555,
    },
    {
        "uid": '6',
        "name": 'video-file.mp4',
        "size": 666666,
    },
    {
        "uid": '7',
        "name": 'audio-file.mp3',
        "size": 777777,
    },
    {
        "uid": '8',
        "name": 'zip-file.zip',
        "size": 888888,
    },
    {
        "uid": '9',
        "name": 'markdown-file.md',
        "size": 999999,
        "description": 'Custom description here',
    },
    {
        "uid": '10',
        "name": 'image-file.png',
        "thumbUrl":
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        "url":
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        "size": 123456,
    },
]
with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            with antd.Flex(vertical=True, gap="middle"):
                for file in file_list:
                    antdx.Attachments.FileCard(item=file)

if __name__ == "__main__":
    demo.queue().launch()
