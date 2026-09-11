import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import {
  DisposalMethodBadge,
  DISPOSAL_METHOD_OPTIONS,
} from '@/components/StatusBadges';
import type { Disposal, DisposalMethod } from '@/types/database';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

const EMPTY_FORM = {
  asset_id: '',
  method: 'sale' as DisposalMethod,
  disposal_date: new Date().toISOString().slice(0, 10),
  residual_value: '' as string | number,
  approved_by: '',
  reason: '',
};

export function DisposalsPage() {
  const { disposals, assets, reload, loading } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...disposals].sort(
      (a, b) => new Date(b.disposal_date).getTime() - new Date(a.disposal_date).getTime()
    );
  }, [disposals]);

  const openAdd = () => {
    setForm({
      ...EMPTY_FORM,
      disposal_date: new Date().toISOString().slice(0, 10),
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.asset_id || !form.disposal_date || !form.method) {
      setError('Vui lòng chọn tài sản, phương thức và ngày thanh lý');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Map method to db constraint if needed: ('sell','scrap','donate','other')
      let dbMethod = 'scrap';
      if (form.method === 'sale' || form.method === ('sell' as any)) dbMethod = 'sell';
      else if (form.method === 'donation' || form.method === ('donate' as any)) dbMethod = 'donate';
      else if (form.method === 'liquidation') dbMethod = 'sell';
      else if (form.method === 'scrap') dbMethod = 'scrap';

      const payload = {
        asset_id: form.asset_id,
        reason: form.reason.trim() || 'Thanh lý tài sản',
        method: dbMethod,
        residual_value: Number(form.residual_value) || 0,
        disposal_date: form.disposal_date,
        approved_by: form.approved_by.trim() || null,
      };

      const { error: insertError } = await supabase.from('disposals').insert(payload);
      if (insertError) throw insertError;

      // Cập nhật tài sản: chuyển trạng thái thành "Đã thanh lý" (disposed) (UC011, TC_33)
      const selectedAsset = assets.find((a) => a.id === form.asset_id);
      const existingNote = selectedAsset?.condition_note || '';
      const updatedNote =
        existingNote.replace(/\[Trạng thái: [^\]]+\]/g, '').trim() +
        ' [Trạng thái: Đã thanh lý]';

      await supabase
        .from('assets')
        .update({
          status: 'disposed',
          condition_note: updatedNote,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.asset_id);

      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo phiếu thanh lý');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (disposal: Disposal) => {
    // Theo đúng đặc tả UC011 (Bảng 17) và TC_34:
    // Cảnh báo: "Xóa phiếu thanh lý này? Trạng thái tài sản sẽ không tự khôi phục."
    // Khi đồng ý: xóa phiếu, trạng thái tài sản giữ nguyên.
    if (!window.confirm('Xóa phiếu thanh lý này? Trạng thái tài sản sẽ không tự khôi phục.')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase.from('disposals').delete().eq('id', disposal.id);
      if (deleteError) throw deleteError;

      // KHÔNG khôi phục trạng thái tài sản theo tài liệu
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa phiếu thanh lý');
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
          <h2 className="text-xl font-bold text-slate-900">Thanh lý tài sản</h2>
          <p className="text-sm text-slate-500">
            Ghi nhận thanh lý, bán, tặng cho hoặc phế liệu tài sản ({disposals.length} phiếu)
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

      {/* Bảng phiếu thanh lý theo UC011 */}
      <div className="card overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Trash2 className="mx-auto mb-2 h-10 w-10 text-slate-300" />
            <p className="text-base font-medium">Chưa có phiếu thanh lý</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Tài sản</th>
                  <th className="px-4 py-3.5">Phương thức</th>
                  <th className="px-4 py-3.5">Ngày</th>
                  <th className="px-4 py-3.5">Giá trị thu hồi (VNĐ)</th>
                  <th className="px-4 py-3.5">Duyệt bởi</th>
                  <th className="px-4 py-3.5">Lý do</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((disposal) => {
                  const asset = disposal.asset || assets.find((a) => a.id === disposal.asset_id);

                  return (
                    <tr key={disposal.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{asset?.name || '—'}</div>
                        <div className="text-xs font-mono text-primary-700">{asset?.code || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <DisposalMethodBadge method={disposal.method} />
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {disposal.disposal_date}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900">
                        {formatCurrency(disposal.residual_value)} đ
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {disposal.approved_by || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                        {disposal.reason || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(disposal)}
                          title="Xóa phiếu"
                          className="rounded p-1.5 text-slate-400 hover:bg-error-50 hover:text-error-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Tạo Phiếu Thanh Lý */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tạo phiếu thanh lý"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Phương thức *</label>
              <select
                required
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value as DisposalMethod })}
                className="input"
              >
                {DISPOSAL_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Ngày thanh lý *</label>
              <input
                type="date"
                required
                value={form.disposal_date}
                onChange={(e) => setForm({ ...form, disposal_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Giá trị thu hồi (VNĐ)</label>
              <input
                type="number"
                min="0"
                value={form.residual_value}
                onChange={(e) => setForm({ ...form, residual_value: e.target.value })}
                className="input"
                placeholder="VD: 1000000"
              />
            </div>

            <div>
              <label className="label">Duyệt bởi</label>
              <input
                type="text"
                value={form.approved_by}
                onChange={(e) => setForm({ ...form, approved_by: e.target.value })}
                className="input"
                placeholder="VD: Hiệu trưởng"
              />
            </div>
          </div>

          <div>
            <label className="label">Lý do</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="input"
              placeholder="VD: Hư hỏng không thể sửa chữa"
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
              {saving ? 'Đang lưu...' : 'Tạo phiếu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
