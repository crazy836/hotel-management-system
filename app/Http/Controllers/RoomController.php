<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Room::query();

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by availability
        if ($request->has('available')) {
            $query->where('is_available', $request->boolean('available'));
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Check availability for specific dates
        if ($request->has('check_in') && $request->has('check_out')) {
            $rooms = $query->get();
            $availableRooms = $rooms->filter(function ($room) use ($request) {
                return $room->isAvailableForDates($request->check_in, $request->check_out);
            });
            return response()->json(['rooms' => $availableRooms->values()]);
        }

        $rooms = $query->get();
        return response()->json(['rooms' => $rooms]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_number' => 'required|string|unique:rooms',
            'type' => 'required|in:single,double,deluxe,suite,presidential',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'capacity' => 'sometimes|integer|min:1',
            'amenities' => 'sometimes|array',
            'is_available' => 'sometimes|boolean',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $room = Room::create($validator->validated());

        return response()->json([
            'room' => $room,
            'message' => 'Room created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        return response()->json(['room' => $room]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        $validator = Validator::make($request->all(), [
            'room_number' => 'sometimes|required|string|unique:rooms,room_number,' . $room->id,
            'type' => 'sometimes|required|in:single,double,deluxe,suite,presidential',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'capacity' => 'sometimes|integer|min:1',
            'amenities' => 'sometimes|array',
            'is_available' => 'sometimes|boolean',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $room->update($validator->validated());

        return response()->json([
            'room' => $room,
            'message' => 'Room updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json([
            'message' => 'Room deleted successfully',
        ]);
    }
}
