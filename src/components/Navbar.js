'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <img src="/logo.png" alt="Materiqo Logo" />
          <span>Materiqo</span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search architectural equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          
          <Link href="/cart" className="nav-cart" onClick={() => setMenuOpen(false)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin
                </Link>
              )}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-ghost btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
