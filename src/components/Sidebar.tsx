import {
  LayoutDashboard,
  Package,
  Layers,
  MapPin,
  ArrowRightLeft,
  Wrench,
  Trash2,
  ClipboardList,
  Sparkles,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export type PageKey =
  | 'dashboard'
  | 'assets'
  | 'categories'
  | 'locations'
  | 'transfers'
  | 'repairs'
  | 'disposals'
  | 'inventory'
  | 'ai-reports';

interface SidebarProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
}

interface NavItem {
  key: PageKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard,
  },
  {
    key: 'assets',
    label: 'Tài sản',
    icon: Package,
  },
  {
    key: 'categories',
    label: 'Nhóm tài sản',
    icon: Layers,
  },
  {
    key: 'locations',
    label: 'Vị trí',
    icon: MapPin,
  },
  {
    key: 'transfers',
    label: 'Điều chuyển',
    icon: ArrowRightLeft,
  },
  {
    key: 'repairs',
    label: 'Sửa chữa',
    icon: Wrench,
  },
  {
    key: 'disposals',
    label: 'Thanh lý',
    icon: Trash2,
  },
  {
    key: 'inventory',
    label: 'Kiểm kê',
    icon: ClipboardList,
  },
  {
    key: 'ai-reports',
    label: 'AI Báo cáo',
    icon: Sparkles,
    badge: 'AI',
  },
];

export function Sidebar({ current, onNavigate }: SidebarProps) {
  const { session, logout } = useAuth();
  const userEmail = session?.user?.email || 'admin@example.com';
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/90 bg-white shadow-soft">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/20">
          <Package className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-extrabold tracking-tight text-slate-900 leading-snug">
            QUẢN LÝ THIẾT BỊ
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="truncate text-[11px] font-semibold text-primary-600 tracking-wide uppercase">
              Tích Hợp AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-4">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Phân hệ chức năng
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                active
                  ? 'bg-primary-50/80 text-primary-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  {item.badge}
                </span>
              )}

              {active && (
                <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-primary-600" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout (Bottom of Menu as in Document) */}
      <div className="border-t border-slate-100 bg-slate-50/60 p-3.5">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white p-2.5 border border-slate-200/60 shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 font-bold text-primary-700 text-sm shadow-inner">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900" title={userEmail}>
              {userEmail}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-semibold text-slate-500">
                Quản trị viên
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-150 hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-[0.98] shadow-2xs"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
