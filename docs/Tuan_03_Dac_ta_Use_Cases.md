# ĐẶC TẢ USE CASES VÀ TÁC NHÂN HỆ THỐNG (TUẦN 03)
**Thời gian thực hiện:** 10/08/2026 – 16/08/2026  
**Nhóm thực hiện:** Nhóm 24  

---

## 1. Danh sách tác nhân hệ thống (Bảng 5)
1. **Khách (Guest):** Người dùng chưa đăng nhập. Chỉ truy cập được màn hình Đăng nhập / Đăng ký.
2. **Quản trị viên (Admin):** Cán bộ quản lý tài sản đã đăng nhập. Được sử dụng toàn bộ chức năng: danh mục, tài sản, điều chuyển, sửa chữa, thanh lý, kiểm kê và sinh báo cáo AI.

## 2. Danh mục 15 Use Cases cốt lõi (Bảng 6)
- **UC001 – Đăng ký tài khoản:** Khách tạo tài khoản mới bằng email và mật khẩu (tối thiểu 6 ký tự).
- **UC002 – Đăng nhập:** Khách đăng nhập vào hệ thống, lưu phiên làm việc.
- **UC003 – Đăng xuất:** Kết thúc phiên làm việc an toàn, quay về màn hình đăng nhập.
- **UC004 – Xem tổng quan (Dashboard):** 6 thẻ chỉ số, biểu đồ phân bố tình trạng & trạng thái, bảng 5 tài sản gần đây.
- **UC005 – Quản lý nhóm tài sản:** Xem, thêm, sửa, xóa nhóm tài sản dạng thẻ card.
- **UC006 – Quản lý vị trí:** Xem, thêm, sửa, xóa vị trí phòng ban (tòa nhà, tầng, người phụ trách).
- **UC007 – Quản lý tài sản:** Xem, thêm, sửa, xóa tài sản với đầy đủ thông tin chi tiết.
- **UC008 – Tìm kiếm, lọc tài sản:** Tìm kiếm theo mã, tên, serial; lọc theo nhóm, vị trí, tình trạng, trạng thái.
- **UC009 – Điều chuyển tài sản:** Lập phiếu điều chuyển, tự động cập nhật vị trí mới và trạng thái "Đã điều chuyển".
- **UC010 – Quản lý sửa chữa:** Theo dõi phiếu sửa chữa, tự động chuyển tài sản thành "Đang sửa chữa" hoặc "Đang sử dụng" + "Tốt".
- **UC011 – Thanh lý tài sản:** Lập phiếu thanh lý (Thanh lý, Tặng cho, Bán, Phế liệu); cảnh báo không khôi phục trạng thái khi xóa phiếu.
- **UC012 – Quản lý đợt kiểm kê:** Tạo đợt mới (mở ngay chi tiết), xem danh sách, hoàn thành và xóa đợt.
- **UC013 – Ghi nhận kết quả kiểm kê:** Đánh dấu tìm thấy/thiếu, vị trí thực tế, tình trạng quan sát; tự động cập nhật tình trạng tài sản.
- **UC014 – Sinh báo cáo AI:** Tự động phân tích sinh 3 loại báo cáo (Kiểm kê, Tóm tắt tình trạng, Gợi ý thay thế); tự động lưu vào CSDL.
- **UC015 – Xem, xóa báo cáo đã lưu:** Tra cứu lại nội dung báo cáo cũ và xóa báo cáo khỏi danh sách.
