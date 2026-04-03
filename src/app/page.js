'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const categories = [
  { id: 'drafting-tools', name: 'Drafting Tools', icon: '📐', desc: 'T-squares, set squares, scales & more' },
  { id: 'model-making', name: 'Model Making', icon: '🏗️', desc: 'Foam boards, cutters, glue & supplies' },
  { id: 'drawing-materials', name: 'Drawing Materials', icon: '✏️', desc: 'Pencils, markers, sheets & papers' },
  { id: 'measuring', name: 'Measuring Tools', icon: '📏', desc: 'Tapes, levels, rulers & instruments' },
  { id: 'other', name: 'Other Supplies', icon: '🧰', desc: 'Everything else you need' },
];

const categoryLabels = {
  'drafting-tools': 'Drafting Tools',
  'model-making': 'Model Making',
  'drawing-materials': 'Drawing Materials',
  'measuring': 'Measuring',
  'other': 'Other',
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [preorderProduct, setPreorderProduct] = useState(null);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/products?limit=8');
      const data = await res.json();
      setFeaturedProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      setPreorderProduct(product);
    } else {
      addToCart(product);
      showToast(`${product.name} added to cart!`, 'success');
    }
  };

  const confirmPreorder = () => {
    addToCart(preorderProduct);
    showToast(`🛍️ ${preorderProduct.name} pre-ordered!`, 'success');
    setPreorderProduct(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">🏗️ #1 Architectural Supplies in Rajshahi</div>
            <h1>
              Build <span className="highlight">Better</span>,<br />
              Build with <span className="highlight">Materiqo</span>
            </h1>
            <p>
              Your one-stop shop for premium architectural equipment and supplies.
              From drafting tools to model making materials — everything a RUET architect needs,
              delivered to your doorstep in 2 days.
            </p>
            <div className="hero-actions">
              <Link href="/products" className="btn-primary btn-lg">
                🛒 Shop Now
              </Link>
              <Link href="/products?category=drafting-tools" className="btn-outline btn-lg">
                Browse Categories
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number">500+</div>
                <div className="label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="number">2 Days</div>
                <div className="label">Delivery</div>
              </div>
              <div className="hero-stat">
                <div className="number">৳50/৳100</div>
                <div className="label">Delivery Charge</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-grid">
              <div className="hero-card">
                <div className="icon">📐</div>
                <h3>Drafting Tools</h3>
                <p>Professional grade</p>
              </div>
              <div className="hero-card">
                <div className="icon">🏗️</div>
                <h3>Model Making</h3>
                <p>Complete kits</p>
              </div>
              <div className="hero-card">
                <div className="icon">✏️</div>
                <h3>Drawing</h3>
                <p>Premium supplies</p>
              </div>
              <div className="hero-card">
                <div className="icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Rajshahi & RUET</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what you need for your next architectural project</p>
          <div className="accent-line"></div>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.id}`}>
              <div className="category-card">
                <span className="icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Our most popular architectural equipment and supplies</p>
          <div className="accent-line"></div>
        </div>
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : featuredProducts.length > 0 ? (
          <>
            <div className="products-grid">
              {featuredProducts.map(product => (
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
                      <span className={`stock-badge ${product.stock > 5 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                        {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Pre-order Available'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/products" className="btn-outline btn-lg">
                View All Products →
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon">📦</div>
            <h3>Products coming soon!</h3>
            <p>We are loading our inventory with the best architectural equipment. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Materiqo?</h2>
          <p>We make shopping for architectural supplies easy and reliable</p>
          <div className="accent-line"></div>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🚚</div>
            <h3>2-Day Delivery</h3>
            <p>Fast delivery across Rajshahi city and RUET campus. Get your supplies when you need them.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Pay with Cash on Delivery, bKash, or Nagad. Multiple payment options for your convenience.</p>
          </div>
          <div className="feature-card">
            <div className="icon">✅</div>
            <h3>Quality Guaranteed</h3>
            <p>All products are handpicked and quality-tested to meet professional architectural standards.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📍</div>
            <h3>Local Service</h3>
            <p>Proudly serving RUET students and Rajshahi residents with dedicated local support.</p>
          </div>
        </div>
      </section>

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
    </>
  );
}
