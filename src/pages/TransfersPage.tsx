import { useState, useMemo } from 'react';
import { Plus, ArrowRightLeft, Trash2, ArrowRight } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import type { Transfer } from '@/types/database';

export function TransfersPage() {
  const { transfers, assets, locations, reload, loading } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    asset_id: '',
    from_location_id: '',
    to_location_id: '',
    transfer_date: new Date().toISOString().slice(0, 10),
    performed_by: '',
    reason: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...transfers].sort(
      (a, b) => new Date(b.transfer_date).getTime() - new Date(a.transfer_date).getTime()
    );
  }, [transfers]);

  const openAdd = () => {
    setForm({
      asset_id: '',
      from_location_id: '',
      to_location_id: '',
      transfer_date: new Date().toISOString().slice(0, 10),
      performed_by: '',
      reason: '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleAssetChange = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    setForm({
      ...form,
      asset_id: assetId,
      // Mặc định Từ vị trí = "" (ứng với "— Tự động —")
      from_location_id: '',
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.asset_id || !form.to_location_id || !form.transfer_date) {
      setError('Vui lòng chọn tài sản, vị trí đích và ngày điều chuyển');
      return;
    }

    const selectedAsset = assets.find((a) => a.id === form.asset_id);
    const resolvedFromLocId = form.from_location_id || selectedAsset?.location_id || null;

    if (resolvedFromLocId && resolvedFromLocId === form.to_location_id) {
      setError('Vị trí đích phải khác vị trí hiện tại của tài sản');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // 1. Thêm phiếu vào transfers
      const { error: transferError } = await supabase.from('transfers').insert({
        asset_id: form.asset_id,
        from_location_id: resolvedFromLocId,
        to_location_id: form.to_location_id,
        transfer_date: form.transfer_date,
        performed_by: form.performed_by.trim() || null,
        reason: form.reason.trim() || null,
      });
      if (transferError) throw transferError;

      // 2. Cập nhật tài sản: vị trí mới = Đến vị trí, trạng thái = Đã điều chuyển (UC009)
      const existingNote = selectedAsset?.condition_note || '';
      const updatedNote = existingNote.replace(/\[Trạng thái: [^\]]+\]/g, '').trim() + ' [Trạng thái: Đã điều chuyển]';

      await supabase
        .from('assets')
        .update({
          location_id: form.to_location_id,
          condition_note: updatedNote,
          updated_at: new Date().toISOString(),
        })
        .eq('id', form.asset_id);

      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo phiếu điều chuyển');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (transfer: Transfer) => {
    if (!window.confirm('Xóa phiếu điều chuyển này?')) return;
    try {
      const { error: deleteError } = await supabase.from('transfers').delete().eq('id', transfer.id);
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

  const selectedAsset = assets.find((a) => a.id === form.asset_id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Điều chuyển tài sản</h2>
          <p className="text-sm text-slate-500">
            Theo dõi quá trình luân chuyển tài sản giữa các phòng ban ({transfers.length} phiếu)
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

      {/* Bảng phiếu điều chuyển theo UC009 */}
      <div className="card overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ArrowRightLeft className="mx-auto mb-2 h-10 w-10 text-slate-300" />
            <p className="text-base font-medium">Chưa có phiếu điều chuyển</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Tài sản</th>
                  <th className="px-4 py-3.5">Từ vị trí</th>
                  <th className="px-4 py-3.5">Đến vị trí</th>
                  <th className="px-4 py-3.5">Ngày</th>
                  <th className="px-4 py-3.5">Người thực hiện</th>
                  <th className="px-4 py-3.5">Lý do</th>
                  <th className="px-4 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sorted.map((transfer) => {
                  const asset = transfer.asset || assets.find((a) => a.id === transfer.asset_id);
                  const fromLoc =
                    transfer.from_location || locations.find((l) => l.id === transfer.from_location_id);
                  const toLoc =
                    transfer.to_location || locations.find((l) => l.id === transfer.to_location_id);

                  return (
                    <tr key={transfer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{asset?.name || '—'}</div>
                        <div className="text-xs font-mono text-primary-700">{asset?.code || '—'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {fromLoc?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900">
                        {toLoc?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {transfer.transfer_date}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {transfer.performed_by || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                        {transfer.reason || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(transfer)}
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

      {/* Modal Form Tạo Phiếu Điều Chuyển */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Tạo phiếu điều chuyển"
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
              onChange={(e) => handleAssetChange(e.target.value)}
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
              <label className="label">Từ vị trí</label>
              <select
                value={form.from_location_id}
                onChange={(e) => setForm({ ...form, from_location_id: e.target.value })}
                className="input"
              >
                <option value="">— Tự động —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              {selectedAsset && !form.from_location_id && (
                <p className="mt-1 text-[11px] text-slate-500">
                  Vị trí hiện tại: {selectedAsset.location?.name || locations.find((l) => l.id === selectedAsset.location_id)?.name || 'Chưa xác định'}
                </p>
              )}
            </div>

            <div>
              <label className="label">Đến vị trí *</label>
              <select
                required
                value={form.to_location_id}
                onChange={(e) => setForm({ ...form, to_location_id: e.target.value })}
                className="input"
              >
                <option value="">— Chọn vị trí đến —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Ngày điều chuyển *</label>
              <input
                type="date"
                required
                value={form.transfer_date}
                onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="label">Người thực hiện</label>
              <input
                type="text"
                value={form.performed_by}
                onChange={(e) => setForm({ ...form, performed_by: e.target.value })}
                className="input"
                placeholder="VD: Cán bộ thiết bị"
              />
            </div>
          </div>

          <div>
            <label className="label">Lý do điều chuyển</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="input"
              placeholder="VD: Điều chuyển phòng máy thực hành mới"
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
