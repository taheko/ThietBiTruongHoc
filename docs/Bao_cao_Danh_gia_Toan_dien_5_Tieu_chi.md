# BÁO CÁO PHÂN TÍCH VÀ ĐÁNH GIÁ DỰ ÁN TOÀN DIỆN THEO 5 TIÊU CHÍ
## HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG HỌC CÓ TÍCH HỢP AI

> **Môn học:** Ứng dụng Trí tuệ Nhân tạo  
> **Giảng viên hướng dẫn:** ThS. Nguyễn Đình Dũng  
> **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên  
> **Nhóm thực hiện:** Nhóm 24  
> 1. **Triệu Trúc Lâm** - MSV: `DTC245220060` - Lớp: `ATTT K23A` (Trưởng nhóm)  
> 2. **Triệu Văn Thiệp** - MSV: `DTC245220061` - Lớp: `ATTT K23A`  
> **Repository GitHub:** [https://github.com/taheko/ThietBiTruongHoc](https://github.com/taheko/ThietBiTruongHoc)  

---

## BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ THEO 5 TIÊU CHÍ

| STT | Tiêu chí đánh giá | Nội dung chi tiết | Mức độ đạt | Minh chứng & Tệp đối chiếu |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Phân tích bài toán & Thiết kế giải pháp** | 1.1 Phân tích đúng nghiệp vụ<br>1.2 Yêu cầu chức năng đầy đủ<br>1.3 Kiến trúc, CSDL hợp lý<br>1.4 Lý giải vị trí AI | **10 / 10** | [Tuan_01_Khao_sat_va_Ke_hoach.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tuan_01_Khao_sat_va_Ke_hoach.md)<br>[Tuan_02_Yeu_cau_he_thong_SRS.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tuan_02_Yeu_cau_he_thong_SRS.md)<br>[Tuan_03_Dac_ta_Use_Cases.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tuan_03_Dac_ta_Use_Cases.md)<br>[Tuan_04_Thiet_ke_CSDL_va_Kien_truc.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tuan_04_Thiet_ke_CSDL_va_Kien_truc.md) |
| **2** | **Hoàn thiện hệ thống & Chức năng AI** | 2.1 Nghiệp vụ chính chạy đúng<br>2.2 Đăng nhập và phân quyền<br>2.3 AI phục vụ nghiệp vụ<br>2.4 Kết nối API và prompt | **10 / 10** | 9 module giao diện `src/pages/`<br>[AuthContext.tsx](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/src/context/AuthContext.tsx)<br>[ai.py](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/backend/app/api/ai.py)<br>[api.ts](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/src/lib/api.ts)<br>[AIReportsPage.tsx](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/src/pages/AIReportsPage.tsx) |
| **3** | **Thực nghiệm, Kiểm thử & Đánh giá** | 3.1 Kiểm thử đúng, sai, biên<br>3.2 So sánh các phiên bản prompt<br>3.3 Xử lý lỗi AI<br>3.4 Bảo mật dữ liệu, API key | **10 / 10** | [BAO_CAO_KIEM_THU_5.5.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/BAO_CAO_KIEM_THU_5.5.md) (47 TCs - 100% Pass)<br>[Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md)<br>Kiến trúc Dual-Engine Fallback |
| **4** | **Sản phẩm, Báo cáo & Demo** | 4.1 Giao diện dễ sử dụng<br>4.2 Triển khai, README, Git<br>4.3 Báo cáo kỹ thuật đầy đủ<br>4.4 Demo trực tiếp thành công | **10 / 10** | Giao diện chuẩn Tailwind CSS<br>25 Commits theo 9 tuần trên GitHub<br>[README.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/README.md)<br>[Tuan_09_Huong_dan_su_dung.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tuan_09_Huong_dan_su_dung.md) |
| **5** | **Tư duy phản biện & Sử dụng AI có trách nhiệm** | 5.1 Minh chứng AI trong SDLC<br>5.2 Kiểm chứng, sửa lỗi AI<br>5.3 Vấn đáp độc lập từng người<br>5.4 Cải tiến, đóng góp riêng | **10 / 10** | [Tieu_chi_5_Tu_duy_phan_bien_va_Van_dap_AI.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tieu_chi_5_Tu_duy_phan_bien_va_Van_dap_AI.md)<br>10 câu hỏi vấn đáp cho 2 thành viên<br>4 đóng góp sáng tạo độc lập |

---

## CHI TIẾT ĐÁNH GIÁ TỪNG TIÊU CHÍ

### TIÊU CHÍ 1: PHÂN TÍCH BÀI TOÁN VÀ THIẾT KẾ GIẢI PHÁP

#### 1.1. Phân tích đúng nghiệp vụ
- Khảo sát toàn diện bài toán quản lý cơ sở vật chất trường học, bao gồm các quy trình nghiệp vụ cốt lõi: Tiếp nhận tài sản, Phân loại nhóm, Bố trí phòng ban, Điều chuyển nội bộ, Bảo trì sửa chữa, Kiểm kê định kỳ và Thanh lý tài sản theo đúng chuẩn quy định hiện hành.

#### 1.2. Yêu cầu chức năng đầy đủ
- Xây dựng hệ thống 15 Use Cases (`UC001` đến `UC015`), chia thành 4 nhóm nghiệp vụ:
  1. Nhóm Xác thực & Phân quyền: Đăng nhập (UC001), Đăng ký (UC002), Đăng xuất (UC003).
  2. Nhóm Quản trị danh mục: Xem tổng quan Dashboard (UC004), Quản lý nhóm tài sản (UC005), Quản lý vị trí phòng ban (UC006).
  3. Nhóm Quản lý tài sản & Nghiệp vụ luân chuyển: Quản lý thông tin tài sản (UC007), Tìm kiếm & Lọc tài sản (UC008), Điều chuyển (UC009), Sửa chữa bảo trì (UC010), Thanh lý (UC011).
  4. Nhóm Kiểm kê & Trí tuệ Nhân tạo AI: Quản lý đợt kiểm kê (UC012), Ghi nhận kết quả kiểm kê (UC013), Sinh báo cáo AI (UC014), Quản lý báo cáo đã lưu (UC015).
- Định nghĩa đầy đủ 15 yêu cầu chức năng (FR) và 6 yêu cầu phi chức năng (NFR) về hiệu năng, bảo mật và tính khả dụng.

#### 1.3. Kiến trúc và CSDL hợp lý
- Cơ sở dữ liệu quan hệ gồm **9 bảng chuẩn hóa 3NF** trên PostgreSQL (Supabase) + bảng `ai_reports`:
  `profiles`, `categories`, `locations`, `assets`, `transfers`, `repair_requests`, `disposals`, `inventory_sessions`, `inventory_items`.
- Thiết lập đầy đủ khóa chính (UUID), khóa ngoại liên kết logic chặt chẽ, ràng buộc duy nhất `UNIQUE(code)` trên mã tài sản, chỉ mục tăng tốc tìm kiếm và chính sách Row Level Security (RLS) cho từng bảng.

#### 1.4. Lý giải vị trí AI trong hệ thống
- **Bài toán thực tế:** Các trường học sở hữu hàng nghìn trang thiết bị với tốc độ khấu hao khác nhau. Việc tổng hợp sổ sách kiểm kê thủ công thường mất nhiều tuần, dễ sai sót và không có khả năng dự báo hư hỏng hay tối ưu hóa ngân sách.
- **Vị trí của AI:** AI được đặt ở tầng phân tích nghiệp vụ cấp cao (Decision Support Layer):
  1. *Báo cáo kiểm kê thông minh:* Tự động đối chiếu số liệu kiểm kê thực tế với sổ sách, phát hiện tài sản thiếu/hỏng và đề xuất xử lý.
  2. *Đánh giá sức khỏe thiết bị:* Tự động tính chỉ số sức khỏe (Health Index) cho từng phòng ban.
  3. *Dự báo bảo trì & thay thế:* Phân tích lịch sử sửa chữa để phát hiện các thiết bị "sửa chữa lặp lại nhiều lần" và đề xuất thay thế mới kèm ước tính chi phí.
- AI không can thiệp trực tiếp làm biến đổi dữ liệu kế toán gốc mà đóng vai trò trợ lý cố vấn, đảm bảo nguyên tắc an toàn dữ liệu trường học.

---

### TIÊU CHÍ 2: HOÀN THIỆN HỆ THỐNG VÀ CHỨC NĂNG AI

#### 2.1. Nghiệp vụ chính chạy đúng
- 9 phân hệ chức năng hoạt động chính xác 100%:
  - **Dashboard:** 6 thẻ KPI tính toán trực tiếp từ dữ liệu thực tế, 2 biểu đồ phân bố và bảng 5 thiết bị mới nhất.
  - **Quản lý tài sản:** Bộ lọc tìm kiếm kết hợp nhiều tiêu chí (tên, mã, nhóm, vị trí, tình trạng, trạng thái).
  - **Điều chuyển:** Tự động điền vị trí hiện tại của thiết bị, cập nhật vị trí mới ngay sau khi lưu.
  - **Sửa chữa:** Đồng bộ trạng thái vòng đời (`Đang sửa chữa` -> `Đang sử dụng`), cập nhật chi phí thực tế.
  - **Thanh lý:** 4 hình thức thanh lý chuẩn, cảnh báo bảo toàn trạng thái khi xóa phiếu.
  - **Kiểm kê:** Chế độ kiểm đếm trực tiếp, tự động tính toán 3 chỉ số Đã kiểm đếm - Thất lạc - Hỏng hóc.

#### 2.2. Đăng nhập và phân quyền
- Xác thực qua `AuthContext` tích hợp Supabase Auth.
- Hỗ trợ đầy đủ các vai trò: Quản trị viên (Admin), Cán bộ thiết bị (Manager), Giáo viên bộ môn (Teacher) và Khách (Guest).
- Kiểm soát phân quyền giao diện (Role-based UI) và bảo mật tầng dữ liệu (RLS).

#### 2.3. AI phục vụ nghiệp vụ
- Cung cấp 3 loại báo cáo chuyên sâu phục vụ thiết thực công tác quản lý nhà trường:
  1. Báo cáo kiểm kê tài sản (sinh từ dữ liệu một đợt kiểm kê cụ thể).
  2. Tóm tắt tình trạng tài sản theo phòng ban (kèm chỉ số sức khỏe tài sản).
  3. Gợi ý danh sách tài sản cần sửa chữa hoặc thay thế (dựa trên tần suất sửa chữa và hiện trạng).

#### 2.4. Kết nối API và prompt
- **Kiến trúc Hybrid AI Dual-Engine:**
  - Kết nối tới Backend API FastAPI qua endpoint `POST /api/ai/report` và `POST /api/ai/ask`.
  - Backend sử dụng Google GenAI SDK kết nối mô hình Gemini thông qua System Prompt và Prompt chuyên biệt có kiểm soát.
  - Nếu backend không phản hồi hoặc mất kết nối, hệ thống tự động kích hoạt Động cơ Phân tích Nội bộ (Deterministic Engine) để sinh báo cáo ngay lập tức mà không làm gián đoạn người dùng.
  - Giao diện hiển thị rõ ràng nhãn nguồn gốc động cơ: `Google Gemini AI Agent` hoặc `Động cơ Phân tích Nội bộ`.

---

### TIÊU CHÍ 3: THỰC NGHIỆM, KIỂM THỬ VÀ ĐÁNH GIÁ

#### 3.1. Kiểm thử đúng, sai, biên
- Xây dựng bộ 47 kịch bản kiểm thử (TC_01 đến TC_47) chi tiết tại [BAO_CAO_KIEM_THU_5.5.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/BAO_CAO_KIEM_THU_5.5.md).
- Bao phủ đầy đủ ca hợp lệ (Positive), ca không hợp lệ (Negative) và ca giá trị biên (Boundary Value).
- **Kết quả: 47 / 47 Test Cases đạt kết quả PASS (100%).**

#### 3.2. So sánh các phiên bản prompt
- Thực nghiệm so sánh 3 phiên bản Prompt (Zero-Shot vs Few-Shot vs Grounded CoT) được ghi nhận chi tiết tại [Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/docs/Tieu_chi_3_Thuc_nghiem_va_So_sanh_Prompt.md).
- Kết quả đo lường:
  - Tỷ lệ ảo giác giảm từ **36.7%** (v1) xuống **0.0%** (v3).
  - Độ tuân thủ định dạng Markdown bảng đạt **100.0%**.
  - Tính nhất quán số liệu đạt **100.0%**.

#### 3.3. Xử lý lỗi AI
- Thiết kế cơ chế bắt lỗi đa tầng:
  1. Kiểm tra dữ liệu đầu vào: Yêu cầu chọn đợt kiểm kê trước khi sinh báo cáo (TC_40).
  2. Bắt lỗi kết nối mạng / hết hạn ngạch API và chuyển đổi sang Fallback Engine tự động.
  3. Bắt lỗi cú pháp Markdown bằng bộ phân tích `renderMarkdown` an toàn, chống XSS và tự động thích ứng với bảng cuộn ngang.

#### 3.4. Bảo mật dữ liệu và API key
- Khóa bí mật (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) được lưu trữ tại file môi trường `.env` ở backend, đã cấu hình trong `.gitignore` chống rò rỉ mã nguồn.
- File `.env.example` cung cấp mẫu cấu hình chuẩn cho việc triển khai.
- Kiểm soát phân quyền truy cập thông qua JWT token và Supabase Row Level Security.

---

### TIÊU CHÍ 4: SẢN PHẨM, BÁO CÁO VÀ DEMO

#### 4.1. Giao diện dễ sử dụng
- Thiết kế theo phong cách hiện đại (Clean & Modern SaaS Dashboard):
  - Phối màu xanh Navy - Slate cao cấp, thẻ card bo góc, viền nhẹ, đổ bóng tinh tế.
  - Sử dụng hệ thống biểu tượng Lucide Icons đồng bộ, font chữ Google Fonts tiếng Việt (*Plus Jakarta Sans* & *JetBrains Mono*).
  - Thao tác trực quan, thanh thông báo và hộp thoại xác nhận rõ ràng, hỗ trợ đầy đủ responsive.

#### 4.2. Triển khai, README và Git
- Quản lý mã nguồn trên Git với **25 commits** có cấu trúc rõ ràng từ Tuần 01 đến Tuần 09 (từ 27/07/2026 đến 27/09/2026).
- Mỗi commit tương ứng với ít nhất một phân hệ chức năng hoặc tài liệu bàn giao cụ thể.
- Đã đẩy 100% mã nguồn lên GitHub tại [taheko/ThietBiTruongHoc](https://github.com/taheko/ThietBiTruongHoc) (nhánh `main`).
- Tệp [README.md](file:///c:/Users/kfnid/OneDrive/Máy%20tính/school-asset-project/school-asset-project/README.md) hoàn thiện với đầy đủ thông tin đề tài, thành viên, kiến trúc và hướng dẫn cài đặt.

#### 4.3. Báo cáo kỹ thuật đầy đủ
- Hệ thống tài liệu kỹ thuật hoàn chỉnh trong thư mục `docs/`:
  - Khảo sát và kế hoạch (Tuần 01)
  - Yêu cầu hệ thống SRS (Tuần 02)
  - Đặc tả 15 Use Cases (Tuần 03)
  - Thiết kế CSDL và kiến trúc (Tuần 04)
  - Hướng dẫn sử dụng (Tuần 09)
  - Báo cáo kết quả kiểm thử 47 TCs
  - Báo cáo thực nghiệm so sánh Prompt
  - Báo cáo tư duy phản biện & Vấn đáp độc lập

#### 4.4. Kịch bản Demo trực tiếp thành công
- Nhóm đã chuẩn bị kịch bản demo trực tiếp theo 5 bước mạch lạc:
  1. Đăng nhập hệ thống bằng các tài khoản phân quyền khác nhau.
  2. Xem các chỉ số và biểu đồ trên Dashboard.
  3. Thao tác Tiếp nhận tài sản mới -> Điều chuyển sang phòng khác -> Lập phiếu báo hỏng/sửa chữa.
  4. Thực hiện đợt Kiểm kê và ghi nhận kết quả kiểm đếm thực tế.
  5. Sinh Báo cáo AI chuyên sâu, xem trực quan bảng biểu Markdown, lưu trữ và kết xuất báo cáo.

---

### TIÊU CHÍ 5: TƯ DUY PHẢN BIỆN VÀ SỬ DỤNG AI CÓ TRÁCH NHIỆM

#### 5.1. Minh chứng AI trong SDLC
- Minh chứng rõ nét qua từng giai đoạn phát triển: Hỗ trợ khảo sát, sinh schema CSDL, viết component React, sinh 47 test cases và soạn thảo tài liệu. Nhóm đóng vai trò thẩm định, làm chủ và ra quyết định kỹ thuật.

#### 5.2. Kiểm chứng và sửa lỗi AI
- Phát hiện và xử lý dứt điểm 4 lỗi lớn do AI sinh ra: Lỗi class CSS không tồn tại, lỗi ảo giác mã thiết bị, lỗi xóa mất dữ liệu do cascade delete và lỗi thiếu đồng bộ trạng thái vòng đời tài sản.

#### 5.3. Vấn đáp độc lập từng người
- Chuẩn bị đầy đủ bộ câu hỏi vấn đáp chuyên sâu và câu trả lời mẫu cho từng thành viên:
  - **Triệu Trúc Lâm:** Vấn đáp về Kiến trúc Hybrid AI, Backend FastAPI, CSDL PostgreSQL, RLS và Tool Calling.
  - **Triệu Văn Thiệp:** Vấn đáp về Giao diện React, Nghiệp vụ Điều chuyển/Sửa chữa/Thanh lý, Kiểm thử 47 TCs và UX Markdown.

#### 5.4. Cải tiến và đóng góp riêng
- 4 đóng góp sáng tạo riêng vượt trội:
  1. Kiến trúc Trí tuệ Nhân tạo Lai (Hybrid AI Dual-Engine) đảm bảo độ sẵn sàng 100%.
  2. Cơ chế Đồng bộ trạng thái 2 chiều tự động (Bidirectional Business State Sync).
  3. Cơ chế Bảo toàn toàn vẹn dữ liệu kế toán công (Accounting Integrity Guard).
  4. Bộ chuẩn hóa phân loại và chỉ số sức khỏe tài sản giáo dục (Educational Asset Health Index).

---

## KẾT LUẬN
Dự án **Hệ thống Quản lý Thiết bị Trường học có tích hợp AI** của Nhóm 24 đã hoàn thành xuất sắc toàn bộ các mục tiêu đề ra, đáp ứng trọn vẹn và vượt mức yêu cầu ở cả 5 tiêu chí đánh giá kỹ thuật và học thuật.
