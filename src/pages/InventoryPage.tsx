import { useState, useMemo } from 'react';
import {
  Plus,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Trash2,
  Edit2,
  Clock,
  MapPin,
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import {
  SessionStatusBadge,
  AssetConditionBadge,
  ASSET_CONDITION_OPTIONS,
} from '@/components/StatusBadges';
import type {
  InventorySession,
  InventoryItem,
  AssetCondition,
} from '@/types/database';

export function InventoryPage() {
  const { sessions, inventoryItems, assets, locations, reload, loading } = useData();

  // Đợt kiểm kê đang xem chi tiết (null nếu đang ở màn hình danh sách các đợt)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Modal tạo đợt kiểm kê
  const [createSessionModal, setCreateSessionModal] = useState(false);
  const [newSessionForm, setNewSessionForm] = useState({
    title: '',
    start_date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  // Modal ghi nhận / sửa kết quả kiểm kê
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemForm, setItemForm] = useState({
    asset_id: '',
    found: true,
    actual_location_id: '',
    condition_observed: 'good' as AssetCondition,
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return sessions.find((s) => s.id === selectedSessionId) || null;
  }, [sessions, selectedSessionId]);

  // Kết quả kiểm kê thuộc đợt đang xem
  const currentSessionItems = useMemo(() => {
    if (!currentSession) return [];
    return inventoryItems.filter((i) => i.session_id === currentSession.id);
  }, [inventoryItems, currentSession]);

  // 3 chỉ số trong chi tiết đợt: Đã tìm thấy, Thiếu, Hư hỏng
  const sessionStats = useMemo(() => {
    const foundCount = currentSessionItems.filter((i) => i.found).length;
    const missingCount = currentSessionItems.filter((i) => !i.found).length;
    const damagedCount = currentSessionItems.filter(
      (i) => i.condition_observed === 'damaged' || i.condition_observed === 'broken' || i.condition_observed === 'lost'
    ).length;

    return {
      foundCount,
      missingCount,
      damagedCount,
    };
  }, [currentSessionItems]);

  const isSessionCompleted = currentSession?.status === 'completed';

  // --- CÁC THAO TÁC ĐỢT KIỂM KÊ (UC012) ---

  const handleOpenCreateSession = () => {
    setNewSessionForm({
      title: '',
      start_date: new Date().toISOString().slice(0, 10),
      notes: '',
    });
    setError(null);
    setCreateSessionModal(true);
  };

  const handleCreateSession = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSessionForm.title.trim() || !newSessionForm.start_date) {
      setError('Vui lòng nhập tên đợt kiểm kê và ngày bắt đầu');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        name: newSessionForm.title.trim(),
        start_date: newSessionForm.start_date,
        notes: newSessionForm.notes.trim() || null,
        status: 'open',
      };

      const { data, error: insertError } = await supabase
        .from('inventory_sessions')
        .insert(payload)
        .select()
        .single();

      if (insertError) throw insertError;

      await reload();
      setCreateSessionModal(false);

      // Theo UC012: lưu đợt với trạng thái "Đang làm" và mở màn hình chi tiết đợt
      if (data?.id) {
        setSelectedSessionId(data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tạo đợt kiểm kê');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!currentSession) return;
    if (!window.confirm('Hoàn thành đợt kiểm kê này?')) return;

    try {
      const today = new Date().toISOString().slice(0, 10);
      const { error: updateError } = await supabase
        .from('inventory_sessions')
        .update({ status: 'completed', end_date: today })
        .eq('id', currentSession.id);

      if (updateError) throw updateError;
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi hoàn thành đợt');
    }
  };

  const handleDeleteSession = async (session: InventorySession) => {
    if (!window.confirm(`Xóa đợt kiểm kê "${session.title || session.name}"?`)) return;

    try {
      await supabase.from('inventory_items').delete().eq('session_id', session.id);
      const { error: deleteError } = await supabase
        .from('inventory_sessions')
        .delete()
        .eq('id', session.id);

      if (deleteError) throw deleteError;

      if (selectedSessionId === session.id) {
        setSelectedSessionId(null);
      }
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa đợt kiểm kê');
    }
  };

  // --- CÁC THAO TÁC KẾT QUẢ KIỂM KÊ (UC013) ---

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      asset_id: '',
      found: true,
      actual_location_id: '',
      condition_observed: 'good',
      notes: '',
    });
    setError(null);
    setItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setItemForm({
      asset_id: item.asset_id,
      found: item.found,
      actual_location_id: item.actual_location_id || item.asset?.location_id || '',
      condition_observed: item.condition_observed || 'good',
      notes: item.notes || item.note || '',
    });
    setError(null);
    setItemModalOpen(true);
  };

  const handleAssetSelect = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    setItemForm({
      ...itemForm,
      asset_id: assetId,
      actual_location_id: asset?.location_id || '',
      condition_observed: asset?.condition || 'good',
    });
  };

  const handleSaveItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentSession) return;
    if (!itemForm.asset_id) {
      setError('Vui lòng chọn tài sản kiểm kê');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const selectedAsset = assets.find((a) => a.id === itemForm.asset_id);
      const expectedLocId = selectedAsset?.location_id || null;

      // Map to db result if needed
      let dbResult = 'good';
      if (!itemForm.found) {
        dbResult = 'missing';
      } else if (itemForm.condition_observed === 'damaged') {
        dbResult = 'damaged';
      } else if (itemForm.condition_observed === 'broken') {
        dbResult = 'needs_repair';
      } else if (itemForm.condition_observed === 'lost') {
        dbResult = 'missing';
      }

      const noteText = itemForm.notes.trim() || null;

      if (editingItem) {
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update({
            result: dbResult,
            note: noteText,
            checked_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('inventory_items').insert({
          session_id: currentSession.id,
          asset_id: itemForm.asset_id,
          result: dbResult,
          note: noteText,
          checked_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;
      }

      // Theo UC013 (Bảng 19, TC_36): Nếu tài sản được tìm thấy -> cập nhật tình trạng tài sản
      if (itemForm.found) {
        const condLabel =
          ASSET_CONDITION_OPTIONS.find((c) => c.value === itemForm.condition_observed)?.label ||
          'Tốt';
        const existingNote = selectedAsset?.condition_note || '';
        let updatedNote = existingNote.replace(/\[Tình trạng: [^\]]+\]/g, '').trim();
        updatedNote = `[Tình trạng: ${condLabel}] ${updatedNote}`.trim();

        let dbStatus = 'good';
        if (itemForm.condition_observed === 'broken' || itemForm.condition_observed === 'damaged') {
          dbStatus = 'damaged';
        } else if (itemForm.condition_observed === 'lost') {
          dbStatus = 'missing';
        }

        await supabase
          .from('assets')
          .update({
            status: dbStatus,
            condition_note: updatedNote,
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemForm.asset_id);
      }

      await reload();
      setItemModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu kết quả kiểm kê');
    } finally {
      setSaving(false);
    }
  };

  // Theo NFR-10 và Bảng 75: Xóa kết quả kiểm kê KHÔNG có popup xác nhận!
  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) throw deleteError;
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa kết quả');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  // --- MÀN HÌNH 2: CHI TIẾT ĐỢT KIỂM KÊ (UC013) ---
  if (currentSession) {
    return (
      <div className="space-y-6">
        {/* Header với nút Quay lại, Hoàn thành, Ghi nhận tài sản */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSessionId(null)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {currentSession.title || currentSession.name}
                </h2>
                <SessionStatusBadge status={currentSession.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày bắt đầu: {currentSession.start_date}{' '}
                {currentSession.end_date ? `— Ngày kết thúc: ${currentSession.end_date}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSessionCompleted && (
              <>
                <button onClick={handleOpenAddItem} className="btn-primary">
                  <Plus className="h-4 w-4" />
                  Ghi nhận tài sản
                </button>
                <button
                  onClick={handleCompleteSession}
                  className="rounded-lg border border-emerald-600 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition shadow-sm"
                >
                  <CheckCircle2 className="inline mr-1.5 h-4 w-4" />
                  Hoàn thành
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
            {error}
          </div>
        )}

        {/* 3 Thẻ chỉ số: Đã tìm thấy, Thiếu, Hư hỏng theo UC013 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Đã tìm thấy
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {sessionStats.foundCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>

          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Thiếu
              </p>
              <p className="text-2xl font-bold text-rose-600 mt-1">
                {sessionStats.missingCount}
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
              <XCircle className="h-6 w-6" />
            </div>
          </div>

          <div className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hư hỏng
              </p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {sessionStats.damagedCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Bảng kết quả kiểm kê theo UC013: Mã, Tên tài sản, Vị trí dự kiến, Vị trí thực tế, Tìm thấy (Có / Thiếu), Tình trạng, Ghi chú, Thao tác */}
        <div className="card overflow-hidden">
          {currentSessionItems.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <ClipboardList className="mx-auto mb-2 h-10 w-10 text-slate-300" />
              <p className="text-base font-medium">Chưa có kết quả kiểm kê nào</p>
              {!isSessionCompleted && (
                <button onClick={handleOpenAddItem} className="btn-primary mt-3">
                  <Plus className="h-4 w-4" />
                  Ghi nhận tài sản đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Mã</th>
                    <th className="px-4 py-3.5">Tên tài sản</th>
                    <th className="px-4 py-3.5">Vị trí dự kiến</th>
                    <th className="px-4 py-3.5">Vị trí thực tế</th>
                    <th className="px-4 py-3.5">Tìm thấy</th>
                    <th className="px-4 py-3.5">Tình trạng</th>
                    <th className="px-4 py-3.5">Ghi chú</th>
                    {!isSessionCompleted && (
                      <th className="px-4 py-3.5 text-right">Thao tác</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSessionItems.map((item) => {
                    const asset = item.asset || assets.find((a) => a.id === item.asset_id);
                    const expectedLoc =
                      locations.find((l) => l.id === (item.expected_location_id || asset?.location_id));
                    const actualLoc =
                      locations.find((l) => l.id === (item.actual_location_id || asset?.location_id));

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-xs text-primary-700">
                          {asset?.code || '—'}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {asset?.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {expectedLoc?.name || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {actualLoc?.name || expectedLoc?.name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {item.found ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Có
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                              Thiếu
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <AssetConditionBadge condition={item.condition_observed} />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">
                          {item.notes || item.note || '—'}
                        </td>
                        {!isSessionCompleted && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditItem(item)}
                                title="Sửa kết quả"
                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              {/* Theo NFR-10 và Bảng 75: Xóa không cần popup xác nhận */}
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                title="Xóa kết quả"
                                className="rounded p-1.5 text-slate-400 hover:bg-error-50 hover:text-error-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Ghi Nhận / Sửa Kết Quả Kiểm Kê */}
        <Modal
          open={itemModalOpen}
          onClose={() => setItemModalOpen(false)}
          title={editingItem ? 'Sửa kết quả kiểm kê' : 'Ghi nhận tài sản'}
          size="md"
        >
          <form onSubmit={handleSaveItem} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
                {error}
              </div>
            )}

            <div>
              <label className="label">Tài sản *</label>
              <select
                required
                disabled={Boolean(editingItem)}
                value={itemForm.asset_id}
                onChange={(e) => handleAssetSelect(e.target.value)}
                className="input disabled:bg-slate-100 disabled:cursor-not-allowed"
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

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="found-checkbox"
                checked={itemForm.found}
                onChange={(e) => setItemForm({ ...itemForm, found: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="found-checkbox" className="text-sm font-medium text-slate-800 select-none">
                Đã tìm thấy tài sản
              </label>
            </div>

            <div>
              <label className="label">Vị trí thực tế</label>
              <select
                value={itemForm.actual_location_id}
                onChange={(e) => setItemForm({ ...itemForm, actual_location_id: e.target.value })}
                className="input"
              >
                <option value="">— Chọn vị trí thực tế —</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Tình trạng quan sát</label>
              <select
                value={itemForm.condition_observed}
                onChange={(e) =>
                  setItemForm({ ...itemForm, condition_observed: e.target.value as AssetCondition })
                }
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
              <label className="label">Ghi chú</label>
              <input
                type="text"
                value={itemForm.notes}
                onChange={(e) => setItemForm({ ...itemForm, notes: e.target.value })}
                className="input"
                placeholder="Ghi chú thêm về hiện trạng tài sản..."
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setItemModalOpen(false)}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Đang lưu...' : editingItem ? 'Cập nhật' : 'Ghi nhận'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // --- MÀN HÌNH 1: DANH SÁCH ĐỢT KIỂM KÊ (UC012) ---
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý đợt kiểm kê</h2>
          <p className="text-sm text-slate-500">
            Tổ chức và theo dõi các đợt kiểm tra thực tế tài sản ({sessions.length} đợt)
          </p>
        </div>
        <button onClick={handleOpenCreateSession} className="btn-primary">
          <Plus className="h-4 w-4" />
          Tạo đợt kiểm kê
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {/* Danh sách thẻ đợt kiểm kê theo UC012 */}
      {sessions.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-slate-400">
          <ClipboardList className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-base font-medium text-slate-600">Chưa có đợt kiểm kê</p>
          <p className="mt-1 text-sm text-slate-400">Hãy tạo đợt kiểm kê định kỳ mới</p>
          <button onClick={handleOpenCreateSession} className="btn-primary mt-4">
            <Plus className="h-4 w-4" />
            Tạo đợt kiểm kê
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const itemsCount = inventoryItems.filter((i) => i.session_id === session.id).length;

            return (
              <div
                key={session.id}
                className="card group flex flex-col justify-between p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <SessionStatusBadge status={session.status} />
                    <button
                      onClick={() => handleDeleteSession(session)}
                      title="Xóa đợt kiểm kê"
                      className="rounded p-1 text-slate-400 hover:bg-error-50 hover:text-error-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {session.title || session.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {session.start_date}{' '}
                      {session.end_date ? `→ ${session.end_date}` : '→ đang tiến hành'}
                    </span>
                  </div>

                  {session.notes && (
                    <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                      {session.notes}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">
                    Đã kiểm kê: <strong className="text-slate-800">{itemsCount}</strong> tài sản
                  </span>
                  <button
                    onClick={() => setSelectedSessionId(session.id)}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center gap-1"
                  >
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tạo Đợt Kiểm Kê */}
      <Modal
        open={createSessionModal}
        onClose={() => setCreateSessionModal(false)}
        title="Tạo đợt kiểm kê mới"
        size="md"
      >
        <form onSubmit={handleCreateSession} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Tên đợt kiểm kê *</label>
            <input
              type="text"
              required
              value={newSessionForm.title}
              onChange={(e) => setNewSessionForm({ ...newSessionForm, title: e.target.value })}
              className="input"
              placeholder="VD: Kiểm kê cuối kỳ 1 năm học 2026"
            />
          </div>

          <div>
            <label className="label">Ngày bắt đầu *</label>
            <input
              type="date"
              required
              value={newSessionForm.start_date}
              onChange={(e) => setNewSessionForm({ ...newSessionForm, start_date: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Ghi chú</label>
            <textarea
              rows={3}
              value={newSessionForm.notes}
              onChange={(e) => setNewSessionForm({ ...newSessionForm, notes: e.target.value })}
              className="input"
              placeholder="Ghi chú phạm vi, kế hoạch kiểm kê..."
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setCreateSessionModal(false)}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Đang tạo...' : 'Tạo'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
