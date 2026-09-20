

from app.tools.asset_tools import (
    get_asset_status_summary,
    get_assets_needing_action,
)


def inventory_analysis():
    """
    Phân tích tổng quan tình trạng tài sản.
    """

    summary = get_asset_status_summary()
    needing_action = get_assets_needing_action()

    return {
        "summary": summary,
        "needing_action": needing_action,
    }

