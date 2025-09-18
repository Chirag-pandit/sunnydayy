import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ImageObj { url: string }
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  images: (ImageObj | string)[];
  productType?: string; // e.g., tshirt, shorts
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Try public product endpoint first
        const res = await fetch(`${API_BASE}/products/${id}`);
        let data: any = null;
        if (res.ok) {
          data = await res.json();
        } else {
          // Fallback to admin product fetch
          const adminRes = await fetch(`${API_BASE}/admin/products/${id}`);
          if (!adminRes.ok) throw new Error('Failed to load product');
          data = await adminRes.json();
        }
        const p: Product = data.product || data;
        setProduct(p);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as any).categories)
          ? (data as any).categories
          : Array.isArray((data as any).data)
          ? (data as any).data
          : [];
        const mapped = list
          .map((c: any) => ({ _id: c._id || c.id || c.slug || c.name, name: c.name || c.title || c.slug || 'Unnamed' }))
          .filter((c: any) => c._id && c.name);
        setCategories(mapped);
      } catch (e) {
        // ignore
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  const handleChange = (field: keyof Product, value: any) => {
    if (!product) return;
    setProduct({ ...product, [field]: value });
  };

  const handleSave = async () => {
    if (!id || !product) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          category: product.category,
          stock: product.stock,
          description: product.description,
          productType: product.productType,
          images: product.images.map(img => typeof img === 'string' ? { url: img } : img),
        }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      alert('Product updated');
      navigate('/admin/products');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      alert('Deleted');
      navigate('/admin/products');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!product) return <div className="p-8">Not found</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
        <div>
          <button onClick={() => navigate('/admin/products')} className="mr-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm">Back</button>
          <button onClick={handleDelete} className="rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700">Delete</button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={product.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select value={product.productType || ''} onChange={e => handleChange('productType', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select type</option>
              <option value="tshirt">T-shirt</option>
              <option value="shorts">Shorts</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input type="number" value={product.price} onChange={e => handleChange('price', parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" value={product.stock} onChange={e => handleChange('stock', parseInt(e.target.value, 10))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={product.category} onChange={e => handleChange('category', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={product.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} disabled={saving} className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProductPage;
