import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms


def on_submit(_form):
    print(_form)  # the Form Component will automatically collect the form data


def on_change(_form):
    return gr.update(layout=_form["layout"],
                     disabled=_form["form_disabled"],
                     variant=_form["variant"])


with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Form(value={
                    "layout": "horizontal",
                    "remember": True,
                    "form_disabled": False,
                    "variant": "outlined",
            },
                           variant="outlined",
                           label_col=dict(span=8),
                           wrapper_col=dict(span=16),
                           layout="horizontal") as form:
                with antd.Form.Item(form_name="form_disabled",
                                    value_prop_name="checked"):
                    with antd.Checkbox(disabled=False):
                        ms.Text("Form disabled")
                with antd.Form.Item(form_name="layout", label="Form Layout"):
                    antd.Radio.Group(options=[{
                        "label": "Horizontal",
                        "value": "horizontal"
                    }, {
                        "label": "Vertical",
                        "value": "vertical"
                    }, {
                        "label": "Inline",
                        "value": "inline"
                    }])
                with antd.Form.Item(form_name="variant", label="Form variant"):
                    antd.Segmented(
                        options=['outlined', 'filled', 'borderless'])
                with antd.Form.Item(form_name="username",
                                    label="Username",
                                    tooltip="This is a required field",
                                    rules=[{
                                        "required":
                                        True,
                                        "message":
                                        'Please input your username!'
                                    }]):
                    antd.Input()
                with antd.Form.Item(form_name="password",
                                    label="Password",
                                    tooltip="This is a required field",
                                    rules=[{
                                        "required":
                                        True,
                                        "message":
                                        'Please input your password!'
                                    }]):
                    antd.Input.Password()
                with antd.Form.Item(form_name="files", label="Upload"):
                    with antd.Upload.Dragger():
                        with ms.Div(elem_classes="ant-upload-drag-icon"):
                            antd.Icon("InboxOutlined")
                        ms.Div("Click or drag file to this area to upload",
                               elem_classes="ant-upload-text")
                        ms.Div("Support for a single or bulk upload.",
                               elem_classes="ant-upload-hint")

                with antd.Form.Item(
                        wrapper_col=dict(offset=8, span=16),
                        form_name="remember",
                        value_prop_name="checked",
                ):
                    with antd.Checkbox():
                        ms.Text("Remember me")
                with antd.Form.Item(wrapper_col=dict(offset=8, span=16)):
                    submit_btn = antd.Button("Submit",
                                             type="primary",
                                             html_type="submit")
            form.values_change(on_change, inputs=[form], outputs=[form])
            form.finish(on_submit, inputs=[form])

if __name__ == "__main__":
    demo.queue().launch()
