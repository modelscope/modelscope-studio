import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.antdx as antdx
import modelscope_studio.components.base as ms

text = "Ant Design X love you! "


def repeat(state_value):
    if state_value["repeat"] < 5:
        state_value["repeat"] = state_value["repeat"] + 1
    else:
        state_value["repeat"] = 1
    return gr.update(value=state_value), gr.update(
        value=f"Repeat {state_value["repeat"]} Times"), gr.update(
            content=text * state_value["repeat"]), gr.update(content=text * state_value["repeat"])


with gr.Blocks() as demo:
    state = gr.State({"repeat": 1})
    with ms.Application():
        with antdx.XProvider():
            antd.Typography.Paragraph("Enable typing output by setting the typing prop. If the updated content is a subset of the previous content, it will continue to output, otherwise it will output again.")
            with antd.Flex(vertical=True, gap="small"):
                with antdx.Bubble(content=text,
                                  typing=dict(step=2, interval=50)) as bubble1:
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                with antdx.Bubble(content=text,
                                  typing=dict(step=2, interval=50,
                                              suffix="💗")) as bubble2:
                    with ms.Slot("avatar.icon"):
                        antd.Icon("UserOutlined")
                btn = antd.Button("Repeat 1 Times",
                                  elem_style=dict(alignSelf="flex-end"))
                btn.click(fn=repeat,
                          inputs=[state],
                          outputs=[state, btn, bubble1, bubble2])

if __name__ == "__main__":
    demo.queue().launch()
