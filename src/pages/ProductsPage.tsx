import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/client';
import { getPrimaryImage } from '../utils/imageUtils';

// Extend the Product type to include the image property for display
interface DisplayProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  description?: string;
  image: string;
}

// Helper to truncate description
const brief = (text?: string) => {
  if (!text) return '';
  return text.length > 100 ? text.substring(0, 100) + '...' : text;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { category: categorySlug } = useParams();

  const { addToCart } = useCart() as any;
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        let items: any[] = [];
        if (categorySlug) {
          // Resolve slug/name to category _id
          const catRes = await api<any>(`/categories`);
          const list = Array.isArray(catRes)
            ? catRes
            : Array.isArray((catRes as any).categories)
            ? (catRes as any).categories
            : Array.isArray((catRes as any).data)
            ? (catRes as any).data
            : [];
          const match = list.find((c: any) =>
            (c.slug && String(c.slug).toLowerCase() === String(categorySlug).toLowerCase()) ||
            (c.name && String(c.name).toLowerCase() === String(categorySlug).toLowerCase())
          );
          if (match?._id) {
            const data = await api<any>(`/products/category/${match._id}`);
            items = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
          } else {
            items = [];
          }
        } else {
          const data = await api<any>(`/products`);
          items = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        }

        const mapped: DisplayProduct[] = items.map((p: any) => {
          const img = getPrimaryImage(p.images, 'https://placehold.co/600x600?text=Product');
          return {
            _id: p._id,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            stock: p.stock ?? 0,
            description: brief(p.description),
            image: img,
          } as DisplayProduct;
        });
        setProducts(mapped);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Error loading products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categorySlug]);

  const handleAddToCart = async (product: DisplayProduct) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      const cartItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        // Add default size/color if needed
        size: undefined,
        color: undefined
      };
      
      const maybePromise = addToCart(cartItem);
      if (maybePromise && typeof maybePromise.then === 'function') {
        await maybePromise;
      }
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {categorySlug ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' ')}` : 'All Products'}
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x600?text=Product';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1 text-gray-900">{product.name}</h3>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <p className={`text-sm mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to={`/products/${product._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`py-2 px-4 rounded transition-colors ${
                      product.stock > 0 
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;