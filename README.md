# HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG HỌC CÓ TÍCH HỢP AI

> **Đề tài:** Hệ thống quản lý thiết bị trường học có tích hợp AI  
> **Môn học:** Ứng dụng Trí tuệ Nhân tạo  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Đình Dũng  
> **Nhóm thực hiện:** Nhóm 24  
> 1. **Triệu Trúc Lâm** - MSV: `DTC245220060` - Lớp: `ATTT K23A` (Trưởng nhóm)  
> 2. **Triệu Văn Thiệp** - MSV: `DTC245220061` - Lớp: `ATTT K23A`  
> **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên  

---

## 📖 Giới thiệu đề tài

Hệ thống quản lý thiết bị trường học có tích hợp AI là giải pháp web app hiện đại giúp số hóa toàn bộ vòng đời tài sản, thiết bị trong nhà trường: từ khai báo danh mục, vị trí phòng ban, thông tin chi tiết từng thiết bị đến điều chuyển, sửa chữa bảo dưỡng, thanh lý và tổ chức kiểm kê định kỳ theo đợt. 

Hệ thống ứng dụng AI để tự động phân tích dữ liệu, đánh giá tỷ lệ tìm thấy trong các đợt kiểm kê, tính toán chỉ số sức khỏe tài sản theo từng phòng ban và đề xuất danh sách thiết bị cần sửa chữa hoặc thay thế.

---

## 🛠️ Ngăn xếp công nghệ (Tech Stack)

- **Frontend:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Lucide React Icons.
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security - RLS).
- **Mô-đun AI:** Động cơ phân tích dữ liệu thông minh theo quy tắc nghiệp vụ chuyên sâu, hỗ trợ Markdown rendering chuẩn xác.
- **Quản lý phiên & Bảo mật:** Supabase Session, RLS kiểm soát phân quyền dữ liệu.

---

## 👥 Danh sách tác nhân & Tài khoản đăng nhập

Hệ thống hỗ trợ 2 tác nhân theo đặc tả yêu cầu:

| Tác nhân | Quyền hạn | Tài khoản đăng nhập |
| :--- | :--- | :--- |
| **Khách** *(Guest)* | Truy cập màn hình Đăng nhập / Đăng ký. Có thể tự đăng ký tài khoản mới bằng email và mật khẩu. | Tự đăng ký tại tab *Đăng ký* (hoặc test: `gv01@truong.edu.vn` / `123456`) |
| **Quản trị viên** *(Admin)* | Cán bộ quản lý thiết bị đã đăng nhập. Sử dụng toàn bộ 9 chức năng trong hệ thống. | **Email:** `admin@example.com`<br>**Mật khẩu:** `123456` |

*Tài khoản phân quyền phụ có sẵn trong hệ thống (mật khẩu `123456`):*
- Kiểm kê viên: `kiemke@example.com`
- Giáo viên: `giaovien@example.com`

---

## 🚀 Danh mục 9 phân hệ chức năng

1. **Tổng quan (Dashboard - UC004):** 6 thẻ Hero KPI (Tổng tài sản, nhóm, vị trí, kiểm kê đang làm, sửa chữa chờ xử lý, tổng giá trị VNĐ), 2 biểu đồ phân bố theo tình trạng và trạng thái, bảng 5 tài sản gần đây.
2. **Quản lý tài sản (UC007, UC008):** Bảng tài sản chi tiết, tìm kiếm theo mã, tên, số serial, bộ lọc đa chiều (nhóm, vị trí, tình trạng, trạng thái).
3. **Nhóm tài sản (UC005):** Danh mục phân loại thiết bị dạng thẻ card, hiển thị số lượng tài sản thuộc nhóm.
4. **Vị trí phòng ban (UC006):** Quản lý khu vực, tòa nhà, tầng, người phụ trách và số tài sản tại từng phòng.
5. **Điều chuyển tài sản (UC009):** Lập phiếu điều chuyển thiết bị giữa các phòng ban, tự động cập nhật vị trí mới và trạng thái "Đã điều chuyển".
6. **Quản lý sửa chữa (UC010):** Lập và theo dõi phiếu sửa chữa bảo dưỡng, tự động đồng bộ tài sản sang "Đang sửa chữa" hoặc về "Đang sử dụng" + tình trạng "Tốt".
7. **Thanh lý tài sản (UC011):** Ghi nhận thanh lý, bán, tặng cho, phế liệu; cảnh báo bảo toàn trạng thái khi xóa phiếu.
8. **Kiểm kê định kỳ (UC012, UC013):** Tổ chức đợt kiểm kê, ghi nhận tìm thấy/thiếu/hỏng, tự động cập nhật tình trạng tài sản, tính toán 3 chỉ số Đã tìm thấy - Thiếu - Hư hỏng.
9. **AI Báo cáo thông minh (UC014, UC015):** Tự động sinh 3 loại báo cáo AI: Báo cáo kiểm kê theo đợt, Tóm tắt tình trạng theo phòng ban với chỉ số sức khỏe, Gợi ý sửa chữa / thay thế kèm ước tính ngân sách.

---

## 📊 Kết quả kiểm thử chức năng (Testing Compliance)

- **Tổng số tình huống kiểm thử:** 47 tình huống (TC_01 đến TC_47).
- **Kết quả đạt (Pass):** 47 / 47 tình huống (**100% Pass**).
- Chi tiết báo cáo kiểm thử được ghi nhận tại tệp [`BAO_CAO_KIEM_THU_5.5.md`](./BAO_CAO_KIEM_THU_5.5.md).

---

## 📑 Hệ thống tài liệu kỹ thuật & Đánh giá 5 Tiêu chí

Hệ thống tài liệu hoàn chỉnh được lưu trữ tại thư mục `docs/`:
- **Báo cáo Đánh giá Toàn diện 5 Tiêu chí:** [`docs/Bao_cao_Danh_gia_Toan_dien_5_Tieu_chi.md`](./docs/Bao_cao_Danh_gia_Toan_dien_5_Tieu_chi.md)
- **Thực nghiệm & So sánh các phiên bản Prompt (Tiêu chí 3.2):** [`docs/Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md`](./docs/Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md)
- **Tư duy phản biện, Minh chứng SDLC & Vấn đáp độc lập (Tiêu chí 5):** [`docs/Tieu_chi_5_Tu_duy_phan_bien_va_Van_dap_AI.md`](./docs/Tieu_chi_5_Tu_duy_phan_bien_va_Van_dap_AI.md)
- **Hướng dẫn sử dụng hệ thống:** [`docs/Tuan_09_Huong_dan_su_dung.md`](./docs/Tuan_09_Huong_dan_su_dung.md)
- **Hồ sơ thiết kế Tuần 01 - 04:** [`docs/Tuan_01_Khao_sat_va_Ke_hoach.md`](./docs/Tuan_01_Khao_sat_va_Ke_hoach.md), [`docs/Tuan_02_Yeu_cau_he_thong_SRS.md`](./docs/Tuan_02_Yeu_cau_he_thong_SRS.md), [`docs/Tuan_03_Dac_ta_Use_Cases.md`](./docs/Tuan_03_Dac_ta_Use_Cases.md), [`docs/Tuan_04_Thiet_ke_CSDL_va_Kien_truc.md`](./docs/Tuan_04_Thiet_ke_CSDL_va_Kien_truc.md)

---


## ⚙️ Hướng dẫn cài đặt và khởi chạy cục bộ

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Cấu hình biến môi trường
cp .env.example .env

# 3. Khởi chạy máy chủ phát triển
npm run dev

# 4. Kiểm tra biên dịch production
npm run build
```
