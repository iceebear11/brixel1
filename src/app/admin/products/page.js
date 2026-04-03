'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const categoryOptions = [
  { value: 'drafting-tools', label: 'Drafting Tools' },
  { value: 'model-making', label: 'Model Making' },
  { value: 'drawing-materials', label: 'Drawing Materials' },
  { value: 'measuring', label: 'Measuring Tools' },
  { value: 'safety', label: 'Safety Gear' },
  { value: 'other', label: 'Other' },
];

export default function AdminProductsPage() {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: 'drafting-tools', stock: '', featured: false, image: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({ ...prev, image: data.url }));
        showToast('Image uploaded!', 'success');
      }
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: 'drafting-tools', stock: '', featured: false, image: '' });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      image: product.image || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        showToast(editingProduct ? 'Product updated!' : 'Product added!', 'success');
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showToast('Product deleted', 'success');
        fetchProducts();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>📦 Products ({products.length})</h1>
        <button className="btn-primary" onClick={openNewModal}>➕ Add Product</button>
      </div>

      {products.length > 0 ? (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.image || '/placeholder-product.png'}
                      alt={product.name}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>{categoryOptions.find(c => c.value === product.category)?.label || product.category}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>৳{product.price}</td>
                  <td>
                    <span className={`stock-badge ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.featured ? '⭐' : '—'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-secondary btn-sm" onClick={() => openEditModal(product)}>✏️ Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(product._id)}>🗑️ Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">📦</div>
          <h3>No products yet</h3>
          <p>Start adding your architectural equipment</p>
          <button className="btn-primary" onClick={openNewModal}>➕ Add First Product</button>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="form-group">
                <label>Product Image</label>
                <div className="product-form-image-preview" onClick={() => document.getElementById('product-image-input').click()}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" />
                  ) : (
                    <div className="placeholder">
                      <span>📷</span>
                      {uploading ? 'Uploading...' : 'Click to upload image'}
                    </div>
                  )}
                </div>
                <input
                  id="product-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Professional T-Square 36 inch"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the product features, materials, specifications..."
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Price (৳) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    style={{ width: 'auto' }}
                  />
                  ⭐ Featured Product (shows on homepage)
                </label>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                {editingProduct && (
                  <button type="button" className="btn-danger" onClick={() => handleDelete(editingProduct._id)}>
                    🗑️ Remove Product
                  </button>
                )}
                <div style={{ flex: 1 }}></div>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
