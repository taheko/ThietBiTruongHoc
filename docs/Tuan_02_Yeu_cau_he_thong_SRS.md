# ĐẶC TẢ YÊU CẦU HỆ THỐNG - SRS (TUẦN 02)
**Thời gian thực hiện:** 03/08/2026 – 09/08/2026  
**Nhóm thực hiện:** Nhóm 24  

---

## 1. Bộ câu hỏi khảo sát và thu thập yêu cầu (Bảng 2)
- Xác định đối tượng phục vụ: Cán bộ quản lý tài sản, thiết bị nhà trường.
- Cơ chế truy cập: Trình duyệt web, đăng ký/đăng nhập bằng email và mật khẩu tối thiểu 6 ký tự.
- Cơ chế bảo mật dữ liệu: Row Level Security (RLS) - mỗi tài khoản quản lý dữ liệu độc lập.
- Thông tin quản lý thiết bị: Mã, tên, nhóm, vị trí, số serial, ngày mua, giá mua, giá trị hiện tại, tình trạng, trạng thái.
- Tích hợp AI: Tự động sinh Báo cáo kiểm kê theo đợt, Tóm tắt tình trạng theo phòng ban với chỉ số sức khỏe, Gợi ý danh sách sửa chữa / thay thế.

## 2. Danh sách yêu cầu chức năng (Functional Requirements - FR)
- **FR-01 (Đăng ký tài khoản):** Cho phép tạo tài khoản mới bằng email và mật khẩu.
- **FR-02 (Đăng nhập / Đăng xuất):** Xác thực người dùng và kết thúc phiên làm việc an toàn.
- **FR-03 (Quản lý nhóm tài sản):** Thêm, sửa, xóa, hiển thị nhóm tài sản kèm số lượng thiết bị.
- **FR-04 (Quản lý vị trí):** Thêm, sửa, xóa, hiển thị vị trí (tòa nhà, tầng, người phụ trách).
- **FR-05 (Quản lý tài sản):** Thêm, sửa, xóa tài sản với đầy đủ thông tin vòng đời.
- **FR-06 (Tìm kiếm, lọc tài sản):** Tìm theo mã, tên, serial; lọc theo nhóm, vị trí, tình trạng, trạng thái.
- **FR-07 (Điều chuyển tài sản):** Lập phiếu điều chuyển, tự động cập nhật vị trí mới và trạng thái "Đã điều chuyển".
- **FR-08 (Quản lý sửa chữa):** Lập, sửa, xóa phiếu sửa chữa; tự động chuyển trạng thái thiết bị theo tiến độ sửa.
- **FR-09 (Thanh lý tài sản):** Lập phiếu thanh lý (Thanh lý, Tặng cho, Bán, Phế liệu); cảnh báo không khôi phục khi xóa.
- **FR-10 (Quản lý đợt kiểm kê):** Tạo đợt mới, xem chi tiết, hoàn thành và xóa đợt.
- **FR-11 (Ghi nhận kết quả kiểm kê):** Đánh dấu tìm thấy/thiếu, ghi nhận tình trạng quan sát và tự cập nhật tài sản.
- **FR-12 (Màn hình tổng quan):** 6 thẻ chỉ số, biểu đồ phân bố tình trạng & trạng thái, bảng tài sản gần đây.
- **FR-13 (Báo cáo kiểm kê AI):** Phân tích tỷ lệ tìm thấy, tài sản thiếu, hỏng và đề xuất xử lý.
- **FR-14 (Tóm tắt tình trạng theo phòng ban AI):** Tính chỉ số sức khỏe tài sản (% Mới/Tốt) từng phòng ban.
- **FR-15 (Gợi ý sửa chữa / thay thế AI):** Đề xuất thay thế thiết bị mất, hỏng nhiều lần, ước tính ngân sách.
- **FR-16 (Lưu, xem, xóa báo cáo AI):** Tự động lưu báo cáo, tra cứu và xóa báo cáo cũ.

## 3. Danh sách yêu cầu phi chức năng (Non-Functional Requirements - NFR)
- **NFR-01 (Hiệu năng tải dữ liệu):** Truy vấn đồng thời, tự động tải lại khi đổi bộ lọc.
- **NFR-03 (Xác thực):** Supabase Auth, tự động duy trì và làm mới session.
- **NFR-04 (Phân quyền dữ liệu):** RLS bật trên tất cả các bảng.
- **NFR-08 (Ngôn ngữ, định dạng):** Giao diện 100% tiếng Việt, định dạng tiền tệ VNĐ.
- **NFR-09 (Trực quan hóa):** Nhãn màu phân biệt tình trạng và trạng thái.
- **NFR-10 (Thao tác an toàn):** Đánh dấu trường bắt buộc `*`, hộp thoại xác nhận khi xóa (ngoại trừ xóa kết quả kiểm kê).
- **NFR-11 (Mã nguồn):** TypeScript strict mode.
