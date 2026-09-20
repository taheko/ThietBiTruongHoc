from fastapi import APIRouter
from app.services.supabase_service import get_supabase

router = APIRouter(prefix="/api", tags=["system"])


@router.get("/health")
def health_check():
    try:
        result = (
            get_supabase()
            .table("assets")
            .select("id")
            .limit(1)
            .execute()
        )

        return {
            "status": "ok",
            "database": "connected",
            "sample_rows": len(result.data or []),
        }

    except Exception as exc:
        return {
            "status": "error",
            "database": "disconnected",
            "error": type(exc).__name__,
            "message": str(exc),
        }