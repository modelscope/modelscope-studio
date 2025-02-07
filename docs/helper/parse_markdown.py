from html.parser import HTMLParser


def default_read_file(path):
    with open(path, "r") as f:
        return f.read()


enable_tags = ["demo", "demo-prefix", "demo-suffix", "file"]


class MarkdownParser(HTMLParser):

    def __init__(self, read_file=None):
        super().__init__()
        self.value = [{"type": "text", "value": ""}]
        self.tag_stack = []
        self.read_file = read_file or default_read_file
        self.current_tag = None

    def get_value(self):
        return self.value

    def handle_data(self, data: str) -> None:
        if self.value[-1]["type"] == "text":
            self.value[-1]["value"] += data
        elif self.current_tag is None:
            self.value.append({"type": "text", "value": data})
        elif self.current_tag == "demo-prefix":
            self.value[-1]["prefix"] += data
        elif self.current_tag == "demo-suffix":
            self.value[-1]["suffix"] += data

    def handle_startendtag(self, tag: str, attrs) -> None:
        if tag not in enable_tags:
            self.handle_data(self.get_starttag_text())
            return

    def handle_starttag(self, tag: str, attrs) -> None:
        if (tag not in enable_tags):
            self.handle_data(self.get_starttag_text())
            return
        if tag == "demo":
            self.value.append({
                "type": "demo",
                "name": dict(attrs)["name"],
                "fixed": "fixed" in dict(attrs),
                "prefix": "",
                "suffix": "",
                "position": dict(attrs).get("position", "left"),
                "collapsible": "collapsible" in dict(attrs),
                "title": dict(attrs).get("title", "")
            })
        elif tag == "file":
            content = self.read_file(dict(attrs)["src"])
            if self.value[-1]["type"] == "text":
                self.value[-1]["value"] += content
            elif self.current_tag == "demo-prefix":
                self.value[-1]["prefix"] += content
            elif self.current_tag == "demo-suffix":
                self.value[-1]["suffix"] += content
        self.current_tag = tag
        self.tag_stack.append(self.current_tag)

    def handle_endtag(self, tag: str) -> None:

        if (tag not in enable_tags):
            self.handle_data(f"</{tag}>")
            return
        if (len(self.tag_stack) > 0):
            self.tag_stack.pop()
            if (len(self.tag_stack) > 0):
                self.current_tag = self.tag_stack[-1]
            else:
                self.current_tag = None
        else:
            self.current_tag = None


def parse_markdown(markdown: str, read_file=None):
    parser = MarkdownParser(read_file=read_file)
    parser.feed(markdown)
    return parser.get_value()
