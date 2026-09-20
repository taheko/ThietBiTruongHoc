from app.agent.skill_agent import run_skill_agent # type: ignore


message = "Hãy tạo báo cáo kiểm kê hiện tại"

data = """
Tổng số tài sản: 10
Tài sản tốt: 7
Tài sản hỏng: 2
Tài sản thiếu: 1
"""

result = run_skill_agent(message, data)

print("SUCCESS:", result["success"])
print("SKILL:", result["skill"])
print("RESPONSE:")
print(result["response"])