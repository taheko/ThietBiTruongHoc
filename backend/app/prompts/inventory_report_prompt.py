
INVENTORY_REPORT_PROMPT = """
Dựa hoàn toàn trên dữ liệu kiểm kê được cung cấp,
hãy sinh báo cáo kiểm kê tài sản trường học.

DỮ LIỆU KIỂM KÊ:

{asset_inventory}

YÊU CẦU:

1. Tổng quan kiểm kê
- Tổng số tài sản.
- Phân loại theo tình trạng.

2. Tài sản thiếu
- Liệt kê các tài sản có trạng thái missing.

3. Tài sản hỏng
- Liệt kê các tài sản có trạng thái broken.

4. Tài sản đang sửa chữa
- Liệt kê các tài sản có trạng thái repairing.

5. Nhận xét
- Đánh giá tình trạng tài sản dựa trên dữ liệu.

6. Đề xuất xử lý
- Tài sản nên sửa chữa.
- Tài sản cần kiểm tra lại.
- Tài sản cần theo dõi.
- Tài sản có thể cân nhắc thay thế.

QUY TẮC:

- Không tự tạo số liệu.
- Không tự tạo tài sản.
- Không tự tạo mã tài sản.
- Không tự tạo chi phí.
- Không tự tạo thời gian sửa chữa.
- Nếu thiếu dữ liệu, ghi "Không có dữ liệu".
- Đề xuất phải được ghi rõ là đề xuất của AI.
"""

