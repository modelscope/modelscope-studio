import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_submit(_form):
    print(_form)  # the Form Component will automatically collect the form data


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Form(label_col=dict(span=8),
                           wrapper_col=dict(span=16)) as form:
                with antd.Form.Item(
                        form_name="username",
                        label="Username",
                        rules=[{
                            "required": True,
                            "message": 'Please input your username!'
                        }, {
                            "pattern":
                            "^[a-zA-Z0-9]+$",
                            "message":
                            "Username can only contain letters and numbers!"
                        }, {
                            "min":
                            6,
                            "message":
                            "Username must be at least 6 characters long!"
                        }, {
                            "max":
                            20,
                            "message":
                            "Username must be at most 20 characters long!"
                        }]):
                    antd.Input()
                with antd.Form.Item(
                        form_name="password",
                        label="Password",
                        rules=[
                            {
                                "required": True,
                                "message": 'Please input your password!'
                            },
                            {
                                # custom validator with javascript function
                                "validator":
                                """(rule, value, cb) => {
                                    if (value !== '123') {
                                      cb('Password must be "123"')
                                    }
                                    cb()
                                }"""
                            }
                        ]):
                    antd.Input.Password()

                with antd.Form.Item(wrapper_col=dict(offset=8, span=16)):
                    submit_btn = antd.Button("Submit",
                                             type="primary",
                                             html_type="submit")
            form.finish(on_submit, inputs=[form])

if __name__ == "__main__":
    demo.queue().launch()
