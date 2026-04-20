'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { AdminCategory } from '@/types/product'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Spinner } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'

export default function AdminCategoryPage() {
  const { accessToken } = useAuthStore()
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create / edit modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await apiFetchAuth<AdminCategory[]>('/api/admin/categories', accessToken)
      setCategories(res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [accessToken]) // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setEditing(null)
    setForm({ name: '', slug: '', description: '' })
    setModalOpen(true)
  }

  function openEdit(cat: AdminCategory) {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '' })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!accessToken) return
    setSaving(true)
    setError(null)
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description || null,
      }
      if (editing) {
        await apiFetchAuth(`/api/admin/categories/${editing.id}`, accessToken, {
          method: 'PUT', body: JSON.stringify(body),
        })
      } else {
        await apiFetchAuth('/api/admin/categories', accessToken, {
          method: 'POST', body: JSON.stringify(body),
        })
      }
      setModalOpen(false)
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!accessToken || !window.confirm('Xóa danh mục này? Thao tác thất bại nếu danh mục có sản phẩm.')) return
    try {
      await apiFetchAuth(`/api/admin/categories/${id}`, accessToken, { method: 'DELETE' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Danh mục</h1>
        <Button onClick={openCreate}>+ Thêm danh mục</Button>
      </div>

      {error && (
        <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary" /></div>
      ) : (
        <div className="overflow-x-auto rounded-card border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted">
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Tên</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Đường dẫn</th>
                <th className="px-4 py-3 text-left font-medium text-text-secondary">Mô tả</th>
                <th className="px-4 py-3 text-center font-medium text-text-secondary">Sản phẩm</th>
                <th className="px-4 py-3 text-right font-medium text-text-secondary">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{cat.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{cat.slug}</td>
                  <td className="px-4 py-3 text-text-secondary">{cat.description ?? '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      cat.productCount > 0
                        ? 'bg-primary/10 text-primary'
                        : 'bg-surface-muted text-text-muted'
                    }`}>
                      {cat.productCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(cat)}>Sửa</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(cat.id)}
                        title={cat.productCount > 0 ? `Có ${cat.productCount} sản phẩm — xóa sẽ thất bại` : undefined}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      >
        <div className="space-y-4">
          {error && (
            <div className="rounded-btn bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
          )}
          <Input label="Tên danh mục *" required value={form.name} onChange={set('name')} />
          <Input label="Đường dẫn (slug)"
            placeholder="Tự động tạo từ tên nếu để trống"
            value={form.slug} onChange={set('slug')} />
          <Textarea label="Mô tả" value={form.description} onChange={set('description')} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Huỷ</Button>
            <Button loading={saving} onClick={handleSave}>
              {editing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}