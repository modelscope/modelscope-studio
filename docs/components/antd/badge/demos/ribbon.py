import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(direction="vertical",
                            size="middle",
                            elem_style=dict(width="100%")):
                with antd.Badge.Ribbon(text="Hippies"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="pink"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="red"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="cyan"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="green"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="purple"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="volcano"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")

                with antd.Badge.Ribbon(text="Hippies", color="magenta"):
                    with antd.Card(title="Pushes open the window",
                                   size="small"):
                        ms.Text("and raises the spyglass.")
if __name__ == "__main__":
    demo.queue().launch()
