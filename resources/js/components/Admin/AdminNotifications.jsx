import React, { useState } from 'react';

const AdminNotifications = ({ user, token, onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch all pending bookings as notifications
      const response = await fetch('/api/admin/bookings?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const bookings = data.bookings || [];
        
        // Convert bookings to notification format
        const bookingNotifications = bookings.map((booking, index) => ({
          id: booking.id,
          bookingId: booking.id,
          type: 'booking',
          title: 'New Booking Request',
          message: `${booking.user.name} booked Room ${booking.room.room_number} for ${booking.nights || 1} nights - $${booking.total_price}`,
          time: new Date(booking.created_at).toLocaleString(),
          read: false,
          action: 'confirm',
        }));

        // Add some system notifications
        const systemNotifications = [
          { 
            id: 999, 
            type: 'system', 
            title: 'System Notification', 
            message: 'Welcome to the admin dashboard!', 
            time: 'Just now', 
            read: false 
          },
        ];

        setNotifications([...bookingNotifications, ...systemNotifications]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'booking': return '📋';
      case 'payment': return '💳';
      case 'cancellation': return '❌';
      case 'system': return '⚠️';
      case 'maintenance': return '🔧';
      default: return '🔔';
    }
  };

  const getColorClass = (type) => {
    switch(type) {
      case 'booking': return 'bg-green-500/10 border-green-500/30';
      case 'payment': return 'bg-blue-500/10 border-blue-500/30';
      case 'cancellation': return 'bg-red-500/10 border-red-500/30';
      case 'system': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'maintenance': return 'bg-orange-500/10 border-orange-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleConfirmBooking = async (notificationId, bookingId) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the notification and update the list
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        alert('Booking confirmed successfully!');
      } else {
        console.error('Confirm failed:', data);
        alert(data.message || data.error || 'Failed to confirm booking');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleDismissNotification = (notificationId) => {
    // Just remove the notification without taking action
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh}
            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            🔄 Refresh
          </button>
          <span className="text-white/60 text-sm">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </span>
          <button className="text-sm text-purple-400 hover:text-purple-300">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">🔔 Admin Notifications</h2>
          <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
            {notifications.filter(n => n.type === 'booking').length} Pending Bookings
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-2xl mb-2">⏳</div>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-lg">No pending bookings!</p>
            <p className="text-sm mt-2">All caught up. New bookings will appear here.</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">
              {notifications.filter(n => n.type === 'booking').length}
            </div>
            <div className="text-white/60 text-xs">Bookings</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {notifications.filter(n => n.type === 'payment').length}
            </div>
            <div className="text-white/60 text-xs">Payments</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">
              {notifications.filter(n => n.type === 'cancellation').length}
            </div>
            <div className="text-white/60 text-xs">Cancellations</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">
              {unreadCount}
            </div>
            <div className="text-white/60 text-xs">Unread</div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition ${
                notification.read
                  ? 'bg-white/5 border-white/10'
                  : `${getColorClass(notification.type)} border-l-4`
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl">{getIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span className="text-xs text-white/40 ml-auto">{notification.time}</span>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                    {notification.action && (
                      <div className="flex gap-2 mt-2">
                        {notification.action === 'confirm' ? (
                          <>
                            <button 
                              onClick={() => handleConfirmBooking(notification.id, notification.bookingId)}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                            >
                              ✓ Confirm Booking
                            </button>
                            <button 
                              onClick={() => handleDismissNotification(notification.id)}
                              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition">
                              → Review Details
                            </button>
                            <button 
                              onClick={() => handleDismissNotification(notification.id)}
                              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition"
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {!notification.read && notification.type !== 'booking' && (
                  <button className="text-xs text-purple-400 hover:text-purple-300 whitespace-nowrap">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-white/20 text-center">
          <p className="text-white/60 text-sm">Showing last 6 notifications</p>
          <button className="mt-2 text-purple-400 hover:text-purple-300 text-sm">
            View all notifications →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
