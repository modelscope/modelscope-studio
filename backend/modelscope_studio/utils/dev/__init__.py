from typing import List, Optional, TypedDict

from .app_context import *
from .component import *
from .process_links import process_links
from .resolve_frontend_dir import *


class CustomComponentDict(TypedDict):
    props: Optional[List[str]]
    template: Optional[str]
    js: Optional[str]
