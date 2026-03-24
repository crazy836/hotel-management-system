import React, { useState } from 'react';

const Profile = ({ user, token, onBack }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      // Only include password if it's being changed
      if (formData.password) {
        if (formData.password !== formData.password_confirmation) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setFormData({ ...formData, password: '', password_confirmation: '' });
      } else {
        setError(data.message || Object.values(data.error || {})[0]?.[0] || 'Update failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">Edit Profile</h2>

        {message && (
          <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="border-t border-white/20 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Change Password (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  placeholder="Leave blank to keep current password"
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="text-sm text-white/60">
            <p><strong>Account Type:</strong> <span className="text-purple-300 capitalize">{user?.role}</span></p>
            <p><strong>Member Since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
