
from app.tools.asset_tools import (
    get_assets,
    get_asset_status_summary,
    get_assets_needing_action,
)


def get_inventory_report_data():
    """
    Chuẩn bị dữ liệu cho AI sinh báo cáo kiểm kê.
    """

    assets = get_assets()
    summary = get_asset_status_summary()
    needing_action = get_assets_needing_action()

    missing = [
        asset
        for asset in assets
        if asset.get("status") == "missing"
    ]

    broken = [
        asset
        for asset in assets
        if asset.get("status") == "broken"
    ]

    repairing = [
        asset
        for asset in assets
        if asset.get("status") == "repairing"
    ]

    return {
        "total": len(assets),
        "summary": summary,
        "missing": missing,
        "broken": broken,
        "repairing": repairing,
        "needing_action": needing_action,
    }

