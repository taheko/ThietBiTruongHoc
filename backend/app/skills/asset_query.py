
from app.tools.asset_tools import get_assets


def asset_query(
    status: str | None = None,
    location_id: str | None = None,
    category_id: str | None = None,
):
    """
    Skill tra cứu tài sản.
    """

    assets = get_assets(
        status=status,
        location_id=location_id,
        category_id=category_id,
    )

    return {
        "total": len(assets),
        "assets": assets,
    }

