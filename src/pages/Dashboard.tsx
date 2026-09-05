import { useMemo } from 'react';
import {
  Package,
  Layers,
  MapPin,
  ClipboardList,
  Wrench,
  DollarSign,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { AssetConditionBadge, AssetStatusBadge } from '@/components/StatusBadges';
import type { AssetCondition, AssetStatus } from '@/types/database';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function Dashboard() {
  const { assets, categories, locations, sessions, repairs, loading } = useData();

  const activeAssets = useMemo(() => {
    return assets.filter((a) => a.status !== 'disposed');
  }, [assets]);

  // 6 thẻ chỉ số theo Mục 4.2.4 (Bảng 10)
  const stats = useMemo(() => {
    const totalAssets = activeAssets.length;
    const totalCategories = categories.length;
    const totalLocations = locations.length;
    const openSessions = sessions.filter(
      (s) => s.status === 'in_progress' || (s.status as any) === 'open'
    ).length;
    const pendingRepairs = repairs.filter(
      (r) => r.status === 'pending' || r.status === 'in_progress'
    ).length;
    const totalValue = activeAssets.reduce((sum, a) => sum + (Number(a.current_value) || 0), 0);

    return {
      totalAssets,
      totalCategories,
      totalLocations,
      openSessions,
      pendingRepairs,
      totalValue,
    };
  }, [activeAssets, categories, locations, sessions, repairs]);

  // Phân bố theo Tình trạng (Mới, Tốt, Hư hỏng nhẹ, Hỏng, Mất)
  const conditionStats = useMemo(() => {
    const counts: Record<AssetCondition, number> = {
      new: 0,
      good: 0,
      damaged: 0,
      broken: 0,
      lost: 0,
    };
    activeAssets.forEach((a) => {
      const c = a.condition || 'good';
      if (counts[c] !== undefined) {
        counts[c]++;
      } else {
        counts.good++;
      }
    });

    const total = activeAssets.length || 1;
    return [
      { key: 'new', label: 'Mới', count: counts.new, percent: Math.round((counts.new / total) * 100), color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500' },
      { key: 'good', label: 'Tốt', count: counts.good, percent: Math.round((counts.good / total) * 100), color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500' },
      { key: 'damaged', label: 'Hư hỏng nhẹ', count: counts.damaged, percent: Math.round((counts.damaged / total) * 100), color: 'from-amber-400 to-orange-400', bg: 'bg-amber-400' },
      { key: 'broken', label: 'Hỏng', count: counts.broken, percent: Math.round((counts.broken / total) * 100), color: 'from-rose-500 to-red-500', bg: 'bg-rose-500' },
      { key: 'lost', label: 'Mất', count: counts.lost, percent: Math.round((counts.lost / total) * 100), color: 'from-slate-400 to-slate-500', bg: 'bg-slate-400' },
    ];
  }, [activeAssets]);

  // Phân bố theo Trạng thái sử dụng
  const statusStats = useMemo(() => {
    const counts: Record<AssetStatus, number> = {
      in_use: 0,
      in_storage: 0,
      under_repair: 0,
      transferred: 0,
      disposed: 0,
    };
    assets.forEach((a) => {
      const s = a.status || 'in_use';
      if (counts[s] !== undefined) {
        counts[s]++;
      } else {
        counts.in_use++;
      }
    });

    const total = assets.length || 1;
    return [
      { key: 'in_use', label: 'Đang sử dụng', count: counts.in_use, percent: Math.round((counts.in_use / total) * 100), color: 'from-emerald-500 to-teal-500' },
      { key: 'in_storage', label: 'Lưu kho', count: counts.in_storage, percent: Math.round((counts.in_storage / total) * 100), color: 'from-sky-500 to-cyan-500' },
      { key: 'under_repair', label: 'Đang sửa chữa', count: counts.under_repair, percent: Math.round((counts.under_repair / total) * 100), color: 'from-amber-500 to-yellow-500' },
      { key: 'transferred', label: 'Đã điều chuyển', count: counts.transferred, percent: Math.round((counts.transferred / total) * 100), color: 'from-purple-500 to-indigo-500' },
      { key: 'disposed', label: 'Đã thanh lý', count: counts.disposed, percent: Math.round((counts.disposed / total) * 100), color: 'from-slate-400 to-slate-500' },
    ];
  }, [assets]);

  // Bảng 5 tài sản (Tài sản gần đây)
  const recentAssets = useMemo(() => {
    return [...assets]
      .sort((a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime())
      .slice(0, 5);
  }, [assets]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  // 6 thẻ chỉ số đúng chuẩn UC004
  const statCards = [
    {
      label: 'Tổng tài sản',
      value: stats.totalAssets,
      icon: Package,
      gradient: 'from-blue-600 to-indigo-600',
      bgLight: 'bg-blue-50/80 text-blue-700',
    },
    {
      label: 'Nhóm tài sản',
      value: stats.totalCategories,
      icon: Layers,
      gradient: 'from-indigo-600 to-violet-600',
      bgLight: 'bg-indigo-50/80 text-indigo-700',
    },
    {
      label: 'Vị trí phòng ban',
      value: stats.totalLocations,
      icon: MapPin,
      gradient: 'from-emerald-600 to-teal-600',
      bgLight: 'bg-emerald-50/80 text-emerald-700',
    },
    {
      label: 'Kiểm kê đang làm',
      value: stats.openSessions,
      icon: ClipboardList,
      gradient: 'from-cyan-600 to-blue-600',
      bgLight: 'bg-cyan-50/80 text-cyan-700',
    },
    {
      label: 'Sửa chữa chờ xử lý',
      value: stats.pendingRepairs,
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50/80 text-amber-700',
    },
    {
      label: 'Tổng giá trị (VNĐ)',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      gradient: 'from-violet-600 to-purple-600',
      bgLight: 'bg-violet-50/80 text-violet-700',
      isCurrency: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 6 Thẻ chỉ số Hero KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="card group relative flex flex-col justify-between p-4.5 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight">
                  {c.label}
                </span>
                <div className={`p-2 rounded-xl ${c.bgLight} transition-transform group-hover:scale-110 shadow-2xs`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div>
                <p
                  className={`font-black text-slate-900 tracking-tight ${
                    c.isCurrency ? 'text-base truncate' : 'text-2xl'
                  }`}
                  title={String(c.value)}
                >
                  {c.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Khối phân bố theo Tình trạng & Trạng thái sử dụng */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Phân bố theo Tình trạng tài sản */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Phân bố theo Tình trạng tài sản
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                5 mức đánh giá chất lượng thiết bị hiện hành
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-1.5 text-slate-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            {conditionStats.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.bg}`} />
                    {item.label}
                  </span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">{item.count}</strong> ({item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(item.percent, item.count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phân bố theo Trạng thái sử dụng */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Phân bố theo Trạng thái sử dụng
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Vòng đời sử dụng thiết bị trong toàn trường
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-1.5 text-slate-500">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-4">
            {statusStats.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-800 font-bold">{item.count}</strong> ({item.percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(item.percent, item.count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng 5 tài sản: Tài sản gần đây */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary-100/70 p-1.5 text-primary-700">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Tài sản gần đây
              </h3>
              <p className="text-xs text-slate-400">5 thiết bị mới thêm hoặc cập nhật gần nhất</p>
            </div>
          </div>
        </div>

        {recentAssets.length === 0 ? (
          <div className="py-14 text-center text-sm font-medium text-slate-400">
            Chưa có tài sản nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="px-5 py-3.5">Mã tài sản</th>
                  <th className="px-5 py-3.5">Tên tài sản</th>
                  <th className="px-5 py-3.5">Vị trí</th>
                  <th className="px-5 py-3.5">Tình trạng</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAssets.map((asset) => {
                  const loc = asset.location || locations.find((l) => l.id === asset.location_id);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-primary-700">
                        {asset.code}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {asset.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {loc?.name || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <AssetConditionBadge condition={asset.condition} />
                      </td>
                      <td className="px-5 py-3.5">
                        <AssetStatusBadge status={asset.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
