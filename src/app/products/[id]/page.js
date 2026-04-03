'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const categoryLabels = {
  'drafting-tools': 'Drafting Tools',
  'model-making': 'Model Making',
  'drawing-materials': 'Drawing Materials',
  'measuring': 'Measuring Tools',
  'safety': 'Safety Gear',
  'other': 'Other',
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showPreorderModal, setShowPreorderModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      if (product.stock <= 0) {
        setShowPreorderModal(true);
      } else {
        addToCart(product, quantity);
        showToast(`${product.name} (x${quantity}) added to cart!`);
      }
    }
  };

  const confirmPreorder = () => {
    addToCart(product, quantity);
    showToast(`🛍️ ${product.name} pre-ordered! We'll notify you when it's ready.`);
    setShowPreorderModal(false);
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="icon">😕</div>
        <h3>Product not found</h3>
        <p>This product may have been removed or the link is invalid</p>
        <Link href="/products" className="btn-primary">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div style={{ marginBottom: '24px' }}>
        <Link href="/products" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Products
        </Link>
      </div>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image || '/placeholder-product.png'} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <div className="category">{categoryLabels[product.category] || product.category}</div>
          <h1>{product.name}</h1>
          <div className="price">৳ {product.price}</div>

          <div className="stock-info">
            <span className={`stock-badge ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
              {product.stock > 5 ? `✅ In Stock (${product.stock} available)` : product.stock > 0 ? `⚠️ Only ${product.stock} left` : '🛍️ Pre-order Available'}
            </span>
          </div>

          <div className="description">
            <p>{product.description}</p>
          </div>

          <div className="product-qty-selector">
            <label>Quantity:</label>
            <div className="qty-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(product.stock > 0 ? Math.min(product.stock, quantity + 1) : quantity + 1)}>+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-primary btn-lg" onClick={handleAddToCart}>
              {product.stock <= 0 ? '🛍️ Pre-order' : '🛒 Add to Cart'}
            </button>
            <Link href="/cart" className="btn-outline btn-lg" onClick={handleAddToCart}>
              {product.stock <= 0 ? 'Pre-order Now' : 'Buy Now'}
            </Link>
          </div>

          <div style={{ marginTop: '32px', padding: '20px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
            <h4 style={{ marginBottom: '12px' }}>📦 Delivery Info</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: '0 0 8px' }}>
              🚚 Delivery within <strong>2 days</strong> in Rajshahi City
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: '0 0 8px' }}>
              📍 Delivery to RUET Campus & all Rajshahi zones
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: 0 }}>
              💰 Flat delivery charge: <strong>৳100</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Pre-order Confirmation Modal */}
      {showPreorderModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '40px 36px',
            maxWidth: '480px', width: '100%', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛍️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#1A1A1A' }}>
              Confirm Pre-order
            </h2>
            <p style={{ color: '#555', marginBottom: '8px', fontSize: '1rem' }}>
              <strong>{product.name}</strong> is currently out of stock.
            </p>
            <div style={{
              background: '#FFF8E7', border: '1px solid #F5B731',
              borderRadius: '12px', padding: '16px', margin: '20px 0', textAlign: 'left'
            }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#B45309' }}>📦 Pre-order Details</p>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#555', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li>Your order will be placed as a <strong>pre-order</strong></li>
                <li>You'll be contacted once the item is <strong>restocked</strong></li>
                <li>Payment is collected at time of delivery</li>
                <li>Expected restock: <strong>5–10 business days</strong></li>
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setShowPreorderModal(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid #E5E5E5',
                  background: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmPreorder}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #E84B1C, #F5B731)',
                  color: 'white', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem'
                }}
              >
                ✅ Yes, Pre-order!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
