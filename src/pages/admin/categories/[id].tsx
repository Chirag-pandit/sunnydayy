import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const AdminEditCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategory: '',
    isActive: true as boolean | string,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: ''
  });

  const makeSlug = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/categories/${id}`);
        if (!res.ok) throw new Error('Failed to fetch category');
        const data = await res.json();
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          image: data.image || '',
          parentCategory: data.parentCategory || '',
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
          sortOrder: data.sortOrder ?? 0,
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || ''
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({ ...prev, slug: makeSlug(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!id) return;

    if (!formData.name || !formData.description || !formData.image) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        isActive: formData.isActive === true || formData.isActive === 'true',
        slug: formData.slug || makeSlug(formData.name)
      };
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to update category');
      }
      alert('Category updated successfully!');
      navigate('/admin/categories');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading category...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
          <p className="mt-2 text-sm text-gray-600">Update the category details below.</p>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 max-w-2xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="auto-generated if empty" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" min={0} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="isActive" value={String(formData.isActive)} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleInputChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => navigate('/admin/categories')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditCategoryPage;
