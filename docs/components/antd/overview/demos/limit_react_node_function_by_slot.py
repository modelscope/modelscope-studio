import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Statistic(title="Active Users", value=112893):
                with ms.Slot("formatter",
                             params_mapping="(value) => ({ text: { value }})"):
                    antd.Typography.Text(type="success", as_item="text")

if __name__ == "__main__":
    demo.queue().launch()
