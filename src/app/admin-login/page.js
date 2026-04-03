'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      if (data.user.role !== 'admin') {
        setError('Unauthorized: You do not have admin privileges');
        return;
      }

      login(data.user, data.token);
      showToast('Welcome to the Command Center, Boss! 🛠️', 'success');
      router.push('/admin');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        padding: '50px 40px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <img src="/logo.png" alt="Materiqo" style={{ width: '80px', marginBottom: '20px' }} />
          <h1 style={{ color: '#1A1A1A', fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Admin Portal</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Secure access to materiqo management panel</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#FFF4F4', 
            border: '1px solid #FFCDCD', 
            color: '#E02424', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '24px',
            fontSize: '0.88rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Admin ID (Email)</label>
            <input
              type="email"
              placeholder="e.g. admin@materiqo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid #E5E5E5',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.9rem', color: '#333' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid #E5E5E5',
                fontSize: '1rem',
                transition: 'all 0.2s',
                outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#1A1A1A',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.1s active'
            }}
          >
            {loading ? (
              <span className="spinner-sm" style={{ border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}></span>
            ) : (
              <>🔒 Sign in to Panel</>
            )}
          </button>
        </form>

        <div style={{ marginTop: '32px', color: '#999', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Materiqo Admin Dashboard
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
