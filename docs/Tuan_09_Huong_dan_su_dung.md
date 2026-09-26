# HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG HỌC

## 1. GIỚI THIỆU CHUNG
Hệ thống Quản lý Thiết bị & Tài sản Trường học là nền tảng số hóa toàn diện quy trình vòng đời tài sản từ khâu tiếp nhận, bố trí vị trí, điều chuyển, bảo trì sửa chữa, kiểm kê định kỳ đến thanh lý và báo cáo thông minh ứng dụng AI.

---

## 2. TÀI KHOẢN VÀ ĐĂNG NHẬP HỆ THỐNG

### 2.1. Danh sách tài khoản thử nghiệm theo phân quyền
| Vai trò | Email đăng nhập | Mật khẩu | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@school.edu.vn` | `Admin@123456` | Toàn quyền cấu hình hệ thống, quản lý người dùng, phân quyền và dữ liệu |
| **Cán bộ QL Thiết bị (Manager)** | `thietbi@school.edu.vn` | `Manager@123456` | Quản lý danh mục, tài sản, điều chuyển, sửa chữa, kiểm kê, thanh lý |
| **Giáo viên bộ môn (Teacher)** | `giaovien@school.edu.vn` | `Teacher@123456` | Xem danh mục tài sản, gửi yêu cầu báo hỏng/sửa chữa thiết bị phòng bộ môn |

### 2.2. Hướng dẫn Đăng nhập & Đăng ký
1. Truy cập vào ứng dụng qua trình duyệt web.
2. Chọn tab **Đăng nhập**, nhập email và mật khẩu tương ứng, sau đó nhấn **Đăng nhập**.
3. Người dùng mới có thể chuyển qua tab **Đăng ký**, điền Họ tên, Email, Mật khẩu và chọn Vai trò để khởi tạo tài khoản.

---

## 3. CÁC PHÂN HỆ VÀ QUY TRÌNH SỬ DỤNG

### 3.1. Tổng quan Dashboard
- **Chỉ số KPI chính:** Hiển thị 6 thẻ thông số thời gian thực: Tổng số tài sản, Tài sản đang sử dụng, Tài sản đang báo hỏng/sửa chữa, Tài sản chờ/đã thanh lý, Tổng giá trị nguyên giá (VNĐ) và Số đợt kiểm kê đang hoạt động.
- **Biểu đồ phân bổ:** Trực quan hóa tỷ lệ tài sản theo Tình trạng hoạt động và theo Vị trí phòng ban.
- **Tài sản mới tiếp nhận:** Danh sách 5 thiết bị mới nhất được ghi nhận vào hệ thống.

### 3.2. Quản lý Danh mục & Vị trí
- **Nhóm tài sản (`/categories`):**
  - Thêm, sửa, xóa nhóm tài sản (Ví dụ: Thiết bị Tin học, Thiết bị Nghe nhìn, Bàn ghế phòng học,...).
  - Tự động thống kê số lượng tài sản thuộc từng nhóm.
- **Vị trí / Phòng ban (`/locations`):**
  - Quản lý sơ đồ phòng học, phòng thí nghiệm, thư viện, hội trường.
  - Phân loại rõ: Phòng học văn hóa, Phòng bộ môn, Khu hiệu bộ, Kho chứa.

### 3.3. Quản lý Tài sản (`/assets`)
- **Tra cứu và Lọc:**
  - Tìm kiếm nhanh theo mã tài sản, tên thiết bị.
  - Bộ lọc kết hợp: Lọc theo Nhóm tài sản, Vị trí phòng ban, Tình trạng sử dụng (`Đang sử dụng`, `Hỏng hóc`, `Đang sửa chữa`, `Đã thanh lý`).
- **Thêm mới tài sản:**
  - Nhập thông tin bắt buộc: Mã tài sản, Tên thiết bị, Nhóm tài sản, Vị trí ban đầu, Nguyên giá (mặc định 0 VNĐ nếu chưa có), Năm đưa vào sử dụng, Đơn vị tính.
- **Cập nhật & Xóa:** Chỉnh sửa thông tin thiết bị hoặc xóa tài sản khỏi hệ thống khi chưa phát sinh ràng buộc nghiệp vụ.

### 3.4. Quản lý Điều chuyển (`/transfers`)
- **Tạo phiếu điều chuyển:**
  - Chọn tài sản cần di chuyển: Hệ thống **tự động điền vị trí hiện tại** vào ô "Từ vị trí".
  - Chọn vị trí đích ("Đến vị trí"), người thực hiện, ngày điều chuyển và ghi chú lý do.
- **Tác động dữ liệu:** Khi lưu phiếu điều chuyển thành công, vị trí của tài sản tại màn hình Quản lý Tài sản sẽ được cập nhật sang vị trí mới ngay lập tức.

### 3.5. Quản lý Sửa chữa & Bảo trì (`/repairs`)
- **Tạo phiếu báo hỏng / đề xuất sửa chữa:**
  - Chọn thiết bị cần sửa chữa, mô tả chi tiết lỗi phát sinh, mức độ ưu tiên và đơn vị sửa chữa dự kiến.
- **Cập nhật tiến độ & Chi phí:**
  - Cập nhật trạng thái phiếu: `Chờ tiếp nhận` -> `Đang sửa chữa` -> `Hoàn thành` / `Không thể khắc phục`.
  - Nhập chi phí sửa chữa thực tế khi hoàn tất.
  - Trạng thái của thiết bị được tự động đồng bộ sang `Đang sử dụng` sau khi sửa chữa thành công.

### 3.6. Quản lý Thanh lý (`/disposals`)
- **Tạo hồ sơ thanh lý:**
  - Chọn tài sản hết niên hạn hoặc hư hỏng không thể phục hồi.
  - Chọn 1 trong 4 hình thức thanh lý chuẩn: **Bán đấu giá**, **Hủy bỏ**, **Tặng/Cho**, **Tái chế linh kiện**.
  - Nhập giá trị thu hồi (VNĐ), ngày thanh lý và lý do phê duyệt.
- **Lưu ý bảo toàn:** Khi đã xác nhận thanh lý, trạng thái tài sản sẽ chuyển sang `Đã thanh lý` và không cho phép hoàn tác tùy tiện nhằm bảo đảm tính toàn vẹn sổ sách tài chính.

### 3.7. Kiểm kê Tài sản (`/inventory`)
- **Tạo đợt kiểm kê:**
  - Khởi tạo đợt kiểm kê theo năm/học kỳ, chọn vị trí hoặc kiểm kê toàn trường.
- **Ghi nhận thực tế (Chế độ Kiểm đếm):**
  - Chuyển sang màn hình chi tiết đợt kiểm kê.
  - Đối chiếu danh sách: Ghi nhận tình trạng thực tế của từng thiết bị (`Khớp sổ sách`, `Thừa`, `Thiếu/Thất lạc`, `Xuống cấp`).
  - Hệ thống tự động tính toán 3 chỉ số tỷ lệ: Tỷ lệ đã kiểm đếm, Tỷ lệ hao hụt/thiếu, Tỷ lệ hỏng hóc.
- **Xóa đợt kiểm kê:** Cho phép xóa nhanh đợt kiểm kê nháp trực tiếp từ danh sách.

### 3.8. AI Báo cáo Thông minh (`/ai-reports`)
- **Cơ chế phân tích:** Tự động tổng hợp dữ liệu từ 9 bảng cơ sở dữ liệu để sinh báo cáo chuyên sâu.
- **3 loại báo cáo chuyên sâu:**
  1. *Báo cáo Tổng hợp Tình trạng Thiết bị:* Phân tích hiện trạng sử dụng, tỷ lệ hao mòn và khuyến nghị phân bổ.
  2. *Báo cáo Dự báo Hư hỏng & Kế hoạch Sửa chữa/Thay thế:* Dự báo các thiết bị có nguy cơ lỗi cao dựa trên số lần sửa chữa và niên hạn sử dụng.
  3. *Báo cáo Kết quả Kiểm kê & Đề xuất Tối ưu hóa:* Đánh giá mức độ hao hụt thực tế, phát hiện vị trí tồn đọng lãng phí và đề xuất giải pháp.
- **Tính năng mở rộng:** Cho phép xem trực quan định dạng Markdown, lưu trữ báo cáo vào cơ sở dữ liệu Supabase, xem lại lịch sử và xóa báo cáo cũ.

---

## 4. XỬ LÝ SỰ CỐ THƯỜNG GẶP
1. **Không đăng nhập được:** Kiểm tra kết nối Internet và đảm bảo biến môi trường Supabase URL / Anon Key đã được cấu hình chính xác trong `.env`.
2. **Không tải được dữ liệu:** Tải lại trang (`Ctrl + F5`) hoặc kiểm tra lại chính sách Row Level Security (RLS) trên Supabase project.
3. **Mã tài sản trùng lặp:** Hệ thống áp dụng ràng buộc `UNIQUE` trên cột `code`. Vui lòng đặt mã tài sản không trùng với thiết bị đã có.
