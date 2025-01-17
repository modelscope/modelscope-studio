import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Upload(list_type="picture-card",
                             max_count=1,
                             show_upload_list=False,
                             accept="image/*") as upload:
                image = antd.Image(elem_style=dict(width="100%"),
                                   preview=False,
                                   visible=False)
                with ms.Div(visible=True) as btn:
                    antd.Icon("PlusOutlined")
                    ms.Div("Upload", elem_style=dict(marginTop=8))

                def on_change(_upload):
                    return gr.update(value=[]), gr.update(
                        visible=True,
                        value=None if not _upload else _upload[0]), gr.update(
                            visible=False)

                upload.change(fn=on_change,
                              inputs=[upload],
                              outputs=[upload, image, btn])

if __name__ == "__main__":
    demo.queue().launch()
