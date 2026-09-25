import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

// Trim white/transparent padding from Cloudinary PNG product shots with high quality
function trimCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return url;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/e_trim,f_auto,q_auto/");
  }
  return url;
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedFabricIndex, setSelectedFabricIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
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
      className="group relative bg-white rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 md:p-3 border border-brand-sand/80 hover:border-brand-sandDark shadow-subtle hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container — aspect-square on all sizes, bigger on mobile */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white w-full min-h-[260px] sm:min-h-0">
        <img
          src={trimCloudinaryUrl(isHovered ? secondaryImage : activeImage)}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain scale-[1.06] sm:scale-100 group-hover:scale-110 transition-transform duration-500 ease-out"
        />



        {/* Bestseller Badge */}
        {product.isBestSeller && (
          <span className="absolute bottom-2 left-2 bg-brand-amber text-brand-charcoal text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-subtle uppercase tracking-wider">
            ★ Bestseller
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all ${
            inWish
              ? "bg-white text-red-500 shadow-card"
              : "bg-white/80 text-brand-charcoal hover:bg-white hover:text-red-500 shadow-subtle"
          }`}
          aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
      <div className="pt-2 sm:pt-3 px-0.5 flex-1 flex flex-col justify-between w-full min-w-0 overflow-hidden">
        <div>
          {/* Subtitle & Material */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-brand-muted w-full">
            <span className="uppercase tracking-wider font-semibold truncate flex-1 min-w-0">{product.subCategory}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.slug}`} className="block mt-0.5 sm:mt-1 w-full">
            <h3 className="font-semibold text-xs sm:text-base text-brand-charcoal group-hover:text-brand-terracotta transition-colors line-clamp-2 w-full break-words">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-brand-muted line-clamp-1 mt-0.5 hidden sm:block w-full">
            {product.material}
          </p>
        </div>

        {/* Color Swatches */}
        {product.fabricOptions && product.fabricOptions.length > 0 && (
          <div className="flex items-center gap-1 sm:gap-1.5 mt-2">
            {product.fabricOptions.slice(0, 4).map((opt, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFabricIndex(index);
                }}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all ${
                  selectedFabricIndex === index
                    ? "scale-125 border-brand-charcoal shadow-sm"
                    : "border-black/15 hover:scale-110"
                }`}
                style={{ backgroundColor: opt.hex }}
                title={opt.name}
                aria-label={`Select ${opt.name}`}
              />
            ))}
            {product.fabricOptions.length > 4 && (
              <span className="text-[9px] sm:text-[10px] text-brand-muted font-medium ml-0.5">
                +{product.fabricOptions.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Price & Mobile Add to Cart */}
        <div className="mt-2 sm:mt-3 pt-2 border-t border-brand-sand/60 flex items-center justify-between gap-1 w-full">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="font-display font-bold text-xs sm:text-base md:text-lg text-brand-charcoal whitespace-nowrap">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-brand-forest font-semibold leading-tight truncate">10-Yr Frame Warranty</p>
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-1.5 bg-brand-charcoal text-white rounded-lg active:bg-brand-terracotta flex-shrink-0"
            aria-label="Add to cart"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
