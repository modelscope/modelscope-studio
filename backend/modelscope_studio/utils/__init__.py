from typing import List, Optional, TypedDict

from .process_links import process_links


class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]


def resolve_frontend_dir(component: str):
    return f"../../../../frontend/{component}"
