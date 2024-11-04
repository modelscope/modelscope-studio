import os
import re

import gradio as gr

import modelscope_studio.components.antd as antd
import modelscope_studio.components.base as ms
import modelscope_studio.components.legacy as mgr

from .parse_markdown import parse_markdown

is_modelscope_studio = os.getenv('MODELSCOPE_ENVIRONMENT') == 'studio'


class Docs:

    def __init__(self, file_path: str):
        self.file_path = file_path
        # default current directory
        self.markdown_files = [
            filename for filename in os.listdir(os.path.dirname(file_path))
            if filename.endswith(".md")
        ]
        self.demo_modules = self._get_demo_modules()
        if is_modelscope_studio:
            self.markdown_files = list(
                filter(
                    lambda x: x.endswith("-zh_CN.md") or
                    (f"{'.'.join(x.split('.')[:-1])}-zh_CN.md" not in self.
                     markdown_files), self.markdown_files))
        else:
            self.markdown_files = list(
                filter(lambda x: not x.endswith("-zh_CN.md"),
                       self.markdown_files))

    def _remove_formatter(self, markdown_text):
        pattern = r"^ *---[\s\S]*?---"
        replaced_text = re.sub(pattern, "", markdown_text)
        return replaced_text

    def _list_demos(self, dir_path: str, prefix=''):
        result = []
        if (not os.path.isdir(dir_path)):
            return result
        for name in os.listdir(dir_path):
            path = os.path.join(dir_path, name)

            if os.path.isfile(path):
                result.append(prefix + name)
            elif os.path.isdir(path):
                sub_prefix = prefix + name + '/'
                result.extend(self._list_demos(path, sub_prefix))

        return result

    def _get_demo_modules(self):
        import importlib.util

        demos = [
            demo for demo in self._list_demos(
                os.path.join(os.path.dirname(self.file_path), "demos"))
            if demo.endswith(".py") and not demo.startswith("__")
        ]
        demo_modules = {}
        for demo in demos:
            demo_name = demo.split(".")[0]
            spec = importlib.util.spec_from_file_location(
                "demo",
                os.path.join(os.path.dirname(self.file_path), "demos", demo))
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            demo_modules[demo_name] = module
        return demo_modules

    def _read_file(self, relative_path: str):
        with open(os.path.join(os.path.dirname(self.file_path), relative_path),
                  "r") as f:
            return f.read()

    def _render_demo(self, demo_name, prefix='', suffix='', fixed=False):
        content = self._read_file(f"./demos/{demo_name}.py")
        module = self.demo_modules[demo_name]
        with antd.Card(styles=dict(body=dict(padding=10))):
            with antd.Row(align="stretch", wrap=False):
                with antd.Col(span=10):
                    with antd.Flex(elem_style=dict(height='100%')):
                        prefix = prefix + "\n" if prefix else ""
                        suffix = "\n" + suffix if suffix else ""
                        gr.Markdown(f"""{prefix}```python
{content}
```{suffix}""",
                                    header_links=True)
                        antd.Divider(type="vertical",
                                     variant="dashed",
                                     elem_style=dict(height='100%'))
                with antd.Col(
                        span=14,
                        elem_style=dict(
                            width='100%',
                            transform="translate(0, 0)" if fixed else None)):
                    module.demo.render()

    def _render_markdown(self, markdown_file):
        items = parse_markdown(self._remove_formatter(
            self._read_file(markdown_file)),
                               read_file=self._read_file)
        for item in items:
            if item["type"] == "text":
                mgr.Markdown(item["value"], header_links=True, preview=False)
            elif item["type"] == "demo":
                self._render_demo(item["name"],
                                  prefix=item["prefix"],
                                  suffix=item["suffix"],
                                  fixed=item["fixed"])

    def render(self):
        with gr.Blocks() as demo:
            self._render_markdown(self.markdown_files[0])
        return demo
