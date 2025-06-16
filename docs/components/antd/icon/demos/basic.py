import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space():
                antd.Icon("HomeOutlined")
                antd.Icon("SettingFilled")
                antd.Icon("SmileOutlined")
                antd.Icon("SyncOutlined", spin=True)
                antd.Icon("SmileOutlined", rotate=180)
                antd.Icon("LoadingOutlined")
                antd.Icon("SmileTwoTone")
                icon = antd.Icon("HeartTwoTone", two_tone_color="#eb2f96")
                icon.click(lambda: print("clicked"))
            antd.Divider("Custom Icon")
            with antd.Icon():
                with ms.Slot("component"):
                    ms.Text("🔥")
if __name__ == "__main__":
    demo.queue().launch()
