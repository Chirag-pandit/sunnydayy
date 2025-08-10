import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './pages/CartContext'
import { WishlistProvider } from './pages/WishlistContext'; 
import WishlistPage from './pages/WishlistPage';
import Profile from './pages/profile';
import Login from './login';
import { auth } from './lib/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

function LoginRoute() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/profile'

  return (
    <Login
      fullScreen
      onSuccess={() => {
        navigate(from, { replace: true })
      }}
    />
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
    return () => unsub()
  }, [])

  if (checking) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <>{children}</>
}

function ProtectedApp({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setChecking(false)
    })
    return () => unsub()
  }, [])

  if (checking) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="*" element={
        <ProtectedApp>
          <CartProvider>
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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ProtectedApp>
      } />
    </Routes>
  );
};

export default App;