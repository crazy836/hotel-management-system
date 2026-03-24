<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class ApiController extends Controller
{
    /**
     * Get weather data for hotel location.
     * Using OpenWeatherMap API (you'll need to get a free API key)
     */
    public function getWeather()
    {
        // Default: Manila, Philippines (you can change this to your hotel location)
        $city = config('services.weather.city', 'Manila');
        $apiKey = config('services.weather.api_key');

        if (!$apiKey) {
            // Return mock weather data if no API key
            return response()->json([
                'weather' => [
                    'temperature' => rand(25, 32),
                    'condition' => 'Partly Cloudy',
                    'humidity' => rand(60, 80),
                    'description' => 'Pleasant weather for your stay',
                    'location' => $city,
                ],
                'is_mock' => true,
            ]);
        }

        try {
            $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
                'q' => $city,
                'appid' => $apiKey,
                'units' => 'metric',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'weather' => [
                        'temperature' => round($data['main']['temp']),
                        'condition' => $data['weather'][0]['main'],
                        'humidity' => $data['main']['humidity'],
                        'description' => $data['weather'][0]['description'],
                        'location' => $data['name'],
                    ],
                    'is_mock' => false,
                ]);
            }
        } catch (\Exception $e) {
            // Fallback to mock data on error
        }

        return response()->json([
            'weather' => [
                'temperature' => rand(25, 32),
                'condition' => 'Partly Cloudy',
                'humidity' => rand(60, 80),
                'description' => 'Pleasant weather for your stay',
                'location' => $city,
            ],
            'is_mock' => true,
        ]);
    }

    /**
     * Process payment (Stripe integration placeholder).
     */
    public function processPayment(Request $request)
    {
        $validator = validator($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'payment_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // In production, integrate with Stripe SDK here
        // For demo purposes, we'll simulate successful payment
        
        $booking = \App\Models\Booking::findOrFail($request->booking_id);
        
        // Simulate payment processing
        $booking->update([
            'payment_status' => 'paid',
            'status' => 'confirmed',
            'payment_intent_id' => 'pi_' . bin2hex(random_bytes(16)),
        ]);

        // Send notification email
        try {
            Mail::raw(
                "Dear {$booking->user->name},\n\nYour booking #{$booking->id} has been confirmed!\n" .
                "Room: {$booking->room->room_number}\nCheck-in: {$booking->check_in}\nCheck-out: {$booking->check_out}\n" .
                "Total paid: \${$booking->total_price}\n\nThank you for choosing our hotel!",
                function ($message) use ($booking) {
                    $message->to($booking->user->email)
                            ->subject('Booking Confirmation');
                }
            );
        } catch (\Exception $e) {
            // Log error but don't fail the request
        }

        return response()->json([
            'success' => true,
            'booking' => $booking,
            'message' => 'Payment processed successfully!',
        ]);
    }

    /**
     * Send notification (for webhook or AJAX triggers).
     */
    public function sendNotification(Request $request)
    {
        $validator = validator($request->all(), [
            'type' => 'required|in:booking_confirmation,cancellation,reminder',
            'booking_id' => 'required|exists:bookings,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $booking = \App\Models\Booking::with('user')->findOrFail($request->booking_id);
        
        $subject = match($request->type) {
            'booking_confirmation' => 'Booking Confirmed',
            'cancellation' => 'Booking Cancelled',
            'reminder' => 'Upcoming Stay Reminder',
        };

        // In production, send actual email/SMS
        // For demo, return success
        
        return response()->json([
            'success' => true,
            'message' => "Notification sent: {$subject}",
        ]);
    }
}
