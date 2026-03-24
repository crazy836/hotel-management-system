import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, token, onLogout }) => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomData, setRoomData] = useState({
    room_number: '', type: 'single', price: '', description: '', capacity: 2, is_available: true
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    
    const interval = setInterval(() => {
      fetchRooms();
      fetchBookings();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms', {
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

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings', {
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

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(roomData),
      });

      if (res.ok) {
        setMessage('Room added successfully');
        setShowRoomForm(false);
        setRoomData({ room_number: '', type: 'single', price: '', description: '', capacity: 2, is_available: true });
        fetchRooms();
      }
    } catch (err) {
      setMessage('Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Delete this room?')) return;
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage('Room deleted');
        fetchRooms();
      }
    } catch (err) {
      setMessage('Failed to delete room');
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage('Booking confirmed');
        fetchBookings();
      }
    } catch (err) {
      setMessage('Failed to confirm booking');
    }
  };

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.is_available).length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + parseFloat(b.total_price), 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-white/70">Welcome, {user?.name}</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg mb-6 ${message.includes('success') || message.includes('confirmed') || message.includes('deleted') ? 'bg-green-500/20 border border-green-500 text-green-200' : 'bg-red-500/20 border border-red-500 text-red-200'}`}>
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-white">{stats.totalRooms}</div>
          <div className="text-white/70 text-sm">Total Rooms</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-green-400">{stats.availableRooms}</div>
          <div className="text-white/70 text-sm">Available</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
          <div className="text-white/70 text-sm">Total Bookings</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-yellow-400">{stats.pendingBookings}</div>
          <div className="text-white/70 text-sm">Pending</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-green-400">{stats.confirmedBookings}</div>
          <div className="text-white/70 text-sm">Confirmed</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="text-2xl font-bold text-purple-400">${stats.revenue.toFixed(0)}</div>
          <div className="text-white/70 text-sm">Revenue</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2 transition ${activeTab === 'rooms' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
        >
          Rooms Management
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 transition ${activeTab === 'bookings' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/70 hover:text-white'}`}
        >
          All Bookings
        </button>
      </div>

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Room Inventory</h2>
            <button
              onClick={() => setShowRoomForm(!showRoomForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              {showRoomForm ? 'Cancel' : 'Add New Room'}
            </button>
          </div>

          {showRoomForm && (
            <form onSubmit={handleAddRoom} className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Room Number</label>
                  <input
                    type="text"
                    value={roomData.room_number}
                    onChange={(e) => setRoomData({ ...roomData, room_number: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Type</label>
                  <select
                    value={roomData.type}
                    onChange={(e) => setRoomData({ ...roomData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="deluxe">Deluxe</option>
                    <option value="suite">Suite</option>
                    <option value="presidential">Presidential</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Price per Night ($)</label>
                  <input
                    type="number"
                    value={roomData.price}
                    onChange={(e) => setRoomData({ ...roomData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Capacity</label>
                  <input
                    type="number"
                    value={roomData.capacity}
                    onChange={(e) => setRoomData({ ...roomData, capacity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    min="1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/80 text-sm mb-2">Description</label>
                  <textarea
                    value={roomData.description}
                    onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    rows="3"
                  />
                </div>
              </div>
              <button type="submit" className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition">
                Add Room
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-purple-300 font-semibold">{room.type.toUpperCase()}</div>
                    <div className="text-white/70 text-sm">Room {room.room_number}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${room.is_available ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {room.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="text-white font-bold text-xl mb-2">${room.price}</div>
                <p className="text-white/70 text-sm mb-3 line-clamp-2">{room.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="mb-2">
                  <div className="text-white font-semibold">{booking.user.name}</div>
                  <div className="text-purple-300 text-sm">{booking.room.type} - Room {booking.room.room_number}</div>
                </div>
                <div className="text-white/70 text-sm mb-2">
                  {booking.check_in} → {booking.check_out}
                </div>
                <div className="text-white font-bold mb-2">${booking.total_price}</div>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {booking.status}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.payment_status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => confirmBooking(booking.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition text-sm"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            ))}
            {bookings.length === 0 && (
              <div className="text-white/60 col-span-full text-center py-8">
                No bookings yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
