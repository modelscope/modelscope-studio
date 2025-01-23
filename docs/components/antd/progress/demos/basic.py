import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="small", vertical=True):
                antd.Progress(percent=30)
                antd.Progress(percent=50, status='active')
                antd.Progress(percent=70, status="exception")
                antd.Progress(percent=100)
                antd.Progress(percent=50, show_info=False)
            antd.Divider("Circular progress bar")
            with antd.Flex(gap="small", wrap=True):
                antd.Progress(type="circle", percent=75)
                antd.Progress(type="circle", percent=70, status="exception")
                antd.Progress(type="circle", percent=100)
                antd.Progress(
                    type="circle",
                    percent=100,
                    format=
                    """( percent ) => percent === 100 ? 'Done' : percent + '%' """
                )
            antd.Divider("Progress bar with steps")
            with antd.Flex(gap="small", vertical=True):
                antd.Progress(percent=50, steps=3)
                antd.Progress(percent=30, steps=5)
                antd.Progress(percent=100,
                              steps=5,
                              size="small",
                              stroke_color='#f56a00')
                antd.Progress(percent=60,
                              steps=5,
                              stroke_color=['#f56a00', '#1890ff', '#13c2c2'])

if __name__ == "__main__":
    demo.queue().launch()
