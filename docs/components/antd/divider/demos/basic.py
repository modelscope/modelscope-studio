import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            ms.Div(
                " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi istaprobare, quae sunt a te dicta? Refert tamen, quo modo."
            )
            antd.Divider("Solid", elem_style=dict(borderColor='#7cb305'))
            ms.Div(
                " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi istaprobare, quae sunt a te dicta? Refert tamen, quo modo."
            )
            with antd.Divider(elem_style=dict(borderColor='#7cb305'),
                              variant="dotted"):
                ms.Text("Dotted")
            ms.Div(
                " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi istaprobare, quae sunt a te dicta? Refert tamen, quo modo."
            )
            with antd.Divider(elem_style=dict(borderColor='#7cb305'),
                              variant="dashed"):
                ms.Text("Dashed")
            ms.Div(
                " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi istaprobare, quae sunt a te dicta? Refert tamen, quo modo."
            )
if __name__ == "__main__":
    demo.queue().launch()
