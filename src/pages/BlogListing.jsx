import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function BlogListing() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/blogs?page=${page}&limit=9`);
        setBlogs(data.blogs); setTotalPages(data.pages); setTotal(data.total);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page]);

  return (
    <>
      <SEO
        title="Blog | Sofa Hi Sofa — Furniture Tips & Interior Design"
        description="Read expert tips on sofa buying, interior design ideas, furniture care, and home decor from Sofa Hi Sofa — Lucknow's trusted furniture brand."
        canonical="https://www.thesofahisofa.com/blog"
      />
      <div className="bg-brand-porcelain min-h-screen py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-brand-terracotta text-xs font-bold uppercase tracking-widest">Tips · Ideas · Guides</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-brand-charcoal mt-1">Sofa Hi Sofa Blog</h1>
            <p className="text-brand-muted text-sm mt-2">Interior design tips, sofa buying guides & home decor ideas.</p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-brand-sand overflow-hidden animate-pulse">
                  <div className="h-48 bg-brand-sand" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-brand-sand rounded w-1/3" />
                    <div className="h-4 bg-brand-sand rounded w-3/4" />
                    <div className="h-3 bg-brand-sand rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📝</p>
              <h2 className="font-display text-2xl text-brand-charcoal font-bold">No blogs yet</h2>
              <p className="text-brand-muted text-sm mt-2">Check back soon for interior design tips and guides.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <Link key={blog._id} to={`/blog/${blog.slug}`}
                  className="bg-white rounded-2xl border border-brand-sand overflow-hidden hover:shadow-cardHover transition-all duration-300 group flex flex-col">
                  {blog.featuredImage?.url ? (
                    <div className="h-48 overflow-hidden">
                      <img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-brand-sand/40 flex items-center justify-center text-4xl">📝</div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-terracotta bg-brand-terracotta/10 px-2 py-0.5 rounded-full">{blog.category}</span>
                      <span className="text-[10px] text-brand-muted">{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h2 className="font-display text-base font-bold text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-2">{blog.title}</h2>
                    {blog.excerpt && <p className="text-brand-muted text-xs mt-2 line-clamp-2 flex-1">{blog.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-sand/60">
                      <span className="text-xs text-brand-muted">By {blog.author}</span>
                      <span className="text-xs font-semibold text-brand-terracotta group-hover:underline">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-5 py-2 border border-brand-sand rounded-full text-xs font-semibold text-brand-charcoal disabled:opacity-40 hover:bg-brand-sand/50">← Prev</button>
              <span className="text-xs text-brand-muted">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-5 py-2 border border-brand-sand rounded-full text-xs font-semibold text-brand-charcoal disabled:opacity-40 hover:bg-brand-sand/50">Next →</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
