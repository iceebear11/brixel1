'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

const deliveryZones = [
  'RUET Campus',
  'Shaheb Bazar',
  'Padma Residential',
  'Kazla',
  'Laxmipur',
  'Talaimari',
  'Binodpur',
  'Court Area',
  'Rajpara',
  'Sapura',
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, getAuthHeaders } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  if (!user) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="icon">🔐</div>
        <h3>Please login to checkout</h3>
        <p>You need an account to place an order</p>
        <Link href="/login" className="btn-primary btn-lg">Sign In</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products before checking out</p>
        <Link href="/products" className="btn-primary btn-lg">Browse Products</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!customerName || !phone || !deliveryAddress || !deliveryZone) {
      setError('Please fill in all delivery details');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!transactionId || !senderNumber)) {
      setError(`Please provide your ${paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} transaction ID and sender number`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          paymentMethod,
          deliveryAddress,
          deliveryZone,
          phone,
          customerName,
          transactionId,
          senderNumber,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to place order');
        return;
      }

      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      router.push('/account/orders');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const calculatedDeliveryCharge = deliveryZone === 'RUET Campus' ? 50 : 100;

  return (
    <div className="checkout-page">
      <h1>📋 Checkout</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-grid">
          <div>
            {/* Delivery Details */}
            <div className="checkout-section">
              <h2>📍 Delivery Details</h2>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your detailed delivery address in Rajshahi"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Zone (Rajshahi City Only)</label>
                <div className="delivery-zones">
                  {deliveryZones.map(zone => (
                    <div
                      key={zone}
                      className={`zone-option ${deliveryZone === zone ? 'selected' : ''}`}
                      onClick={() => setDeliveryZone(zone)}
                    >
                      {zone === 'RUET Campus' ? '🎓 ' : '📍 '}{zone}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows={2}
                />
              </div>
            </div>

            {/* Payment */}
            <div className="checkout-section">
              <h2>💳 Payment Method</h2>

              <div className="payment-options">
                <div
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <span className="icon">💵</span>
                  <div className="info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay when you receive your order</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'bkash' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('bkash')}
                >
                  <span className="icon" style={{ color: '#E2136E' }}>📱</span>
                  <div className="info">
                    <h4>bKash</h4>
                    <p>Send to: {settings?.bkash_number || '01840150075'} (Personal)</p>
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'nagad' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('nagad')}
                >
                  <span className="icon" style={{ color: '#F6921E' }}>📱</span>
                  <div className="info">
                    <h4>Nagad</h4>
                    <p>Send to: {settings?.nagad_number || '01840150075'} (Personal)</p>
                  </div>
                </div>
              </div>

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                  <div className="form-group">
                    <label>Sender bKash/Nagad Number *</label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Transaction ID *</label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter 10-digit transaction ID"
                      required
                    />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginTop: '8px' }}>
                    Send ৳{cartTotal + calculatedDeliveryCharge} to <strong>{paymentMethod === 'bkash' ? (settings?.bkash_number || '01840150075') : (settings?.nagad_number || '01840150075')}</strong> and enter the details above
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="checkout-section" style={{ position: 'sticky', top: '100px' }}>
              <h2>📦 Order Summary</h2>

              {cart.map(item => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-100)' }}>
                  <img src={item.image || '/placeholder-product.png'} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>৳{item.price * item.quantity}</div>
                </div>
              ))}

              <div className="summary-row">
                <span>Subtotal</span>
                <span className="price">৳ {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span className="price">৳ {deliveryZone ? calculatedDeliveryCharge : '---'}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="price">৳ {deliveryZone ? cartTotal + calculatedDeliveryCharge : cartTotal}</span>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: 'var(--radius)', marginTop: '16px', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                🚚 Estimated delivery: <strong>2 days</strong>
              </div>

              <button
                type="submit"
                className="btn-primary btn-lg mt-6"
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={loading || !deliveryZone}
              >
                {loading ? 'Placing Order...' : '✅ Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
