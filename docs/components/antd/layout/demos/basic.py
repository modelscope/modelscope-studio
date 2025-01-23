import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

header_style = {
    "textAlign": 'center',
    "color": '#fff',
    "height": 64,
    "paddingInline": 48,
    "lineHeight": '64px',
    "backgroundColor": '#4096ff',
}

content_style = {
    "textAlign": 'center',
    "minHeight": 120,
    "lineHeight": '120px',
    "color": '#fff',
    "backgroundColor": '#0958d9',
}

sider_style = {
    "textAlign": 'center',
    "lineHeight": '120px',
    "color": '#fff',
    "backgroundColor": '#1677ff',
}

footer_style = {
    "textAlign": 'center',
    "color": '#fff',
    "backgroundColor": '#4096ff',
}

layout_style = {
    "borderRadius": 8,
    "overflow": 'hidden',
    "width": 'calc(50% - 8px)',
    "maxWidth": 'calc(50% - 8px)',
}

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Flex(gap="middle", wrap="wrap"):
                with antd.Layout(elem_style=layout_style):
                    with antd.Layout.Header(elem_style=header_style):
                        ms.Text("Header")
                    with antd.Layout.Content(elem_style=content_style):
                        ms.Text("Content")
                    with antd.Layout.Footer(elem_style=footer_style):
                        ms.Text("Footer")
                with antd.Layout(elem_style=layout_style):
                    with antd.Layout.Header(elem_style=header_style):
                        ms.Text("Header")
                    with antd.Layout():
                        with antd.Layout.Sider(width="25%",
                                               elem_style=sider_style):
                            ms.Text("Sider")
                        with antd.Layout.Content(elem_style=content_style):
                            ms.Text("Content")
                    with antd.Layout.Footer(elem_style=footer_style):
                        ms.Text("Footer")
                with antd.Layout(elem_style=layout_style):
                    with antd.Layout.Header(elem_style=header_style):
                        ms.Text("Header")
                    with antd.Layout():
                        with antd.Layout.Content(elem_style=content_style):
                            ms.Text("Content")
                        with antd.Layout.Sider(width="25%",
                                               elem_style=sider_style):
                            ms.Text("Sider")
                    with antd.Layout.Footer(elem_style=footer_style):
                        ms.Text("Footer")
                with antd.Layout(elem_style=layout_style):
                    with antd.Layout.Sider(width="25%",
                                           elem_style=sider_style):
                        ms.Text("Sider")
                    with antd.Layout():
                        with antd.Layout.Header(elem_style=header_style):
                            ms.Text("Header")
                        with antd.Layout.Content(elem_style=content_style):
                            ms.Text("Content")
                        with antd.Layout.Footer(elem_style=footer_style):
                            ms.Text("Footer")
if __name__ == "__main__":
    demo.queue().launch()
