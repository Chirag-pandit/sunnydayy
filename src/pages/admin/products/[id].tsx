import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ImageObj { url: string }
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string; // Category ObjectId
  stock: number;
  description?: string;
  images: (ImageObj | string)[];
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const AdminEditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
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
        const raw = data.product || data;
        const normalized: Product = {
          _id: raw._id,
          name: raw.name,
          price: raw.price,
          // if populated, use _id; else assume it's already an id string
          category: typeof raw.category === 'object' && raw.category?._id ? String(raw.category._id) : String(raw.category || ''),
          stock: raw.stock ?? 0,
          description: raw.description,
          images: Array.isArray(raw.images) ? raw.images : [],
        };
        setProduct(normalized);
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
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          category: product.category, // Category ObjectId
          stock: product.stock,
          description: product.description,
          images: product.images.map(img => (typeof img === 'string' ? img : (img?.url || ''))).filter(Boolean),
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

  // Helpers for images
  const imageToUrl = (img: ImageObj | string): string => (typeof img === 'string' ? img : (img?.url || ''));

  const handleRemoveImage = (index: number) => {
    if (!product) return;
    const next = product.images.map(imageToUrl);
    next.splice(index, 1);
    setProduct({ ...product, images: next });
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || !product) return;
    try {
      setUploadingImages(true);
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('images', f));
      const res = await fetch(`${API_BASE}/uploads/multiple`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Failed to upload images');
      }
      const data = await res.json();
      const urls: string[] = Array.isArray(data?.files) ? data.files.map((f: any) => f.url).filter(Boolean) : [];
      const merged = [...product.images.map(imageToUrl), ...urls];
      setProduct({ ...product, images: merged });
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Image upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
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
    <div className="py-8">
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
            <input value={product.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900" />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input type="number" value={product.price} onChange={e => handleChange('price', parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" value={product.stock} onChange={e => handleChange('stock', parseInt(e.target.value, 10))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={product.category} onChange={e => handleChange('category', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900">
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={product.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900" />
          </div>

          {/* Images management */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Images</label>
            {/* Preview grid */}
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <div key={idx} className="relative group border rounded-lg overflow-hidden bg-gray-50">
                    <img
                      src={imageToUrl(img)}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/300x200?text=Image'; }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-90 hover:opacity-100"
                      aria-label="Remove image"
                    >
                      Remove
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No images yet</div>
              )}
            </div>

            {/* Uploader */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Images</label>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={(e) => handleUploadImages(e.target.files)}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {uploadingImages && <p className="mt-2 text-xs text-gray-500">Uploading images...</p>}
            </div>
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
