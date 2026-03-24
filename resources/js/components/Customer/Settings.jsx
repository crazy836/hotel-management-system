import React from 'react';

const Settings = ({ user, token, onBack }) => {
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
        <h2 className="text-3xl font-bold text-white mb-6">⚙️ Settings</h2>
        
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">🎨 Appearance</h3>
            <p className="text-white/60 text-sm">Customize how the application looks</p>
            <div className="mt-4">
              <label className="flex items-center gap-3 text-white/80">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20" defaultChecked />
                <span>Dark mode (always on)</span>
              </label>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">🔔 Notifications</h3>
            <p className="text-white/60 text-sm">Manage your notification preferences</p>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-3 text-white/80">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20" defaultChecked />
                <span>Email notifications for bookings</span>
              </label>
              <label className="flex items-center gap-3 text-white/80">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20" defaultChecked />
                <span>Booking reminders</span>
              </label>
              <label className="flex items-center gap-3 text-white/80">
                <input type="checkbox" className="w-4 h-4 rounded bg-white/10 border-white/20" />
                <span>Promotional emails</span>
              </label>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">🔒 Privacy</h3>
            <p className="text-white/60 text-sm">Control your privacy settings</p>
            <div className="mt-4">
              <button className="text-purple-400 hover:text-purple-300 text-sm">
                Download my data
              </button>
            </div>
          </div>

          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <h3 className="text-xl font-semibold text-red-300 mb-2">⚠️ Danger Zone</h3>
            <p className="text-white/60 text-sm mb-4">Irreversible actions</p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
