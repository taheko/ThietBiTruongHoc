/**
 * ============================================================================
 * HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG HỌC CÓ TÍCH HỢP AI
 * DATABASE SCHEMA & TYPES DEFINITIONS
 * ============================================================================
 * Phù hợp với đặc tả thực thể ERD, các ràng buộc toàn vẹn và 15 Use Cases.
 */

/* ========================================================================== */
/* 1. DOMAIN UNION TYPES & CHECK CONSTRAINTS                                 */
/* ========================================================================== */

/**
 * Tình trạng vật lý thực tế của tài sản (assets.condition, inventory_items.condition_observed)
 * 5 mức: Mới (new), Tốt (good), Hư hỏng nhẹ (damaged), Hỏng (broken), Mất (lost).
 */
export type AssetCondition = 'new' | 'good' | 'damaged' | 'broken' | 'lost';

/**
 * Trạng thái vòng đời sử dụng của tài sản (assets.status)
 * 5 mức: Đang sử dụng (in_use), Lưu kho (in_storage), Đang sửa chữa (under_repair),
 * Đã điều chuyển (transferred), Đã thanh lý (disposed).
 */
export type AssetStatus =
  | 'in_use'
  | 'in_storage'
  | 'under_repair'
  | 'transferred'
  | 'disposed';

/**
 * Trạng thái phiếu sửa chữa, bảo dưỡng tài sản (repairs.status)
 */
export type RepairStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Phương thức thanh lý tài sản (disposals.method)
 */
export type DisposalMethod = 'liquidation' | 'donation' | 'sale' | 'scrap';

/**
 * Trạng thái của một đợt kiểm kê tài sản (inventory_sessions.status)
 */
export type InventorySessionStatus = 'in_progress' | 'completed' | 'cancelled';

/**
 * Kết quả kiểm kê tài sản truyền thống (tương thích ngược)
 */
export type InventoryResult = 'good' | 'damaged' | 'missing' | 'needs_repair';

/**
 * Các loại báo cáo do mô-đun AI sinh ra (ai_reports.report_type)
 */
export type AIReportType =
  | 'inventory_report'
  | 'condition_summary'
  | 'replacement_suggestions';

/* ========================================================================== */
/* 2. CORE MASTER DATA ENTITIES (DANH MỤC & TÀI SẢN)                          */
/* ========================================================================== */

/**
 * Nhóm tài sản / Danh mục phân loại thiết bị (asset_categories / categories)
 * Use case: UC005 - Quản lý nhóm tài sản
 */
export interface Category {
  id: string;
  code: string;
  name: string;
  description: string | null;
  user_id?: string;
  created_at: string;
}

/**
 * Vị trí phòng ban, khu vực đặt tài sản (locations)
 * Use case: UC006 - Quản lý vị trí
 */
export interface Location {
  id: string;
  code: string;
  name: string;
  building: string | null;
  floor: string | null;
  person_in_charge: string | null;
  user_id?: string;
  created_at: string;
}

/**
 * Thực thể trung tâm: Tài sản & Thiết bị trường học (assets)
 * Use cases: UC007 - Quản lý tài sản, UC008 - Tìm kiếm, lọc tài sản
 */
export interface Asset {
  id: string;
  code: string;
  name: string;
  category_id: string | null;
  location_id: string | null;
  serial_number?: string | null;
  purchase_date: string | null;
  purchase_value: number;
  current_value: number;
  useful_life_years?: number;
  condition: AssetCondition;
  status: AssetStatus;
  condition_note?: string | null;
  person_in_charge?: string | null;
  user_id?: string;
  created_at: string;
  updated_at: string;

  // Quan hệ tham chiếu (Foreign Key Joins)
  category?: Category | null;
  location?: Location | null;
}

/* ========================================================================== */
/* 3. ASSET OPERATIONS & TRANSACTIONS (NGHIỆP VỤ BIẾN ĐỘNG TÀI SẢN)          */
/* ========================================================================== */

/**
 * Phiếu điều chuyển tài sản giữa các vị trí (transfers)
 * Use case: UC009 - Điều chuyển tài sản
 */
export interface Transfer {
  id: string;
  asset_id: string;
  from_location_id: string | null;
  to_location_id: string;
  reason: string | null;
  transfer_date: string;
  performed_by: string | null;
  user_id?: string;
  created_at: string;

  // Quan hệ tham chiếu
  asset?: Asset | null;
  from_location?: Location | null;
  to_location?: Location | null;
}

/**
 * Phiếu sửa chữa và bảo dưỡng tài sản (repairs)
 * Use case: UC010 - Quản lý sửa chữa
 */
export interface Repair {
  id: string;
  asset_id: string;
  description: string;
  cost: number;
  status: RepairStatus;
  start_date: string;
  end_date: string | null;
  performed_by: string | null;
  notes?: string | null;
  user_id?: string;
  created_at: string;

  // Quan hệ tham chiếu
  asset?: Asset | null;
}

/**
 * Phiếu thanh lý tài sản (disposals)
 * Use case: UC011 - Thanh lý tài sản
 */
export interface Disposal {
  id: string;
  asset_id: string;
  reason: string;
  method: DisposalMethod | null;
  residual_value: number;
  disposal_date: string;
  approved_by: string | null;
  user_id?: string;
  created_at: string;

  // Quan hệ tham chiếu
  asset?: Asset | null;
}

/* ========================================================================== */
/* 4. INVENTORY & AUDIT (KIỂM KÊ TÀI SẢN ĐỊNH KỲ)                            */
/* ========================================================================== */

/**
 * Đợt kiểm kê tài sản (inventory_sessions)
 * Use case: UC012 - Quản lý đợt kiểm kê
 */
export interface InventorySession {
  id: string;
  title: string;
  name?: string; // Tương thích ngược với trường name
  start_date: string;
  end_date: string | null;
  status: InventorySessionStatus;
  notes: string | null;
  user_id?: string;
  created_at: string;
}

/**
 * Kết quả kiểm kê chi tiết từng tài sản trong một đợt (inventory_items)
 * Use case: UC013 - Ghi nhận kết quả kiểm kê
 */
export interface InventoryItem {
  id: string;
  session_id: string;
  asset_id: string;
  expected_location_id?: string | null;
  actual_location_id?: string | null;
  found: boolean;
  condition_observed: AssetCondition;
  notes?: string | null;
  result?: InventoryResult; // Tương thích ngược
  note?: string | null;     // Tương thích ngược
  checked_at?: string;
  user_id?: string;
  created_at?: string;

  // Quan hệ tham chiếu
  asset?: Asset | null;
  session?: InventorySession | null;
  expected_location?: Location | null;
  actual_location?: Location | null;
}

/* ========================================================================== */
/* 5. AI REPORTS & ANALYTICS (BÁO CÁO TÍCH HỢP AI)                           */
/* ========================================================================== */

/**
 * Báo cáo thông minh được sinh tự động bởi AI (ai_reports)
 * Use cases: UC014 - Sinh báo cáo AI, UC015 - Xem, xóa báo cáo đã lưu
 */
export interface AIReport {
  id: string;
  title: string;
  content: string;
  type?: AIReportType;
  report_type?: AIReportType;
  session_id?: string | null;
  source_data?: Record<string, unknown> | null;
  user_id?: string;
  created_at: string;
}
