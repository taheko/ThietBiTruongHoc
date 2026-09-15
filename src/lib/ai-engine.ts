import type {
  Asset,
  InventoryItem,
  InventorySession,
  Repair,
  Disposal,
  Location,
  Category,
  AIReportType,
} from '@/types/database';

export interface AIReportInput {
  assets: Asset[];
  inventoryItems: InventoryItem[];
  sessions: InventorySession[];
  repairs: Repair[];
  disposals: Disposal[];
  locations: Location[];
  categories: Category[];
  sessionId?: string;
}

const STATUS_LABELS: Record<string, string> = {
  in_use: 'Đang sử dụng',
  in_storage: 'Lưu kho',
  under_repair: 'Đang sửa chữa',
  transferred: 'Đã điều chuyển',
  disposed: 'Đã thanh lý',
  good: 'Đang sử dụng',
  damaged: 'Hỏng',
  missing: 'Mất',
};

const CONDITION_LABELS: Record<string, string> = {
  new: 'Mới',
  good: 'Tốt',
  damaged: 'Hư hỏng nhẹ',
  broken: 'Hỏng',
  lost: 'Mất',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

function getLocationName(asset: Asset, locations: Location[]): string {
  if (asset.location) return asset.location.name;
  const loc = locations.find((l) => l.id === asset.location_id);
  return loc ? loc.name : 'Chưa xác định';
}

function getCategoryName(asset: Asset, categories: Category[]): string {
  if (asset.category) return asset.category.name;
  const cat = categories.find((c) => c.id === asset.category_id);
  return cat ? cat.name : 'Chưa phân loại';
}

// Báo cáo kiểm kê (UC014, Bảng 84, TC_41)
export function generateInventoryReport(input: AIReportInput): string {
  const { assets, inventoryItems, sessions, sessionId, locations } = input;
  const session = sessionId
    ? sessions.find((s) => s.id === sessionId)
    : sessions[0];

  const sessionTitle = session?.title || session?.name || 'Đợt kiểm kê';
  const items = session ? inventoryItems.filter((i) => i.session_id === session.id) : [];

  const lines: string[] = [];
  lines.push(`# Báo cáo kiểm kê: ${sessionTitle}`);
  lines.push('');
  lines.push(`**Thời gian:** ${session ? `Từ ${session.start_date}${session.end_date ? ` đến ${session.end_date}` : ''}` : 'N/A'}`);
  lines.push(`**Ngày lập báo cáo:** ${new Date().toLocaleDateString('vi-VN')}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // 1. Tổng quan
  const totalAssets = assets.filter((a) => a.status !== 'disposed').length;
  const checkedItems = items.length;
  const foundItems = items.filter((i) => i.found).length;
  const missingItems = items.filter((i) => !i.found).length;
  const damagedItems = items.filter(
    (i) => i.condition_observed === 'damaged' || i.condition_observed === 'broken'
  ).length;
  const goodItems = items.filter(
    (i) => i.found && (i.condition_observed === 'good' || i.condition_observed === 'new')
  ).length;

  const foundRate = checkedItems > 0 ? Math.round((foundItems / checkedItems) * 100) : 0;

  lines.push('## 1. TỔNG QUAN KẾT QUẢ KIỂM KÊ');
  lines.push('');
  lines.push(`- Tổng số tài sản cần kiểm kê: **${totalAssets}**`);
  lines.push(`- Số tài sản đã kiểm kê thực tế: **${checkedItems}** (${totalAssets > 0 ? Math.round((checkedItems / totalAssets) * 100) : 0}%)`);
  lines.push(`- Tỷ lệ tìm thấy tài sản: **${foundRate}%**`);
  lines.push('');
  lines.push('| Chỉ số kiểm kê | Số lượng | Tỷ lệ |');
  lines.push('|---|---|---|');
  lines.push(`| Tìm thấy | ${foundItems} | ${checkedItems > 0 ? Math.round((foundItems / checkedItems) * 100) : 0}% |`);
  lines.push(`| Thiếu hụt | ${missingItems} | ${checkedItems > 0 ? Math.round((missingItems / checkedItems) * 100) : 0}% |`);
  lines.push(`| Hoạt động tốt / Mới | ${goodItems} | ${checkedItems > 0 ? Math.round((goodItems / checkedItems) * 100) : 0}% |`);
  lines.push(`| Hư hỏng / Cần xử lý | ${damagedItems} | ${checkedItems > 0 ? Math.round((damagedItems / checkedItems) * 100) : 0}% |`);
  lines.push('');

  // 2. Tài sản thiếu
  const missingList = items.filter((i) => !i.found);
  if (missingList.length > 0) {
    lines.push('## 2. DANH SÁCH TÀI SẢN THIẾU');
    lines.push('');
    lines.push(`⚠️ Có **${missingList.length}** tài sản không tìm thấy tại vị trí kiểm kê:`);
    lines.push('');
    lines.push('| Mã tài sản | Tên tài sản | Vị trí dự kiến | Ghi chú |');
    lines.push('|---|---|---|---|');
    missingList.forEach((item) => {
      const a = item.asset || assets.find((x) => x.id === item.asset_id);
      if (a) {
        lines.push(`| ${a.code} | ${a.name} | ${getLocationName(a, locations)} | ${item.notes || item.note || 'Không tìm thấy'} |`);
      }
    });
    lines.push('');
    lines.push('**Đề xuất xử lý:**');
    lines.push('- Phối hợp với người phụ trách phòng ban xác minh tài sản lưu kho hoặc đã chuyển phòng.');
    lines.push('- Lập biên bản kiểm kê tài sản thiếu báo cáo Ban Giám hiệu.');
    lines.push('');
  }

  // 3. Tài sản hỏng / Cần sửa chữa
  const damagedList = items.filter(
    (i) => i.found && (i.condition_observed === 'damaged' || i.condition_observed === 'broken')
  );
  if (damagedList.length > 0) {
    lines.push('## 3. DANH SÁCH TÀI SẢN HỎNG VÀ CẦN SỬA CHỮA');
    lines.push('');
    lines.push(`Có **${damagedList.length}** tài sản hư hỏng cần bảo trì, sửa chữa:`);
    lines.push('');
    lines.push('| Mã tài sản | Tên tài sản | Vị trí thực tế | Tình trạng | Đề xuất |');
    lines.push('|---|---|---|---|---|');
    damagedList.forEach((item) => {
      const a = item.asset || assets.find((x) => x.id === item.asset_id);
      if (a) {
        lines.push(
          `| ${a.code} | ${a.name} | ${getLocationName(a, locations)} | ${CONDITION_LABELS[item.condition_observed] || 'Hỏng'} | Lập phiếu sửa chữa |`
        );
      }
    });
    lines.push('');
  }

  // 4. Kết luận đánh giá
  lines.push('## 4. KẾT LUẬN VÀ ĐỀ XUẤT');
  lines.push('');
  if (foundRate >= 95) {
    lines.push(`- Đánh giá tổng thể đợt kiểm kê: **TỐT** (Tỷ lệ tìm thấy đạt ${foundRate}% ≥ 95%). Công tác quản lý tài sản tại các phòng ban được thực hiện nghiêm túc.`);
  } else if (foundRate >= 80) {
    lines.push(`- Đánh giá tổng thể đợt kiểm kê: **KHÁ** (Tỷ lệ tìm thấy đạt ${foundRate}% ≥ 80%). Cần tiếp tục rà soát các tài sản chưa xác định vị trí.`);
  } else {
    lines.push(`- Đánh giá tổng thể đợt kiểm kê: **CẦN CẢI THIỆN** (Tỷ lệ tìm thấy chỉ đạt ${foundRate}% < 80%). Đề nghị các đơn vị nghiêm túc chấn chỉnh việc quản lý tài sản.`);
  }
  lines.push('');
  lines.push('---');
  lines.push('*Báo cáo được sinh tự động bởi hệ thống Quản lý tài sản trường học*');

  return lines.join('\n');
}

// Tóm tắt tình trạng theo phòng ban (UC014, Bảng 85, TC_42)
export function generateConditionSummary(input: AIReportInput): string {
  const { assets, locations } = input;
  const activeAssets = assets.filter((a) => a.status !== 'disposed');

  const lines: string[] = [];
  lines.push('# Tóm tắt tình trạng tài sản theo phòng ban');
  lines.push('');
  lines.push(`**Thời gian phân tích:** ${new Date().toLocaleDateString('vi-VN')}`);
  lines.push(`**Tổng số tài sản theo dõi:** ${activeAssets.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  lines.push('## 1. BẢNG TỔNG HỢP VÀ CHỈ SỐ SỨC KHỎE THEO PHÒNG BAN');
  lines.push('');
  lines.push('| Vị trí / Phòng ban | Tổng TS | Mới / Tốt | Hư hỏng / Mất | Chỉ số sức khỏe | Nhận xét |');
  lines.push('|---|---|---|---|---|---|');

  let totalGood = 0;
  let totalProblems = 0;

  for (const loc of locations) {
    const locAssets = activeAssets.filter((a) => a.location_id === loc.id);
    if (locAssets.length === 0) continue;

    const goodCount = locAssets.filter(
      (a) => a.condition === 'good' || a.condition === 'new'
    ).length;
    const problemCount = locAssets.length - goodCount;

    totalGood += goodCount;
    totalProblems += problemCount;

    const healthRate = Math.round((goodCount / locAssets.length) * 100);
    const evaluation =
      healthRate >= 90 ? 'Tốt' : healthRate >= 70 ? 'Khá' : 'Kém, cần bảo trì';

    lines.push(
      `| ${loc.name} | ${locAssets.length} | ${goodCount} | ${problemCount} | **${healthRate}%** | ${evaluation} |`
    );
  }

  lines.push('');

  // Tổng kết chung
  const overallHealthRate =
    activeAssets.length > 0 ? Math.round((totalGood / activeAssets.length) * 100) : 100;

  lines.push('## 2. ĐÁNH GIÁ CHUNG TOÀN TRƯỜNG');
  lines.push('');
  lines.push(`- Tổng số tài sản hoạt động tốt: **${totalGood}** (${overallHealthRate}%)`);
  lines.push(`- Tổng số tài sản có vấn đề: **${totalProblems}**`);
  lines.push(
    `- Chỉ số sức khỏe tài sản bình quân toàn trường: **${overallHealthRate}%** — Đánh giá: **${
      overallHealthRate >= 85 ? 'Tốt' : overallHealthRate >= 65 ? 'Khá' : 'Cần bảo trì diện rộng'
    }**`
  );
  lines.push('');
  lines.push('---');
  lines.push('*Báo cáo được sinh tự động bởi hệ thống Quản lý tài sản trường học*');

  return lines.join('\n');
}

// Gợi ý thay thế / sửa chữa (UC014, Bảng 86, TC_43, TC_44)
export function generateReplacementSuggestions(input: AIReportInput): string {
  const { assets, repairs, locations, categories } = input;
  const activeAssets = assets.filter((a) => a.status !== 'disposed');

  // Lọc tài sản Hư hỏng nhẹ / Hỏng / Mất theo Bảng 86
  const problematicAssets = activeAssets.filter(
    (a) => a.condition === 'damaged' || a.condition === 'broken' || a.condition === 'lost'
  );

  const lines: string[] = [];
  lines.push('# GỢI Ý DANH SÁCH TÀI SẢN CẦN SỬA CHỮA HOẶC THAY THẾ');
  lines.push('');
  lines.push(`**Thời gian phân tích:** ${new Date().toLocaleDateString('vi-VN')}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // TC_44: Nếu không có tài sản nào trong tình trạng hư hỏng hoặc mất
  if (problematicAssets.length === 0) {
    lines.push('Không có tài sản nào trong tình trạng hư hỏng hoặc mất.');
    lines.push('');
    lines.push('Tất cả thiết bị hiện tại đều đang hoạt động tốt hoặc ở trạng thái mới.');
    lines.push('');
    lines.push('---');
    lines.push('*Báo cáo được sinh tự động bởi hệ thống Quản lý tài sản trường học*');
    return lines.join('\n');
  }

  // Phân loại: Thay thế vs Sửa chữa theo Bảng 86 & TC_43
  // Quy tắc: Đề xuất thay thế nếu:
  // 1. Tài sản Mất
  // 2. Hoặc Hỏng và đã sửa từ 3 lần trở lên
  // 3. Hoặc Hỏng và tổng chi phí sửa > 50% giá mua
  const replaceList: { asset: Asset; reason: string; estCost: number }[] = [];
  const repairList: { asset: Asset; reason: string }[] = [];

  for (const asset of problematicAssets) {
    const assetRepairs = repairs.filter((r) => r.asset_id === asset.id);
    const repairCount = assetRepairs.length;
    const totalRepairCost = assetRepairs.reduce((s, r) => s + (Number(r.cost) || 0), 0);

    const isLost = asset.condition === 'lost';
    const isBroken = asset.condition === 'broken';
    const purchaseVal = Number(asset.purchase_value) || 0;
    const highRepairCost = purchaseVal > 0 && totalRepairCost > purchaseVal * 0.5;

    if (isLost) {
      replaceList.push({
        asset,
        reason: 'Tài sản bị mất, không thể phục hồi',
        estCost: purchaseVal || 1000000,
      });
    } else if (isBroken && repairCount >= 3) {
      replaceList.push({
        asset,
        reason: `Đã sửa ${repairCount} lần, thiết bị xuống cấp nghiêm trọng`,
        estCost: purchaseVal || 1000000,
      });
    } else if (isBroken && highRepairCost) {
      replaceList.push({
        asset,
        reason: `Chi phí sửa tích lũy (${formatCurrency(totalRepairCost)}) vượt 50% giá mua`,
        estCost: purchaseVal || 1000000,
      });
    } else {
      repairList.push({
        asset,
        reason:
          asset.condition === 'damaged'
            ? 'Hư hỏng nhẹ, khả năng khắc phục cao'
            : 'Hỏng hóc bộ phận, đề xuất thay linh kiện',
      });
    }
  }

  // Mục 1: Tài sản đề xuất thay thế (TC_43)
  lines.push('## 1. TÀI SẢN ĐỀ XUẤT THAY THẾ');
  lines.push('');
  if (replaceList.length === 0) {
    lines.push('Hiện chưa có tài sản nào cần thay thế ngay.');
  } else {
    lines.push(`Phát hiện **${replaceList.length}** tài sản đề xuất thay thế:`);
    lines.push('');
    lines.push('| Mã tài sản | Tên tài sản | Vị trí | Lý do đề xuất thay thế | Chi phí ước tính |');
    lines.push('|---|---|---|---|---|');
    replaceList.forEach((item) => {
      lines.push(
        `| ${item.asset.code} | ${item.asset.name} | ${getLocationName(item.asset, locations)} | ${item.reason} | ${formatCurrency(item.estCost)} |`
      );
    });
    lines.push('');
    const totalBudget = replaceList.reduce((sum, item) => sum + item.estCost, 0);
    lines.push(`💰 **Ước tính ngân sách thay thế:** **${formatCurrency(totalBudget)}**`);
  }
  lines.push('');

  // Mục 2: Tài sản đề xuất sửa chữa
  lines.push('## 2. TÀI SẢN ĐỀ XUẤT SỬA CHỮA');
  lines.push('');
  if (repairList.length === 0) {
    lines.push('Không có tài sản nào thuộc diện sửa chữa bảo dưỡng.');
  } else {
    lines.push(`Có **${repairList.length}** tài sản có thể tiếp tục sử dụng sau khi sửa chữa:`);
    lines.push('');
    lines.push('| Mã tài sản | Tên tài sản | Vị trí | Hiện trạng | Hướng xử lý |');
    lines.push('|---|---|---|---|---|');
    repairList.forEach((item) => {
      lines.push(
        `| ${item.asset.code} | ${item.asset.name} | ${getLocationName(item.asset, locations)} | ${CONDITION_LABELS[item.asset.condition] || 'Cần sửa'} | ${item.reason} |`
      );
    });
  }
  lines.push('');

  lines.push('---');
  lines.push('*Báo cáo được sinh tự động bởi hệ thống Quản lý tài sản trường học*');

  return lines.join('\n');
}

export function generateReport(type: AIReportType, input: AIReportInput): string {
  switch (type) {
    case 'inventory_report':
      return generateInventoryReport(input);
    case 'condition_summary':
      return generateConditionSummary(input);
    case 'replacement_suggestions':
      return generateReplacementSuggestions(input);
    default:
      return 'Loại báo cáo không được hỗ trợ.';
  }
}

export const REPORT_TYPE_LABELS: Record<AIReportType, string> = {
  inventory_report: 'Báo cáo kiểm kê',
  condition_summary: 'Tóm tắt tình trạng theo phòng ban',
  replacement_suggestions: 'Gợi ý sửa chữa / thay thế',
};
