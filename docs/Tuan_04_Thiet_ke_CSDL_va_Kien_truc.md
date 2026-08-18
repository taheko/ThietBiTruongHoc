# THIẾT KẾ CƠ SỞ DỮ LIỆU VÀ MÔ HÌNH LỚP (TUẦN 04)
**Thời gian thực hiện:** 17/08/2026 – 23/08/2026  
**Nhóm thực hiện:** Nhóm 24  

---

## 1. Thiết kế cơ sở dữ liệu quan hệ (PostgreSQL / Supabase)
Bao gồm 9 bảng dữ liệu được tạo bởi tệp migration:
1. **`asset_categories` (hoặc `categories`):** Danh mục nhóm tài sản (`id`, `name`, `code`, `description`, `created_at`).
2. **`locations`:** Danh mục vị trí phòng ban (`id`, `name`, `code`, `building`, `floor`, `person_in_charge`, `created_at`).
3. **`assets`:** Thông tin tài sản trung tâm (`id`, `code`, `name`, `category_id`, `location_id`, `status`, `condition_note`, `purchase_date`, `purchase_value`, `current_value`, `created_at`, `updated_at`).
4. **`transfers`:** Phiếu điều chuyển thiết bị (`id`, `asset_id`, `from_location_id`, `to_location_id`, `transfer_date`, `reason`, `performed_by`, `created_at`).
5. **`repairs`:** Phiếu sửa chữa bảo dưỡng (`id`, `asset_id`, `description`, `cost`, `status`, `start_date`, `end_date`, `performed_by`, `created_at`).
6. **`disposals`:** Phiếu thanh lý thiết bị (`id`, `asset_id`, `reason`, `method`, `residual_value`, `disposal_date`, `approved_by`, `created_at`).
7. **`inventory_sessions`:** Đợt kiểm kê định kỳ (`id`, `name`/`title`, `start_date`, `end_date`, `status`, `notes`, `created_at`).
8. **`inventory_items`:** Kết quả kiểm kê từng tài sản trong đợt (`id`, `session_id`, `asset_id`, `result`, `note`, `checked_at`).
9. **`ai_reports`:** Báo cáo AI đã sinh (`id`, `type`, `title`, `content`, `source_data`, `created_at`).

## 2. Các ràng buộc toàn vẹn & Phân quyền bảo mật (RLS)
- Khóa chính: Khóa chính `id` kiểu `uuid` với `DEFAULT gen_random_uuid()`.
- Khóa ngoại: 
  - `assets.category_id` -> `categories(id) ON DELETE SET NULL`
  - `assets.location_id` -> `locations(id) ON DELETE SET NULL`
  - `transfers.asset_id`, `repairs.asset_id`, `disposals.asset_id` -> `assets(id) ON DELETE CASCADE`
  - `inventory_items.session_id` -> `inventory_sessions(id) ON DELETE CASCADE`
  - `inventory_items.asset_id` -> `assets(id) ON DELETE CASCADE`
- Ràng buộc miền giá trị CHECK:
  - `repairs.status IN ('pending', 'in_progress', 'completed', 'cancelled')`
  - `disposals.method IN ('liquidation', 'donation', 'sale', 'scrap', 'sell', 'donate', 'other')`
  - `inventory_sessions.status IN ('in_progress', 'completed', 'cancelled', 'open')`
  - `ai_reports.type IN ('inventory_report', 'condition_summary', 'replacement_suggestions')`
- RLS: Row Level Security được bật trên toàn bộ các bảng.

## 3. Phân luồng màn hình (Screen Flow)
- Đăng nhập/Đăng ký -> Tổng quan (Dashboard)
- Menu bên trái gồm 9 mục: Tổng quan, Tài sản, Nhóm tài sản, Vị trí, Điều chuyển, Sửa chữa, Thanh lý, Kiểm kê, AI Báo cáo.
