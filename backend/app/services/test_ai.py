from app.services.ai_service import ask_ai


print("================================")
print("INVENTORY REPORT TEST")
print("================================")


question = """
Hãy lập báo cáo kiểm kê tài sản trường học
dựa trên dữ liệu hiện có trong hệ thống.
"""


print("\nUSER:")
print(question)

print("\nAI:")

answer = ask_ai(question)

print(answer)