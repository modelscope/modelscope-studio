import gradio as gr
import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms

mock_data = [{
    "key": str(i),
    "title": f"content{i + 1}",
    "description": f"description of content{i + 1}"
} for i in range(20)]

initial_target_keys = [
    item['key'] for item in mock_data if int(item['key']) > 10
]

with gr.Blocks() as demo:
    with ms.Application():
        with antd.ConfigProvider():
            antd.Transfer(value=initial_target_keys,
                          data_source=mock_data,
                          titles=['Source', 'Target'])
            antd.Divider("One Way")
            antd.Transfer(one_way=True,
                          data_source=mock_data,
                          titles=['Source', 'Target'])
            antd.Divider("Search")
            antd.Transfer(
                value=initial_target_keys,
                show_search=True,
                # use javascript function to filter options
                filter_option=
                "(inputValue, option) => option.description.indexOf(inputValue) > -1",
                data_source=mock_data,
                titles=['Source', 'Target'])

if __name__ == "__main__":
    demo.queue().launch()
