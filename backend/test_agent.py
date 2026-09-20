from app.agent.agent import get_skill_for_message

tests = [
    "Hãy tạo báo cáo kiểm kê hiện tại",
    "Hãy tóm tắt tình trạng tài sản theo phòng ban",
    "Tài sản nào cần sửa chữa hoặc thay thế?"
]

for message in tests:
    skill_name, skill_content = get_skill_for_message(message)

    print("\nUSER:", message)
    print("SKILL:", skill_name)
    print("LOADED:", skill_content is not None)