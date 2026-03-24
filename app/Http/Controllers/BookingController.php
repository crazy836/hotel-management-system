<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Admin sees all bookings, customers see only their own
        if ($user->isAdmin()) {
            $query = Booking::with(['room', 'user']);
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            $bookings = $query->orderBy('created_at', 'desc')->get();
        } else {
            $bookings = $user->bookings()
                ->with('room')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json(['bookings' => $bookings]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'sometimes|integer|min:1|max:10',
            'special_requests' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $room = Room::findOrFail($request->room_id);

        // Check if room is available for the requested dates
        if (!$room->isAvailableForDates($request->check_in, $request->check_out)) {
            return response()->json([
                'error' => 'Room is not available for the selected dates',
            ], 422);
        }

        // Calculate total price
        $checkIn = \Carbon\Carbon::parse($request->check_in);
        $checkOut = \Carbon\Carbon::parse($request->check_out);
        $nights = $checkIn->diffInDays($checkOut);
        $totalPrice = $nights * $room->price;

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'room_id' => $room->id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'guests' => $request->guests ?? 1,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_status' => 'pending',
                'special_requests' => $request->special_requests,
            ]);

            DB::commit();

            $booking->load('room');

            return response()->json([
                'booking' => $booking,
                'message' => 'Booking created successfully. Please complete payment.',
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Failed to create booking',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $booking->load(['room', 'user']);
        return response()->json(['booking' => $booking]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        // Only admin can update bookings
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:pending,confirmed,checked_in,checked_out,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,refunded',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $booking->update($validator->validated());

        return response()->json([
            'booking' => $booking,
            'message' => 'Booking updated successfully',
        ]);
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Request $request, Booking $booking)
    {
        // Only the booking owner or admin can cancel
        if ($booking->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($booking->status === 'checked_out' || $booking->status === 'cancelled') {
            return response()->json([
                'error' => 'Cannot cancel this booking',
            ], 422);
        }

        $booking->cancel();

        return response()->json([
            'booking' => $booking,
            'message' => 'Booking cancelled successfully',
        ]);
    }

    /**
     * Confirm a booking (Admin only).
     */
    public function confirm(Request $request, Booking $booking)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $booking->confirm();

        return response()->json([
            'booking' => $booking,
            'message' => 'Booking confirmed successfully',
        ]);
    }
}
