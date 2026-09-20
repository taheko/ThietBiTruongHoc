
CONDITION_PROMPT = """
Bạn đang phân tích tình trạng tài sản của một phòng ban hoặc vị trí.

Dữ liệu tài sản:

{assets}

Hãy tạo bản tóm tắt gồm:

1. Tổng số tài sản.
2. Số lượng tài sản theo từng trạng thái.
3. Những tài sản cần chú ý.
4. Nhận xét tổng quan.
5. Đề xuất xử lý.

Chỉ sử dụng dữ liệu được cung cấp.

Không được:
- Tự tạo số liệu.
- Tự tạo tài sản.
- Tự đoán tình trạng.
- Tự tạo chi phí.
- Tự tạo tuổi tài sản.

Nếu dữ liệu không đủ, hãy nói rõ:
"Không đủ dữ liệu để đưa ra kết luận."
"""

