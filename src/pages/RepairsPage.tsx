import { useState, useMemo } from 'react';
import { Plus, Wrench, Edit2, Trash2 } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import { RepairStatusBadge, REPAIR_STATUS_OPTIONS } from '@/components/StatusBadges';
import type { Repair, RepairStatus } from '@/types/database';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

const EMPTY_FORM = {
  asset_id: '',
  description: '',
  cost: '' as string | number,
  status: 'pending' as RepairStatus,
  start_date: new Date().toISOString().slice(0, 10),
  end_date: '',
  performed_by: '',
  notes: '',
};

export function RepairsPage() {
  const { repairs, assets, reload, loading } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Repair | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...repairs].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [repairs]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      start_date: new Date().toISOString().slice(0, 10),
    });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (repair: Repair) => {
    setEditing(repair);
    setForm({
      asset_id: repair.asset_id,
      description: repair.description,
      cost: repair.cost || 0,
      status: repair.status,
      start_date: repair.start_date,
      end_date: repair.end_date || '',
      performed_by: repair.performed_by || '',
      notes: repair.notes || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.asset_id || !form.description.trim() || !form.start_date) {
      setError('Vui lòng chọn tài sản, nhập mô tả hỏng hóc và ngày bắt đầu');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        asset_id: form.asset_id,
        description: form.description.trim(),
        cost: Number(form.cost) || 0,
        status: form.status,
        start_date: form.start_date,
        end_date: form.end_date || null,
        performed_by: form.performed_by.trim() || null,
      };

      if (editing) {
        const { error: updateError } = await supabase
          .from('repairs')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('repairs').insert(payload);
        if (insertError) throw insertError;
      }

      // Cập nhật trạng thái / tình trạng tài sản theo UC010 (TC_29, TC_30)
      const targetAsset = assets.find((a) => a.id === form.asset_id);
      const existingNote = targetAsset?.condition_note || '';

      if (form.status === 'in_progress') {
        // Phiếu Đang sửa -> tài sản chuyển Đang sửa chữa (under_repair)
        const updatedNote =
          existingNote.replace(/\[Trạng thái: [^\]]+\]/g, '').trim() +
          ' [Trạng thái: Đang sửa chữa]';

        await supabase
          .from('assets')
          .update({
            status: 'under_repair',
            condition_note: updatedNote,
            updated_at: new Date().toISOString(),
          })
          .eq('id', form.asset_id);
      } else if (form.status === 'completed') {
        // Phiếu Hoàn thành -> tài sản chuyển Đang sử dụng (in_use), tình trạng Tốt (good)
        let updatedNote = existingNote
          .replace(/\[Trạng thái: [^\]]+\]/g, '')
          .replace(/\[Tình trạng: [^\]]+\]/g, '')
          .trim();
        updatedNote = `[Tình trạng: Tốt] [Trạng thái: Đang sử dụng] ${updatedNote}`.trim();

        await supabase
          .from('assets')
          .update({
            status: 'good',
            condition_note: updatedNote,
            updated_at: new Date().toISOString(),
          })
          .eq('id', form.asset_id);
      }

      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu phiếu sửa chữa');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (repair: Repair) => {
    if (!window.confirm('Xóa phiếu sửa chữa này?')) return;
    try {
      const { error: deleteError } = await supabase.from('repairs').delete().eq('id', repair.id);
      if (deleteError) throw deleteError;
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa phiếu');
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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý sửa chữa</h2>
          <p className="text-sm text-slate-500">
            Theo dõi tiến độ và chi phí sửa chữa bảo dưỡng tài sản ({repairs.length} phiếu)
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Tạo phiếu
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {/* Bảng phiếu sửa chữa theo UC010 */}
      <div className="card overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Wrench className="mx-auto mb-2 h-10 w-10 text-slate-300" />
            <p className="text-base font-medium">Chưa có phiếu sửa chữa nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Tài sản</th>
                  <th className="px-4 py-3.5">Mô tả</th>
                  <th className="px-4 py-3.5">Chi phí (VNĐ)</th>
                  <th className="px-4 py-3.5">Bắt đầu</th>
                  <th className="px-4 py-3.5">Kết thúc</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((repair) => {
                  const asset = repair.asset || assets.find((a) => a.id === repair.asset_id);

                  return (
                    <tr key={repair.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{asset?.name || '—'}</div>
                        <div className="text-xs font-mono text-primary-700">{asset?.code || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-xs">
                        {repair.description}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900">
                        {formatCurrency(repair.cost)} đ
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {repair.start_date}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {repair.end_date || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <RepairStatusBadge status={repair.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(repair)}
                            title="Sửa phiếu"
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(repair)}
                            title="Xóa phiếu"
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

      {/* Modal Form Tạo / Sửa Phiếu Sửa Chữa */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa phiếu sửa chữa' : 'Tạo phiếu sửa chữa'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Tài sản *</label>
            <select
              required
              value={form.asset_id}
              onChange={(e) => setForm({ ...form, asset_id: e.target.value })}
              className="input"
            >
              <option value="">— Chọn tài sản —</option>
              {assets
                .filter((a) => a.status !== 'disposed')
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} — {a.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="label">Mô tả hỏng hóc *</label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              placeholder="VD: Hỏng nguồn máy tính, quạt kêu to..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Chi phí (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="input"
                placeholder="VD: 500000"
              />
            </div>

            <div>
              <label className="label">Trạng thái phiếu</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as RepairStatus })}
                className="input"
              >
                {REPAIR_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Ngày bắt đầu *</label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Ngày kết thúc</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Người thực hiện</label>
            <input
              type="text"
              value={form.performed_by}
              onChange={(e) => setForm({ ...form, performed_by: e.target.value })}
              className="input"
              placeholder="VD: Cán bộ kỹ thuật / Thợ sửa ngoài"
            />
          </div>

          <div>
            <label className="label">Ghi chú</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input"
              placeholder="Ghi chú thêm..."
            />
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
              {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo phiếu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
