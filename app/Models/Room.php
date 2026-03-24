<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'type',
        'price',
        'description',
        'capacity',
        'amenities',
        'is_available',
        'image_url',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'amenities' => 'array',
    ];

    /**
     * Get all bookings for this room.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if room is available for given dates.
     */
    public function isAvailableForDates($checkIn, $checkOut)
    {
        return !$this->bookings()
            ->where(function ($query) use ($checkIn, $checkOut) {
                $query->whereBetween('check_in', [$checkIn, $checkOut])
                      ->orWhereBetween('check_out', [$checkIn, $checkOut])
                      ->orWhere(function ($q) use ($checkIn, $checkOut) {
                          $q->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                      });
            })
            ->whereIn('status', ['confirmed', 'checked_in'])
            ->exists();
    }

    /**
     * Scope to get only available rooms.
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }
}
