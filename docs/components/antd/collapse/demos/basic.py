import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

default_accordion = False

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            accordion = antd.Switch(value=default_accordion,
                                    checked_children="Accordion",
                                    un_checked_children="Collapse")
            with antd.Collapse(default_active_key=['2'],
                               accordion=default_accordion) as collapse:
                with antd.Collapse.Item(collapsible='disabled',
                                        key="1",
                                        label="This is panel header 1"):
                    antd.Typography.Paragraph("""
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
""")
                with antd.Collapse.Item(label="This is panel header 2",
                                        key="2"):
                    antd.Typography.Paragraph("""
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
""")
                with antd.Collapse.Item(label="This is panel header 3",
                                        key="3"):
                    antd.Typography.Paragraph("""
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
""")
                accordion.change(fn=lambda x: gr.update(accordion=x),
                                 inputs=[accordion],
                                 outputs=[collapse])
if __name__ == "__main__":
    demo.queue().launch()
