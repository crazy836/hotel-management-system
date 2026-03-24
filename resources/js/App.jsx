import React, { useState, useEffect } from 'react';
import ShaderBackground from './components/ShaderBackground';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './components/Customer/Profile';
import Settings from './components/Customer/Settings';
import Notifications from './components/Customer/Notifications';
import AdminNotifications from './components/Admin/AdminNotifications';

const API_URL = '/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'customer');
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  const register = (userData, authToken) => {
    login(userData, authToken);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={login} onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <Register onRegister={register} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'customer':
        return <CustomerDashboard user={user} token={token} onLogout={logout} />;
      case 'admin':
        return <AdminDashboard user={user} token={token} onLogout={logout} />;
      case 'profile':
        return <Profile user={user} token={token} onBack={() => setCurrentPage('customer')} />;
      case 'settings':
        return <Settings user={user} token={token} onBack={() => setCurrentPage('customer')} />;
      case 'notifications':
        return <Notifications user={user} token={token} onBack={() => setCurrentPage('customer')} />;
      case 'admin-notifications':
        return <AdminNotifications user={user} token={token} onBack={() => setCurrentPage('admin')} />;
      default:
        return <Home onNavigate={(page) => setCurrentPage(page)} isLoggedIn={!!user} user={user} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      <ShaderBackground />
      <div className="relative z-10">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={(page) => setCurrentPage(page)}
          isLoggedIn={!!user}
          user={user}
          onLogout={logout}
        />
        <main className="pt-16 pb-20">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
