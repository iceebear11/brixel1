'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetUrl('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSuccess(data.message);
      showToast('Reset instructions sent to your email.', 'success');
      
      // FOR DEVELOPMENT TESTING ONLY
      if (data._dev_resetUrl) {
        setDevResetUrl(data._dev_resetUrl);
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="Materiqo" style={{ width: '60px', marginBottom: '16px' }} />
        </div>
        <h1>Reset Password</h1>
        <p className="subtitle">Enter your email to receive reset link</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {devResetUrl && (
          <div className="alert" style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Development Mode Reset Link:</p>
            <Link href={devResetUrl} style={{ color: '#1976d2', textDecoration: 'underline' }}>{devResetUrl}</Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-link">
          Remember your password? <Link href="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
