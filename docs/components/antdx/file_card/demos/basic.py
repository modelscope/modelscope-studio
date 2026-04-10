import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antdx.XProvider():
            antd.Divider("File Types")
            with antd.Flex(gap="middle", wrap=True):
                antdx.FileCard(filename="document.pdf",
                               type="file",
                               icon="pdf",
                               byte=204800)
                antdx.FileCard(filename="spreadsheet.xlsx",
                               type="file",
                               icon="excel",
                               byte=102400)
                antdx.FileCard(filename="presentation.pptx",
                               type="file",
                               icon="ppt",
                               byte=512000)
                antdx.FileCard(filename="report.docx",
                               type="file",
                               icon="word",
                               byte=81920)
                antdx.FileCard(filename="archive.zip",
                               type="file",
                               icon="zip",
                               byte=1048576)
                antdx.FileCard(filename="README.md",
                               type="file",
                               icon="markdown",
                               byte=4096)
                antdx.FileCard(filename="script.py",
                               type="file",
                               icon="python",
                               byte=8192)

            antd.Divider("Image Type")
            with antd.Flex(gap="middle", wrap=True):
                antdx.FileCard(
                    filename="photo.jpg",
                    type="image",
                    src=
                    "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
                    byte=327680)

            antd.Divider("Loading State")
            with antd.Flex(gap="middle", wrap=True):
                antdx.FileCard(filename="loading-file.pdf",
                               type="file",
                               icon="pdf",
                               loading=True)

            antd.Divider("With Description")
            with antd.Flex(gap="middle", wrap=True):
                antdx.FileCard(filename="notes.txt",
                               type="file",
                               description="Last modified today",
                               byte=2048)

            antd.Divider("FileCard.List")
            antdx.FileCard.List(items=[{
                "filename": "file1.pdf",
                "type": "file",
                "icon": "pdf",
                "byte": 204800
            }, {
                "filename": "image1.jpg",
                "type": "image",
                "byte": 327680
            }, {
                "filename": "audio.mp3",
                "type": "audio",
                "byte": 5242880
            }, {
                "filename": "video.mp4",
                "type": "video",
                "byte": 52428800
            }],
                                removable=True)

            antd.Divider("FileCard.List with Custom Items")
            with antdx.FileCard.List(removable=True):
                antdx.FileCard.List.Item(filename="custom1.xlsx",
                                         type="file",
                                         icon="excel",
                                         byte=102400)
                antdx.FileCard.List.Item(filename="custom2.pdf",
                                         type="file",
                                         icon="pdf",
                                         byte=204800)

if __name__ == "__main__":
    demo.queue().launch()
