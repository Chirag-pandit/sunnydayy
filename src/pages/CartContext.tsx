import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_image: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUserCart = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cart/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          product_id: product.id,
          quantity: quantity,
          product_name: product.name,
          product_price: product.price,
          product_image: product.image
        }),
      });

      if (response.ok) {
        await fetchUserCart(); // Refresh cart from backend
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchUserCart(); // Refresh cart from backend
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchUserCart(); // Refresh cart from backend
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cart/clear/${user.uid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const refreshCart = async () => {
    await fetchUserCart();
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (user?.uid) {
      fetchUserCart();
    } else {
      setCartItems([]);
    }
  }, [user?.uid, fetchUserCart]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    loading,
    cartTotal,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};