import os

from components.Docs import Docs


def resolve(relative_path: str):
    return os.path.join(os.path.dirname(__file__), relative_path)


docs = Docs(
    __file__,
    markdown_files=(["README.md", "README-zh_CN.md"] + [
        f"custom_tags/{filename}"
        for filename in os.listdir(resolve('custom_tags'))
        if filename.endswith(".md")
    ]),
)

if __name__ == "__main__":
    docs.render().queue().launch()
