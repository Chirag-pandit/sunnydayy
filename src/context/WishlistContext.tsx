import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  images: string[];
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (id: string | number) => boolean;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (id: string | number) => {
    const key = String(id);
    return wishlist.some((item) => String(item.id) === key);
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setWishlist((prev) => [...prev, item]);
    }
  };

  const removeFromWishlist = (id: string | number) => {
    const key = String(id);
    setWishlist((prev) => prev.filter((item) => String(item.id) !== key));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
