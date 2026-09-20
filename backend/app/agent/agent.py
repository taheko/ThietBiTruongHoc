from app.agent.skill_loader import load_skill, list_skills


SKILL_KEYWORDS = {
    "inventory_report": [
        "báo cáo kiểm kê",
        "báo cáo kiểm kê tài sản",
        "kết quả kiểm kê",
        "tài sản thiếu",
        "tài sản hỏng",
    ],
    "condition_summary": [
        "tóm tắt tình trạng",
        "tình trạng tài sản",
        "tình trạng phòng ban",
        "tình trạng tài sản theo phòng",
        "tài sản theo phòng ban",
    ],
    "replacement_recommendation": [
        "cần sửa chữa",
        "cần thay thế",
        "nên thay thế",
        "gợi ý thay thế",
        "tài sản cần xử lý",
        "kế hoạch thay thế",
    ],
    "testing": [
        "kiểm thử",
        "kiểm tra chức năng",
        "test chức năng",
        "test case",
        "tạo test case",
        "kiểm thử hệ thống",
        "kiểm thử api",
        "kiểm thử đăng nhập",
        "kiểm thử phân quyền",
        "kiểm thử tài sản",
        "kiểm thử kiểm kê",
    ],
}


def detect_skill(message: str) -> str | None:
    message_lower = message.lower()

    for skill_name, keywords in SKILL_KEYWORDS.items():
        for keyword in keywords:
            if keyword in message_lower:
                return skill_name

    return None


def get_skill_for_message(message: str) -> tuple[str | None, str | None]:
    skill_name = detect_skill(message)

    if skill_name is None:
        return None, None

    skill_content = load_skill(skill_name)

    return skill_name, skill_content


def get_available_skills() -> list[str]:
    return list_skills()