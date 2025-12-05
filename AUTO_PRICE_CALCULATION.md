# Automatic Price Calculation in Reservation Form

## Overview

The reservation form now **automatically updates the price** in the payment section when:

- A room is selected
- Check-in or check-out dates are changed

This ensures accurate pricing based on the selected room's nightly rate and the duration of stay.

## How It Works

### Automatic Calculation

When you select a room and dates, the system:

1. **Gets the room's nightly rate** from the selected room
2. **Calculates the number of nights** between check-in and check-out dates
3. **Multiplies** nightly rate × number of nights
4. **Updates** both the base price and amount paid automatically

### Formula

```
Total Price = Room Nightly Rate × Number of Nights
```

### Example

**Selected Room:** ONI001 - Onipopo - ₦27,500/night  
**Check-in:** 2025-12-10  
**Check-out:** 2025-12-13  
**Nights:** 3 nights

**Calculation:**  
₦27,500 × 3 = **₦82,500**

The payment section automatically shows: **₦82,500**

## Visual Feedback

### Price Calculation Info Box

When a room and dates are selected, a blue info box appears showing:

```
✓ Price automatically calculated: ₦27,500/night × 3 nights = ₦82,500
```

This provides transparency and helps users verify the calculation.

## Features

### 1. **Real-time Updates**

- Price updates instantly when room or dates change
- No manual calculation needed
- Always accurate

### 2. **Works in All Modes**

- ✅ New reservation creation
- ✅ Editing existing reservations
- ✅ Automatic recalculation on changes

### 3. **Discount Integration**

- Base price updates automatically
- If discount is NOT active: Amount paid updates too
- If discount IS active: Amount paid stays at discounted value
- User can manually adjust when discount is enabled

### 4. **Smart Behavior**

**Scenario 1: Creating New Reservation**

1. Select room: ONI001 (₦27,500/night)
2. Select dates: 3 nights
3. ✅ Price automatically set to ₦82,500

**Scenario 2: Changing Room**

1. Original: ONI001 (₦27,500) × 3 nights = ₦82,500
2. Change to: KSAA001 (₦45,000/night)
3. ✅ Price automatically updates to ₦135,000

**Scenario 3: Changing Dates**

1. Original: 3 nights × ₦27,500 = ₦82,500
2. Change to: 5 nights
3. ✅ Price automatically updates to ₦137,500

**Scenario 4: With Discount**

1. Base price: ₦82,500
2. Enable discount, set amount to: ₦70,000
3. Change dates to 5 nights
4. ✅ Base price updates to ₦137,500
5. ⚠️ Amount paid stays at ₦70,000 (manual discount preserved)
6. User can adjust discount amount if needed

## User Interface

### Payment Section Display

```
┌─────────────────────────────────────────┐
│ 💰 Pricing Details                      │
│                                          │
│ Fixed Price (Total)                     │
│ ₦82,500 (read-only, grayed)             │
│                                          │
│ Discount Given                           │
│ ₦0                                       │
│                                          │
│ Amount Paid / Final Price                │
│ ₦82,500 (blue, editable if discount on) │
│                                          │
│ ✓ Price automatically calculated:       │
│   ₦27,500/night × 3 nights = ₦82,500   │
└─────────────────────────────────────────┘
```

## Technical Implementation

### Price Calculation Effect

```typescript
useEffect(() => {
  if (formData.roomId && formData.checkIn && formData.checkOut) {
    const room = rooms.find((r) => r.id === formData.roomId);
    if (room) {
      const start = parseISO(formData.checkIn);
      const end = parseISO(formData.checkOut);
      const nights = differenceInDays(end, start);

      if (nights > 0) {
        const priceStr = String(room.price).replace(/[^0-9.]/g, "");
        const priceVal = parseFloat(priceStr) || 0;
        const calculatedPrice = priceVal * nights;

        // Update base price
        setBasePrice(calculatedPrice);

        // Update amount paid only if discount is not active
        if (!giveDiscount) {
          setAmountPaid(calculatedPrice);
        }
      }
    }
  }
}, [formData.roomId, formData.checkIn, formData.checkOut, rooms, giveDiscount]);
```

### Dependencies

The calculation triggers when:

- `formData.roomId` changes (different room selected)
- `formData.checkIn` changes (check-in date modified)
- `formData.checkOut` changes (check-out date modified)
- `rooms` data changes (room prices updated)
- `giveDiscount` changes (discount toggled)

## Benefits

### 1. **Accuracy**

- Eliminates manual calculation errors
- Always uses current room rates
- Correct night count calculation

### 2. **Efficiency**

- Saves time for front desk staff
- Instant price updates
- No calculator needed

### 3. **Transparency**

- Shows calculation breakdown
- Users can verify pricing
- Clear and professional

### 4. **Flexibility**

- Works with discount system
- Handles date changes smoothly
- Adapts to room changes

## Edge Cases Handled

### ✅ Zero Nights

- If check-out = check-in, no calculation
- Prevents division errors

### ✅ Invalid Dates

- If check-out before check-in, no calculation
- Waits for valid date range

### ✅ No Room Selected

- Calculation only runs when room is selected
- Prevents errors

### ✅ Price Format Variations

- Handles prices with currency symbols
- Handles prices with commas
- Extracts numeric value correctly

## Testing Checklist

- [x] Price updates when room selected
- [x] Price updates when dates change
- [x] Calculation shows correct formula
- [x] Works in create mode
- [x] Works in edit mode
- [x] Respects discount setting
- [x] Handles multiple date changes
- [x] Handles multiple room changes
- [x] Shows correct night count
- [x] Displays formatted currency

## Files Modified

- `components/Reservations.tsx`
  - Enhanced price calculation effect
  - Added visual calculation feedback
  - Improved discount integration

## Related Features

- Room selection with unique numbers (ONI001, KSAA001, etc.)
- Discount system
- Multi-night reservations
- Dynamic pricing
