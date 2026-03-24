import React, { useState, useEffect } from 'react';
import Profile from '../components/Customer/Profile';

const CustomerDashboard = ({ user, token, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    room_id: '', check_in: '', check_out: '', guests: 1, special_requests: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchBookings();
      fetchRooms();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms?available=true', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Booking created! Proceeding to payment...');
        // Simulate payment
        setTimeout(() => processPayment(data.booking.id), 1500);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const processPayment = async (bookingId) => {
    try {
      const res = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ booking_id: bookingId, payment_token: 'mock_token' }),
      });

      if (res.ok) {
        setMessage('Payment successful! Booking confirmed.');
        setShowBookingForm(false);
        setBookingData({ room_id: '', check_in: '', check_out: '', guests: 1, special_requests: '' });
        fetchBookings();
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        setMessage('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
            <p className="text-white/70">Manage your bookings</p>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
          >
            👤 Edit Profile
          </button>
        </div>
      </div>

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

      {showProfile ? (
        <Profile user={user} token={token} onBack={() => setShowProfile(false)} />
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Room List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Available Rooms</h2>
          </div>
          <div className="space-y-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-purple-300 font-semibold">{room.type.toUpperCase()}</div>
                    <div className="text-white/70 text-sm">Room {room.room_number}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">${room.price}</div>
                </div>
                <p className="text-white/70 text-sm mb-3">{room.description}</p>
                <div className="flex gap-2 text-xs text-white/60 mb-3">
                  <span>👥 {room.capacity} guests</span>
                  <span>✓ Available</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    setBookingData({ ...bookingData, room_id: room.id });
                    setShowBookingForm(true);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        {showBookingForm && selectedRoom && (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 h-fit">
            <h3 className="text-2xl font-bold text-white mb-4">Book {selectedRoom.type}</h3>
            <form onSubmit={handleBookRoom} className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={bookingData.check_in}
                  onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={bookingData.check_out}
                  onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                  min={bookingData.check_in || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Guests</label>
                <input
                  type="number"
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="1"
                  max={selectedRoom.capacity}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-2">Special Requests</label>
                <textarea
                  value={bookingData.special_requests}
                  onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  rows="3"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
                  Confirm & Pay
                </button>
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      )}

      {/* My Bookings */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex justify-between items-start mb-2">
                <div className="text-purple-300 font-semibold">{booking.room.type}</div>
                <span className={`px-2 py-1 rounded text-xs ${
                  booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                  booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="text-white/70 text-sm mb-2">
                {booking.check_in} → {booking.check_out}
              </div>
              <div className="text-white font-bold mb-2">${booking.total_price}</div>
              {booking.status === 'pending' && (
                <button
                  onClick={() => cancelBooking(booking.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="text-white/60 col-span-full text-center py-8">
              No bookings yet. Book your first room!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
