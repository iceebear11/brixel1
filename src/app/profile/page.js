'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout, getAuthHeaders, updateUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      setEditName(user.name || '');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="section" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading-spinner"><div className="spinner"></div></div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    let avatarUrl = user.avatar;

    try {
      // 1. Upload image if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          avatarUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || 'Image upload failed');
        }
      }

      // 2. Update profile
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: editName,
          avatar: avatarUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        updateUser({ name: editName, avatar: avatarUrl });
        showToast('Profile updated successfully! ✨', 'success');
        setIsEditing(false);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>My Profile</h2>
        <p>Manage your account settings and view your orders</p>
        <div className="accent-line"></div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '2rem', gridTemplateColumns: '1fr', '@media (min-width: 768px)': { gridTemplateColumns: '350px 1fr' } }}>
        
        {/* Profile Info Card */}
        <div className="auth-card" style={{ maxWidth: '100%', margin: '0', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-light)' }} 
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '3rem', 
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
              )}
            </div>
            
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem' }}>{user.name}</h3>
            <p className="subtitle" style={{ margin: 0, textTransform: 'capitalize', fontWeight: 'bold', color: 'var(--primary)' }}>
              {user.role} Account
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '20px', marginTop: '20px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.4rem' }}>✉️</span> 
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
                <span style={{ color: 'var(--gray-800)', fontWeight: '500' }}>{user.email}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setIsEditing(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              ✏️ Customize Profile
            </button>
            <button onClick={handleLogout} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              🚪 Log Out
            </button>
          </div>
        </div>

        {/* Quick Links / Actions Segment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="product-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '2.5rem' }}>📦</span>
              <div>
                <h3 style={{ margin: '0 0 6px 0' }}>Order History</h3>
                <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}>Check the status of recent orders.</p>
              </div>
            </div>
            <Link href="/account/orders" className="btn-outline btn-sm" style={{ textDecoration: 'none' }}>
              View Orders
            </Link>
          </div>

          {user.role === 'admin' && (
            <div className="product-card" style={{ padding: '24px', borderLeft: '5px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontSize: '2.5rem' }}>🛠️</span>
                <div>
                  <h3 style={{ margin: '0 0 6px 0' }}>Admin Controls</h3>
                  <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}>Manage products and customers.</p>
                </div>
              </div>
              <Link href="/admin" className="btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
            </div>
          )}

          <div className="product-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '2.5rem' }}>🛒</span>
              <div>
                <h3 style={{ margin: '0 0 6px 0' }}>Shopping Cart</h3>
                <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.9rem' }}>Proceed items to checkout.</p>
              </div>
            </div>
            <Link href="/cart" className="btn-outline btn-sm" style={{ textDecoration: 'none' }}>
              View Cart
            </Link>
          </div>

        </div>
      </div>

      {/* Customize Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="auth-card" style={{ maxWidth: '500px', width: '90%', padding: '32px' }}>
            <h2 style={{ marginBottom: '8px' }}>Customize Profile</h2>
            <p className="subtitle" style={{ marginBottom: '24px' }}>Update your personal informations</p>

            <form onSubmit={handleUpdateProfile}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    margin: '0 auto 12px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '3px solid var(--primary)'
                  }}
                >
                  {(previewImage || user.avatar) ? (
                    <img 
                      src={previewImage || user.avatar} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', background: 'var(--gray-100)' }}>
                      📷
                    </div>
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.5)',
                    padding: '4px 0',
                    color: 'white',
                    fontSize: '0.7rem'
                  }}>Change</div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn-ghost" 
                  style={{ flex: 1 }}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

