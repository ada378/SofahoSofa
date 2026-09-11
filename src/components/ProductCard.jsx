import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedFabricIndex, setSelectedFabricIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(((product.marketPrice - product.price) / product.marketPrice) * 100);
  const inWish = isInWishlist(product._id);
  const activeImage = product.images?.[selectedFabricIndex % (product.images?.length || 1)]?.url || product.images?.[0]?.url || product.image;
  const secondaryImage = product.images?.[1]?.url || activeImage;

  const currentFabric = product.fabricOptions?.[selectedFabricIndex] || { name: "Standard", hex: "#D9A441" };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, currentFabric.name, product.seatingCapacity);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative bg-white rounded-3xl p-3 border border-brand-sand/80 hover:border-brand-sandDark shadow-subtle hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sand/40">
        <img
          src={isHovered ? secondaryImage : activeImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-brand-charcoal text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-subtle">
            {discount}% OFF
          </span>
        )}

        {/* Bestseller Badge */}
        {product.isBestSeller && (
          <span className="absolute bottom-2.5 left-2.5 bg-brand-amber text-brand-charcoal text-[10px] font-bold px-2 py-0.5 rounded-md shadow-subtle uppercase tracking-wider">
            ★ Bestseller
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all ${
            inWish
              ? "bg-white text-red-500 shadow-card"
              : "bg-white/80 text-brand-charcoal hover:bg-white hover:text-red-500 shadow-subtle"
          }`}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={inWish ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-brand-charcoal/90 hover:bg-brand-terracotta text-white py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-colors flex items-center justify-center gap-1.5 shadow-floating"
          >
            <span>+ Quick Add to Cart</span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-3 px-1 flex-1 flex flex-col justify-between">
        <div>
          {/* Subtitle & Material */}
          <div className="flex items-center justify-between text-[11px] text-brand-muted">
            <span className="uppercase tracking-wider font-semibold">{product.subCategory}</span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold">
              <span>★</span>
              <span>{product.rating}</span>
              <span className="text-brand-muted font-normal">({product.numReviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="font-semibold text-sm sm:text-base text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
            {product.material}
          </p>
        </div>

        {/* Color Swatches */}
        {product.fabricOptions && product.fabricOptions.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.fabricOptions.slice(0, 5).map((opt, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFabricIndex(index);
                }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedFabricIndex === index
                    ? "scale-125 border-brand-charcoal shadow-sm"
                    : "border-black/15 hover:scale-110"
                }`}
                style={{ backgroundColor: opt.hex }}
                title={opt.name}
                aria-label={`Select ${opt.name}`}
              />
            ))}
            {product.fabricOptions.length > 5 && (
              <span className="text-[10px] text-brand-muted font-medium ml-0.5">
                +{product.fabricOptions.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price & Mobile Add to Cart */}
        <div className="mt-3 pt-2.5 border-t border-brand-sand/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-semibold text-base sm:text-lg text-brand-charcoal">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.marketPrice > product.price && (
                <span className="text-xs text-brand-muted line-through">
                  ₹{product.marketPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="text-[10px] text-brand-forest font-semibold">Free Delivery &amp; Setup</p>
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 bg-brand-charcoal text-white rounded-xl active:bg-brand-terracotta"
            aria-label="Add to cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
