'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const categoryLabels = {
  'all': 'All Products',
  'drafting-tools': 'Drafting Tools',
  'model-making': 'Model Making',
  'drawing-materials': 'Drawing Materials',
  'measuring': 'Measuring Tools',
  'other': 'Other Supplies',
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('newest');
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [preorderProduct, setPreorderProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products?limit=50';
      if (category && category !== 'all') url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sort) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      setPreorderProduct(product);
    } else {
      addToCart(product);
      showToast(`${product.name} added to cart!`);
    }
  };

  const confirmPreorder = () => {
    addToCart(preorderProduct);
    showToast(`🛍️ ${preorderProduct.name} pre-ordered!`);
    setPreorderProduct(null);
  };

  return (
    <section className="section">
      <div className="section-header">
        <h2>{categoryLabels[category] || 'Products'}</h2>
        <p>Browse our complete collection of architectural equipment</p>
        <div className="accent-line"></div>
      </div>

      <div className="filter-bar">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : sortedProducts.length > 0 ? (
        <div className="products-grid">
          {sortedProducts.map(product => (
            <div key={product._id} className="product-card">
              <Link href={`/products/${product._id}`}>
                <div className="product-card-image">
                  <img src={product.image || '/placeholder-product.png'} alt={product.name} />
                  {product.featured && <span className="product-card-badge">Featured</span>}
                </div>
              </Link>
              <div className="product-card-body">
                <div className="product-card-category">
                  {categoryLabels[product.category] || product.category}
                </div>
                <Link href={`/products/${product._id}`}>
                  <h3>{product.name}</h3>
                </Link>
                <div className="product-card-price">
                  <span className="currency">৳</span> {product.price}
                </div>
                <div className="product-card-footer">
                  <button
                    className="btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.stock <= 0 ? '🛍️ Pre-order' : '🛒 Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or category filter</p>
          <button className="btn-primary" onClick={() => { setCategory('all'); setSearch(''); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Pre-order Confirmation Modal */}
      {preorderProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '36px',
            maxWidth: '460px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px', color: '#1A1A1A' }}>Confirm Pre-order</h2>
            <p style={{ color: '#555', marginBottom: '4px' }}>
              <strong>{preorderProduct.name}</strong> is currently out of stock.
            </p>
            <div style={{
              background: '#FFF8E7', border: '1px solid #F5B731',
              borderRadius: '12px', padding: '16px', margin: '16px 0', textAlign: 'left'
            }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#B45309' }}>📦 Pre-order Info</p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#555', fontSize: '0.88rem', lineHeight: '1.8' }}>
                <li>Your order will be placed as a <strong>pre-order</strong></li>
                <li>We'll contact you once the item is <strong>restocked</strong></li>
                <li>Payment collected at time of <strong>delivery</strong></li>
                <li>Estimated restock: <strong>5–10 business days</strong></li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setPreorderProduct(null)}
                style={{
                  flex: 1, padding: '13px', borderRadius: '12px',
                  border: '2px solid #E5E5E5', background: 'white',
                  fontWeight: 700, cursor: 'pointer'
                }}
              >Cancel</button>
              <button
                onClick={confirmPreorder}
                style={{
                  flex: 2, padding: '13px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #E84B1C, #F5B731)',
                  color: 'white', fontWeight: 800, cursor: 'pointer'
                }}
              >✅ Yes, Pre-order!</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
