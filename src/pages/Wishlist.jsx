import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist, wishlistCount } = useWishlist();

  return (
    <div className="bg-brand-porcelain min-h-screen py-8 sm:py-12">
      <SEO
        title="My Wishlist & Saved Furniture | Sofa Hi Sofa"
        description="View your saved handcrafted sofas, modular sectionals, motorized recliners, and beds."
        canonical="https://www.thesofahisofa.com/wishlist"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-sand">
          <div>
            <h1 className="font-display text-3xl text-brand-charcoal">My Saved Furniture</h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              {wishlistCount} {wishlistCount === 1 ? "design saved" : "designs saved"}
            </p>
          </div>
          <Link
            to="/collections/all"
            className="text-xs sm:text-sm font-semibold text-brand-terracotta hover:underline"
          >
            Continue Browsing Collections →
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center border border-brand-sand shadow-subtle space-y-4">
            <div className="w-16 h-16 bg-brand-sand rounded-full flex items-center justify-center mx-auto text-3xl">
              ❤️
            </div>
            <h2 className="font-display text-xl text-brand-charcoal">Your wishlist is empty</h2>
            <p className="text-brand-muted text-xs sm:text-sm">
              Tap the heart icon on any sofa or furniture piece to save it here for later.
            </p>
            <Link
              to="/collections/sofa-sets"
              className="inline-block bg-brand-charcoal text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-brand-terracotta transition-colors shadow-subtle"
            >
              Explore Sofas &amp; Furniture
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
