from app.services.supabase_service import get_supabase


def get_inventory_data(inventory_session_id: str):
    """
    Lấy dữ liệu của một đợt kiểm kê.
    """

    result = (
        get_supabase()
        .table("inventory_items")
        .select("*")
        .eq("inventory_session_id", inventory_session_id)
        .execute()
    )

    return result.data or []