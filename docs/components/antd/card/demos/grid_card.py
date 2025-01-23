import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

gridStyle = {
    "width": '25%',
    "textAlign": 'center',
}

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Card(title="Card Title"):
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(hoverable=False, elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")
                with antd.Card.Grid(elem_style=gridStyle):
                    ms.Text("Content")

if __name__ == "__main__":
    demo.queue().launch()
