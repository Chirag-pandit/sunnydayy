import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types';
import { allProducts, tshirts, hoodies, shorts, comingSoon } from '../data/products';

// Extend the Product type to include the image property for display
interface DisplayProduct extends Omit<Product, 'images'> {
  image: string;
}

// Helper to get products by category
const getProductsByCategory = (category?: string): DisplayProduct[] => {
  let products: Product[] = [];
  
  if (!category) {
    products = allProducts;
  } else {
    const categoryMap: Record<string, Product[]> = {
      'tshirt': tshirts,
      'hoodie': hoodies,
      'shorts': shorts,
      'coming-soon': comingSoon
    };
    products = categoryMap[category] || [];
  }
  
  return products.map(product => ({
    ...product,
    image: product.images?.[0] || '',
    description: product.description 
      ? (product.description.length > 100 
          ? product.description.substring(0, 100) + '...' 
          : product.description)
      : ''
  }));
};

const ProductsPage = () => {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { category } = useParams();
  const { addToCart } = useCart() as { addToCart: (item: any) => Promise<void> };
  const { user } = useAuth();

  useEffect(() => {
    try {
      setLoading(true);
      // Get and set products for the current category
      const categoryProducts = getProductsByCategory(category);
      setProducts(categoryProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error loading products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [category]);

  const handleAddToCart = async (product: DisplayProduct) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        // Add default size/color if needed
        size: product.sizes?.[0],
        color: product.colors?.[0]
      };
      
      await addToCart(cartItem);
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
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}` : 'All Products'}
      </h1>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{product.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <p className={`text-sm mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <div className="flex flex-col space-y-2">
                  <Link 
                    to={`/products/${product.id}`}
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