import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_custom(e: gr.EventData):
    print(e._data)


with gr.Blocks() as demo:
    with ms.Application() as app:
        with antd.ConfigProvider():
            antd.Input(show_count=dict(formatter="""({ count }) => {
                    window.ms_globals.dispatch({ type: "input_count_change", payload: count });
                    return `${count} characters`;
                }"""))
    app.custom(on_custom)

if __name__ == "__main__":
    demo.queue().launch()
