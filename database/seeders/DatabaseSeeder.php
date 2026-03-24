<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@hotel.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Customer User
        User::create([
            'name' => 'John Doe',
            'email' => 'customer@hotel.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create Sample Rooms
        Room::create([
            'room_number' => '101',
            'type' => 'single',
            'price' => 50.00,
            'description' => 'Cozy single room with city view, perfect for solo travelers.',
            'capacity' => 1,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning'],
            'is_available' => true,
            'image_url' => null,
        ]);

        Room::create([
            'room_number' => '201',
            'type' => 'double',
            'price' => 80.00,
            'description' => 'Spacious double room with queen bed and modern amenities.',
            'capacity' => 2,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
            'is_available' => true,
            'image_url' => null,
        ]);

        Room::create([
            'room_number' => '301',
            'type' => 'deluxe',
            'price' => 120.00,
            'description' => 'Luxurious deluxe room with king bed and ocean view.',
            'capacity' => 2,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony'],
            'is_available' => true,
            'image_url' => null,
        ]);

        Room::create([
            'room_number' => '401',
            'type' => 'suite',
            'price' => 200.00,
            'description' => 'Elegant suite with separate living area and premium furnishings.',
            'capacity' => 3,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Jacuzzi'],
            'is_available' => true,
            'image_url' => null,
        ]);

        Room::create([
            'room_number' => '501',
            'type' => 'presidential',
            'price' => 500.00,
            'description' => 'Ultimate luxury presidential suite with panoramic views and exclusive services.',
            'capacity' => 4,
            'amenities' => ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Butler Service', 'Private Pool'],
            'is_available' => true,
            'image_url' => null,
        ]);
    }
}
