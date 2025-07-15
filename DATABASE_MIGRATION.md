# Database Migration for Want Criteria Feature

## Overview
This migration adds a `criteria` column to the `wants` table to support the new criteria functionality in the AddWantModal.

## Migration SQL

Run the following SQL in your Supabase SQL editor:

```sql
-- Add criteria column to wants table
ALTER TABLE wants 
ADD COLUMN criteria TEXT[] DEFAULT '{}';

-- Add a comment to document the column
COMMENT ON COLUMN wants.criteria IS 'Array of criteria strings for the want (e.g., ["public_place", "accessible", "daytime_only"])';
```

## Column Details
- **Column Name**: `criteria`
- **Type**: `TEXT[]` (array of text strings)
- **Default**: `'{}'` (empty array)
- **Nullable**: Yes (optional field)

## Criteria Values
The criteria column stores an array of predefined criteria strings. The available criteria are defined in `src/lib/types.ts`:

- `public_place` - "Public Place"
- `accessible` - "Accessible"
- `daytime_only` - "Daytime Only"
- `evening_only` - "Evening Only"
- `weekend_only` - "Weekend Only"
- `child_friendly` - "Child Friendly"
- `pet_friendly` - "Pet Friendly"
- `wheelchair_accessible` - "Wheelchair Accessible"
- `quiet_environment` - "Quiet Environment"
- `outdoor` - "Outdoor"
- `indoor` - "Indoor"
- `near_public_transit` - "Near Public Transit"
- `parking_available` - "Parking Available"
- `flexible_schedule` - "Flexible Schedule"
- `one_time_only` - "One Time Only"
- `ongoing_help` - "Ongoing Help"
- `virtual_ok` - "Virtual OK"
- `in_person_only` - "In Person Only"

## Adding New Criteria
To add new criteria in the future:

1. Add the new criterion to the `WANT_CRITERIA` array in `src/lib/types.ts`
2. Add the corresponding label to the `CRITERIA_LABELS` object
3. The UI will automatically pick up the new criteria

## Example Data
```sql
-- Example want with criteria
INSERT INTO wants (title, description, category, user_id, criteria) 
VALUES (
    'Help with Bike Repair', 
    'My bike chain keeps slipping and I need help fixing it.', 
    'Repair', 
    'user-uuid-here', 
    ARRAY['public_place', 'daytime_only', 'accessible']
);
``` 