import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_change(e: gr.EventData, state_value):
    page = e._data["payload"][0]
    page_size = e._data["payload"][1]
    state_value["page"] = page
    state_value["page_size"] = page_size
    return state_value


def on_click(state_value):
    gr.Info(
        f"Page: {state_value['page']}, Page Size: {state_value['page_size']}")


with gr.Blocks() as demo:
    state = gr.State({"page": 1, "page_size": 10})
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(vertical=True, gap="middle"):
                pagination = antd.Pagination(
                    total=85,
                    show_quick_jumper=True,
                    show_size_changer=True,
                )
                btn = antd.Button("Show me the page",
                                  type="primary",
                                  block=True)
    pagination.change(fn=on_change, inputs=[state], outputs=[state])
    btn.click(fn=on_click, inputs=[state], outputs=[btn])
if __name__ == "__main__":
    demo.queue().launch()
