import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const CART_STORAGE_KEY = "sofahisofa_cart_v2";
const COUPON_STORAGE_KEY = "sofahisofa_coupon_v2";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || "";
  });
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(() => {
    const saved = localStorage.getItem(COUPON_STORAGE_KEY);
    if (saved === "SOFA10" || saved === "WELCOME10") return 10;
    if (saved === "SOFALUXE" || saved === "FESTIVAL15") return 15;
    return 0;
  });
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, selectedFabric = null, selectedSize = null) => {
    const fabric = selectedFabric || (product.fabricOptions && product.fabricOptions[0] ? product.fabricOptions[0].name : "Standard");
    const size = selectedSize || product.seatingCapacity || "Standard";
    const cartItemId = `${product._id}-${fabric}-${size}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            product,
            quantity,
            selectedFabric: fabric,
            selectedSize: size,
            price: product.price,
            marketPrice: product.marketPrice,
          },
        ];
      }
    });

    setIsDrawerOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQty = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode("");
    setCouponDiscountPercent(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "SOFA10" || cleanCode === "WELCOME10") {
      setCouponCode(cleanCode);
      setCouponDiscountPercent(10);
      setCouponMessage("🎉 Coupon applied! Extra 10% discount added.");
      localStorage.setItem(COUPON_STORAGE_KEY, cleanCode);
      return { success: true, message: "10% off applied!" };
    } else if (cleanCode === "SOFALUXE" || cleanCode === "FESTIVAL15") {
      setCouponCode(cleanCode);
      setCouponDiscountPercent(15);
      setCouponMessage("✨ Festival Luxe code applied! Extra 15% discount added.");
      localStorage.setItem(COUPON_STORAGE_KEY, cleanCode);
      return { success: true, message: "15% off applied!" };
    } else {
      setCouponMessage("Invalid coupon code. Try 'SOFA10' or 'SOFALUXE'");
      return { success: false, message: "Invalid code" };
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscountPercent(0);
    setCouponMessage("");
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const marketTotal = cartItems.reduce((sum, item) => sum + item.marketPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * couponDiscountPercent) / 100);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalSavings = (marketTotal - subtotal) + discountAmount;
  const freeDeliveryThreshold = 20000;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        marketTotal,
        discountAmount,
        finalTotal,
        totalSavings,
        couponCode,
        couponDiscountPercent,
        couponMessage,
        freeDeliveryThreshold,
        amountToFreeDelivery,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
