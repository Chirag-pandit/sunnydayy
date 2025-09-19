import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const NewProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories for dropdown
  useEffect(() => {
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
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !sku || !brand || !price || !category || !stock || images.length === 0) {
      setError('Please fill all fields and upload at least one image.');
      return;
    }

    setUploading(true);

    try {
      // 1) Upload selected images to backend (multer)
      const form = new FormData();
      images.forEach((file) => form.append('images', file));
      const uploadRes = await fetch(`${API_BASE}/uploads/multiple`, {
        method: 'POST',
        body: form,
      });
      if (!uploadRes.ok) {
        const text = await uploadRes.text().catch(() => '');
        throw new Error(text || 'Failed to upload images');
      }
      const uploadData = await uploadRes.json();
      const imageUrls: string[] = Array.isArray(uploadData?.files)
        ? uploadData.files.map((f: any) => f.url).filter(Boolean)
        : [];
      if (imageUrls.length === 0) throw new Error('No images were uploaded');

      // 2) Create product with uploaded image URLs
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          images: imageUrls, // array<string> of /uploads/...
          category, // Category ObjectId
          stock: parseInt(stock, 10),
          sku, // required by backend
          brand, // required by backend
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let message = 'Failed to create product';
        try { const data = JSON.parse(text); if (data?.message) message = data.message; } catch {}
        throw new Error(message);
      }

      alert('Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <div className="py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-sm text-gray-700">Fill in the details below to add a new product to your store.</p>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
              <input type="text" id="sku" value={sku} onChange={e => setSku(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" placeholder="Unique identifier" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input type="text" id="brand" value={brand} onChange={e => setBrand(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" placeholder="e.g., SunnyDay" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900">
                <option value="">Select category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Manage categories under Admin → Categories.</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
              <input type="number" id="stock" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900" />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                      <span>Upload files</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" multiple className="sr-only" onChange={handleImageChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {images.map((f, i) => (
                        <div key={i} className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                          <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="pt-5">
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('/admin/products')} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Cancel</button>
              <button type="submit" disabled={uploading} className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                {uploading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProductPage;
