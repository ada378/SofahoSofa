import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <div className="bg-brand-porcelain min-h-screen flex items-center justify-center px-4">
      <SEO
        title="Page Not Found | Sofa Hi Sofa"
        description="Sorry, the page you are looking for could not be found. Browse our luxury furniture collections."
        canonical="https://www.thesofahisofa.com/404"
      />
      
      <div className="text-center space-y-8 max-w-lg mx-auto">
        {/* Large 404 illustration */}
        <div className="space-y-4">
          <div className="text-8xl sm:text-9xl font-display font-bold text-brand-sand select-none">
            404
          </div>
          <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-4xl border border-brand-sand">
            🛋️
          </div>
        </div>

        {/* Error message */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl sm:text-3xl text-brand-charcoal font-bold">
            Oops! This Page Seems to Be Missing
          </h1>
          <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
            The page you're looking for might have been moved, deleted, or the URL might be incorrect. 
            Don't worry, our handcrafted furniture collections are still here!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link 
            to="/"
            className="bg-brand-charcoal text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-brand-terracotta transition-all shadow-subtle inline-flex items-center gap-2 group"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to Home</span>
          </Link>
          
          <Link 
            to="/collections/all"
            className="bg-brand-porcelain border border-brand-sand hover:border-brand-terracotta text-brand-charcoal px-8 py-3.5 rounded-full text-sm font-semibold hover:text-brand-terracotta transition-all shadow-subtle inline-flex items-center gap-2 group"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Browse Collections</span>
          </Link>
        </div>

        {/* Help section */}
        <div className="pt-8 border-t border-brand-sand space-y-4">
          <h2 className="font-display text-lg text-brand-charcoal font-semibold">Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <a 
              href="https://wa.me/919810926762?text=Hi! I need help navigating the website"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 py-3 rounded-full font-semibold transition-all shadow-subtle inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Support
            </a>
            
            <a 
              href="tel:+919810926762"
              className="bg-brand-charcoal hover:bg-brand-terracotta text-white px-6 py-3 rounded-full font-semibold transition-all shadow-subtle inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Call Us
            </a>
          </div>
        </div>

        {/* Popular categories */}
        <div className="pt-6 space-y-4">
          <h3 className="font-display text-base text-brand-charcoal font-semibold">Popular Categories</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: "Sofas", slug: "sofa" },
              { name: "Beds", slug: "bed" },
              { name: "Chairs", slug: "chair" },
              { name: "Dining Tables", slug: "center-table" },
              { name: "Mirrors", slug: "mirror" }
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/collections/${category.slug}`}
                className="bg-white border border-brand-sand hover:border-brand-terracotta text-brand-charcoal hover:text-brand-terracotta px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-subtle"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}