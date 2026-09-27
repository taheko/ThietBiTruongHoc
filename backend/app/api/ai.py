from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json

from app.agent.skill_agent import run_skill_agent
from app.agent.agent import get_available_skills
from app.prompts.inventory_report_prompt import INVENTORY_REPORT_PROMPT
from app.prompts.condition_prompt import CONDITION_PROMPT
from app.services.ai_service import ask_ai

router = APIRouter(prefix="/api/ai", tags=["ai"])


class ReportRequest(BaseModel):
    type: str  # inventory_report | condition_summary | replacement_suggestions
    session_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class AskRequest(BaseModel):
    message: str
    data: Optional[str] = ""


@router.get("/skills")
def get_skills():
    """Trả về danh sách các Skill AI đang có trong hệ thống."""
    return {"skills": get_available_skills()}


@router.post("/ask")
def ask_agent(req: AskRequest):
    """Gửi yêu cầu phân tích hoặc kiểm thử trực tiếp tới AI Skill Agent."""
    try:
        result = run_skill_agent(req.message, req.data or "")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/report")
def generate_ai_report(req: ReportRequest):
    """
    Sinh báo cáo thông minh ứng dụng AI theo UC014.
    Hỗ trợ 3 loại báo cáo:
    1. inventory_report: Báo cáo kiểm kê tài sản
    2. condition_summary: Tóm tắt tình trạng tài sản theo phòng ban
    3. replacement_suggestions: Gợi ý tài sản cần sửa chữa hoặc thay thế
    """
    try:
        data_str = json.dumps(req.data or {}, ensure_ascii=False, indent=2)
        
        if req.type == "inventory_report":
            prompt = f"""
Bạn là AI chuyên gia quản lý tài sản trường học.
Hãy phân tích dữ liệu kiểm kê được cung cấp và tạo Báo cáo kiểm kê chuyên sâu định dạng Markdown chuẩn.

DỮ LIỆU ĐỢT KIỂM KÊ:
{data_str}

{INVENTORY_REPORT_PROMPT}
"""
            title = "Báo cáo kiểm kê tài sản trường học (AI Generated)"

        elif req.type == "condition_summary":
            prompt = f"""
Bạn là AI chuyên gia đánh giá hiện trạng cơ sở vật chất giáo dục.
Hãy phân tích dữ liệu tài sản theo phòng ban và tạo Tóm tắt tình trạng tài sản định dạng Markdown.
Tính toán chỉ số sức khỏe tài sản (Asset Health Score) cho từng vị trí.

DỮ LIỆU TÀI SẢN PHÒNG BAN:
{data_str}

{CONDITION_PROMPT}
"""
            title = "Tóm tắt tình trạng tài sản theo phòng ban (AI Generated)"

        elif req.type == "replacement_suggestions":
            prompt = f"""
Bạn là AI cố vấn quản lý ngân sách và thiết bị trường học.
Dựa trên dữ liệu tài sản, lịch sử sửa chữa và niên hạn sử dụng, hãy đề xuất danh sách tài sản cần sửa chữa hoặc thay thế kèm ước tính ngân sách định dạng Markdown chuẩn.

DỮ LIỆU TÀI SẢN VÀ LỊCH SỬ SỬA CHỮA:
{data_str}

QUY TẮC:
- Chỉ đề xuất dựa trên dữ liệu hiện có (số lần sửa chữa >= 2 hoặc tình trạng hỏng hóc nặng).
- Ước tính chi phí rõ ràng và phân loại theo mức độ ưu tiên: Khẩn cấp, Trung bình, Theo dõi.
- Định dạng Markdown có bảng chi tiết và tóm tắt tổng ngân sách.
"""
            title = "Gợi ý danh sách tài sản cần sửa chữa hoặc thay thế (AI Generated)"

        else:
            raise HTTPException(status_code=400, detail=f"Loại báo cáo không hợp lệ: {req.type}")

        # Gọi Gemini AI qua ask_ai
        response_text = ask_ai(prompt)

        return {
            "success": True,
            "type": req.type,
            "title": title,
            "content": response_text,
            "engine": "google-gemini-ai"
        }

    except Exception as e:
        # Trả về thông tin lỗi chi tiết để frontend có thể fallback mượt mà
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi AI Backend: {str(e)}"
        )
