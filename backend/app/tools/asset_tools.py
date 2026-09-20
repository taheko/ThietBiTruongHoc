
from app.services.supabase_service import get_supabase


def get_assets(
    status: str | None = None,
    location_id: str | None = None,
    category_id: str | None = None,
):
    """
    Lấy danh sách tài sản từ database.

    Đây là Tool dành cho AI Agent.
    AI không tự tạo dữ liệu mà phải lấy từ Tool này.
    """

    query = (
        get_supabase()
        .table("assets")
        .select("*")
    )

    if status:
        query = query.eq("status", status)

    if location_id:
        query = query.eq("location_id", location_id)

    if category_id:
        query = query.eq("category_id", category_id)

    result = query.execute()

    return result.data or []


def get_asset_status_summary():
    """
    Thống kê số lượng tài sản theo tình trạng.
    """

    assets = (
        get_supabase()
        .table("assets")
        .select("id,status")
        .execute()
        .data
        or []
    )

    summary = {}

    for asset in assets:
        status = asset.get("status") or "unknown"

        if status not in summary:
            summary[status] = 0

        summary[status] += 1

    return {
        "total": len(assets),
        "by_status": summary,
    }


def get_assets_needing_action():
    """
    Lấy các tài sản có tình trạng cần xử lý.
    """

    assets = (
        get_supabase()
        .table("assets")
        .select("*")
        .in_("status", ["damaged", "under_repair"])
        .execute()
        .data
        or []
    )

    return assets


def get_repair_history(asset_id: str):
    """
    Lấy lịch sử sửa chữa của một tài sản.
    """

    result = (
        get_supabase()
        .table("repairs")
        .select("*")
        .eq("asset_id", asset_id)
        .order("created_at", desc=True)
        .execute()
    )

    return result.data or []

def get_inventory_report_data():
    """
    Lấy toàn bộ dữ liệu cần thiết để AI sinh báo cáo kiểm kê.

    Tool này chỉ đọc dữ liệu từ database.
    AI không được tự tạo số liệu.
    """

    assets = (
        get_supabase()
        .table("assets")
        .select("*")
        .execute()
        .data
        or []
    )

    summary = {}

    for asset in assets:
        status = asset.get("status") or "unknown"

        if status not in summary:
            summary[status] = 0

        summary[status] += 1

    needing_action = [
        asset
        for asset in assets
        if asset.get("status") in ["broken", "repairing"]
    ]

    return {
        "total": len(assets),
        "by_status": summary,
        "assets": assets,
        "needing_action": needing_action,
    }