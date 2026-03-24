import React, { useState } from 'react';

const Navbar = ({ currentPage, onNavigate, isLoggedIn, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-white font-bold text-xl hover:text-purple-300 transition"
            >
              🏨 Hotel Manager
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* User Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 text-white hover:text-purple-300 transition bg-white/10 px-4 py-2 rounded-lg"
                  >
                    <span className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm hidden sm:block">{user?.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white font-semibold">{user?.name}</p>
                        <p className="text-white/60 text-sm">{user?.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${user?.role === 'admin' ? 'bg-purple-600/20 text-purple-300' : 'bg-blue-600/20 text-blue-300'}`}>
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {user?.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => {
                                onNavigate('customer');
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                            >
                              <span>📋</span>
                              My Bookings
                            </button>
                            <button
                              onClick={() => {
                                onNavigate('profile');
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                            >
                              <span>👤</span>
                              Profile
                            </button>
                          </>
                        )}
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                          >
                            <span>⚙️</span>
                            Admin Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onNavigate(user?.role === 'admin' ? 'admin-notifications' : 'notifications');
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                        >
                          <span>🔔</span>
                          Notifications
                        </button>
                        {user?.role !== 'admin' && (
                          <button
                            onClick={() => {
                              onNavigate('settings');
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                          >
                            <span>⚙️</span>
                            Settings
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="py-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            onLogout();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition flex items-center gap-3"
                        >
                          <span>🚪</span>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-white hover:text-purple-300 transition text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
