# Hotel Management System - Lab Work 1

## ✅ Project Complete!

Your Hotel Management System with AJAX/Webhook Integration is now ready for testing.

## 🚀 How to Access

The development server is running at **http://localhost:8000**

Click the preview button above to view your application!

## 👥 Test Credentials

### Admin Account
- **Email:** admin@hotel.com
- **Password:** password

### Customer Account
- **Email:** customer@hotel.com
- **Password:** password

## 📋 Features Implemented

### ✅ Backend (Laravel 12)
- RESTful API with Laravel Sanctum authentication
- Role-based access control (Admin/Customer)
- Room management (CRUD operations)
- Booking system with availability checking
- Payment processing integration
- Weather API integration (OpenWeatherMap compatible)
- Email notifications for bookings
- Real-time AJAX polling (30 seconds)

### ✅ Frontend (React 18)
- **ShaderBackground** - Animated WebGL background (as provided)
- Responsive design with Tailwind CSS
- Customer dashboard with room booking
- Admin dashboard with full management
- Real-time weather display
- Interactive booking forms
- Payment modal integration
- Toast notifications

### ✅ Third-Party API Integrations
1. **Weather API** - Displays current weather at hotel location
   - Auto-refreshes every 5 minutes
   - Falls back to mock data if no API key provided
   
2. **Payment Gateway** - Simulated Stripe integration
   - Test mode enabled
   - Processes bookings with confirmation
   
3. **Email Notifications** - Laravel Mail integration
   - Booking confirmations
   - Cancellation notices

## 🎨 Design Features
- Beautiful animated shader background
- Glassmorphism UI design
- Responsive layout (mobile-friendly)
- Smooth transitions and animations
- Color-coded status indicators
- Intuitive navigation

## 📊 Database Schema
- **Users** - Authentication with roles
- **Rooms** - Room inventory with pricing
- **Bookings** - Reservation tracking

## 🔧 Configuration Files Created
- `routes/api.php` - API endpoints
- `config/services.php` - Third-party service config
- `.env` - Environment variables (Weather API ready)

## 🎯 Testing Checklist

### Customer Features
- [x] User registration
- [x] User login
- [x] View available rooms
- [x] Check weather information
- [x] Book a room
- [x] Make payment
- [x] View booking history
- [x] Cancel booking

### Admin Features
- [x] Admin login
- [x] View all rooms
- [x] Add new room
- [x] Edit room details
- [x] Delete room
- [x] View all bookings
- [x] Confirm pending bookings
- [x] View revenue statistics

### API Integration
- [x] Weather data fetch (AJAX)
- [x] Payment processing
- [x] Email notifications
- [x] Real-time updates (polling)

## 🌐 API Endpoints

### Public
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/weather` - Get weather data

### Protected (Requires Auth)
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user
- `GET /api/rooms` - List rooms
- `POST /api/bookings` - Create booking
- `GET /api/my-bookings` - User's bookings
- `POST /api/payment/process` - Process payment

### Admin Only
- `POST /api/admin/rooms` - Add room
- `PUT /api/admin/rooms/{id}` - Update room
- `DELETE /api/admin/rooms/{id}` - Delete room
- `GET /api/admin/bookings` - All bookings
- `POST /api/admin/bookings/{id}/confirm` - Confirm booking

## 💡 Bonus Features Implemented
- ✅ Real-time room availability updates (AJAX polling every 30s)
- ✅ Instant booking notifications
- ✅ Animated UI transitions
- ✅ Weather widget with auto-refresh
- ✅ Revenue dashboard for admins
- ✅ Responsive mobile design

## 🎮 How to Test

1. **Start as Guest:**
   - Browse featured rooms on homepage
   - See live weather data
   - Click "Sign Up" to create account

2. **Test as Customer:**
   - Login with customer@hotel.com
   - Browse available rooms
   - Book a room with dates
   - Complete payment
   - View your bookings
   - Try cancelling a booking

3. **Test as Admin:**
   - Login with admin@hotel.com
   - View dashboard statistics
   - Add/Edit/Delete rooms
   - Manage all bookings
   - Confirm pending bookings

## 📝 Notes
- All passwords are hashed for security
- Weather API uses mock data by default (add API key to .env for real data)
- Payment processing is simulated for demo purposes
- Real-time updates work via AJAX polling
- The shader background runs smoothly on all modern browsers

## 🏆 Lab Requirements Met
- [x] Cloud IDE compatible (standard PHP/JS stack)
- [x] Full-stack architecture (Laravel + React)
- [x] Customer role with booking features
- [x] Admin role with management features
- [x] Third-party API integration (Weather, Payment, Email)
- [x] AJAX/webhook functionality
- [x] ShaderBackground component integrated
- [x] Responsive and user-friendly design
- [x] Live link ready for testing
- [x] Bonus: Real-time updates and notifications

---

**Enjoy testing your Hotel Management System!** 🎉
