import os
import re
from typing import Callable

from gradio import processing_utils, utils
from gradio.components import Component


def process_html_links(html: str, transformer: Callable):
    src_regex = re.compile(r'src=["\'](.*?)["\']')
    img_src_regex = re.compile(r'"imgSrc": *"(.*?)"')

    def replace_src(type):

        def replace(match):
            src = match.group(1)
            new_url = transformer(src) if transformer else src
            if (type == "src"):
                return f'src="{new_url}"'
            elif (type == "imgSrc"):
                return f'"imgSrc": "{new_url}"'

        return replace

    html = src_regex.sub(replace_src("src"), html)
    html = img_src_regex.sub(replace_src("imgSrc"), html)
    return html


def process_markdown_links(markdown: str, transformer: Callable):
    link_pattern = r"\[(.*?)\]\((.*?)\)"

    def replace_link(match):
        text = match.group(1)
        url = match.group(2)

        new_url = transformer(url) if transformer else url

        new_link = f"[{text}]({new_url})"

        return new_link

    new_markdown = re.sub(link_pattern, replace_link, markdown)

    return new_markdown


def process_links(text: str, block: Component):

    def link_transformer(src: str):
        if (src.startswith("http") or src.startswith("https")
                or src.startswith("data")):
            return src
        file_path = str(utils.abspath(src))
        if (not os.path.exists(file_path)):
            return src
        return f"/file={processing_utils.move_resource_to_block_cache(file_path, block)}"

    return process_html_links(process_markdown_links(text, link_transformer),
                              link_transformer)
