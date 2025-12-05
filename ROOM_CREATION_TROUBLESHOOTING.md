# Room Creation Troubleshooting Guide

## ✅ Backend Status: WORKING

The backend API has been tested and is functioning correctly:

- Database connection: ✅ Working
- Rooms table: ✅ Exists with correct structure
- Room creation endpoint: ✅ Working
- Authentication: ✅ Working

## Recent Fixes Applied

### 1. Enhanced Settings Component

**File**: `components/Settings.tsx`

**Changes**:

- Added proper error handling and display
- Added loading state during submission
- Changed price input from `text` to `number` type
- Added price validation (must be > 0)
- Added success feedback
- Improved data formatting before sending to API

### 2. Enhanced AppContext Error Handling

**File**: `context/AppContext.tsx`

**Changes**:

- Modified `addRoom`, `updateRoom`, and `deleteRoom` to throw errors
- This allows the UI to catch and display errors to users

## How to Test Room Creation

### Method 1: Using the UI

1. Log in as Super Admin (superadmin@ife.com / password123)
2. Navigate to **Settings** → **Rooms** tab
3. Click **Add Room** button
4. Fill in the form:
   - Room Number: e.g., "301"
   - Type: Select from dropdown
   - Price: Enter numeric value (e.g., 15000)
5. Click **Save Room**
6. Check for:
   - Error message (red box) if something went wrong
   - Modal should close if successful
   - Room should appear in the table

### Method 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try creating a room
4. Look for:
   - Network errors (401, 403, 500, etc.)
   - JavaScript errors
   - API response data

### Method 3: Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try creating a room
4. Look for POST request to `/api/rooms`
5. Check:
   - Request payload (should have id, number, type, price, status)
   - Response status (should be 201)
   - Response data (should return the created room)

## Common Issues and Solutions

### Issue 1: "Failed to save room" Error

**Possible Causes**:

- Not logged in as Administrator
- Backend server not running
- Database connection issue

**Solutions**:

1. Check user role: Must be "Administrator"
2. Verify backend is running: `npm run server`
3. Check database connection in server logs

### Issue 2: Room Not Appearing After Creation

**Possible Causes**:

- Frontend not refreshing data
- Room created but not added to state

**Solutions**:

1. Refresh the page manually
2. Check browser console for errors
3. Verify room exists in database using test script

### Issue 3: Price Validation Error

**Possible Causes**:

- Entering non-numeric characters
- Entering negative or zero price

**Solutions**:

1. Enter only numbers (decimals allowed)
2. Price must be greater than 0
3. Use format: 15000 or 15000.50

### Issue 4: Authentication Error (401/403)

**Possible Causes**:

- Token expired
- Not logged in as Administrator
- Token not being sent with request

**Solutions**:

1. Log out and log back in
2. Verify you're logged in as Super Admin
3. Check localStorage for 'token' key

## Testing Scripts

### Test Database Connection

```bash
node test_rooms_db.js
```

This will show:

- Database connection status
- Rooms table structure
- Existing rooms count
- Sample rooms

### Test Room Creation API

```bash
node test_room_creation.js
```

This will:

- Login as Super Admin
- Create a test room
- Verify the room was created
- Show the created room data

## Expected Behavior

### Successful Room Creation

1. User fills form and clicks "Save Room"
2. Button shows "Saving..." (disabled)
3. API request sent to `/api/rooms`
4. Server creates room in database
5. Server returns created room data
6. Frontend adds room to state
7. Modal closes
8. Room appears in table immediately

### Failed Room Creation

1. User fills form and clicks "Save Room"
2. Button shows "Saving..." (disabled)
3. API request sent to `/api/rooms`
4. Server returns error (e.g., 400, 500)
5. Error message displayed in red box
6. Button re-enabled
7. Modal stays open for user to fix issue

## Data Flow

```
User Input (Settings.tsx)
    ↓
Validation (price > 0, required fields)
    ↓
Format Data (convert price to number)
    ↓
Call addRoom (AppContext)
    ↓
POST /api/rooms (axios)
    ↓
Backend Validation (server.js)
    ↓
Insert into Database (PostgreSQL)
    ↓
Return Created Room
    ↓
Update Frontend State
    ↓
Room Appears in UI
```

## Debugging Checklist

- [ ] Backend server running (`npm run server`)
- [ ] Frontend running (`npm run dev`)
- [ ] Logged in as Administrator
- [ ] Browser console shows no errors
- [ ] Network tab shows successful POST to `/api/rooms`
- [ ] Database has rooms table
- [ ] Token present in localStorage
- [ ] Price is a valid number > 0
- [ ] Room number is unique

## Quick Fixes

### If Nothing Works

1. **Restart backend server**:

   ```bash
   # Stop current server (Ctrl+C)
   npm run server
   ```

2. **Clear browser cache and localStorage**:

   - Open DevTools → Application → Storage
   - Clear Site Data
   - Refresh page and login again

3. **Check .env file**:

   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=ife_resort_db
   DB_PASSWORD=your_password
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```

4. **Verify database**:
   ```bash
   psql -U postgres -d ife_resort_db
   \dt  # List tables
   SELECT * FROM rooms;  # View rooms
   ```

## Still Not Working?

If room creation still doesn't work after trying all the above:

1. **Check server logs**: Look at the terminal running `npm run server`
2. **Check browser console**: Look for JavaScript errors
3. **Check network tab**: Look for failed API requests
4. **Run test scripts**: Both `test_rooms_db.js` and `test_room_creation.js`
5. **Check user permissions**: Ensure logged in as Administrator

## Contact Information

For further assistance, provide:

- Browser console errors (screenshot)
- Network tab showing failed request (screenshot)
- Server logs (copy/paste)
- Output of test scripts
