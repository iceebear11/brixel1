'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      let url = '/api/orders';
      if (filter !== 'all') url += `?status=${filter}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderDetail = async (orderId, updates) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        showToast('Order updated successfully', 'success');
        fetchOrders();
        
        // Update local selectedOrder if it's the one we modified
        if (selectedOrder?._id === orderId) {
          const data = await res.json();
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>🛒 Orders ({orders.length})</h1>
      </div>

      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Orders</option>
          {statusOptions.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {orders.length > 0 ? (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{order.phone}</div>
                  </td>
                  <td>{order.items?.length || 0}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>৳{order.grandTotal}</td>
                  <td>
                    <div>{order.paymentMethod === 'cod' ? '💵 COD' : order.paymentMethod === 'bkash' ? '📱 bKash' : '📱 Nagad'}</div>
                    {order.senderNumber && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '2px' }}>From: {order.senderNumber}</div>
                    )}
                    {order.transactionId && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>ID: {order.transactionId}</div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>📍 {order.deliveryZone}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderDetail(order._id, { status: e.target.value })}
                      style={{ padding: '6px 10px', fontSize: '0.82rem', minWidth: '120px' }}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-secondary btn-sm" onClick={() => setSelectedOrder(order)}>
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="icon">📋</div>
          <h3>No orders found</h3>
          <p>{filter !== 'all' ? 'Try changing the filter' : 'Orders will appear here when customers place them'}</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2>📋 Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h4 style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '4px' }}>Customer</h4>
                <p style={{ fontWeight: 600 }}>{selectedOrder.customerName}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>📱 {selectedOrder.phone}</p>
                {selectedOrder.user?.email && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>✉️ {selectedOrder.user.email}</p>
                )}
              </div>
              <div>
                <h4 style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '4px' }}>Delivery</h4>
                <p style={{ fontWeight: 600 }}>📍 {selectedOrder.deliveryZone}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>{selectedOrder.deliveryAddress}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h4 style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '4px' }}>Payment</h4>
                <p style={{ fontWeight: 600 }}>
                  {selectedOrder.paymentMethod === 'cod' ? '💵 Cash on Delivery' : selectedOrder.paymentMethod === 'bkash' ? '📱 bKash' : '📱 Nagad'}
                </p>
                {selectedOrder.senderNumber && (
                   <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>From: {selectedOrder.senderNumber}</p>
                )}
                {selectedOrder.transactionId && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>TxID: {selectedOrder.transactionId}</p>
                )}
              </div>
              <div>
                <h4 style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '4px' }}>Status</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderDetail(selectedOrder._id, { status: e.target.value })}
                  style={{ padding: '8px 12px' }}
                >
                  {statusOptions.map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedOrder.notes && (
              <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                <h4 style={{ color: 'var(--gray-600)', fontSize: '0.82rem', marginBottom: '4px' }}>Customer Notes</h4>
                <p style={{ fontSize: '0.9rem' }}>{selectedOrder.notes}</p>
              </div>
            )}

            <h4 style={{ marginBottom: '12px' }}>🛒 Order Items</h4>
            {selectedOrder.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <img src={item.image || '/placeholder-product.png'} alt={item.name}
                  style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>৳{item.price} × {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700 }}>৳{item.price * item.quantity}</div>
              </div>
            ))}

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid var(--gray-100)' }}>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>৳{selectedOrder.totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span>৳{selectedOrder.deliveryCharge}</span>
              </div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span style={{ color: 'var(--primary)' }}>৳{selectedOrder.grandTotal}</span>
              </div>
            </div>

            <div className="modal-actions">
              {selectedOrder.paymentStatus === 'pending' && selectedOrder.paymentMethod !== 'cod' && (
                <button 
                  className="btn-success btn-sm" 
                  onClick={() => updateOrderDetail(selectedOrder._id, { paymentStatus: 'paid' })}
                >
                  💰 Mark as Paid (Verified)
                </button>
              )}
              <button className="btn-ghost" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
