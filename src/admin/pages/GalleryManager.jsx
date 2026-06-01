import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaCheck, FaImage,
  FaToggleOn, FaToggleOff, FaEye, FaLink, FaUpload,
  FaExclamationTriangle
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || ''

const CATEGORIES = ['General', 'National Parks', 'Wildlife', 'Nature', 'Volcanoes', 'Primates', 'Culture', 'City']

const CAT_COLORS = {
  'General':       'bg-gray-100 text-gray-700',
  'National Parks':'bg-green-100 text-green-700',
  'Wildlife':      'bg-amber-100 text-amber-700',
  'Nature':        'bg-emerald-100 text-emerald-700',
  'Volcanoes':     'bg-slate-100 text-slate-700',
  'Primates':      'bg-teal-100 text-teal-700',
  'Culture':       'bg-rose-100 text-rose-700',
  'City':          'bg-blue-100 text-blue-700',
}

const EMPTY_FORM = {
  title: '', description: '', image_url: '',
  category: 'General', sort_order: 0, is_active: true,
}

// ── Broken image fallback component ──────────────────────────
function SafeImage({ src, alt, className }) {
  const [broken, setBroken] = useState(false)

  useEffect(() => { setBroken(false) }, [src])

  if (!src || broken) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center gap-2`}>
        <FaExclamationTriangle className="text-gray-300" size={28} />
        <span className="text-xs text-gray-400">No image</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  )
}

export default function GalleryManager() {
  const { authFetch, token } = useAuth()
  const fileRef = useRef(null)

  const [images, setImages]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)   // 'create' | 'edit'
  const [form, setForm]           = useState(EMPTY_FORM)
  const [editId, setEditId]       = useState(null)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [preview, setPreview]     = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [inputMode, setInputMode] = useState('url')  // 'url' | 'file'
  const [filePreview, setFilePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  // ── Fetch all images ────────────────────────────────────────
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

  // ── Open create modal ───────────────────────────────────────
  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setError('')
    setFilePreview(null)
    setInputMode('url')
    setModal('create')
  }

  // ── Open edit modal ─────────────────────────────────────────
  const openEdit = (img) => {
    setForm({
      title:       img.title       || '',
      description: img.description || '',
      image_url:   img.image_url   || '',
      category:    img.category    || 'General',
      sort_order:  img.sort_order  ?? 0,
      is_active:   img.is_active   ?? true,
    })
    setEditId(img.id)
    setError('')
    setFilePreview(img.image_url || null)
    setInputMode('url')
    setModal('edit')
  }

  // ── Handle file selection → convert to base64 data URL ─────
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setFilePreview(dataUrl)
      setForm(f => ({ ...f, image_url: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  // ── Save (create or update) ─────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return }
    if (!form.image_url.trim()) { setError('Please provide an image URL or upload a file.'); return }

    setSaving(true); setError('')
    try {
      const url    = modal === 'create' ? '/api/gallery' : `/api/gallery/${editId}`
      const method = modal === 'create' ? 'POST' : 'PUT'
      const res    = await authFetch(url, { method, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!data.success) { setError(data.message || 'Error saving.'); return }
      setModal(null)
      fetchImages()
    } catch { setError('Network error. Please try again.') }
    finally { setSaving(false) }
  }

  // ── Toggle visibility ───────────────────────────────────────
  const toggleActive = async (img) => {
    await authFetch(`/api/gallery/${img.id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_active: !img.is_active }),
    })
    fetchImages()
  }

  // ── Delete ──────────────────────────────────────────────────
  const deleteImage = async (id) => {
    if (!confirm('Delete this image permanently?')) return
    await authFetch(`/api/gallery/${id}`, { method: 'DELETE' })
    fetchImages()
  }

  const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat)

  // ── Current image preview in modal ─────────────────────────
  const modalPreviewSrc = inputMode === 'file' ? filePreview : form.image_url

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gallery Manager</h2>
          <p className="text-gray-500 text-sm">{images.length} images total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <FaPlus size={12} /> Add Image
        </button>
      </div>

      {/* ── Category filter ── */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCat === cat
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300 hover:text-primary-600'
            }`}>{cat}
          </button>
        ))}
      </div>

      {/* ── Image grid ── */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length ? filtered.map(img => (
            <div key={img.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
                img.is_active ? 'border-gray-100' : 'border-orange-200 opacity-70'
              }`}>

              {/* Image area */}
              <div className="relative h-44 overflow-hidden group bg-gray-50">
                <SafeImage
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setPreview(img)}
                    className="bg-white text-gray-800 p-2.5 rounded-full hover:bg-gray-100 transition-colors shadow-md" title="Preview">
                    <FaEye size={13} />
                  </button>
                  <button onClick={() => openEdit(img)}
                    className="bg-white text-amber-600 p-2.5 rounded-full hover:bg-amber-50 transition-colors shadow-md" title="Edit">
                    <FaEdit size={13} />
                  </button>
                  <button onClick={() => deleteImage(img.id)}
                    className="bg-white text-red-500 p-2.5 rounded-full hover:bg-red-50 transition-colors shadow-md" title="Delete">
                    <FaTrash size={13} />
                  </button>
                </div>

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shadow-sm ${CAT_COLORS[img.category] || 'bg-gray-100 text-gray-700'}`}>
                    {img.category}
                  </span>
                </div>

                {/* Hidden badge */}
                {!img.is_active && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">Hidden</span>
                  </div>
                )}
              </div>

              {/* Card info + always-visible action buttons */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{img.title}</h3>
                    {img.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{img.description}</p>
                    )}
                  </div>
                  <button onClick={() => toggleActive(img)}
                    className={`flex-shrink-0 transition-colors ${img.is_active ? 'text-green-500 hover:text-green-700' : 'text-gray-300 hover:text-gray-500'}`}
                    title={img.is_active ? 'Visible — click to hide' : 'Hidden — click to show'}>
                    {img.is_active ? <FaToggleOn size={22} /> : <FaToggleOff size={22} />}
                  </button>
                </div>

                {/* Always-visible action row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">Order: {img.sort_order}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPreview(img)}
                      className="text-gray-400 hover:text-blue-500 p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="Preview">
                      <FaEye size={12} />
                    </button>
                    <button onClick={() => openEdit(img)}
                      className="text-gray-400 hover:text-amber-500 p-1.5 rounded-lg hover:bg-amber-50 transition-colors" title="Edit">
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => deleteImage(img.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-4 text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <FaImage size={36} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium">No images found</p>
              <p className="text-sm mt-1">Click "Add Image" to get started</p>
            </div>
          )}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h3 className="font-bold text-gray-900 text-lg">
                {modal === 'create' ? '➕ Add New Image' : '✏️ Edit Image'}
              </h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <FaExclamationTriangle size={14} />
                  {error}
                </div>
              )}

              {/* ── Image input: URL or File upload ── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image *</label>

                {/* Tab switcher */}
                <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-3">
                  <button
                    onClick={() => setInputMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                      inputMode === 'url' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}>
                    <FaLink size={12} /> Paste URL
                  </button>
                  <button
                    onClick={() => setInputMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                      inputMode === 'file' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}>
                    <FaUpload size={12} /> Upload File
                  </button>
                </div>

                {/* URL input */}
                {inputMode === 'url' && (
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                )}

                {/* File upload */}
                {inputMode === 'file' && (
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-primary-400 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors">
                      <FaUpload size={20} />
                      <span className="text-sm font-medium">Click to choose image</span>
                      <span className="text-xs text-gray-400">JPG, PNG, WEBP — max 5MB</span>
                    </button>
                  </div>
                )}

                {/* Image preview */}
                {modalPreviewSrc && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ height: '160px' }}>
                    <SafeImage
                      src={modalPreviewSrc}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mountain Gorillas in Volcanoes Park"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the image..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
              </div>

              {/* Category + Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    min={0}
                    onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              {/* Visibility toggle */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <input
                  type="checkbox"
                  id="is_active_modal"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-primary-600 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="is_active_modal" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                  Visible on website
                </label>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${form.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {form.is_active ? 'Visible' : 'Hidden'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-primary-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors shadow-sm">
                  {saving
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    : <><FaCheck size={12} /> {modal === 'create' ? 'Add Image' : 'Save Changes'}</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Full Preview Modal ── */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <button
            onClick={() => setPreview(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 z-10">
            <FaTimes size={20} />
          </button>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <SafeImage
              src={preview.image_url}
              alt={preview.title}
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="text-center mt-5">
              <div className="text-white font-bold text-xl">{preview.title}</div>
              {preview.description && (
                <div className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">{preview.description}</div>
              )}
              <div className="flex items-center justify-center gap-3 mt-3">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${CAT_COLORS[preview.category] || 'bg-gray-100 text-gray-700'}`}>
                  {preview.category}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${preview.is_active ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                  {preview.is_active ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => { setPreview(null); openEdit(preview) }}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                  <FaEdit size={12} /> Edit
                </button>
                <button
                  onClick={() => { setPreview(null); deleteImage(preview.id) }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
                  <FaTrash size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
