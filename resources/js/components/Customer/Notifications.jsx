import React, { useState } from 'react';

const Notifications = ({ user, token, onBack }) => {
  const [notifications] = useState([
    { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your room booking has been confirmed!', time: '2 hours ago', read: false },
    { id: 2, type: 'reminder', title: 'Upcoming Stay', message: 'You have a check-in tomorrow at 2:00 PM', time: '1 day ago', read: false },
    { id: 3, type: 'payment', title: 'Payment Received', message: 'We\'ve received your payment of $200.00', time: '3 days ago', read: true },
    { id: 4, type: 'promo', title: 'Special Offer', message: 'Get 20% off your next booking this weekend!', time: '1 week ago', read: true },
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-purple-400 hover:text-purple-300 transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>
        <button className="text-sm text-purple-400 hover:text-purple-300">
          Mark all as read
        </button>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-3xl font-bold text-white mb-6">🔔 Notifications</h2>

        <div className="space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition ${
                notification.read
                  ? 'bg-white/5 border-white/10'
                  : 'bg-purple-500/10 border-purple-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">
                      {notification.type === 'booking' && '📋'}
                      {notification.type === 'reminder' && '⏰'}
                      {notification.type === 'payment' && '💳'}
                      {notification.type === 'promo' && '🎁'}
                    </span>
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                  <span className="text-white/50 text-xs">{notification.time}</span>
                </div>
                {!notification.read && (
                  <button className="text-xs text-purple-400 hover:text-purple-300 whitespace-nowrap">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/20 text-center">
          <p className="text-white/60 text-sm">No more notifications</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
