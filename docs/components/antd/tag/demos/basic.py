import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Space(size="small"):
                antd.Tag("Tag1")
                with antd.Tag():
                    antd.Typography.Link(
                        "Link",
                        href=
                        "https://github.com/ant-design/ant-design/issues/1862")
                antd.Tag('Closeable', close_icon=True)
                with antd.Tag():
                    with ms.Slot("closeIcon"):
                        antd.Icon("CloseCircleOutlined",
                                  elem_style=dict(fontSize=14,
                                                  marginLeft="4px"))
                    ms.Text("Custom Close Icon")
            with antd.Divider(orientation="left"):
                ms.Text("Icon Tag")
            with antd.Flex(gap=("4px", "0"), wrap=True):
                with antd.Tag(color="#55acee"):
                    ms.Text("Twitter")
                with antd.Tag(color="#cd201f"):
                    ms.Text("Youtube")
                with antd.Tag(color="#3b5999"):
                    ms.Text("Facebook")
                with antd.Tag(color="#55acee"):
                    ms.Text("LinkedIn")

            with antd.Divider(orientation="left"):
                ms.Text("Presets Colorful Tag")

            with antd.Flex(gap=("4px", "0"), wrap=True):
                antd.Tag("magenta", color="magenta")
                antd.Tag("red", color="red")
                antd.Tag("volcano", color="volcano")
                antd.Tag("orange", color="orange")
                antd.Tag("gold", color="gold")
                antd.Tag("lime", color="lime")
                antd.Tag("green", color="green")
                antd.Tag("cyan", color="cyan")
                antd.Tag("blue", color="blue")
                antd.Tag("geekblue", color="geekblue")
                antd.Tag("purple", color="purple")

            with antd.Divider(orientation="left"):
                ms.Text("Custom Colorful Tag")

            with antd.Flex(gap="4px 0", wrap=True):
                antd.Tag("#f50", color="#f50")
                antd.Tag("#2db7f5", color="#2db7f5")
                antd.Tag("#87d068", color="#87d068")
                antd.Tag("#108ee9", color="#108ee9")
if __name__ == "__main__":
    demo.queue().launch()
