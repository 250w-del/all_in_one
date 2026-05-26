import React, { useEffect, useState, useCallback } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaImage, FaToggleOn, FaToggleOff, FaEye } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = ['General', 'National Parks', 'Wildlife', 'Nature', 'Volcanoes', 'Primates', 'Culture', 'City']

const TYPE_COLORS = {
  General:       'bg-gray-100 text-gray-700',
  'National Parks': 'bg-green-100 text-green-700',
  Wildlife:      'bg-amber-100 text-amber-700',
  Nature:        'bg-emerald-100 text-emerald-700',
  Volcanoes:     'bg-slate-100 text-slate-700',
  Primates:      'bg-teal-100 text-teal-700',
  Culture:       'bg-rose-100 text-rose-700',
  City:          'bg-blue-100 text-blue-700',
}

const EMPTY_FORM = { title: '', description: '', image_url: '', category: 'General', sort_order: 0, is_active: true }

export default function GalleryManager() {
  const { authFetch } = useAuth()
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null) // 'create' | 'edit'
  const [form, setForm]       = useState(EMPTY_FORM)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [preview, setPreview] = useState(null)
  const [filterCat, setFilterCat] = useState('All')

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/gallery/all')
      const data = await res.json()
      if (data.success) setImages(data.images)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [authFetch])

  useEffect(() => { fetchImages() }, [fetchImages])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setError('')
    setModal('create')
  }

  const openEdit = (img) => {
    setForm({
      title:       img.title,
      description: img.description || '',
      image_url:   img.image_url,
      category:    img.category,
      sort_order:  img.sort_order,
      is_active:   img.is_active,
    })
    setEditId(img.id)
    setError('')
    setModal('edit')
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.image_url.trim()) {
      setError('Title and Image URL are required.')
      return
    }
    setSaving(true); setError('')
    try {
      const url    = modal === 'create' ? '/api/gallery' : `/api/gallery/${editId}`
      const method = modal === 'create' ? 'POST' : 'PUT'
      const res    = await authFetch(url, { method, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!data.success) { setError(data.message || 'Error saving.'); return }
      setModal(null)
      fetchImages()
    } catch { setError('Network error.') }
    finally { setSaving(false) }
  }

  const toggleActive = async (img) => {
    await authFetch(`/api/gallery/${img.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !img.is_active }),
    })
    fetchImages()
  }

  const deleteImage = async (id) => {
    if (!confirm('Delete this image permanently?')) return
    await authFetch(`/api/gallery/${id}`, { method: 'DELETE' })
    fetchImages()
  }

  const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gallery Manager</h2>
          <p className="text-gray-500 text-sm">{images.length} images total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <FaPlus size={12} /> Add Image
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCat === cat ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length ? filtered.map(img => (
            <div key={img.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${img.is_active ? 'border-gray-100' : 'border-red-100 opacity-60'}`}>
              {/* Image */}
              <div className="relative h-44 overflow-hidden group">
                <img src={img.image_url} alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error' }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setPreview(img)}
                    className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <FaEye size={14} />
                  </button>
                  <button onClick={() => openEdit(img)}
                    className="bg-white text-amber-600 p-2 rounded-full hover:bg-amber-50 transition-colors">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => deleteImage(img.id)}
                    className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[img.category] || 'bg-gray-100 text-gray-700'}`}>
                    {img.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{img.title}</h3>
                    {img.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{img.description}</p>
                    )}
                  </div>
                  <button onClick={() => toggleActive(img)}
                    className={`flex-shrink-0 ${img.is_active ? 'text-green-500' : 'text-gray-300'}`}
                    title={img.is_active ? 'Active — click to hide' : 'Hidden — click to show'}>
                    {img.is_active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">Order: {img.sort_order}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${img.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {img.is_active ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <FaImage size={32} className="mx-auto mb-3 text-gray-300" />
              <p>No images found. Click "Add Image" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="font-bold text-gray-900">{modal === 'create' ? 'Add New Image' : 'Edit Image'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

              {/* Image URL + preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL *</label>
                <input type="url" value={form.image_url}
                  onChange={e => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                {form.image_url && (
                  <div className="mt-2 rounded-xl overflow-hidden h-32 bg-gray-100">
                    <img src={form.image_url} alt="preview"
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+URL' }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input type="text" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mountain Gorillas in Volcanoes Park"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the image..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} min={0}
                    onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-primary-600 w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Visible on website
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaCheck size={12} />}
                  {modal === 'create' ? 'Add Image' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={preview.image_url} alt={preview.title}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />
            <div className="text-center mt-4">
              <div className="text-white font-semibold text-lg">{preview.title}</div>
              {preview.description && <div className="text-gray-400 text-sm mt-1">{preview.description}</div>}
              <div className="text-primary-400 text-xs mt-1">{preview.category}</div>
            </div>
            <button onClick={() => setPreview(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300">
              <FaTimes size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
