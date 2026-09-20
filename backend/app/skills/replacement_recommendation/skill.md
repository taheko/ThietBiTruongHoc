# Replacement Recommendation Skill

## 1. Skill Name

Replacement Recommendation Skill

## 2. Purpose

Skill này phân tích tình trạng và lịch sử tài sản để xác định các tài sản cần được xem xét:

* sửa chữa
* theo dõi
* thay thế

Skill phục vụ yêu cầu:

> AI gợi ý danh sách tài sản cần sửa chữa/thay thế.

Skill chỉ đưa ra khuyến nghị dựa trên dữ liệu.

Quyết định cuối cùng thuộc người quản lý tài sản.

---

## 3. When to Use

Sử dụng khi người dùng yêu cầu:

* Danh sách tài sản cần sửa chữa.
* Danh sách tài sản nên xem xét thay thế.
* Tìm tài sản hỏng.
* Phân tích tài sản có lịch sử sửa chữa nhiều.
* Gợi ý kế hoạch thay thế.
* Xác định tài sản cần ưu tiên kiểm tra.

Ví dụ:

* "Những tài sản nào cần sửa?"
* "Tài sản nào nên xem xét thay thế?"
* "Hãy lập danh sách thiết bị cần xử lý."
* "Gợi ý kế hoạch thay thế tài sản."

---

## 4. Input

### Asset Data

* asset_id
* asset_code
* asset_name
* category
* location
* department
* status
* purchase_date
* value
* condition

### Repair History

* asset_id
* repair_date
* repair_description
* repair_status
* repair_cost

### Inventory Data

* asset_id
* inventory_date
* actual_status
* note

---

## 5. Allowed Tools

Skill có thể sử dụng:

* `get_assets`
* `get_assets_needing_action`
* `get_repair_history`
* `get_inventory_data`

Skill không được truy cập database trực tiếp.

---

## 6. Processing Workflow

### Step 1: Lấy tài sản

Lấy danh sách tài sản trong phạm vi yêu cầu.

### Step 2: Lọc tài sản cần xử lý

Ưu tiên kiểm tra các tài sản:

* damaged
* under_repair
* missing
* có lịch sử sửa chữa
* có nhiều lần sửa chữa
* có dữ liệu kiểm kê cho thấy vấn đề

### Step 3: Kiểm tra lịch sử sửa chữa

Với từng tài sản cần chú ý, lấy lịch sử sửa chữa nếu có.

Xác định:

* số lần sửa chữa
* thời gian sửa chữa gần nhất
* chi phí sửa chữa nếu có
* nội dung sửa chữa

### Step 4: Kiểm tra dữ liệu kiểm kê

Nếu có dữ liệu kiểm kê, đối chiếu:

* trạng thái hệ thống
* trạng thái thực tế
* ghi chú kiểm kê

### Step 5: Phân loại đề xuất

Phân thành:

#### Nhóm A — Cần sửa chữa

Tài sản có lỗi/hỏng nhưng có dữ liệu cho thấy có thể xử lý bằng sửa chữa.

#### Nhóm B — Cần theo dõi

Tài sản có dấu hiệu bất thường nhưng chưa đủ dữ liệu để đề xuất thay thế.

#### Nhóm C — Nên xem xét thay thế

Tài sản có nhiều dấu hiệu cần xem xét thay thế, ví dụ:

* tình trạng hỏng nghiêm trọng;
* lịch sử sửa chữa lặp lại;
* chi phí sửa chữa cao nếu dữ liệu có sẵn;
* thời gian sử dụng dài nếu ngày mua có sẵn;
* kết quả kiểm kê cho thấy tình trạng không ổn định.

Không được khẳng định tài sản chắc chắn phải thay thế nếu dữ liệu không đủ.

---

## 7. Recommendation Rules

### Rule 1 — Không tự tạo số liệu

Không được tự tạo:

* tuổi tài sản
* số lần sửa
* chi phí
* giá trị
* trạng thái

### Rule 2 — Không tự quyết định thanh lý

Skill chỉ đưa ra:

> Nên xem xét thay thế.

Không đưa ra:

> Phải thanh lý.

### Rule 3 — Phải nêu lý do

Mỗi đề xuất thay thế phải có căn cứ dữ liệu.

Ví dụ:

> Tài sản A đang ở trạng thái hỏng và có 3 bản ghi sửa chữa trong dữ liệu hệ thống. Đề xuất xem xét thay thế.

### Rule 4 — Thiếu dữ liệu

Nếu thiếu ngày mua:

> Không sử dụng tuổi tài sản làm căn cứ.

Nếu thiếu repair history:

> Không kết luận tài sản đã sửa nhiều lần.

Nếu thiếu chi phí:

> Không đánh giá dựa trên chi phí sửa chữa.

### Rule 5 — Ưu tiên dữ liệu kiểm kê

Nếu dữ liệu kiểm kê gần nhất khác trạng thái hiện tại, phải chỉ ra sự khác biệt.

### Rule 6 — Không dùng một tiêu chí duy nhất

Không đề xuất thay thế chỉ vì:

* tài sản cũ;
* tài sản có một lần sửa;
* tài sản có giá trị thấp;
* tài sản thuộc một nhóm cụ thể.

Phải dựa trên các dữ liệu thực tế có sẵn.

---

## 8. Recommendation Output

### 1. Tổng quan

* Tổng số tài sản phân tích
* Số tài sản cần sửa
* Số tài sản cần theo dõi
* Số tài sản đề xuất xem xét thay thế

### 2. Danh sách sửa chữa

| Mã  | Tài sản | Phòng | Trạng thái | Lý do |
| --- | ------- | ----- | ---------- | ----- |
| ... | ...     | ...   | ...        | ...   |

### 3. Danh sách cần theo dõi

| Mã  | Tài sản | Phòng | Dấu hiệu | Đề xuất |
| --- | ------- | ----- | -------- | ------- |
| ... | ...     | ...   | ...      | ...     |

### 4. Danh sách xem xét thay thế

| Mã  | Tài sản | Phòng | Căn cứ dữ liệu | Đề xuất |
| --- | ------- | ----- | -------------- | ------- |
| ... | ...     | ...   | ...            | ...     |

### 5. Kế hoạch đề xuất

Đưa ra các bước:

1. Kiểm tra thực tế.
2. Xác nhận tình trạng.
3. Kiểm tra lịch sử sửa chữa.
4. Đánh giá khả năng sửa chữa.
5. Nếu phù hợp, xem xét phương án thay thế.
6. Người quản lý phê duyệt.

---

## 9. Prompt

### System Prompt

Bạn là trợ lý quản lý tài sản trường học.

Nhiệm vụ của bạn là phân tích dữ liệu tài sản, dữ liệu kiểm kê và lịch sử sửa chữa để đưa ra khuyến nghị sửa chữa hoặc xem xét thay thế.

Chỉ sử dụng dữ liệu được cung cấp bởi hệ thống hoặc Tool.

Không được tự tạo số liệu.

Mọi khuyến nghị phải có căn cứ từ dữ liệu.

Không tự quyết định thanh lý hoặc thay thế bắt buộc.

Nếu dữ liệu không đủ, phải nói rõ dữ liệu còn thiếu.

### User Prompt

Dữ liệu tài sản:

{{asset_data}}

Lịch sử sửa chữa:

{{repair_history}}

Dữ liệu kiểm kê:

{{inventory_data}}

Hãy:

1. Xác định tài sản cần sửa chữa.
2. Xác định tài sản cần theo dõi.
3. Xác định tài sản nên xem xét thay thế.
4. Nêu căn cứ dữ liệu cho từng đề xuất.
5. Đề xuất các bước xử lý tiếp theo.

Không tự tạo số liệu và không đưa ra quyết định thanh lý bắt buộc.

---

## 10. Confidence and Evidence

Mỗi khuyến nghị phải có căn cứ.

Có thể biểu diễn:

### Evidence: Strong

Có nhiều dữ liệu hỗ trợ:

* trạng thái hỏng;
* nhiều lần sửa chữa;
* kiểm kê xác nhận vấn đề.

### Evidence: Moderate

Có một số dữ liệu hỗ trợ nhưng chưa đầy đủ.

### Evidence: Insufficient

Không đủ dữ liệu để đưa ra khuyến nghị thay thế.

Không sử dụng điểm số hoặc xác suất nếu hệ thống chưa định nghĩa cách tính chính thức.

---

## 11. Error Handling

### Không có dữ liệu

Trả:

> Không có đủ dữ liệu tài sản để tạo khuyến nghị.

### Không có lịch sử sửa chữa

Không dùng số lần sửa chữa làm căn cứ.

### Không có ngày mua

Không đánh giá tuổi tài sản.

### Không có chi phí sửa chữa

Không đánh giá hiệu quả kinh tế của việc sửa chữa.

### Dữ liệu mâu thuẫn

Hiển thị sự mâu thuẫn và yêu cầu kiểm tra thực tế.

---

## 12. Test Cases

### TC-RR-01

Input: Tài sản đang hỏng.

Expected:

* Xuất hiện trong danh sách cần sửa hoặc xem xét xử lý.

### TC-RR-02

Input: Tài sản có nhiều lịch sử sửa chữa.

Expected:

* Lịch sử được sử dụng làm bằng chứng.
* Có thể được đưa vào nhóm xem xét thay thế.

### TC-RR-03

Input: Không có ngày mua.

Expected:

* Không suy đoán tuổi tài sản.

### TC-RR-04

Input: Không có repair history.

Expected:

* Không nói tài sản đã sửa nhiều lần.

### TC-RR-05

Input: Dữ liệu không đủ.

Expected:

* Không đưa ra kết luận thay thế chắc chắn.

### TC-RR-06

Input: Tài sản có trạng thái tốt.

Expected:

* Không đề xuất thay thế chỉ vì tài sản thuộc nhóm thiết bị cũ nếu không có căn cứ khác.

### TC-RR-07

Input: Trạng thái kiểm kê khác trạng thái hệ thống.

Expected:

* Phát hiện và hiển thị chênh lệch.
