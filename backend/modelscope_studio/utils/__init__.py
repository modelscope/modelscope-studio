from .process_links import process_links


def resolve_frontend_dir(component: str):
    return f"../../../../frontend/{component}"


__all__ = ["process_links", "resolve_frontend_dir"]
