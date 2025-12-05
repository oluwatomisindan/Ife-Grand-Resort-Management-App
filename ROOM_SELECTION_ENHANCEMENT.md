# Room Selection Enhancement

## Overview

Enhanced the reservation system to allow users to select from rooms created by the super admin in **both the New Reservation form and the Walk-In Guest form**. The system now provides a cascading dropdown selection process for better user experience across all guest registration workflows.

## Changes Made

### 1. Reservations Component (`components/Reservations.tsx`)

#### Enhanced Room Selection Flow

Implemented a three-tier cascading dropdown system:

1. **Room Category Selection**

   - Users first select a room category (Standard, Premium, Executive, etc.)
   - Resets downstream selections when changed

2. **Room Type Filter**

   - Dynamically populated based on selected category
   - Shows only room types that exist in the selected category
   - Uses unique room types from the rooms created by super admin
   - Disabled until a category is selected

3. **Specific Room Selection**
   - Shows individual rooms filtered by:
     - Selected category
     - Selected room type (if specified)
     - Room status (only Clean or Ready rooms)
   - Displays room details: `Room {number} - {type} - ₦{price}/night`
   - Shows helpful message when no rooms match the filters

### 2. Guests Component (`components/Guests.tsx`)

#### Walk-In Guest Registration with Room Assignment

Added the same cascading room selection to the walk-in guest form:

1. **Room Assignment Section**

   - Appears only when creating new guests (not when editing)
   - Includes visual header with bed icon
   - Positioned between guest details and payment section

2. **Automatic Price Calculation**

   - When a room is selected, the base price automatically updates
   - Price is extracted from the selected room's nightly rate
   - Discount functionality works with the room-based price

3. **Visual Feedback**
   - Success message when room is selected: "✓ Room selected - price updated below"
   - Warning when no rooms available for filters
   - Disabled states for dependent dropdowns

#### Key Features

- **Smart Filtering**: Rooms are filtered in real-time based on user selections
- **Availability Check**: Only shows available rooms (Clean/Ready status)
- **Clear Information**: Each room option displays number, type, and price
- **User Feedback**: Shows warning when no rooms are available for selected filters
- **Reset Logic**: Properly resets downstream selections when upstream filters change
- **Automatic Pricing**: Room selection automatically updates payment amount

## How It Works

### For Super Admin (Room Creation)

1. Navigate to Settings → Rooms
2. Click "Add Room"
3. Select:
   - Room Category (e.g., Premium)
   - Room Type (e.g., Onipopo - shows available room numbers 001-014)
   - Room Number (validated against room type capacity)
   - Price is auto-filled based on room type

### For Front Desk Staff (Making Reservations)

**Option 1: New Reservation**

1. Navigate to Reservations → New Reservation
2. Fill in guest details and dates
3. Select room using cascading dropdowns:
   - **Step 1**: Choose category (e.g., "Premium")
   - **Step 2**: Choose room type (e.g., "Onipopo") - optional filter
   - **Step 3**: Select specific room from available options
4. System shows only rooms that are:
   - In the selected category
   - Of the selected type (if filtered)
   - Currently available (Clean/Ready status)

**Option 2: Walk-In Guest**

1. Navigate to Guests → Add Guest
2. Fill in guest details (name, email, phone, ID)
3. Select company (optional)
4. **Room Assignment Section**:
   - Choose room category
   - Optionally filter by room type
   - Select specific room
5. **Payment Section**:
   - Base price automatically updates based on selected room
   - Apply discount if needed
   - Enter final payment amount
6. Click "Create Guest & Process Payment"

## Benefits

1. **Better Organization**: Rooms are organized by category and type
2. **Easier Selection**: Users can narrow down choices progressively
3. **Prevents Errors**: Only shows available rooms
4. **Clear Pricing**: Price is visible during selection
5. **Flexible Filtering**: Users can filter by type or view all rooms in a category

## Technical Details

### State Management

- `selectedCategory`: Tracks the selected room category
- `selectedRoomType`: Tracks the selected room type filter
- `formData.roomId`: Stores the final selected room ID

### Filtering Logic

```typescript
rooms.filter((r) => {
  // Filter by category
  if (selectedCategory && r.category !== selectedCategory) return false;
  // Filter by room type if selected
  if (selectedRoomType && r.type !== selectedRoomType) return false;
  // Only show clean/ready rooms
  return r.status === "Clean" || r.status === "Ready";
});
```

### Dynamic Room Type Population

```typescript
Array.from(
  new Set(
    rooms.filter((r) => r.category === selectedCategory).map((r) => r.type)
  )
);
```

This extracts unique room types from rooms in the selected category.

## Future Enhancements

Potential improvements for future iterations:

1. **Room Availability Calendar**: Show which rooms are available for specific date ranges
2. **Room Images**: Display room photos in the selection dropdown
3. **Room Amenities**: Show room features and amenities
4. **Quick Filters**: Add filters for bed type, floor, view, etc.
5. **Room Comparison**: Allow users to compare multiple rooms side-by-side
6. **Favorite Rooms**: Let staff mark frequently booked rooms
7. **Room Status Indicators**: Visual indicators for room status in the dropdown

## Testing Checklist

**Reservation Form:**

- [x] Room selection works with category filter
- [x] Room type filter populates correctly
- [x] Only available rooms are shown
- [x] Room details display correctly
- [x] Filters reset properly when changed
- [x] Warning shows when no rooms available
- [x] Selected room persists through form
- [x] Pricing calculation works with selected room

**Walk-In Guest Form:**

- [x] Room selection appears only for new guests
- [x] Room assignment section has proper visual header
- [x] Category selection works correctly
- [x] Room type filter populates based on category
- [x] Room selection shows available rooms only
- [x] Base price updates when room is selected
- [x] Discount functionality works with room price
- [x] Success message shows when room selected
- [x] Room ID is included in form submission

## Related Files

- `components/Reservations.tsx` - Main reservation form with room selection
- `components/Guests.tsx` - Walk-in guest form with room assignment
- `components/Settings.tsx` - Room creation interface for super admin
- `config/roomTypes.ts` - Room type definitions and pricing
- `types.ts` - Type definitions for Room, RoomCategory, etc.
- `server/server.js` - Backend API for room management

## Database Schema

The rooms table includes:

- `id`: Unique identifier
- `number`: Room number (e.g., "001", "014")
- `type`: Room type name (e.g., "Onipopo", "Alaafin")
- `category`: Room category (e.g., "Premium", "Executive")
- `price`: Price per night
- `status`: Current status (Clean, Dirty, Occupied, Ready)
- `room_type`: Additional room type field (legacy)

## API Endpoints Used

- `GET /api/rooms/status` - Fetch all rooms with details
- `POST /api/rooms` - Create new room (admin only)
- `PUT /api/rooms/:id` - Update room details (admin only)
- `DELETE /api/rooms/:id` - Delete room (admin only)
