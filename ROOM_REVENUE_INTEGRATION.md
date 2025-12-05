# Room Management & Revenue Tracking Integration

## Overview

This update integrates the backend and frontend to ensure rooms created by the Super Admin appear across all relevant pages and enables comprehensive revenue tracking for each room.

## Features Implemented

### 1. **Full Room Integration**

Rooms created by the Super Admin now appear in:

- ✅ **Settings Page** - Room management with status display
- ✅ **Reservations** - Room selection dropdown with pricing
- ✅ **Housekeeping** - Room assignment and status tracking
- ✅ **Maintenance** - Room-based ticket management
- ✅ **Front Desk/Reception** - Check-in/Check-out operations

### 2. **Revenue Tracking System**

- **Automatic Revenue Recording**: Revenue is automatically recorded when guests check in
- **Room-Level Analytics**: Track total revenue, booking count, and average revenue per room
- **Dashboard Integration**: Revenue statistics available in dedicated analytics page
- **Historical Data**: All revenue transactions are stored with timestamps and descriptions

## Database Changes

### New Tables

1. **`room_revenue`** - Tracks all revenue transactions
   - `id` - Unique identifier
   - `room_id` - Reference to rooms table
   - `reservation_id` - Reference to reservations table
   - `amount` - Revenue amount
   - `revenue_date` - Transaction timestamp
   - `description` - Transaction description

### Modified Tables

1. **`reservations`** - Added `total_amount` column to store booking value

## API Endpoints Added

### Revenue Endpoints

- `GET /api/revenue/rooms` - Get revenue breakdown by room

  - Returns: Room details with total revenue and booking count
  - Access: Administrator, Front Manager

- `GET /api/revenue/stats` - Get overall revenue statistics
  - Returns: Total revenue, total bookings, average revenue
  - Access: Administrator, Front Manager

### Updated Endpoints

- `POST /api/reservations` - Now accepts `totalAmount` parameter
- `PUT /api/reservations/:id/checkin` - Automatically creates revenue record
- `PUT /api/reservations/:id` - Update reservation with total amount

## Frontend Components

### New Components

1. **`RoomRevenue.tsx`** - Comprehensive revenue analytics dashboard
   - Revenue statistics cards
   - Room-by-room revenue breakdown
   - Top performing rooms highlighted
   - Currency formatting (NGN)

### Updated Components

1. **`Settings.tsx`** - Added room status column
2. **`Reservations.tsx`** - Integrated totalAmount in reservation flow
3. **`AppContext.tsx`** - Added revenue state management
4. **`Layout.tsx`** - Added "Room Revenue" navigation link

## Installation & Setup

### For New Installations

1. Run the database setup script:
   ```bash
   psql -U postgres -d ife_resort_db -f server/database_setup.sql
   ```

### For Existing Installations

1. Run the migration script to add revenue tracking:

   ```bash
   psql -U postgres -d ife_resort_db -f server/migration_add_revenue.sql
   ```

2. Restart the backend server:
   ```bash
   npm run server
   ```

## Usage Guide

### Creating Rooms (Super Admin Only)

1. Navigate to **Settings** → **Rooms** tab
2. Click **Add Room**
3. Enter room details:
   - Room Number
   - Type (Standard, Deluxe, Suite, Villa)
   - Price per Night
4. Room automatically appears across all modules

### Tracking Revenue

1. Create a reservation with pricing
2. When guest checks in, revenue is automatically recorded
3. View revenue analytics at **Finance & Admin** → **Room Revenue**

### Viewing Revenue Analytics

- **Total Revenue**: All-time earnings across all rooms
- **Total Bookings**: Number of completed reservations
- **Average Revenue**: Average revenue per booking
- **Room Breakdown**: Revenue performance by individual room

## Data Flow

```
1. Super Admin creates room → Room saved to database
2. Room appears in all modules (Settings, Reservations, Housekeeping, etc.)
3. Front Desk creates reservation → totalAmount calculated and stored
4. Guest checks in → Revenue record created automatically
5. Revenue data available in analytics dashboard
```

## Security & Permissions

### Room Management

- **Create/Edit/Delete Rooms**: Super Admin only
- **View Rooms**: All authenticated users

### Revenue Access

- **View Revenue**: Super Admin, Accountant
- **Revenue automatically recorded**: System (on check-in)

## Technical Notes

### Revenue Calculation

- Revenue is recorded at check-in time
- Amount is taken from the reservation's `totalAmount` field
- Supports discounts (amount paid vs. base price)

### Database Indexes

- `idx_room_revenue_room_id` - Fast room-based queries
- `idx_room_revenue_date` - Fast date-range queries

### Error Handling

- Revenue creation failures don't block check-in
- Transaction rollback ensures data consistency
- Graceful handling of missing revenue data

## Future Enhancements

- [ ] Date-range revenue filtering
- [ ] Revenue export to CSV/Excel
- [ ] Revenue forecasting
- [ ] Occupancy rate vs. revenue correlation
- [ ] Department-wise revenue breakdown
- [ ] Monthly/Yearly revenue trends

## Troubleshooting

### Rooms not appearing in dropdown

- Ensure backend server is running
- Check browser console for API errors
- Verify room was created successfully in Settings

### Revenue not recording

- Verify `total_amount` is set in reservation
- Check that check-in operation completed successfully
- Review server logs for errors

### Revenue data not loading

- Ensure user has appropriate permissions (Admin/Accountant)
- Check network tab for failed API calls
- Verify database migration was run successfully

## Support

For issues or questions, please check:

1. Server logs: `npm run server`
2. Browser console for frontend errors
3. Database connection status
4. User permissions and roles
