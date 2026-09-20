
from app.tools.asset_tools import (
    get_assets_needing_action,
    get_repair_history,
)


def repair_replacement():
    """
    Phân tích tài sản cần sửa chữa hoặc xem xét thay thế.
    """

    assets = get_assets_needing_action()

    result = []

    for asset in assets:
        asset_id = asset.get("id")

        history = []

        if asset_id:
            history = get_repair_history(asset_id)

        result.append({
            "asset": asset,
            "repair_history": history,
        })

    return result
