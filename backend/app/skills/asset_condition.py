
from app.tools.asset_tools import get_assets


def asset_condition(location_id: str | None = None):
    """
    Phân tích tình trạng tài sản theo vị trí/phòng.
    """

    assets = get_assets(location_id=location_id)

    summary = {}

    for asset in assets:
        status = asset.get("status") or "unknown"

        if status not in summary:
            summary[status] = 0

        summary[status] += 1

    return {
        "total": len(assets),
        "by_status": summary,
        "assets": assets,
    }

