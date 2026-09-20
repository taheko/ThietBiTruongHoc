# Inventory Report Skill

## 1. Skill Name

Inventory Report Skill

## 2. Purpose

Skill này có nhiệm vụ phân tích dữ liệu kiểm kê tài sản và sinh báo cáo kiểm kê bằng ngôn ngữ tự nhiên.

Skill phục vụ yêu cầu chức năng:

> AI sinh báo cáo kiểm kê từ dữ liệu tài sản.

Báo cáo phải dựa hoàn toàn trên dữ liệu được cung cấp bởi hệ thống hoặc các Tool được phép sử dụng.

AI không được tự tạo, ước lượng hoặc thay đổi số liệu thực tế.

---

## 3. When to Use

Sử dụng Skill này khi người dùng yêu cầu:

* Sinh báo cáo kiểm kê.
* Tóm tắt kết quả của một đợt kiểm kê.
* Thống kê tài sản trong một đợt kiểm kê.
* Liệt kê tài sản thiếu.
* Liệt kê tài sản hỏng.
* Liệt kê tài sản cần sửa chữa.
* Phân tích chênh lệch giữa dữ liệu hệ thống và kết quả kiểm kê.
* Đề xuất hướng xử lý dựa trên kết quả kiểm kê.

Ví dụ:

* "Hãy tạo báo cáo kiểm kê đợt INV-001."
* "Có bao nhiêu tài sản bị thiếu trong đợt kiểm kê này?"
* "Tóm tắt kết quả kiểm kê phòng máy tính."

---

## 4. Input

Skill có thể nhận các dữ liệu sau:

### 4.1. Inventory Session

Thông tin đợt kiểm kê:

* inventory_session_id
* tên đợt kiểm kê
* thời gian kiểm kê
* người thực hiện
* phạm vi kiểm kê
* trạng thái kiểm kê

### 4.2. Inventory Items

Dữ liệu từng tài sản trong đợt kiểm kê:

* asset_id
* asset_code
* asset_name
* expected_status
* actual_status
* expected_location
* actual_location
* note

### 4.3. Asset Information

Thông tin tài sản:

* mã tài sản
* tên tài sản
* nhóm tài sản
* vị trí
* phòng ban
* trạng thái
* giá trị
* ngày mua

---

## 5. Allowed Tools

Skill chỉ được sử dụng các Tool được Agent cung cấp.

Các Tool dự kiến:

* `get_inventory_data`
* `get_assets`
* `get_asset_status_summary`

Không truy cập trực tiếp database bằng Skill.

Skill phải thông qua Tool để lấy dữ liệu.

---

## 6. Processing Workflow

Thực hiện theo thứ tự:

### Step 1: Xác định đợt kiểm kê

Xác định:

* inventory_session_id
* phạm vi kiểm kê
* thời gian kiểm kê

Nếu người dùng không cung cấp đủ thông tin để xác định đợt kiểm kê, yêu cầu bổ sung.

### Step 2: Lấy dữ liệu

Gọi:

`get_inventory_data`

để lấy dữ liệu kiểm kê.

Nếu cần thông tin chi tiết tài sản, gọi:

`get_assets`

### Step 3: Kiểm tra dữ liệu

Kiểm tra:

* Có dữ liệu hay không.
* Có asset_id hay không.
* Có trạng thái kiểm kê hay không.
* Có thông tin vị trí hay không.
* Có dữ liệu bị thiếu hoặc không hợp lệ hay không.

Không tự bổ sung dữ liệu còn thiếu.

### Step 4: Phân loại

Phân loại dữ liệu thành:

* Tài sản đúng trạng thái.
* Tài sản thiếu.
* Tài sản hỏng.
* Tài sản cần sửa chữa.
* Tài sản sai vị trí.
* Tài sản có chênh lệch giữa hệ thống và thực tế.

### Step 5: Tổng hợp

Tính toán từ dữ liệu thực tế:

* Tổng số tài sản kiểm kê.
* Số tài sản đúng.
* Số tài sản thiếu.
* Số tài sản hỏng.
* Số tài sản cần sửa.
* Số tài sản sai vị trí.

### Step 6: Sinh báo cáo

Tạo báo cáo theo format quy định ở phần Output.

---

## 7. Business Rules

### Rule 1 — Không bịa số liệu

AI chỉ được sử dụng số liệu có trong dữ liệu đầu vào hoặc kết quả Tool.

Không được tự tạo:

* số lượng tài sản
* mã tài sản
* giá trị tài sản
* trạng thái
* vị trí
* ngày kiểm kê

### Rule 2 — Không tự thay đổi dữ liệu

Skill chỉ phân tích và sinh báo cáo.

Skill không được:

* sửa tài sản
* xóa tài sản
* chuyển tài sản
* thanh lý tài sản

trừ khi có Tool và yêu cầu riêng cho hành động đó.

### Rule 3 — Phân biệt dữ liệu hệ thống và thực tế

Nếu:

`expected_status != actual_status`

phải đánh dấu là có chênh lệch.

Không tự kết luận nguyên nhân nếu dữ liệu không cung cấp nguyên nhân.

### Rule 4 — Dữ liệu thiếu

Nếu thiếu dữ liệu quan trọng:

> Không đủ dữ liệu để đưa ra kết luận.

Không được đoán.

### Rule 5 — Đề xuất phải dựa trên dữ liệu

AI có thể đề xuất:

* kiểm tra lại tài sản
* lập phiếu sửa chữa
* xác minh vị trí
* kiểm tra tài sản mất
* xem xét thay thế

nhưng phải dựa trên dữ liệu kiểm kê.

---

## 8. Output Format

Báo cáo phải có cấu trúc:

### 1. Tổng quan

* Tên đợt kiểm kê
* Thời gian
* Phạm vi
* Tổng số tài sản

### 2. Kết quả kiểm kê

| Nhóm            | Số lượng |
| --------------- | -------: |
| Đúng trạng thái |      ... |
| Thiếu           |      ... |
| Hỏng            |      ... |
| Cần sửa         |      ... |
| Sai vị trí      |      ... |

### 3. Tài sản cần chú ý

Liệt kê:

* Mã tài sản
* Tên tài sản
* Trạng thái
* Vị trí
* Ghi chú

### 4. Chênh lệch phát hiện

Mô tả các trường hợp:

* Sai trạng thái.
* Sai vị trí.
* Không tìm thấy tài sản.
* Thông tin không khớp.

### 5. Đề xuất xử lý

Đề xuất các bước tiếp theo dựa trên dữ liệu.

### 6. Dữ liệu không đủ

Nếu có trường hợp thiếu dữ liệu, liệt kê rõ những thông tin còn thiếu.

---

## 9. Prompt

### System Prompt

Bạn là trợ lý quản lý tài sản trường học.

Nhiệm vụ của bạn là phân tích dữ liệu kiểm kê và sinh báo cáo kiểm kê.

Chỉ sử dụng dữ liệu được cung cấp bởi hệ thống hoặc Tool.

Không được tự tạo số liệu, mã tài sản, trạng thái, vị trí hoặc giá trị tài sản.

Nếu dữ liệu không đủ để kết luận, phải nói rõ rằng dữ liệu không đủ.

Không tự ý thay đổi dữ liệu trong hệ thống.

### User Prompt

Dữ liệu kiểm kê:

{{inventory_data}}

Hãy sinh báo cáo kiểm kê gồm:

1. Tổng quan.
2. Tổng số tài sản.
3. Tài sản đúng.
4. Tài sản thiếu.
5. Tài sản hỏng.
6. Tài sản cần sửa chữa.
7. Tài sản sai vị trí.
8. Các chênh lệch phát hiện.
9. Đề xuất xử lý.

Chỉ sử dụng số liệu có trong dữ liệu được cung cấp.

---

## 10. Error Handling

### Không có dữ liệu

Trả:

> Không tìm thấy dữ liệu kiểm kê cho yêu cầu này.

### Dữ liệu không đầy đủ

Trả báo cáo với phần:

> Dữ liệu chưa đầy đủ để phân tích chính xác.

### Không xác định được đợt kiểm kê

Yêu cầu người dùng cung cấp:

* inventory_session_id
* hoặc tên đợt kiểm kê.

---

## 11. Test Cases

### TC-IR-01

Input: Đợt kiểm kê có dữ liệu đầy đủ.

Expected:

* Báo cáo được tạo.
* Số liệu khớp database.

### TC-IR-02

Input: Có tài sản thiếu.

Expected:

* Tài sản được đưa vào nhóm thiếu.

### TC-IR-03

Input: Có tài sản hỏng.

Expected:

* Tài sản được đưa vào nhóm hỏng.

### TC-IR-04

Input: Không có dữ liệu.

Expected:

* Không bịa dữ liệu.
* Thông báo không có dữ liệu.

### TC-IR-05

Input: Dữ liệu thiếu trạng thái.

Expected:

* Không tự đoán trạng thái.
* Đánh dấu dữ liệu chưa đầy đủ.

### TC-IR-06

Input: expected_location khác actual_location.

Expected:

* Phát hiện chênh lệch vị trí.
