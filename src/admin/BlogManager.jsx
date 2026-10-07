import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi';

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

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
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

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); };

  const openEdit = async (blog) => {
    try {
      const { data } = await api.get(`/blogs/admin/id/${blog._id}`);
      setForm({ title: data.title || '', slug: data.slug || '', category: data.category || 'General', author: data.author || '', tags: data.tags || [], excerpt: data.excerpt || '', content: data.content || '', faqs: data.faqs || [], status: data.status || 'draft', featuredImage: data.featuredImage || { url: '', alt: '' }, metaTitle: data.metaTitle || '', metaDescription: data.metaDescription || '' });
      setEditing(data); setShowForm(true);
    } catch { toast.error('Failed to load blog'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Title is required');
    if (!form.content || form.content === '<p><br></p>') return toast.error('Content is required');
    setSaving(true);
    try {
      const payload = { ...form };
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
        <p className="text-xs text-gray-400">Fill in the details to publish a new blog.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Blog Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Best Sofas for Small Living Rooms"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
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
            <input name="author" value={form.author} onChange={handleChange} placeholder="e.g. John Doe"
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
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Featured Image URL</label>
            <input value={form.featuredImage.url} onChange={e => setForm(f => ({ ...f, featuredImage: { ...f.featuredImage, url: e.target.value } }))}
              placeholder="https://res.cloudinary.com/..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
            {form.featuredImage.url && <img src={form.featuredImage.url} alt="preview" className="mt-2 h-32 object-cover rounded-lg border border-gray-700" />}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
              placeholder="A short description for the blog listing page..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Full Content *</label>
          <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 text-white blog-quill">
            <ReactQuill theme="snow" value={form.content} onChange={(content) => setForm(f => ({ ...f, content }))} modules={modules} className="min-h-[300px]" />
          </div>
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

        <div className="grid sm:grid-cols-2 gap-4 border-t border-gray-800 pt-4">
          <div><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 sm:col-span-2">SEO Settings</p></div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Meta Title</label>
            <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="Auto-generated if empty"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Meta Description</label>
            <input name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Auto-generated if empty"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-[#C86A3B] focus:outline-none" />
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
