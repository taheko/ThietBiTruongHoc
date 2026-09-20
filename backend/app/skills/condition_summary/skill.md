# Condition Summary Skill

## 1. Skill Name

Condition Summary Skill

## 2. Purpose

Skill này có nhiệm vụ phân tích và tóm tắt tình trạng tài sản theo phòng ban hoặc vị trí.

Skill phục vụ yêu cầu:

> AI tóm tắt tình trạng tài sản theo phòng ban.

Mục tiêu là giúp người quản lý nhanh chóng biết phòng ban nào đang có tài sản tốt, hỏng, thiếu hoặc cần sửa chữa.

---

## 3. When to Use

Sử dụng khi người dùng yêu cầu:

* Tóm tắt tình trạng tài sản.
* Tình trạng tài sản của một phòng ban.
* So sánh tình trạng tài sản giữa các phòng ban.
* Liệt kê tài sản hỏng của phòng ban.
* Thống kê tài sản cần sửa chữa.
* Tổng hợp tình trạng thiết bị trong phòng học.
* Phân tích tình trạng tài sản theo vị trí.

Ví dụ:

* "Tóm tắt tình trạng tài sản của phòng IT."
* "Phòng nào có nhiều tài sản hỏng?"
* "Cho tôi tình trạng thiết bị của phòng A."
* "Có bao nhiêu tài sản cần sửa ở từng phòng?"

---

## 4. Input

Skill sử dụng:

### Asset Data

* asset_id
* asset_code
* asset_name
* category_id
* location_id
* department_id
* status
* value
* purchase_date

### Location Data

* location_id
* location_name
* department_id

### Repair Data

* asset_id
* repair_date
* description
* repair_status
* repair_cost

---

## 5. Allowed Tools

Các Tool được phép:

* `get_assets`
* `get_asset_status_summary`
* `get_repair_history`

Nếu cần dữ liệu phòng ban hoặc vị trí, Agent có thể sử dụng Tool tương ứng nếu hệ thống cung cấp.

Skill không truy cập database trực tiếp.

---

## 6. Processing Workflow

### Step 1: Xác định phạm vi

Xác định:

* phòng ban
* phòng học
* vị trí
* hoặc toàn trường.

Nếu người dùng không chỉ rõ, sử dụng phạm vi phù hợp với yêu cầu hoặc hỏi lại.

### Step 2: Lấy tài sản

Gọi Tool lấy danh sách tài sản.

### Step 3: Phân nhóm

Phân nhóm theo:

* phòng ban
* vị trí
* nhóm tài sản
* trạng thái

### Step 4: Phân loại tình trạng

Phân loại theo trạng thái thực tế có trong database.

Ví dụ:

* good
* damaged
* missing
* under_repair

Không tự tạo trạng thái mới nếu database không có.

### Step 5: Phân tích sửa chữa

Nếu cần, sử dụng lịch sử sửa chữa để bổ sung thông tin.

Các yếu tố có thể xem xét:

* số lần sửa chữa
* thời gian sửa chữa gần nhất
* chi phí sửa chữa

Chỉ sử dụng khi dữ liệu có sẵn.

### Step 6: Sinh tóm tắt

Tạo bản tóm tắt dễ đọc cho người quản lý.

---

## 7. Business Rules

### Rule 1

Không tự tạo số lượng.

Mọi số liệu phải tính từ dữ liệu Tool trả về.

### Rule 2

Không đánh giá phòng ban chỉ dựa trên một tài sản.

Phải dựa trên tập dữ liệu trong phạm vi được yêu cầu.

### Rule 3

Không tự suy luận nguyên nhân hỏng.

Ví dụ không được nói:

> Máy hỏng vì người dùng sử dụng sai.

nếu database không có thông tin này.

### Rule 4

Không tự xác định tài sản cần thanh lý.

Skill chỉ có thể chỉ ra:

> Tài sản có tình trạng hoặc lịch sử sửa chữa cần được xem xét.

Quyết định thanh lý thuộc người quản lý.

### Rule 5

Nếu thiếu dữ liệu phòng ban:

> Không đủ dữ liệu để phân tích theo phòng ban.

---

## 8. Output Format

### 1. Phạm vi phân tích

* Phòng ban:
* Vị trí:
* Thời gian:
* Số tài sản:

### 2. Tổng quan

| Trạng thái | Số lượng |
| ---------- | -------: |
| Tốt        |      ... |
| Hỏng       |      ... |
| Thiếu      |      ... |
| Đang sửa   |      ... |

### 3. Theo phòng ban

| Phòng ban | Tổng | Tốt | Hỏng | Thiếu | Đang sửa |
| --------- | ---: | --: | ---: | ----: | -------: |
| ...       |  ... | ... |  ... |   ... |      ... |

### 4. Tài sản cần chú ý

* Mã tài sản
* Tên
* Phòng
* Trạng thái
* Thông tin sửa chữa nếu có

### 5. Tóm tắt

Mô tả tình trạng dựa trên số liệu thực tế.

### 6. Đề xuất

Đưa ra các bước kiểm tra hoặc xử lý phù hợp.

Không biến đề xuất thành quyết định bắt buộc.

---

## 9. Prompt

### System Prompt

Bạn là trợ lý phân tích tình trạng tài sản trường học.

Hãy tóm tắt tình trạng tài sản dựa trên dữ liệu hệ thống.

Chỉ sử dụng dữ liệu được cung cấp.

Không được tự tạo số liệu.

Không suy đoán nguyên nhân hỏng nếu dữ liệu không cung cấp.

Không tự quyết định thanh lý hoặc thay thế tài sản.

Nếu thiếu dữ liệu, phải nói rõ.

### User Prompt

Dữ liệu tài sản:

{{asset_data}}

Dữ liệu sửa chữa:

{{repair_data}}

Hãy tóm tắt tình trạng tài sản theo phòng ban hoặc vị trí.

Báo cáo gồm:

1. Tổng số tài sản.
2. Phân loại theo trạng thái.
3. Tình trạng từng phòng ban.
4. Tài sản cần chú ý.
5. Lịch sử sửa chữa đáng chú ý nếu có.
6. Đề xuất xử lý.

Không được tự tạo số liệu.

---

## 10. Error Handling

### Không có tài sản

Trả:

> Không tìm thấy tài sản trong phạm vi yêu cầu.

### Không có dữ liệu phòng ban

Không thực hiện phân tích theo phòng ban.

### Không có lịch sử sửa chữa

Không kết luận rằng tài sản chưa từng sửa chữa.

Chỉ ghi:

> Không có dữ liệu lịch sử sửa chữa trong hệ thống.

---

## 11. Test Cases

### TC-CS-01

Input: Nhiều phòng ban có dữ liệu tài sản.

Expected:

* Phân nhóm đúng phòng ban.
* Số lượng khớp database.

### TC-CS-02

Input: Một phòng có tài sản hỏng.

Expected:

* Tài sản hỏng được liệt kê.

### TC-CS-03

Input: Một tài sản có nhiều lần sửa chữa.

Expected:

* Lịch sử sửa chữa được hiển thị nếu Tool cung cấp dữ liệu.

### TC-CS-04

Input: Không có dữ liệu phòng ban.

Expected:

* Không tự tạo tên phòng ban.

### TC-CS-05

Input: Không có repair history.

Expected:

* Không tự suy đoán lịch sử sửa chữa.

### TC-CS-06

Input: Người dùng yêu cầu "phòng nào tệ nhất".

Expected:

* Không đưa ra đánh giá chủ quan.
* Trình bày số liệu tình trạng của từng phòng để người quản lý tự đánh giá.
