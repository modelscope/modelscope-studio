import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def submit(form_value):
    print(form_value)


def add(state_value):
    count = len(state_value)
    return state_value + [{
        "form_name": str(count),
        "label": "Label " + str(count)
    }]


with gr.Blocks() as demo, ms.Application(), antd.ConfigProvider():
    state = gr.State([{"form_name": "0", "label": "Label 0"}])
    with antd.Form() as form:
        with antd.Form.Item():
            add_btn = antd.Button("Add List")

        @gr.render(inputs=[state])
        def render_inputs(state_data):
            for item in state_data:
                with antd.Form.Item(form_name=item["form_name"],
                                    label=item["label"]):
                    antd.Input()

        with antd.Form.Item():
            antd.Button("Submit", type="primary", html_type="submit")
    add_btn.click(fn=add, inputs=[state], outputs=[state])
    form.finish(fn=submit, inputs=[form])

if __name__ == "__main__":
    demo.queue().launch()
