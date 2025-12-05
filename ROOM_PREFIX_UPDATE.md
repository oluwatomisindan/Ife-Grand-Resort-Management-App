# Room Prefix Update - Migration Guide

## What Changed

The room number prefix generation was updated for better consistency:

**Before:**

- Onipopo → **ONIP** (4 letters)
- Moremi → **MORE** (4 letters)
- Longer names used 4 characters

**After:**

- Onipopo → **ONI** (3 letters)
- Moremi → **MOR** (3 letters)
- All names use 3 characters (except special cases)

## Complete Prefix List

| Room Type  | Old Prefix | New Prefix |
| ---------- | ---------- | ---------- |
| Onipopo    | ONIP       | **ONI**    |
| Onisabe    | ONIS       | **ONIS**   |
| Awujale    | AWUJ       | **AWU**    |
| Olubadan   | OLUB       | **OLU**    |
| Moremi     | MORE       | **MOR**    |
| Olowu      | OLOW       | **OLO**    |
| KSA A      | KSAA       | **KSAA**   |
| KSA B      | KSAB       | **KSAB**   |
| Onibeju A  | ONBA       | **ONBA**   |
| Onibeju B  | ONBB       | **ONBB**   |
| Oranmiyan  | ORAN       | **ORAN**   |
| Orangun    | ORAG       | **ORAG**   |
| Owa Obokun | OWAO       | **OWAO**   |
| Alara      | ALAR       | **ALA**    |
| Iyalaje    | IYAL       | **IYA**    |
| Zulu       | ZULU       | **ZULU**   |
| Old Ooni   | OLOO       | **OLOO**   |
| Ajero      | AJER       | **AJE**    |
| 3 Bedroom  | 3BED       | **3BED**   |
| 2 Bedroom  | 2BED       | **2BED**   |

## If You Get "Duplicate Key" Error

This means a room with that number already exists.

### Solution 1: Delete Old Room

1. Go to Settings → Rooms
2. Find the existing room (e.g., ONIP001 or ONI001)
3. Delete it
4. Create new room with correct prefix

### Solution 2: Use Different Number

Instead of 001, try:

- 002
- 003
- 004
- etc.

### Solution 3: Clean Database (Advanced)

If you have many rooms with old prefixes, run this SQL:

```sql
-- View all rooms with old prefixes
SELECT id, number, type FROM rooms
WHERE number LIKE 'ONIP%'
   OR number LIKE 'MORE%'
   OR number LIKE 'AWUJ%'
   OR number LIKE 'OLUB%'
   OR number LIKE 'OLOW%'
   OR number LIKE 'ALAR%'
   OR number LIKE 'IYAL%'
   OR number LIKE 'AJER%';

-- Delete rooms with old prefixes (CAREFUL!)
-- DELETE FROM rooms WHERE number LIKE 'ONIP%';
-- DELETE FROM rooms WHERE number LIKE 'MORE%';
-- etc.
```

**WARNING**: Only run DELETE commands if you're sure you want to remove those rooms!

## Recommended Action

**For New Installations:**

- No action needed - just create rooms normally

**For Existing Installations:**

1. **Option A (Clean Start)**: Delete all existing rooms and recreate with new prefixes
2. **Option B (Keep Data)**: Continue using different room numbers (002, 003, etc.)
3. **Option C (Manual)**: Delete only conflicting rooms one by one

## Why This Change?

**Benefits of 3-Letter Prefixes:**

1. **Consistency** - All prefixes are same length (easier to read)
2. **Shorter** - Room numbers are more compact (ONI001 vs ONIP001)
3. **Clearer** - Easier to distinguish at a glance
4. **Standard** - Follows common hotel naming conventions

## Examples

**Old Format:**

- ONIP001, ONIP002, ONIP003 (Onipopo)
- MORE001, MORE002 (Moremi)
- AWUJ001 (Awujale)

**New Format:**

- ONI001, ONI002, ONI003 (Onipopo)
- MOR001, MOR002 (Moremi)
- AWU001 (Awujale)

Much cleaner and more professional!
