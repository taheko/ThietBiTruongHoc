import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, Package } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import { Modal } from '@/components/Modal';
import type { Category } from '@/types/database';

export function CategoriesPage() {
  const { categories, assets, reload, loading } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assetCountByCategory = (catId: string) =>
    assets.filter((a) => a.category_id === catId && a.status !== 'disposed').length;

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', code: '', description: '' });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      code: cat.code,
      description: cat.description || '',
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) {
      setError('Vui lòng nhập tên nhóm và mã nhóm');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || null,
      };
      if (editing) {
        const { error: updateError } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert(payload);
        if (insertError) throw insertError;
      }
      await reload();
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu nhóm tài sản');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Xóa nhóm ${cat.name}?`)) return;
    try {
      // Khi xóa nhóm, các tài sản thuộc nhóm có category_id = NULL
      await supabase.from('assets').update({ category_id: null }).eq('category_id', cat.id);
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', cat.id);
      if (deleteError) throw deleteError;
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi xóa nhóm tài sản');
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
          <h2 className="text-xl font-bold text-slate-900">Quản lý nhóm tài sản</h2>
          <p className="text-sm text-slate-500">
            Phân loại danh mục thiết bị ({categories.length} nhóm)
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Thêm nhóm
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          {error}
        </div>
      )}

      {/* Categories Cards List */}
      {categories.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-slate-400">
          <Layers className="mb-3 h-12 w-12 text-slate-300" />
          <p className="text-base font-medium text-slate-600">Chưa có nhóm tài sản</p>
          <p className="mt-1 text-sm text-slate-400">Hãy thêm nhóm tài sản đầu tiên vào hệ thống</p>
          <button onClick={openAdd} className="btn-primary mt-4">
            <Plus className="h-4 w-4" />
            Thêm nhóm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = assetCountByCategory(cat.id);
            return (
              <div
                key={cat.id}
                className="card group flex flex-col justify-between p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary-100 px-2 py-0.5 font-mono text-xs font-bold text-primary-700">
                        {cat.code}
                      </span>
                      <h3 className="text-base font-semibold text-slate-900">
                        {cat.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => openEdit(cat)}
                        title="Sửa nhóm"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        title="Xóa nhóm"
                        className="rounded p-1 text-slate-400 hover:bg-error-50 hover:text-error-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {cat.description ? (
                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                      {cat.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-slate-400">
                      Chưa có mô tả
                    </p>
                  )}
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

      {/* Modal Thêm / Sửa Nhóm */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Sửa nhóm tài sản' : 'Thêm nhóm tài sản'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              {error}
            </div>
          )}

          <div>
            <label className="label">Tên nhóm *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              placeholder="VD: Máy tính"
            />
          </div>

          <div>
            <label className="label">Mã nhóm *</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="input font-mono"
              placeholder="VD: MT"
            />
          </div>

          <div>
            <label className="label">Mô tả</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
              placeholder="Mô tả chi tiết nhóm tài sản..."
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
