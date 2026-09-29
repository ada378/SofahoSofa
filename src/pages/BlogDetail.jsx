import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/blogs/${slug}`);
        setBlog(data);
      } catch { setBlog(null); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="bg-brand-porcelain min-h-screen py-14 px-4">
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-6 bg-brand-sand rounded w-1/3" />
        <div className="h-10 bg-brand-sand rounded w-3/4" />
        <div className="h-64 bg-brand-sand rounded-2xl" />
        <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-3 bg-brand-sand rounded" />)}</div>
      </div>
    </div>
  );

  if (!blog) return (
    <div className="bg-brand-porcelain min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">📭</p>
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Blog not found</h2>
        <Link to="/blog" className="mt-4 inline-block text-brand-terracotta text-sm font-semibold hover:underline">← Back to Blog</Link>
      </div>
    </div>
  );

  const faqJsonLd = blog.faqs?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blog.faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } }))
  } : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: blog.featuredImage?.url,
    author: { "@type": "Person", name: blog.author },
    publisher: { "@type": "Organization", name: "Sofa Hi Sofa", logo: { "@type": "ImageObject", url: "https://www.thesofahisofa.com/logo-2.png" } },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    description: blog.excerpt,
  };

  return (
    <>
      <SEO
        title={blog.metaTitle || `${blog.title} | Sofa Hi Sofa Blog`}
        description={blog.metaDescription || blog.excerpt}
        canonical={`https://www.thesofahisofa.com/blog/${blog.slug}`}
        image={blog.featuredImage?.url}
        jsonLd={faqJsonLd ? [articleJsonLd, faqJsonLd] : [articleJsonLd]}
      />

      <div className="bg-brand-porcelain min-h-screen py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6">
            <Link to="/" className="hover:text-brand-charcoal">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-brand-charcoal">Blog</Link>
            <span>/</span>
            <span className="text-brand-charcoal font-semibold truncate">{blog.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-terracotta bg-brand-terracotta/10 px-2.5 py-1 rounded-full">{blog.category}</span>
            {blog.tags?.map(tag => (
              <span key={tag} className="text-[11px] text-brand-muted bg-brand-sand px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal leading-tight mb-4">{blog.title}</h1>

          {/* Author + Date */}
          <div className="flex items-center gap-3 text-xs text-brand-muted mb-6 pb-6 border-b border-brand-sand">
            <div className="w-8 h-8 rounded-full bg-brand-terracotta text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              {blog.author?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-brand-charcoal">{blog.author}</span>
              <span className="mx-1.5">·</span>
              {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              <span className="mx-1.5">·</span>
              {blog.views} views
            </div>
          </div>

          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <div className="rounded-2xl overflow-hidden mb-8 border border-brand-sand">
              <img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} className="w-full h-64 sm:h-80 object-cover" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-sm sm:prose max-w-none text-brand-charcoal
              prose-headings:font-display prose-headings:text-brand-charcoal
              prose-a:text-brand-terracotta prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-brand-terracotta prose-blockquote:text-brand-muted
              prose-img:rounded-xl prose-img:border prose-img:border-brand-sand
              prose-strong:text-brand-charcoal prose-li:text-brand-charcoal"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* FAQs */}
          {blog.faqs?.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-brand-charcoal mb-5">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {blog.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-brand-sand overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-brand-charcoal hover:text-brand-terracotta transition-colors"
                      aria-expanded={openFaq === i}>
                      <span>{faq.question}</span>
                      <span className={`text-xs transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-brand-muted border-t border-brand-sand/40 pt-3">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back */}
          <div className="mt-10 pt-6 border-t border-brand-sand">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-terracotta hover:underline">← Back to All Blogs</Link>
          </div>
        </div>
      </div>
    </>
  );
}
