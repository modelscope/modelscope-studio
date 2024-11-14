import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

description = "This is a description."


def on_next(_state):
    _state["current"] += 1
    return {
        steps: gr.update(current=_state["current"]),
        prev_btn: gr.update(visible=True if _state["current"] > 0 else False),
        next_btn: gr.update(visible=True if _state["current"] < 3 else False)
    }


def on_prev(_state):
    _state["current"] -= 1
    return {
        steps: gr.update(current=_state["current"]),
        prev_btn: gr.update(visible=True if _state["current"] > 0 else False),
        next_btn: gr.update(visible=True if _state["current"] < 3 else False)
    }


with gr.Blocks() as demo:
    state = gr.State({"current": 0})
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Steps(0) as steps:
                antd.Steps.Item(title="Waiting", description=description)
                antd.Steps.Item(title="In Progress",
                                sub_title="Left 00:00:08",
                                description=description)
                antd.Steps.Item(title="Finished", description=description)
            prev_btn = antd.Button("Prev", visible=False)
            next_btn = antd.Button("Next", type="primary")

            prev_btn.click(fn=on_prev,
                           inputs=[state],
                           outputs=[steps, prev_btn, next_btn])
            next_btn.click(fn=on_next,
                           inputs=[state],
                           outputs=[steps, prev_btn, next_btn])

if __name__ == "__main__":
    demo.queue().launch()
