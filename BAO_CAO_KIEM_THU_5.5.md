# PHẦN 5.5: BÁO CÁO KẾT QUẢ KIỂM THỬ CHỨC NĂNG
**Đề tài:** Hệ thống quản lý thiết bị trường học có tích hợp AI  
**Nhóm thực hiện:** Nhóm 24 (Triệu Trúc Lâm - DTC245220060, Triệu Văn Thiệp - DTC245220061)  
**Thời gian thực hiện kiểm thử:** Từ 22/09/2026 đến 25/09/2026  

---

### Bảng 90: Báo cáo kết quả kiểm thử chức năng

| Test ID | Ngày testing | Người tham gia Test | Pass/Fail | Độ nghiêm trọng | Tóm tắt lỗi | Ghi chú |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **TC_01** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Đăng ký thành công, hiển thị thông báo "Tài khoản đã tạo. Vui lòng đăng nhập." và tự động chuyển về tab Đăng nhập | UC001 |
| **TC_02** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form, yêu cầu mật khẩu tối thiểu 6 ký tự | UC001 |
| **TC_03** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form, thông báo email không đúng định dạng | UC001 |
| **TC_04** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Đăng nhập thành công, hiển thị thanh menu 9 mục và màn hình Tổng quan | UC002 |
| **TC_05** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Hiển thị thông báo lỗi màu đỏ "Sai email hoặc mật khẩu", giữ nguyên tại màn hình Đăng nhập | UC002 |
| **TC_06** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form khi bỏ trống trường bắt buộc | UC002 |
| **TC_07** | 22/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Bấm Đăng xuất phiên bị hủy, hệ thống điều hướng về màn hình Đăng nhập | UC003 |
| **TC_08** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Tài khoản mới các chỉ số bằng 0, khối Tài sản gần đây hiển thị "Chưa có tài sản nào." | UC004 |
| **TC_09** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Tổng tài sản, tổng giá trị VNĐ và các khối phân bố theo tình trạng, trạng thái hiển thị đúng số liệu | UC004 |
| **TC_10** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Thêm mới nhóm "Máy tính", thẻ nhóm xuất hiện với Số tài sản: 0 | UC005 |
| **TC_11** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Trình duyệt chặn form khi bỏ trống mã nhóm bắt buộc | UC005 |
| **TC_12** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Cập nhật mô tả nhóm thành công, thẻ hiển thị nội dung mới | UC005 |
| **TC_13** | 23/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Có popup xác nhận "Xóa nhóm …?", nhóm bị xóa và tài sản thuộc nhóm chuyển sang Nhóm "—" | UC005 |
| **TC_14** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Thêm vị trí "Phòng Tin học 1" thành công, thẻ hiển thị "Tòa A — Tầng 2", Số tài sản: 0 | UC006 |
| **TC_15** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form khi để trống tên vị trí | UC006 |
| **TC_16** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Xác nhận xóa vị trí, vị trí bị xóa và tài sản đặt tại đó chuyển sang Vị trí "—" | UC006 |
| **TC_17** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Thêm tài sản MT-001 thành công, xuất hiện đầu bảng với Giá trị 12.000.000 đ, Tình trạng Tốt, Trạng thái Đang sử dụng | UC007 |
| **TC_18** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form khi để trống mã tài sản | UC007 |
| **TC_19** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Để trống giá mua và giá trị hiện tại, hệ thống tự động lưu giá trị 0 | UC007 |
| **TC_20** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Sửa tài sản thành công, tình trạng cập nhật thành "Hư hỏng nhẹ" | UC007 |
| **TC_21** | 23/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Xác nhận xóa tài sản BG-001, tài sản biến mất khỏi bảng và CSDL | UC007 |
| **TC_22** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tìm kiếm từ khóa "MT-001", bảng chỉ hiển thị đúng tài sản MT-001 | UC008 |
| **TC_23** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tìm kiếm từ khóa "sn123", hệ thống tìm thấy đúng tài sản SN123 không phân biệt hoa thường | UC008 |
| **TC_24** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Chọn bộ lọc tình trạng "Hỏng", bảng chỉ hiển thị các tài sản hỏng | UC008 |
| **TC_25** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tìm kiếm từ khóa không khớp "XYZ999", bảng hiển thị "Chưa có tài sản" | UC008 |
| **TC_26** | 24/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Tạo phiếu điều chuyển Từ vị trí tự động: lấy đúng vị trí hiện tại, tài sản chuyển vị trí đích và trạng thái thành "Đã điều chuyển" | UC009 |
| **TC_27** | 24/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form khi thiếu Đến vị trí bắt buộc | UC009 |
| **TC_28** | 24/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Xác nhận xóa phiếu điều chuyển: phiếu bị xóa, vị trí và trạng thái tài sản giữ nguyên | UC009 |
| **TC_29** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tạo phiếu sửa chữa trạng thái "Đang sửa": tài sản tự đổi thành "Đang sửa chữa", Dashboard chỉ số chờ xử lý tăng 1 | UC010 |
| **TC_30** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Cập nhật phiếu sang "Hoàn thành": tài sản tự chuyển về "Đang sử dụng" và tình trạng "Tốt" | UC010 |
| **TC_31** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tạo phiếu trạng thái "Chờ xử lý": phiếu được lưu, tài sản giữ nguyên trạng thái | UC010 |
| **TC_32** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Trình duyệt chặn gửi form khi để trống mô tả hỏng hóc | UC010 |
| **TC_33** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tạo phiếu thanh lý phương thức Bán thành công, tài sản tự chuyển sang trạng thái "Đã thanh lý" | UC011 |
| **TC_34** | 24/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Hiện cảnh báo "Xóa phiếu thanh lý này? Trạng thái tài sản sẽ không tự khôi phục.", phiếu bị xóa, tài sản vẫn giữ nguyên "Đã thanh lý" | UC011 |
| **TC_35** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Tạo đợt kiểm kê thành công, đợt có trạng thái "Đang làm" và tự động mở màn hình chi tiết đợt | UC012 |
| **TC_36** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Ghi nhận tài sản tìm thấy (Có), tình trạng Hư hỏng nhẹ: 3 chỉ số cập nhật đúng, tình trạng tài sản đổi sang "Hư hỏng nhẹ" | UC013 |
| **TC_37** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Ghi nhận tài sản không tìm thấy: Tìm thấy hiển thị "Thiếu", chỉ số Thiếu tăng 1, tình trạng tài sản giữ nguyên | UC013 |
| **TC_38** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Xác nhận hoàn thành đợt: đợt chuyển "Đã hoàn thành", ghi ngày kết thúc hôm nay; các nút Ghi nhận, Sửa, Xóa kết quả tự động ẩn | UC012 |
| **TC_39** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Xác nhận xóa đợt kiểm kê, đợt và các kết quả kiểm kê liên quan biến mất khỏi danh sách | UC012 |
| **TC_40** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Chọn Báo cáo kiểm kê nhưng chưa chọn đợt, hệ thống báo lỗi "Vui lòng chọn đợt kiểm kê để sinh báo cáo." | UC014 |
| **TC_41** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Nút chuyển "Đang sinh báo cáo...", báo cáo hiển thị tiêu đề kèm nhãn "Đã lưu", xuất hiện trong danh sách Báo cáo đã lưu | UC014 |
| **TC_42** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Sinh báo cáo tóm tắt tình trạng theo phòng ban, tính đúng chỉ số sức khỏe tài sản (% Mới/Tốt) từng phòng | UC014 |
| **TC_43** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Sinh gợi ý thay thế: tài sản hỏng đã sửa 3 lần nằm trong mục "Tài sản đề xuất thay thế" với lý do "Đã sửa 3 lần…" | UC014 |
| **TC_44** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Khi tất cả tài sản đều Tốt/Mới, báo cáo ghi rõ "Không có tài sản nào trong tình trạng hư hỏng hoặc mất..." | UC014 |
| **TC_45** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Bấm vào một báo cáo cũ trong danh sách, nội dung báo cáo hiển thị chính xác lên khung xem | UC015 |
| **TC_46** | 25/09/2026 | Triệu Trúc Lâm | **Pass** | — | Không có lỗi. Bấm Xóa báo cáo có xác nhận "Xóa báo cáo này?", báo cáo biến mất khỏi danh sách, số lượng giảm 1 | UC015 |
| **TC_47** | 25/09/2026 | Triệu Văn Thiệp | **Pass** | — | Không có lỗi. Đăng nhập tài khoản B mới không thấy tài sản của tài khoản A (chính sách RLS hoạt động chính xác) | RLS |

---

### 5.6 Tổng hợp kết quả theo tài liệu kiểm thử

- **Tổng số tình huống kiểm thử (Test Cases):** 47 tình huống.
- **Số tình huống Đạt (Pass):** 47 / 47 (tỷ lệ đạt **100%**).
- **Số tình huống Không đạt (Fail):** 0 / 47 (tỷ lệ lỗi **0%**).
- **Mức độ bao phủ:**
  - 15/15 Use Cases (UC001 đến UC015) đạt 100%.
  - 16 yêu cầu chức năng (FR-01 đến FR-16) đạt 100%.
  - 11 yêu cầu phi chức năng (NFR-01 đến NFR-11), bao gồm kiểm soát phiên làm việc, giao diện tiếng Việt, định dạng tiền tệ VNĐ và cơ chế phân quyền bảo mật cấp hàng (Row Level Security - RLS) đạt 100%.
