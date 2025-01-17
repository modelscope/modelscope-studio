import json

import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

gutters = {}
vgutters = {}
col_counts = {}

for i, v in enumerate([8, 16, 24, 32, 40, 48]):
    gutters[str(i)] = vgutters[str(i)] = v

for i, v in enumerate([2, 3, 4, 6, 8, 12]):
    col_counts[str(i)] = v

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            ms.Span("Horizontal Gutter (px): ")
            with ms.Div(elem_style=dict(width="50%")):
                horizontal_slider = antd.Slider(
                    value=1,
                    min=0,
                    max=len(gutters) - 1,
                    marks=gutters,
                    step=None,
                    tooltip=dict(
                        formatter=f"(value) => ({json.dumps(gutters)}[value])")
                )
            ms.Span("Vertical Gutter (px): ")
            with ms.Div(elem_style=dict(width="50%")):
                vertical_slider = antd.Slider(
                    value=1,
                    min=0,
                    max=len(vgutters) - 1,
                    marks=vgutters,
                    step=None,
                    tooltip=dict(
                        formatter=f"(value) => ({json.dumps(vgutters)}[value])"
                    ))
            ms.Span("Column Count: ")
            with ms.Div(elem_style=dict(width="50%", marginBottom=48)):
                count_slider = antd.Slider(
                    value=1,
                    min=0,
                    max=len(col_counts) - 1,
                    marks=col_counts,
                    step=None,
                    tooltip=dict(
                        formatter=
                        f"(value) => ({json.dumps(col_counts)}[value])"))
            with antd.Row(gutter=[gutters["1"], vgutters["1"]]) as row:
                with ms.Each(value=[{
                        "span": 8
                }, {
                        "span": 8
                }, {
                        "span": 8
                }] * 2) as cols:
                    with antd.Col(elem_style=dict(background="transparent",
                                                  border=0)):
                        ms.Div("Column",
                               elem_style=dict(height=120,
                                               fontSize=14,
                                               lineHeight='120px',
                                               background="#0092ff",
                                               borderRadius=4,
                                               color="#fff",
                                               textAlign='center'))

            def on_change(_horizontal_slider, _vertical_slider, _count_slider):
                return gr.update(gutter=[
                    gutters[str(_horizontal_slider)], vgutters[str(
                        _vertical_slider)]
                ]), gr.update(
                    value=[{
                        "span": int(24 / col_counts[str(_count_slider)])
                    } for _ in range(col_counts[str(_count_slider)])] * 2)

            gr.on([
                horizontal_slider.change, vertical_slider.change,
                count_slider.change
            ],
                  fn=on_change,
                  inputs=[horizontal_slider, vertical_slider, count_slider],
                  outputs=[row, cols])
if __name__ == "__main__":
    demo.queue().launch()
