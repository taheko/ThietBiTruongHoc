import type {
  AssetCondition,
  AssetStatus,
  RepairStatus,
  InventorySessionStatus,
  DisposalMethod
} from '@/types/database';

export const ASSET_CONDITION_CONFIG: Record<AssetCondition, { label: string; class: string; dot: string }> = {
  new: { label: 'Mới', class: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  good: { label: 'Tốt', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  damaged: { label: 'Hư hỏng nhẹ', class: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  broken: { label: 'Hỏng', class: 'bg-rose-100 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  lost: { label: 'Mất', class: 'bg-slate-200 text-slate-700 border-slate-300', dot: 'bg-slate-500' },
};

export const ASSET_STATUS_CONFIG: Record<AssetStatus, { label: string; class: string; dot: string }> = {
  in_use: { label: 'Đang sử dụng', class: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  in_storage: { label: 'Lưu kho', class: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  under_repair: { label: 'Đang sửa chữa', class: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  transferred: { label: 'Đã điều chuyển', class: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  disposed: { label: 'Đã thanh lý', class: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

export const REPAIR_STATUS_CONFIG: Record<RepairStatus, { label: string; class: string; dot: string }> = {
  pending: { label: 'Chờ xử lý', class: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  in_progress: { label: 'Đang sửa', class: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Đã hủy', class: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

export const SESSION_STATUS_CONFIG: Record<InventorySessionStatus, { label: string; class: string; dot: string }> = {
  in_progress: { label: 'Đang làm', class: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  completed: { label: 'Hoàn thành', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'Đã hủy', class: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

export const DISPOSAL_METHOD_CONFIG: Record<DisposalMethod, { label: string; class: string }> = {
  liquidation: { label: 'Thanh lý', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  donation: { label: 'Tặng cho', class: 'bg-sky-50 text-sky-700 border-sky-200' },
  sale: { label: 'Bán', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scrap: { label: 'Phế liệu', class: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export function AssetConditionBadge({ condition }: { condition?: AssetCondition | string }) {
  const norm = (condition?.toLowerCase() || 'good') as AssetCondition;
  const config = ASSET_CONDITION_CONFIG[norm] || ASSET_CONDITION_CONFIG.good;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function AssetStatusBadge({ status }: { status?: AssetStatus | string }) {
  const norm = (status?.toLowerCase() || 'in_use') as AssetStatus;
  const config = ASSET_STATUS_CONFIG[norm] || ASSET_STATUS_CONFIG.in_use;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function RepairStatusBadge({ status }: { status?: RepairStatus | string }) {
  const norm = (status?.toLowerCase() || 'pending') as RepairStatus;
  const config = REPAIR_STATUS_CONFIG[norm] || REPAIR_STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function SessionStatusBadge({ status }: { status?: InventorySessionStatus | string }) {
  let norm = (status?.toLowerCase() || 'in_progress') as InventorySessionStatus;
  if (norm === ('open' as any)) norm = 'in_progress';
  const config = SESSION_STATUS_CONFIG[norm] || SESSION_STATUS_CONFIG.in_progress;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function DisposalMethodBadge({ method }: { method?: DisposalMethod | string | null }) {
  if (!method) return <span className="text-slate-400">—</span>;
  let norm = method.toLowerCase() as DisposalMethod;
  if (norm === ('sell' as any)) norm = 'sale';
  if (norm === ('donate' as any)) norm = 'donation';
  const config = DISPOSAL_METHOD_CONFIG[norm] || { label: method, class: 'bg-slate-100 text-slate-700 border-slate-200' };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}

export const ASSET_CONDITION_OPTIONS = Object.entries(ASSET_CONDITION_CONFIG).map(([value, config]) => ({
  value: value as AssetCondition,
  label: config.label,
}));

export const ASSET_STATUS_OPTIONS = Object.entries(ASSET_STATUS_CONFIG).map(([value, config]) => ({
  value: value as AssetStatus,
  label: config.label,
}));

export const REPAIR_STATUS_OPTIONS = Object.entries(REPAIR_STATUS_CONFIG).map(([value, config]) => ({
  value: value as RepairStatus,
  label: config.label,
}));

export const DISPOSAL_METHOD_OPTIONS: { value: DisposalMethod; label: string }[] = [
  { value: 'liquidation', label: 'Thanh lý' },
  { value: 'donation', label: 'Tặng cho' },
  { value: 'sale', label: 'Bán' },
  { value: 'scrap', label: 'Phế liệu' },
];

export const DISPOSAL_METHOD_LABELS: Record<string, string> = {
  liquidation: 'Thanh lý',
  donation: 'Tặng cho',
  sale: 'Bán',
  scrap: 'Phế liệu',
  sell: 'Bán',
  donate: 'Tặng cho',
  other: 'Khác',
};
