'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess(true);
      showToast('Password reset successful! You can now log in.', 'success');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      if(!success) {
         setLoading(false);
      }
    }
  };

  if (!token) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
         <h2>Invalid Request</h2>
         <p style={{ margin: '16px 0', color: '#666' }}>No reset token provided. Please request a new password reset link.</p>
         <Link href="/forgot-password" className="btn-primary" style={{ display: 'inline-block' }}>
           Go to Forgot Password
         </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
         <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
         <h2>Password Reset Successful</h2>
         <p style={{ margin: '16px 0', color: '#666' }}>Your password has been updated.</p>
         <p>Redirecting to login...</p>
         <div style={{ marginTop: '24px' }}>
             <Link href="/login" className="btn-outline">
               Back to login
             </Link>
         </div>
      </div>
    )
  }

  return (
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo.png" alt="Materiqo" style={{ width: '60px', marginBottom: '16px' }} />
        </div>
        <h1>New Password</h1>
        <p className="subtitle">Please enter your new password</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <div className="auth-page">
           <Suspense fallback={<div className="auth-card" style={{textAlign: 'center'}}>Loading...</div>}>
               <ResetPasswordForm />
           </Suspense>
        </div>
    )
}
