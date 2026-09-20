from app.agent.agent import get_skill_for_message
from app.services.ai_service import ask_ai


def run_skill_agent(message: str, data: str = "") -> dict:
    skill_name, skill_content = get_skill_for_message(message)

    if skill_name is None:
        return {
            "success": False,
            "skill": None,
            "message": "Không xác định được Skill phù hợp."
        }

    prompt = f"""
Bạn là AI Agent quản lý tài sản trường học.

Hãy tuân thủ toàn bộ hướng dẫn của Skill bên dưới.

====================
SKILL
====================

{skill_content}

====================
DỮ LIỆU HỆ THỐNG
====================

{data}

====================
YÊU CẦU NGƯỜI DÙNG
====================

{message}

====================
QUY TẮC CHUNG
====================

1. Chỉ sử dụng dữ liệu được cung cấp.
2. Không tự tạo số liệu.
3. Không tự tạo mã tài sản.
4. Không tự tạo trạng thái tài sản.
5. Nếu thiếu dữ liệu phải nói rõ.
6. Đề xuất chỉ mang tính tham khảo.
7. Không tự quyết định thanh lý tài sản.
8. Phải tuân thủ toàn bộ Business Rules trong Skill.
9. Phải sử dụng đúng Output Format của Skill nếu Skill quy định.
10. Nếu yêu cầu thuộc Testing Skill, phải tuân thủ đầy đủ quy trình và Test Cases được quy định trong Testing Skill.
"""

    response = ask_ai(prompt)

    return {
        "success": True,
        "skill": skill_name,
        "response": response
    }