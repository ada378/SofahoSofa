import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX, FiUploadCloud } from 'react-icons/fi';

const BLOG_CATEGORIES = ['General', 'Sofa Tips', 'Interior Design', 'Product Guide', 'Home Decor', 'News & Updates'];

const EMPTY_FORM = {
  title: '', slug: '', category: 'General', author: 'Sofa Hi Sofa Team',
  tags: [], excerpt: '', content: '', faqs: [], status: 'draft',
  featuredImage: { url: '', alt: '' }, metaTitle: '', metaDescription: '',
};

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

const decodeHtmlEntities = (html) => {
  if (!html) return '';
  if (/&lt;(?:h[1-6]|p|div|span|ul|ol|li|strong|b|em|i|a|table|blockquote|img)\b/i.test(html)) {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
  return html;
};

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' | 'html'
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blogs/admin/all?page=${page}&limit=20`);
      setBlogs(data.blogs); setTotalPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to fetch blogs'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload/blog-image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm(f => ({
        ...f,
        featuredImage: {
          url: data.url,
          alt: f.featuredImage.alt || data.alt || '',
        },
      }));
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      setTagInput('');
    }
  };

  const addFaq = () => setForm(f => ({ ...f, faqs: [...f.faqs, { question: '', answer: '' }] }));
  const removeFaq = (i) => setForm(f => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }));
  const updateFaq = (i, field, val) => setForm(f => ({ ...f, faqs: f.faqs.map((faq, idx) => idx === i ? { ...faq, [field]: val } : faq) }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setEditorMode('visual');
    setShowForm(true);
  };

  const openEdit = async (blog) => {
    try {
      const { data } = await api.get(`/blogs/admin/id/${blog._id}`);
      setForm({
        title: data.title || data.metaTitle || '',
        slug: data.slug || '',
        category: data.category || 'General',
        author: data.author || '',
        tags: data.tags || [],
        excerpt: data.excerpt || data.metaDescription || '',
        content: decodeHtmlEntities(data.content) || '',
        faqs: data.faqs || [],
        status: data.status || 'draft',
        featuredImage: data.featuredImage || { url: '', alt: '' },
        metaTitle: data.metaTitle || data.title || '',
        metaDescription: data.metaDescription || data.excerpt || '',
      });
      setEditing(data);
      setEditorMode('visual');
      setShowForm(true);
    } catch { toast.error('Failed to load blog'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postTitle = (form.metaTitle || form.title || '').trim();
    if (!postTitle) return toast.error('Meta Title is required');
    if (!form.content || form.content === '<p><br></p>') return toast.error('Content is required');
    
    // Automatically decode any accidentally entity-encoded HTML tags
    const cleanContent = decodeHtmlEntities(form.content);

    setSaving(true);
    try {
      const payload = {
        ...form,
        title: postTitle,
        metaTitle: postTitle,
        content: cleanContent,
        excerpt: form.metaDescription || form.excerpt || '',
        metaDescription: form.metaDescription || form.excerpt || '',
      };
      if (editing) { await api.put(`/blogs/${editing._id}`, payload); toast.success('Blog updated!'); }
      else { await api.post('/blogs', payload); toast.success('Blog published!'); }
      setShowForm(false); fetchBlogs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try { await api.delete(`/blogs/${id}`); toast.success('Deleted'); fetchBlogs(); }
    catch { toast.error('Failed to delete'); }
  };

  const wordCount = form.content ? form.content.replace(/<[^>]*>?/gm, '').split(/\s+/).filter(Boolean).length : 0;

  // ── Form View ────────────────────────────────────────────────────────────────
  if (showForm) return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">{editing ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><FiX className="w-6 h-6" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-xs text-gray-400">Fill in the details to publish or edit a blog.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* 1. Meta Title (At the top) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Meta Title * <span className="text-gray-500 font-normal">(Post title &amp; SEO title)</span>
            </label>
            <input
              name="metaTitle"
              value={form.metaTitle}
              onChange={(e) => {
                handleChange(e);
                setForm(f => ({ ...f, title: e.target.value }));
              }}
              placeholder="e.g. 10 Best Luxury Sofas for Indian Living Rooms"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none"
            />
          </div>

          {/* 2. Meta Description (At the top) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Meta Description <span className="text-gray-500 font-normal">(Short summary for Google and social previews)</span>
            </label>
            <textarea
              name="metaDescription"
              value={form.metaDescription}
              onChange={(e) => {
                handleChange(e);
                setForm(f => ({ ...f, excerpt: e.target.value }));
              }}
              rows={2}
              placeholder="A concise summary of the blog post for SEO and search engines..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Custom URL (Slug)</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Leave empty to auto-generate from title"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none">
              {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Author</label>
            <input name="author" value={form.author} onChange={handleChange} placeholder="e.g. Sofa Hi Sofa Team"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Tags — Type tag and press Enter or Comma</label>
            <div className="flex flex-wrap gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 min-h-[42px]">
              {form.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-[#C86A3B]/20 text-[#C86A3B] text-xs px-2 py-0.5 rounded-full">
                  {tag}<button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}><FiX className="w-3 h-3" /></button>
                </span>
              ))}
              <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                placeholder="Type tag..." className="flex-1 min-w-[100px] bg-transparent text-white text-sm outline-none placeholder-gray-500" />
            </div>
          </div>

          {/* Featured Image: Direct File Upload + URL Option */}
          <div className="sm:col-span-2 bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-200">Featured Image</label>
              <span className="text-[11px] text-gray-400">Direct Upload or Paste URL</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 items-start">
              {/* Upload from device */}
              <div>
                <label className="block text-[11px] text-gray-400 mb-1.5 font-medium">1. Upload Image from Device</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed border-gray-700 hover:border-[#C86A3B] rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all bg-gray-900/60 hover:bg-gray-900 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {uploadingImage ? (
                    <div className="flex items-center gap-2 text-xs text-[#C86A3B] py-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-[#C86A3B] rounded-full animate-spin" />
                      Uploading to Cloudinary...
                    </div>
                  ) : (
                    <>
                      <FiUploadCloud className="text-2xl text-[#C86A3B]" />
                      <span className="text-xs font-semibold text-gray-300">Click to Choose Photo</span>
                      <span className="text-[10px] text-gray-500">JPG, PNG, WEBP (Max 8MB · 16:9 ratio)</span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="block text-[11px] text-gray-400 font-medium">2. Or Paste Image URL</label>
                <input
                  value={form.featuredImage.url}
                  onChange={e => setForm(f => ({ ...f, featuredImage: { ...f.featuredImage, url: e.target.value } }))}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-[#C86A3B] focus:outline-none"
                />
                <input
                  value={form.featuredImage.alt}
                  onChange={e => setForm(f => ({ ...f, featuredImage: { ...f.featuredImage, alt: e.target.value } }))}
                  placeholder="Alt text for SEO (e.g. Modern Teak Wood Sofa)"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-[#C86A3B] focus:outline-none"
                />
              </div>
            </div>

            {/* Image Preview */}
            {form.featuredImage.url && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-700 max-w-sm aspect-[16/9] bg-gray-900">
                <img src={form.featuredImage.url} alt={form.featuredImage.alt || 'preview'} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, featuredImage: { url: '', alt: '' } }))}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg text-xs"
                  title="Remove image"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-300">
              Full Content * {editorMode === 'html' ? <span className="text-amber-400 font-normal">(Raw HTML Code Mode)</span> : <span className="text-gray-400 font-normal">(Visual Rich Text Mode)</span>}
            </label>
            <div className="flex items-center gap-2">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-0.5 flex">
                <button
                  type="button"
                  onClick={() => {
                    // When switching from HTML to Visual, ensure any escaped entities are decoded
                    setForm(f => ({ ...f, content: decodeHtmlEntities(f.content) }));
                    setEditorMode('visual');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${editorMode === 'visual' ? 'bg-[#C86A3B] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  📝 Visual Editor
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('html')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${editorMode === 'html' ? 'bg-[#C86A3B] text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                >
                  &lt;/&gt; HTML Code View
                </button>
              </div>
            </div>
          </div>

          {editorMode === 'visual' ? (
            <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 text-white blog-quill">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(content) => setForm(f => ({ ...f, content }))}
                modules={modules}
                className="min-h-[300px]"
              />
            </div>
          ) : (
            <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-950">
              <textarea
                value={form.content}
                onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Paste raw HTML here (e.g. <h1>Title</h1><p>Paragraph...</p>)"
                rows={16}
                className="w-full bg-gray-950 text-emerald-400 font-mono text-xs p-4 outline-none focus:ring-1 focus:ring-[#C86A3B] leading-relaxed resize-y"
                spellCheck="false"
              />
              <div className="bg-gray-900 border-t border-gray-800 px-3 py-2 text-[11px] text-gray-400 flex items-center justify-between">
                <span>💡 Tip: Paste your raw HTML here, then click <strong>Visual Editor</strong> above to preview &amp; format!</span>
                <button
                  type="button"
                  onClick={() => {
                    setForm(f => ({ ...f, content: decodeHtmlEntities(f.content) }));
                    toast.success('Cleaned HTML entities');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Clean / Decode Entities
                </button>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">{wordCount} words</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-300">Frequently Asked Questions (Optional)</label>
            <button type="button" onClick={addFaq}
              className="flex items-center gap-1 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg">
              <FiPlus className="w-3 h-3" /> Add FAQ
            </button>
          </div>
          {form.faqs.length === 0 && <p className="text-xs text-gray-500 italic">No FAQs added yet.</p>}
          <div className="space-y-3">
            {form.faqs.map((faq, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-2">
                <div className="flex justify-between"><span className="text-xs text-gray-400 font-semibold">FAQ #{i + 1}</span>
                  <button type="button" onClick={() => removeFaq(i)} className="text-red-400"><FiX className="w-4 h-4" /></button></div>
                <input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)} placeholder="Question..."
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#C86A3B] focus:outline-none" />
                <textarea value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)} placeholder="Answer..." rows={2}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:border-[#C86A3B] focus:outline-none resize-none" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setShowForm(false)}
            className="px-6 py-2.5 border border-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={saving}
            className="px-8 py-2.5 bg-[#C86A3B] hover:bg-[#A85530] text-white rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2">
            {saving ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</> : (editing ? '💾 Update' : '🚀 Publish')}
          </button>
        </div>
      </form>
    </div>
  );

  // ── List View ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-white">Blog Manager</h1><p className="text-gray-400 text-sm mt-0.5">Total: {total} posts</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#C86A3B] hover:bg-[#A85530] text-white px-4 py-2.5 rounded-lg text-sm font-bold">
          <FiPlus className="w-4 h-4" /> New Blog Post
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gray-700 border-t-[#C86A3B] rounded-full animate-spin" /></div>
      ) : blogs.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-16 text-center">
          <p className="text-4xl mb-3">📝</p>
          <h3 className="text-white font-semibold text-lg">No blog posts yet</h3>
          <p className="text-gray-400 text-sm mt-1 mb-4">Create your first blog post.</p>
          <button onClick={openCreate} className="bg-[#C86A3B] text-white px-6 py-2 rounded-lg text-sm font-semibold">Create First Post</button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                {['Title', 'Category', 'Author', 'Status', 'Views', 'Actions'].map(h => (
                  <th key={h} className={`px-5 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider ${['Category','Author','Views'].includes(h) ? 'hidden md:table-cell' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {blogs.map(blog => (
                <tr key={blog._id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-white line-clamp-1">{blog.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">/blog/{blog.slug}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-gray-300">{blog.category}</span></td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-gray-300">{blog.author}</span></td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${blog.status === 'published' ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'}`}>{blog.status}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-gray-400">{blog.views || 0}</span></td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors"><FiEye className="w-4 h-4" /></a>
                      <button onClick={() => openEdit(blog)} className="text-gray-400 hover:text-[#C86A3B] transition-colors"><FiEdit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(blog._id)} className="text-gray-400 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="bg-gray-800 px-5 py-3 flex items-center justify-between border-t border-gray-700">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold">Previous</button>
              <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
