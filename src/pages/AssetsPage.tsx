import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import {
  AssetConditionBadge,
  AssetStatusBadge,
  ASSET_CONDITION_OPTIONS,
  ASSET_STATUS_OPTIONS,
} from '@/components/StatusBadges';
import type { Asset, AssetCondition, AssetStatus } from '@/types/database';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

const EMPTY_FORM = {
  code: '',
  name: '',
  category_id: '',
  location_id: '',
  serial_number: '',
  purchase_date: new Date().toISOString().slice(0, 10),
  purchase_value: '' as string | number,
  current_value: '' as string | number,
  condition: 'good' as AssetCondition,
  status: 'in_use' as AssetStatus,
  condition_note: '',
};

export function AssetsPage() {
  const { assets, categories, locations, reload, loading } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tìm kiếm và lọc theo UC008
  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const codeMatch = (a.code || '').toLowerCase().includes(q);
        const nameMatch = (a.name || '').toLowerCase().includes(q);
        const serialMatch = (a.serial_number || '').toLowerCase().includes(q);
        if (!codeMatch && !nameMatch && !serialMatch) return false;
      }
      if (categoryFilter && a.category_id !== categoryFilter) return false;
      if (locationFilter && a.location_id !== locationFilter) return false;
      if (conditionFilter && a.condition !== conditionFilter) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [assets, search, categoryFilter, locationFilter, conditionFilter, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      purchase_date: new Date().toISOString().slice(0, 10),
    });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (asset: Asset) => {
    setEditing(asset);
    setForm({
      code: asset.code,
      name: asset.name,
      category_id: asset.category_id || '',
      location_id: asset.location_id || '',
      serial_number: asset.serial_number || '',
      purchase_date: asset.purchase_date || '',
      purchase_value: asset.purchase_value || 0,
      current_value: asset.current_value || 0,
      condition: asset.condition || 'good',
      status: asset.status || 'in_use',
      condition_note: asset.condition_note || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) {
      setError('Vui lòng nhập mã và tên tài sản');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const pVal = form.purchase_value === '' ? 0 : Number(form.purchase_value) || 0;
      const cVal = form.current_value === '' ? 0 : Number(form.current_value) || 0;

      // Map condition & status text in note to ensure compatibility
      const condLabel =
        ASSET_CONDITION_OPTIONS.find((c) => c.value === form.condition)?.label || 'Tốt';
      const statusLabel =
        ASSET_STATUS_OPTIONS.find((s) => s.value === form.status)?.label || 'Đang sử dụng';

      // DB status constraint compatibility
      let dbStatus = 'good';
      if (form.status === 'disposed') dbStatus = 'disposed';
      else if (form.status === 'under_repair') dbStatus = 'under_repair';
      else if (form.condition === 'broken' || form.condition === 'damaged') dbStatus = 'damaged';
      else if (form.condition === 'lost') dbStatus = 'missing';

      const conditionNoteStr = `[Tình trạng: ${condLabel}] [Trạng thái: ${statusLabel}] ${
        form.condition_note || ''
      }`.trim();

      const payload: any = {
        code: form.code.trim().toUpperCase(),
        name: form.name.trim(),
        category_id: form.category_id || null,
        location_id: form.location_id || null,
        status: dbStatus,
        condition_note: conditionNoteStr,
        purchase_date: form.purchase_date || null,
        purchase_value: pVal,
        current_value: cVal,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error: updateError } = await supabase
          .from('assets')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('assets').insert(payload);
        if (insertError) throw insertError;
      }

      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu tài sản');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!window.confirm(`Xóa tài sản ${asset.code} - ${asset.name}?`)) return;
    try {
      // Xóa các bản ghi liên quan nếu cần
      await supabase.from('inventory_items').delete().eq('asset_id', asset.id);
      await supabase.from('transfers').delete().eq('asset_id', asset.id);
      await supabase.from('repairs').delete().eq('asset_id', asset.id);
      await supabase.from('disposals').delete().eq('asset_id', asset.id);

      const { error: deleteError } = await supabase.from('assets').delete().eq('id', asset.id);
      if (deleteError) throw deleteError;

      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa tài sản');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý tài sản</h2>
          <p className="text-sm text-slate-500">
            Tổng cộng: {assets.length} tài sản ({filtered.length} kết quả lọc)
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Thêm tài sản
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {/* Filter and Search Bar theo UC008 */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Ô tìm kiếm theo mã, tên, serial */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo mã, tên, serial..."
              className="input pl-10"
            />
          </div>

          {/* Bộ lọc nhóm tài sản */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input md:w-44"
          >
            <option value="">Tất cả nhóm</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Bộ lọc vị trí */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="input md:w-44"
          >
            <option value="">Tất cả vị trí</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {/* Bộ lọc tình trạng */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="input md:w-40"
          >
            <option value="">Tất cả tình trạng</option>
            {ASSET_CONDITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Bộ lọc trạng thái */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input md:w-40"
          >
            <option value="">Tất cả trạng thái</option>
            {ASSET_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng danh sách tài sản theo UC007 & UC008 */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Package className="mx-auto mb-2 h-10 w-10 text-slate-300" />
            <p className="text-base font-medium">Chưa có tài sản</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Mã</th>
                  <th className="px-4 py-3.5">Tên tài sản</th>
                  <th className="px-4 py-3.5">Nhóm</th>
                  <th className="px-4 py-3.5">Vị trí</th>
                  <th className="px-4 py-3.5">Giá trị (VNĐ)</th>
                  <th className="px-4 py-3.5">Tình trạng</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((asset) => {
                  const cat = asset.category || categories.find((c) => c.id === asset.category_id);
                  const loc = asset.location || locations.find((l) => l.id === asset.location_id);

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-xs text-primary-700">
                        {asset.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div>{asset.name}</div>
                        {asset.serial_number && (
                          <div className="text-[11px] text-slate-400 font-mono">
                            SN: {asset.serial_number}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {cat?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {loc?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900">
                        {formatCurrency(asset.current_value)} đ
                      </td>
                      <td className="px-4 py-3">
                        <AssetConditionBadge condition={asset.condition} />
                      </td>
                      <td className="px-4 py-3">
                        <AssetStatusBadge status={asset.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(asset)}
                            title="Sửa tài sản"
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(asset)}
                            title="Xóa tài sản"
                            className="rounded p-1.5 text-slate-400 hover:bg-error-50 hover:text-error-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal Thêm / Sửa Tài Sản */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa thông tin tài sản' : 'Thêm tài sản mới'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Mã tài sản *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="input font-mono"
                placeholder="VD: MT-001"
              />
            </div>

            <div>
              <label className="label">Tên tài sản *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="VD: Máy tính Dell Optiplex"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nhóm tài sản</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input"
              >
                <option value="">— Chọn nhóm —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Vị trí đặt</label>
              <select
                value={form.location_id}
                onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                className="input"
              >
                <option value="">— Chọn vị trí —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Số serial</label>
              <input
                type="text"
                value={form.serial_number}
                onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
                className="input font-mono"
                placeholder="VD: SN123456"
              />
            </div>

            <div>
              <label className="label">Ngày mua</label>
              <input
                type="date"
                value={form.purchase_date}
                onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Giá mua (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={form.purchase_value}
                onChange={(e) => setForm({ ...form, purchase_value: e.target.value })}
                className="input"
                placeholder="VD: 15000000"
              />
            </div>

            <div>
              <label className="label">Giá trị hiện tại (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={form.current_value}
                onChange={(e) => setForm({ ...form, current_value: e.target.value })}
                className="input"
                placeholder="VD: 12000000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Tình trạng</label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value as AssetCondition })}
                className="input"
              >
                {ASSET_CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Trạng thái sử dụng</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as AssetStatus })}
                className="input"
              >
                {ASSET_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
