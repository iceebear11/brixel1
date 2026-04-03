'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="icon">🔒</div>
        <h3>Admin Access Required</h3>
        <p>You need admin privileges to access this area</p>
        <Link href="/login" className="btn-primary btn-lg">Sign In as Admin</Link>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>⚙️ Admin Panel</h3>
          <p>Welcome, {user.name}</p>
        </div>
        <ul className="admin-nav">
          <li>
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
              <span className="icon">📊</span> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className={pathname === '/admin/products' ? 'active' : ''}>
              <span className="icon">📦</span> Products
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className={pathname === '/admin/orders' ? 'active' : ''}>
              <span className="icon">🛒</span> Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={pathname === '/admin/users' ? 'active' : ''}>
              <span className="icon">👥</span> Users
            </Link>
          </li>
          <li>
            <Link href="/admin/settings" className={pathname === '/admin/settings' ? 'active' : ''}>
              <span className="icon">⚙️</span> Settings
            </Link>
          </li>
          <li>
            <Link href="/">
              <span className="icon">🏠</span> Back to Store
            </Link>
          </li>
        </ul>
      </aside>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
