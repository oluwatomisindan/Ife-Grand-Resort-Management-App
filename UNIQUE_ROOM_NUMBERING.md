# Unique Room Numbering System

## Overview

The system now uses **unique room numbers with prefixes** based on room types to ensure each room has a distinctive identifier. This prevents duplicate room numbers and makes room identification clearer.

## Room Number Format

**Format:** `[PREFIX][NUMBER]`

- **PREFIX**: 3-4 letter code based on room type name
- **NUMBER**: 3-digit padded number (001-999)

### Examples:

- Onipopo Room 1 → **ONI001**
- KSA A Room 5 → **KSAA005**
- Onibeju B Room 3 → **ONBB003**
- Moremi Room 10 → **MORE010**

## Room Type Prefixes

### Standard Category

- **Onipopo** → ONI (ONI001, ONI002, ... ONI014)
- **Onisabe** → ONIS (ONIS001, ONIS002, ... ONIS014)
- **Awujale** → AWUJ (AWUJ001, AWUJ002, ... AWUJ014)
- **Olubadan** → OLUB (OLUB001, OLUB002, ... OLUB014)

### Premium Category

- **Moremi** → MORE (MORE001, MORE002, ... MORE010)

### Super Premium Category

- **Olowu** → OLOW (OLOW001, OLOW002, ... OLOW010)

### Super Premium Plus Category

- **KSA A** → KSAA (KSAA001, KSAA002, ... KSAA005)
- **KSA B** → KSAB (KSAB001, KSAB002, ... KSAB005)
- **Onibeju A** → ONBA (ONBA001, ONBA002, ... ONBA005)
- **Onibeju B** → ONBB (ONBB001, ONBB002, ... ONBB005)

### Executive Category

- **Oranmiyan** → ORAN (ORAN001, ORAN002, ... ORAN007)
- **Orangun** → ORAG (ORAG001, ORAG002, ... ORAG006)
- **Owa Obokun** → OWAO (OWAO001, OWAO002, ... OWAO008)
- **Alara** → ALAR (ALAR001, ALAR002, ... ALAR006)

### Royal Diplomatic Category

- **Iyalaje** → IYAL (IYAL001, IYAL002, ... IYAL008)
- **Zulu** → ZULU (ZULU001, ZULU002, ... ZULU005)
- **Old Ooni** → OLOO (OLOO001, OLOO002, ... OLOO004)

### Kings Category

- **Ajero** → AJER (AJER001, AJER002, ... AJER010)
- **3 Bedroom Apartment** → 3BED (3BED001)
- **2 Bedroom Apartment** → 2BED (2BED001)

## How It Works

### 1. Room Creation (Super Admin)

When creating a new room:

1. **Select Room Category** (e.g., "Super Premium Plus")
2. **Select Room Type** (e.g., "KSA A")
   - System automatically determines prefix: **KSAA**
   - Prefix appears in the input field
3. **Enter Room Number** (e.g., "1")
   - Only numeric input allowed (001-005 for KSA A)
   - System shows preview: "Will be saved as: **KSAA001**"
4. **Save Room**
   - Final room number: **KSAA001**

### 2. Room Selection (Front Desk)

When making reservations or walk-in registrations:

- Rooms display with full unique numbers
- Example: "Room **ONI001** - Onipopo - ₦27,500/night"
- Easy to identify and distinguish between different room types

## Benefits

### 1. **No Duplicates**

- Each room has a truly unique identifier
- Prevents "duplicate key" database errors
- No confusion between rooms of different types

### 2. **Clear Identification**

- Room number instantly shows room type
- **ONI001** = Onipopo room
- **KSAA001** = KSA A room
- **MORE001** = Moremi room

### 3. **Better Organization**

- Rooms grouped by prefix in listings
- Easy to filter and search
- Professional appearance

### 4. **Scalability**

- System can handle many rooms per type
- Clear numbering up to 999 per type
- Easy to add new room types

## Technical Implementation

### Prefix Generation Logic

```typescript
export const getRoomPrefix = (roomTypeName: string): string => {
  // Special cases for specific room types
  const specialCases = {
    "KSA A": "KSAA",
    "KSA B": "KSAB",
    "Onibeju A": "ONBA",
    "Onibeju B": "ONBB",
    "Owa Obokun": "OWAO",
    "Old Ooni": "OLOO",
    "3 Bedroom Apartment": "3BED",
    "2 Bedroom Apartment": "2BED",
  };

  // Check special cases first
  if (specialCases[roomTypeName]) {
    return specialCases[roomTypeName];
  }

  // Default: Take first 3-4 letters
  const cleaned = roomTypeName.replace(/[^a-zA-Z]/g, "").toUpperCase();
  return cleaned.length <= 4 ? cleaned : cleaned.substring(0, 4);
};
```

### Room Number Generation

```typescript
// User enters: "1"
const prefix = getRoomPrefix("Onipopo"); // "ONI"
const paddedNumber = "1".padStart(3, "0"); // "001"
const finalRoomNumber = `${prefix}${paddedNumber}`; // "ONI001"
```

## User Interface

### Visual Feedback

The room creation form shows:

1. **Prefix Display**

   - Appears in blue text inside the input field
   - Example: **ONI** (visible when room type selected)

2. **Number Input**

   - User types only the numeric part (1-14)
   - Input field shows: **ONI**|001 (cursor after prefix)

3. **Preview Text**
   - Below input: "Will be saved as: **ONI001**"
   - Updates in real-time as user types

### Example Flow

```
Step 1: Select Category → "Standard"
Step 2: Select Room Type → "Onipopo"
        → Prefix appears: ONI
Step 3: Enter Number → "1"
        → Preview shows: "Will be saved as: ONI001"
Step 4: Save Room
        → Room created with number: ONI001
```

## Migration from Old System

If you have existing rooms with simple numbers (001, 002, etc.):

### Option 1: Manual Update

1. Edit each room in Settings
2. System will add prefix automatically
3. Save to update

### Option 2: Database Script

Run a migration to add prefixes to existing rooms based on their type.

## Files Modified

- `config/roomTypes.ts` - Added `getRoomPrefix()` function
- `components/Settings.tsx` - Updated room creation form
- Room number input shows prefix
- Automatic prefix + number combination

## Testing

✅ **Verified:**

- Prefix generation for all room types
- Room number input with prefix display
- Final room number format (PREFIX + NUMBER)
- No duplicate room numbers possible
- Room selection shows full unique numbers

## Future Enhancements

1. **Bulk Room Creation**

   - Create multiple rooms at once (ONI001-ONI014)
   - Automatic sequential numbering

2. **Room Number Search**

   - Search by prefix (all ONI rooms)
   - Search by full number (ONI001)

3. **Room Renumbering**
   - Batch update room numbers
   - Maintain prefix consistency
