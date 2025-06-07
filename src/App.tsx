import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './pages/CartContext'// ✅ Import your CartProvider
import { WishlistProvider } from './pages/WishlistContext'; 
import WishlistPage from './pages/WishlistPage';
import Profile from './pages/profile';

const App: React.FC = () => {
  return (
    <CartProvider> {/* ✅ Wrap everything in CartProvider */}
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/category/:category" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;