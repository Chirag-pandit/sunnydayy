import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as CartAPI from "../api/cart";

type CartStateItem = CartAPI.CartItem;

type CartContextType = {
  cartItems: CartStateItem[];
  isLoading: boolean;
  addToCart: (item: {
    id: number | string;
    name: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
  }, qty?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartStateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const { items } = await CartAPI.fetchCart();
      setCartItems(items);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addToCart = async (item: {
    id: number | string; name: string; price: number; image: string; size?: string; color?: string;
  }, qty: number = 1) => {
    const payload: CartAPI.CartItem = {
      productId: Number(item.id),
      name: item.name,
      price: item.price,
      image: item.image || "",
      size: item.size || "",
      color: item.color || "",
      quantity: qty
    };
    const { item: saved } = await CartAPI.addToCart(payload);
    // either merge or refetch
    setCartItems((prev) => {
      const idx = prev.findIndex(i => i._id === saved._id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = saved;
        return clone;
      }
      // if server upserted an existing unique combo, we may not have its _id in state
      // safest: refetch
      return prev.some(p => p._id === saved._id) ? prev : [...prev, saved];
    });
    // ensure in sync
    refresh();
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const { item } = await CartAPI.updateCartItem(id, { quantity });
    setCartItems(prev => prev.map(i => i._id === id ? item : i));
  };

  const removeItem = async (id: string) => {
    await CartAPI.removeCartItem(id);
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const clear = async () => {
    await CartAPI.clearCart();
    setCartItems([]);
  };

  const total = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  );

  const value: CartContextType = {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clear,
    total
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
