# Testing Skill

## 1. Skill Name

Testing Skill

## 2. Purpose

Skill này hỗ trợ kiểm thử hệ thống quản lý tài sản trường học bằng AI Agent.

Skill phục vụ yêu cầu trong SDLC:

> Sử dụng AI để phân tích yêu cầu, thiết kế Test Case, kiểm thử chức năng, kiểm thử API và phân tích kết quả kiểm thử.

Skill tập trung vào các chức năng quan trọng:

* Quản lý tài sản.
* Điều chuyển tài sản.
* Kiểm kê tài sản.
* Sửa chữa tài sản.
* Thanh lý tài sản.
* Chức năng AI.
* API Backend.
* Phân quyền người dùng.

Skill có nhiệm vụ phát hiện các trường hợp kiểm thử có thể xảy ra và phân tích kết quả kiểm thử.

Skill không tự ý thay đổi dữ liệu production.

Quyết định sửa code thuộc Developer hoặc Agent được cấp quyền sửa code riêng.

---

## 3. When to Use

Sử dụng Testing Skill khi người dùng yêu cầu:

* Tạo Test Case.
* Thiết kế kế hoạch kiểm thử.
* Kiểm thử chức năng.
* Kiểm thử API.
* Kiểm thử CRUD.
* Kiểm thử điều chuyển tài sản.
* Kiểm thử kiểm kê.
* Kiểm thử thanh lý.
* Kiểm thử chức năng AI.
* Phân tích kết quả kiểm thử.
* Phân tích lỗi.
* Kiểm tra dữ liệu đầu vào không hợp lệ.
* Kiểm thử phân quyền.
* Kiểm tra regression sau khi thay đổi code.

Ví dụ:

* "Hãy tạo Test Case cho chức năng điều chuyển tài sản."
* "Kiểm thử API tạo tài sản."
* "Hãy kiểm tra chức năng thanh lý."
* "Tạo test cho chức năng kiểm kê."
* "Kiểm thử AI sinh báo cáo kiểm kê."
* "Phân tích lỗi của Test Case này."
* "Hãy kiểm tra xem Admin và Kiểm kê viên có đúng quyền không."

---

## 4. Input

### 4.1. Requirement Data

Thông tin yêu cầu chức năng:

* chức năng
* mục tiêu
* actor
* business rules
* input
* output
* validation rules
* permission rules

### 4.2. Source Code

Nếu được cung cấp, Skill có thể sử dụng:

* Backend code.
* Frontend code.
* API endpoint.
* Service.
* Repository.
* AI Agent.
* Tool.
* Skill.

### 4.3. API Information

Có thể sử dụng:

* HTTP method.
* Endpoint.
* Request body.
* Query parameters.
* Authentication.
* Authorization.
* Response.
* HTTP status code.

### 4.4. Database Information

Nếu được cung cấp:

* bảng.
* cột.
* primary key.
* foreign key.
* constraint.
* enum/status.
* dữ liệu mẫu.

Skill chỉ sử dụng database information được cung cấp bởi Tool hoặc hệ thống.

### 4.5. Existing Test Data

Nếu có:

* Test Case.
* Test Result.
* Error message.
* Stack trace.
* HTTP response.
* Screenshot.
* Log.

---

## 5. Allowed Tools

Testing Skill chỉ sử dụng các Tool được Agent cung cấp.

Các Tool có thể sử dụng:

* `get_assets`
* `get_inventory_data`
* `get_repair_history`
* `get_transfer_data`
* `get_disposal_data`
* `run_api_test`
* `run_test`
* `get_test_result`

Nếu hệ thống chưa có Tool tương ứng thì Skill chỉ được phân tích hoặc sinh Test Case dựa trên dữ liệu được cung cấp.

Skill không tự truy cập database trực tiếp.

Skill không được tự thay đổi database.

Skill không được tự xóa dữ liệu.

Skill không được tự thanh lý hoặc điều chuyển tài sản.

---

## 6. Processing Workflow

### Step 1: Xác định đối tượng kiểm thử

Xác định chức năng cần kiểm thử:

* Asset Management.
* Transfer.
* Inventory.
* Repair.
* Disposal.
* AI.
* Authentication.
* Authorization.
* API.

Nếu yêu cầu không rõ, xác định phạm vi từ nội dung người dùng cung cấp.

### Step 2: Phân tích yêu cầu

Xác định:

* Actor.
* Preconditions.
* Input.
* Business rules.
* Expected output.
* Validation.
* Permission.

Không tự tạo business rule nếu hệ thống chưa định nghĩa.

### Step 3: Xác định Test Scenario

Tạo các Scenario cần kiểm thử.

Bao gồm:

* Happy Path.
* Negative Case.
* Boundary Case.
* Validation Case.
* Permission Case.
* Error Case.
* Data Integrity Case.

### Step 4: Tạo Test Case

Mỗi Test Case phải có:

* Test Case ID.
* Chức năng.
* Mục tiêu.
* Preconditions.
* Test Steps.
* Test Data.
* Expected Result.
* Priority.

### Step 5: Thực thi Test

Nếu có Tool thực thi test:

1. Chuẩn bị dữ liệu.
2. Gọi Tool.
3. Nhận kết quả.
4. So sánh Actual Result với Expected Result.
5. Xác định PASS hoặc FAIL.

Nếu không có Tool thực thi:

> Chỉ sinh Test Case và Expected Result, không được giả định rằng test đã chạy.

### Step 6: Phân tích Failure

Nếu Test Case FAIL:

Xác định:

* Expected Result.
* Actual Result.
* Error message.
* Error location nếu có.
* Nguyên nhân có thể xác định từ dữ liệu.
* Mức độ ảnh hưởng.

Không khẳng định nguyên nhân nếu chưa có đủ bằng chứng.

### Step 7: Regression Test

Sau khi chức năng được sửa đổi, kiểm tra lại:

* Test Case đã FAIL.
* Các chức năng liên quan.
* Các API liên quan.
* Business rules liên quan.

Không chỉ kiểm tra Test Case vừa sửa.

---

## 7. Test Design Rules

### Rule 1 — Không tự tạo kết quả

Nếu test chưa được thực thi, không được ghi:

> PASS

hoặc:

> FAIL

Phải ghi:

> NOT EXECUTED

hoặc:

> Chưa thực thi.

### Rule 2 — Expected Result phải có căn cứ

Expected Result phải dựa trên:

* Requirement.
* Business Rule.
* API contract.
* Database constraint.
* Source code nếu được cung cấp.

Không tự tạo hành vi hệ thống.

### Rule 3 — Không bỏ qua Negative Test

Mỗi chức năng quan trọng phải có trường hợp dữ liệu không hợp lệ.

Ví dụ:

* thiếu mã tài sản.
* mã tài sản không tồn tại.
* trạng thái không hợp lệ.
* vị trí không tồn tại.
* người dùng không có quyền.

### Rule 4 — Kiểm thử phân quyền

Các chức năng cần kiểm tra quyền của:

* Admin.
* Kiểm kê viên.
* Giáo viên.

Không tự giả định quyền nếu hệ thống chưa định nghĩa.

### Rule 5 — Không sửa dữ liệu khi chỉ kiểm thử

Testing Skill không được tự:

* sửa tài sản.
* xóa tài sản.
* điều chuyển tài sản.
* thanh lý tài sản.

trừ khi Test Tool được thiết kế để tạo dữ liệu test riêng.

### Rule 6 — Phân biệt Test Data và Production Data

Ưu tiên sử dụng:

* dữ liệu test.
* dữ liệu seed.
* dữ liệu mock.

Không thực hiện destructive test trên production data nếu chưa được cho phép.

---

## 8. Test Scope

### 8.1. Asset Management

Kiểm thử:

* Tạo tài sản.
* Xem tài sản.
* Cập nhật tài sản.
* Xóa tài sản.
* Tìm kiếm tài sản.
* Lọc tài sản.
* Kiểm tra mã tài sản trùng.

### 8.2. Transfer

Kiểm thử:

* Điều chuyển tài sản hợp lệ.
* Điều chuyển tới vị trí hợp lệ.
* Điều chuyển tới vị trí không tồn tại.
* Điều chuyển tài sản không tồn tại.
* Điều chuyển tài sản đã thanh lý.
* Thiếu thông tin điều chuyển.
* Người dùng không có quyền điều chuyển.

### 8.3. Inventory

Kiểm thử:

* Tạo đợt kiểm kê.
* Thêm tài sản vào đợt kiểm kê.
* Ghi nhận tài sản tốt.
* Ghi nhận tài sản hỏng.
* Ghi nhận tài sản thiếu.
* Ghi nhận tài sản cần sửa.
* Sai vị trí.
* Tài sản không tồn tại.
* Kết thúc đợt kiểm kê.

### 8.4. Repair

Kiểm thử:

* Tạo yêu cầu sửa chữa.
* Cập nhật trạng thái sửa chữa.
* Ghi nhận chi phí.
* Ghi nhận lịch sử sửa chữa.
* Tài sản không tồn tại.
* Dữ liệu sửa chữa không hợp lệ.

### 8.5. Disposal

Kiểm thử:

* Thanh lý tài sản hợp lệ.
* Thanh lý tài sản không tồn tại.
* Thanh lý tài sản đã thanh lý.
* Thiếu lý do thanh lý.
* Người dùng không có quyền thanh lý.

### 8.6. AI

Kiểm thử:

* AI sinh báo cáo kiểm kê.
* AI tóm tắt tình trạng.
* AI gợi ý sửa chữa.
* AI gợi ý xem xét thay thế.
* AI không tự tạo số liệu.
* AI xử lý dữ liệu thiếu.
* AI xử lý dữ liệu mâu thuẫn.
* AI sử dụng đúng Skill.

### 8.7. Authentication

Kiểm thử:

* Đăng nhập thành công.
* Sai email.
* Sai password.
* Tài khoản không tồn tại.
* Đăng xuất.
* Session hết hạn.

### 8.8. Authorization

Kiểm thử quyền của:

* Admin.
* Kiểm kê viên.
* Giáo viên.

Mỗi chức năng phải được kiểm tra với quyền phù hợp.

---

## 9. Output Format

### 1. Test Summary

| Nội dung       | Kết quả |
| -------------- | ------- |
| Chức năng      | ...     |
| Tổng Test Case | ...     |
| PASS           | ...     |
| FAIL           | ...     |
| NOT EXECUTED   | ...     |

### 2. Test Cases

| ID     | Chức năng | Preconditions | Steps | Test Data | Expected Result | Priority |
| ------ | --------- | ------------- | ----- | --------- | --------------- | -------- |
| TC-001 | ...       | ...           | ...   | ...       | ...             | High     |

### 3. Test Execution

| ID     | Expected | Actual | Status                 |
| ------ | -------- | ------ | ---------------------- |
| TC-001 | ...      | ...    | PASS/FAIL/NOT EXECUTED |

### 4. Failed Tests

Với mỗi Test Case FAIL:

* Test Case ID.
* Expected Result.
* Actual Result.
* Error.
* Evidence.
* Possible Cause.
* Severity.

### 5. Recommendations

Đề xuất:

* kiểm tra code.
* kiểm tra API.
* kiểm tra database constraint.
* kiểm tra permission.
* kiểm tra dữ liệu.
* chạy regression test.

Không tự khẳng định nguyên nhân nếu chưa đủ bằng chứng.

---

## 10. Prompt

### System Prompt

Bạn là AI Testing Agent cho hệ thống quản lý tài sản trường học.

Nhiệm vụ của bạn là phân tích yêu cầu, source code, API và dữ liệu được cung cấp để thiết kế và phân tích kiểm thử.

Bạn phải:

1. Xác định phạm vi kiểm thử.
2. Phân tích business rules.
3. Tạo Test Scenario.
4. Tạo Test Case.
5. Xác định Test Data.
6. Xác định Expected Result.
7. Phân tích kết quả kiểm thử nếu có.
8. Phát hiện Test Case thất bại.
9. Đề xuất kiểm tra nguyên nhân.

Không được tự tạo kết quả kiểm thử.

Nếu test chưa được thực thi, phải ghi NOT EXECUTED.

Không được tự tạo số liệu.

Không được tự tạo API hoặc database schema nếu chưa được cung cấp.

Không được tự sửa dữ liệu hệ thống.

Không được tự quyết định thanh lý tài sản.

Mọi kết luận phải dựa trên dữ liệu được cung cấp bởi hệ thống hoặc Tool.

### User Prompt

Yêu cầu kiểm thử:

{{requirement}}

Source code nếu có:

{{source_code}}

API information nếu có:

{{api_information}}

Database information nếu có:

{{database_information}}

Test data nếu có:

{{test_data}}

Hãy:

1. Phân tích yêu cầu.
2. Xác định Test Scenario.
3. Tạo Test Case.
4. Xác định Test Data.
5. Xác định Expected Result.
6. Nếu có kết quả thực thi, phân tích PASS/FAIL.
7. Phân tích các lỗi phát hiện được.
8. Đề xuất kiểm thử bổ sung.

Không tự tạo kết quả test nếu chưa thực thi.

---

## 11. AI Testing Rules

### Rule 1 — Kiểm thử AI không chỉ kiểm tra HTTP 200

Đối với chức năng AI, phải kiểm tra cả nội dung trả về.

Ví dụ:

* HTTP status.
* Response structure.
* Số liệu.
* Mã tài sản.
* Trạng thái.
* Tính nhất quán với dữ liệu đầu vào.

### Rule 2 — Kiểm tra Hallucination

AI không được tự tạo:

* tài sản.
* mã tài sản.
* số lượng.
* trạng thái.
* giá trị.
* lịch sử sửa chữa.

Nếu dữ liệu không có:

> Không đủ dữ liệu.

### Rule 3 — Kiểm tra Skill Routing

Ví dụ:

| User Request                  | Expected Skill                   |
| ----------------------------- | -------------------------------- |
| "Tạo báo cáo kiểm kê"         | Inventory Report Skill           |
| "Tóm tắt tình trạng phòng IT" | Condition Summary Skill          |
| "Tài sản nào cần thay thế?"   | Replacement Recommendation Skill |
| "Tạo Test Case cho kiểm kê"   | Testing Skill                    |

### Rule 4 — Kiểm tra dữ liệu đầu vào

Test với:

* dữ liệu đầy đủ.
* dữ liệu rỗng.
* dữ liệu thiếu trường.
* dữ liệu sai kiểu.
* dữ liệu không hợp lệ.
* dữ liệu mâu thuẫn.

---

## 12. Error Handling

### Không có Requirement

Trả:

> Không đủ thông tin yêu cầu để tạo Test Case.

### Không có Test Data

Có thể tạo Test Case nhưng phải ghi:

> Test Data chưa được cung cấp.

Không tự giả định dữ liệu thực tế.

### Không có Tool thực thi

Trả Test Case với trạng thái:

> NOT EXECUTED

Không ghi PASS hoặc FAIL.

### Không có Actual Result

Không được xác định Test Case PASS/FAIL.

### Có lỗi hệ thống

Ghi:

* Error message.
* Endpoint hoặc chức năng liên quan.
* Evidence nếu có.
* Test Case liên quan.

---

## 13. Test Cases

### TC-TEST-01

Input: Yêu cầu tạo Test Case cho chức năng điều chuyển.

Expected:

* Sinh Test Scenario.
* Có Happy Path.
* Có Negative Case.
* Có Permission Case.

### TC-TEST-02

Input: Điều chuyển tài sản tới vị trí không tồn tại.

Expected:

* Test Case kiểm tra dữ liệu không hợp lệ.
* Expected Result yêu cầu hệ thống từ chối hoặc báo lỗi theo business rule.

### TC-TEST-03

Input: Kiểm kê tài sản bị thiếu.

Expected:

* Có Test Case cho trạng thái missing.
* Expected Result phản ánh đúng business rule.

### TC-TEST-04

Input: Thanh lý tài sản đã thanh lý.

Expected:

* Có Test Case kiểm tra trạng thái không hợp lệ.
* Không tạo thao tác thanh lý lần hai.

### TC-TEST-05

Input: AI sinh báo cáo từ dữ liệu kiểm kê.

Expected:

* Kiểm tra response.
* Kiểm tra số liệu.
* Kiểm tra tài sản thiếu.
* Kiểm tra tài sản hỏng.
* Kiểm tra AI không tạo số liệu.

### TC-TEST-06

Input: AI nhận dữ liệu kiểm kê rỗng.

Expected:

* AI thông báo không có dữ liệu.
* Không tự tạo báo cáo có số liệu.

### TC-TEST-07

Input: User yêu cầu "tài sản nào cần thay thế?".

Expected:

* Agent chọn Replacement Recommendation Skill.
* Không chọn Inventory Report Skill.

### TC-TEST-08

Input: User yêu cầu "tóm tắt tình trạng tài sản theo phòng ban".

Expected:

* Agent chọn Condition Summary Skill.

### TC-TEST-09

Input: User yêu cầu "tạo báo cáo kiểm kê".

Expected:

* Agent chọn Inventory Report Skill.

### TC-TEST-10

Input: Người dùng không có quyền thực hiện chức năng.

Expected:

* Request bị từ chối theo permission rule.
* Không thay đổi dữ liệu.

### TC-TEST-11

Input: Test chưa được thực thi.

Expected:

* Status = NOT EXECUTED.
* Không được ghi PASS hoặc FAIL.

### TC-TEST-12

Input: Actual Result khác Expected Result.

Expected:

* Status = FAIL.
* Hiển thị Expected Result.
* Hiển thị Actual Result.
* Ghi nhận lỗi hoặc evidence nếu có.

---

## 14. Test Priority

### High

Các chức năng ảnh hưởng trực tiếp đến dữ liệu:

* Đăng nhập.
* Phân quyền.
* Điều chuyển.
* Kiểm kê.
* Thanh lý.
* Cập nhật tài sản.

### Medium

Các chức năng:

* Tra cứu.
* Thống kê.
* Lịch sử sửa chữa.
* Báo cáo.

### Low

Các chức năng:

* Hiển thị.
* Formatting.
* Một số UI behavior không ảnh hưởng dữ liệu.

Priority phải được điều chỉnh nếu Requirement của hệ thống quy định khác.

---

## 15. Final Result

Kết quả cuối cùng phải cho biết:

* Đã kiểm thử chức năng nào.
* Có bao nhiêu Test Case.
* Bao nhiêu PASS.
* Bao nhiêu FAIL.
* Bao nhiêu NOT EXECUTED.
* Các lỗi phát hiện.
* Các Test Case cần chạy lại.
* Các khu vực cần kiểm thử bổ sung.

Không được đưa ra kết luận rằng hệ thống đạt hoặc không đạt nếu chưa có đủ kết quả kiểm thử.
