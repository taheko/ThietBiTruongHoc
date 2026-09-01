import { useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building, User, Package } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import type { Location } from '@/types/database';

export function LocationsPage() {
  const { locations, assets, reload, loading } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [form, setForm] = useState({
    name: '',
    code: '',
    building: '',
    floor: '',
    person_in_charge: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assetCountByLocation = (locId: string) =>
    assets.filter((a) => a.location_id === locId && a.status !== 'disposed').length;

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', code: '', building: '', floor: '', person_in_charge: '' });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({
      name: loc.name,
      code: loc.code,
      building: loc.building || '',
      floor: loc.floor || '',
      person_in_charge: loc.person_in_charge || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError('Vui lòng nhập tên vị trí và mã vị trí');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        building: form.building.trim() || null,
        floor: form.floor.trim() || null,
        person_in_charge: form.person_in_charge.trim() || null,
      };
      if (editing) {
        const { error: updateError } = await supabase
          .from('locations')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('locations')
          .insert(payload);
        if (insertError) throw insertError;
      }
      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu vị trí');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (loc: Location) => {
    if (!window.confirm(`Xóa vị trí ${loc.name}?`)) return;
    try {
      // Khi xóa vị trí, các tài sản đặt tại vị trí đó có location_id = NULL
      await supabase.from('assets').update({ location_id: null }).eq('location_id', loc.id);
      const { error: deleteError } = await supabase.from('locations').delete().eq('id', loc.id);
      if (deleteError) throw deleteError;
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa vị trí');
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
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý vị trí</h2>
          <p className="text-sm text-slate-500">
            Phòng ban và vị trí đặt tài sản ({locations.length} vị trí)
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Thêm vị trí
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {/* Locations Cards List */}
      {locations.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-slate-400">
          <MapPin className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-base font-medium text-slate-600">Chưa có vị trí</p>
          <p className="mt-1 text-sm text-slate-400">Hãy thêm vị trí đầu tiên vào hệ thống</p>
          <button onClick={openAdd} className="btn-primary mt-4">
            <Plus className="h-4 w-4" />
            Thêm vị trí
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => {
            const count = assetCountByLocation(loc.id);
            const buildingFloor = [loc.building, loc.floor].filter(Boolean).join(' — ');

            return (
              <div
                key={loc.id}
                className="card group flex flex-col justify-between p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary-100 px-2 py-0.5 font-mono text-xs font-bold text-primary-700">
                        {loc.code}
                      </span>
                      <h3 className="text-base font-semibold text-slate-900">
                        {loc.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(loc)}
                        title="Sửa vị trí"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(loc)}
                        title="Xóa vị trí"
                        className="rounded p-1 text-slate-400 hover:bg-error-50 hover:text-error-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    {buildingFloor && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{buildingFloor}</span>
                      </div>
                    )}
                    {loc.person_in_charge && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Phụ trách: {loc.person_in_charge}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <span>Số tài sản: <strong className="text-slate-800">{count}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm / Sửa Vị Trí */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa vị trí' : 'Thêm vị trí'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Tên vị trí *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="VD: Phòng Tin học 1"
            />
          </div>

          <div>
            <label className="label">Mã vị trí *</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="input font-mono"
              placeholder="VD: PTH1"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Tòa nhà</label>
              <input
                type="text"
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
                className="input"
                placeholder="VD: Tòa A"
              />
            </div>

            <div>
              <label className="label">Tầng</label>
              <input
                type="text"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                className="input"
                placeholder="VD: Tầng 2"
              />
            </div>
          </div>

          <div>
            <label className="label">Người phụ trách</label>
            <input
              type="text"
              value={form.person_in_charge}
              onChange={(e) => setForm({ ...form, person_in_charge: e.target.value })}
              className="input"
              placeholder="VD: Nguyễn Văn A"
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
              {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
