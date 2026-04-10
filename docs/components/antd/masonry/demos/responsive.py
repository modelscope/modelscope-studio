import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

items = [
    dict(color='#1677ff', height=150, label='Item A'),
    dict(color='#52c41a', height=80, label='Item B'),
    dict(color='#fa8c16', height=200, label='Item C'),
    dict(color='#722ed1', height=120, label='Item D'),
    dict(color='#eb2f96', height=100, label='Item E'),
    dict(color='#13c2c2', height=180, label='Item F'),
    dict(color='#faad14', height=90, label='Item G'),
    dict(color='#f5222d', height=160, label='Item H'),
    dict(color='#1677ff', height=110, label='Item I'),
    dict(color='#52c41a', height=140, label='Item J'),
    dict(color='#fa8c16', height=70, label='Item K'),
    dict(color='#722ed1', height=190, label='Item L'),
]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            with antd.Masonry(columns=4, gutter=12):
                for item in items:
                    with antd.Masonry.Item():
                        ms.Div(item['label'],
                               elem_style=dict(
                                   height=item['height'],
                                   background=item['color'],
                                   borderRadius=8,
                                   display='flex',
                                   alignItems='center',
                                   justifyContent='center',
                                   color='#fff',
                                   fontSize=16,
                                   fontWeight='bold',
                               ))

if __name__ == "__main__":
    demo.queue().launch()
