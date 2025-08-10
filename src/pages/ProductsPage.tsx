import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { category } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `http://localhost:5000/api/products/category/${category}`
          : 'http://localhost:5000/api/products';
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError('Error loading products');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart(product, 1);
      alert('Product added to cart successfully!');
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-page">
      <h1>{category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}</h1>
      
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
                onError={(e) => {
                  // Fallback to a default image if the product image fails to load
                  e.currentTarget.src = '/images/products/placeholder.jpg';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <p className="product-stock">In Stock: {product.stock}</p>
              <div className="product-actions">
                <Link to={`/products/${product.id}`} className="view-details-btn">
                  View Details
                </Link>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="add-to-cart-btn"
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;