# New Feature: AddWantModal with Criteria Selection

## Overview
Added a new "Add Want" modal that allows users to create wants with specific criteria requirements. This enhances the time banking platform by allowing users to specify their preferences and requirements when requesting help.

## New Components

### 1. AddWantModal (`src/components/modals/AddWantModal.tsx`)
- **Purpose**: Modal for creating new wants with criteria selection
- **Features**:
  - Title, description, and category input fields
  - Interactive criteria selection with checkboxes
  - Responsive grid layout for criteria options
  - Form validation and error handling
  - Integration with Supabase database

### 2. Updated Types (`src/lib/types.ts`)
- **New Interface**: Enhanced `Want` interface with optional `criteria` field
- **Criteria Constants**: `WANT_CRITERIA` array with all available criteria
- **Type Safety**: `WantCriteria` type for type-safe criteria handling
- **Labels**: `CRITERIA_LABELS` mapping for human-readable display

### 3. Updated ServiceCard (`src/components/dashboard/ServiceCard.tsx`)
- **New Feature**: Displays criteria badges for wants
- **Visual**: Indigo-colored badges showing selected criteria
- **Layout**: Responsive design that accommodates criteria display

## Available Criteria

The system includes 18 predefined criteria that cover common requirements:

### Location & Accessibility
- Public Place
- Accessible
- Wheelchair Accessible
- Near Public Transit
- Parking Available

### Timing
- Daytime Only
- Evening Only
- Weekend Only
- Flexible Schedule

### Environment
- Child Friendly
- Pet Friendly
- Quiet Environment
- Outdoor
- Indoor

### Service Type
- One Time Only
- Ongoing Help
- Virtual OK
- In Person Only

## User Experience

### Adding a Want
1. Click the "Add" button on the "My Wants" card
2. Fill in title, description, and category
3. Select relevant criteria from the interactive grid
4. Submit the form to create the want

### Viewing Wants
- Criteria are displayed as small badges below the want description
- Badges use indigo styling to distinguish them from categories
- Responsive layout ensures good display on all screen sizes

## Technical Implementation

### Database Schema
- Added `criteria` column to `wants` table
- Type: `TEXT[]` (array of strings)
- Default: Empty array
- Nullable: Yes

### State Management
- Modal state managed in `dashboard-client.tsx`
- Criteria selection handled with React state
- Form submission integrated with existing Supabase client

### Styling
- Consistent with existing modal design
- Uses Tailwind CSS classes
- Responsive grid layout for criteria selection
- Hover effects and transitions for better UX

## Future Enhancements

### Easy to Add New Criteria
1. Add to `WANT_CRITERIA` array in types
2. Add label to `CRITERIA_LABELS` object
3. UI automatically updates

### Potential Improvements
- Criteria categories (grouping related criteria)
- Custom criteria input
- Criteria-based filtering in marketplace
- Smart matching based on criteria

## Database Migration Required

See `DATABASE_MIGRATION.md` for the required SQL to add the `criteria` column to the `wants` table. 