'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
      setLowStock(data.lowStockProducts || []);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>📊 Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card orange">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats?.totalProducts || 0}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{stats?.totalOrders || 0}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-value">৳{stats?.totalRevenue?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Customers</div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-value">{stats?.pendingOrders || 0}</div>
          <div className="stat-label">⏳ Pending</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div className="stat-value">{stats?.processingOrders || 0}</div>
          <div className="stat-label">🔨 Processing</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #9b59b6' }}>
          <div className="stat-value">{stats?.shippedOrders || 0}</div>
          <div className="stat-label">🚚 Shipped</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="stat-value">{stats?.deliveredOrders || 0}</div>
          <div className="stat-label">✅ Delivered</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>🕐 Recent Orders</h2>
        {recentOrders.length > 0 ? (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600 }}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.user?.name || 'N/A'}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>৳{order.grandTotal}</td>
                    <td><span className={`status-badge ${order.status}`}>{order.status}</span></td>
                    <td>{order.paymentMethod === 'cod' ? 'COD' : order.paymentMethod}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--gray-500)' }}>No orders yet</p>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>⚠️ Low Stock Alert</h2>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map(product => (
                  <tr key={product._id}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : 'low-stock'}`}>
                        {product.stock} left
                      </span>
                    </td>
                    <td>৳{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
