'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const statusLabels = {
  pending: '⏳ Pending',
  confirmed: '✅ Confirmed',
  processing: '🔨 Processing',
  shipped: '🚚 Shipped',
  delivered: '📦 Delivered',
  cancelled: '❌ Cancelled',
};

const getStatusDisplay = (order) => {
  if (order.status === 'pending' && (order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad')) {
    return '⏳ Pending Confirmation';
  }
  return statusLabels[order.status] || order.status;
};

export default function MyOrdersPage() {
  const { user, getAuthHeaders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="icon">🔐</div>
        <h3>Please login to view orders</h3>
        <Link href="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div className="orders-page">
      <h1>📦 My Orders</h1>
      <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>Track and manage your orders</p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here</p>
          <Link href="/products" className="btn-primary btn-lg">Start Shopping</Link>
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-BD', { 
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <span className={`status-badge ${order.status}`}>
                {getStatusDisplay(order)}
              </span>
            </div>

            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <div className="order-timeline">
                {statusSteps.map((step, idx) => {
                  const currentIdx = statusSteps.indexOf(order.status);
                  const isCompleted = idx < currentIdx;
                  const isActive = idx === currentIdx;
                  return (
                    <div key={step} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="step-icon">
                        {isCompleted ? '✓' : step === 'pending' ? '⏳' : step === 'confirmed' ? '✅' : step === 'processing' ? '🔨' : step === 'shipped' ? '🚚' : '📦'}
                      </div>
                      <span className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="order-card-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-card-item">
                  <img src={item.image || '/placeholder-product.png'} alt={item.name} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ color: 'var(--gray-600)' }}>x{item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                  📍 {order.deliveryZone} | 💳 {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'}
                </span>
              </div>
              <div className="order-total">Total: ৳{order.grandTotal}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
