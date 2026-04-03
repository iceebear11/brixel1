'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { getAuthHeaders } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    delivery_charge_dhaka: 80,
    delivery_charge_outside: 150,
    contact_phone: '',
    contact_email: '',
    store_address: '',
    facebook_link: '',
    bkash_number: '',
    nagad_number: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (key, value) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        showToast(`${key.replace(/_/g, ' ')} updated`, 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAllUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ key, value }),
        });
      }
      showToast('All settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save all settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div></div>;
  }

  return (
    <div>
      <div className="admin-header">
        <h1>⚙️ Business Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Delivery settings */}
        <div className="card shadow-sm p-4">
          <h3 className="mb-4">🚚 Delivery Fees</h3>
          <div className="form-group">
            <label>Inside Dhaka (৳)</label>
            <div className="flex gap-2">
              <input type="number" name="delivery_charge_dhaka" value={settings.delivery_charge_dhaka} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('delivery_charge_dhaka', settings.delivery_charge_dhaka)}>Save</button>
            </div>
          </div>
          <div className="form-group">
            <label>Outside Dhaka (৳)</label>
            <div className="flex gap-2">
              <input type="number" name="delivery_charge_outside" value={settings.delivery_charge_outside} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('delivery_charge_outside', settings.delivery_charge_outside)}>Save</button>
            </div>
          </div>
        </div>

        {/* Contact settings */}
        <div className="card shadow-sm p-4">
          <h3 className="mb-4">📞 Essential Contact Info</h3>
          <div className="form-group">
            <label>Support Phone</label>
            <div className="flex gap-2">
              <input type="text" name="contact_phone" value={settings.contact_phone} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('contact_phone', settings.contact_phone)}>Save</button>
            </div>
          </div>
          <div className="form-group">
            <label>Support Email</label>
            <div className="flex gap-2">
              <input type="email" name="contact_email" value={settings.contact_email} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('contact_email', settings.contact_email)}>Save</button>
            </div>
          </div>
        </div>

        {/* Payment settings */}
        <div className="card shadow-sm p-4">
          <h3 className="mb-4">💳 Payment Method info</h3>
          <div className="form-group">
            <label>bKash Personal Number</label>
            <div className="flex gap-2">
              <input type="text" name="bkash_number" value={settings.bkash_number} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('bkash_number', settings.bkash_number)}>Save</button>
            </div>
          </div>
          <div className="form-group">
            <label>Nagad Personal Number</label>
            <div className="flex gap-2">
              <input type="text" name="nagad_number" value={settings.nagad_number} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('nagad_number', settings.nagad_number)}>Save</button>
            </div>
          </div>
        </div>

        {/* Store Location settings */}
        <div className="card shadow-sm p-4">
          <h3 className="mb-4">🏠 Store info</h3>
          <div className="form-group">
            <label>Store Address</label>
            <div className="flex gap-2">
              <input type="text" name="store_address" value={settings.store_address} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('store_address', settings.store_address)}>Save</button>
            </div>
          </div>
          <div className="form-group">
            <label>Facebook Page Link</label>
            <div className="flex gap-2">
              <input type="url" name="facebook_link" value={settings.facebook_link} onChange={handleChange} />
              <button className="btn-secondary" onClick={() => handleUpdate('facebook_link', settings.facebook_link)}>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button className="btn-primary" onClick={handleAllUpdate} disabled={saving}>
          {saving ? 'Saving...' : 'Save All Business Settings'}
        </button>
      </div>
    </div>
  );
}
