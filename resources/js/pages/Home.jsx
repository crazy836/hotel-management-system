import React, { useState, useEffect } from 'react';

const Home = ({ onNavigate, isLoggedIn, user }) => {
  const [weather, setWeather] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchWeather();
    fetchRooms();
    
    // Poll weather every 5 minutes
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch('/api/weather');
      const data = await res.json();
      setWeather(data.weather);
    } catch (err) {
      console.error('Weather error:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms?available=true');
      const data = await res.json();
      setRooms(data.rooms.slice(0, 3));
    } catch (err) {
      console.error('Rooms error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to Luxury Stays
        </h1>
        <p className="text-xl text-white/80 mb-8">
          Experience premium comfort with our world-class accommodations
        </p>
        
        {weather && (
          <div className="inline-block bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <span className="text-white">
              🌡️ {weather.temperature}°C - {weather.condition} in {weather.location}
            </span>
          </div>
        )}

        <div className="mt-12 flex justify-center gap-4">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => onNavigate('login')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition"
              >
                Book Now
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition border border-white/20"
              >
                Create Account
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate(user?.role === 'admin' ? 'admin' : 'customer')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Featured Rooms */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map(room => (
            <div key={room.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-500 transition">
              <div className="text-2xl font-bold text-white mb-2">${room.price}/night</div>
              <div className="text-purple-300 font-semibold mb-2">{room.type.toUpperCase()}</div>
              <p className="text-white/70 text-sm mb-4">{room.description}</p>
              <div className="flex gap-2 text-xs text-white/60">
                <span>👥 {room.capacity} guests</span>
                <span>🏠 Room {room.room_number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-bold text-white mb-2">Real-time Booking</h3>
          <p className="text-white/70">Instant confirmation and availability updates</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-xl font-bold text-white mb-2">Secure Payment</h3>
          <p className="text-white/70">Safe and encrypted payment processing</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-xl font-bold text-white mb-2">Instant Notifications</h3>
          <p className="text-white/70">Get booking confirmations via email</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
