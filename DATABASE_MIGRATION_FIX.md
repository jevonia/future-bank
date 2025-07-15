# Database Migration Fix for Username Constraint

## Problem
You're getting error `23502: column "username" of relation "profiles" contains null values` when trying to add the `NOT NULL` constraint to the username column.

## Solution
We need to update existing null usernames before adding the constraint. Run these SQL commands in order:

### Step 1: Update Existing Null Usernames
```sql
-- Update profiles with null usernames to use email prefix
UPDATE public.profiles 
SET username = split_part(
    (SELECT email FROM auth.users WHERE auth.users.id = profiles.id), 
    '@', 
    1
)
WHERE username IS NULL;

-- Handle any remaining null usernames (fallback)
UPDATE public.profiles 
SET username = 'user_' || id::text
WHERE username IS NULL;
```

### Step 2: Fix Invalid Username Formats
```sql
-- Fix usernames that are too short (less than 3 characters)
UPDATE public.profiles 
SET username = 'user_' || username
WHERE LENGTH(username) < 3;

-- Fix usernames that are too long (more than 20 characters)
UPDATE public.profiles 
SET username = LEFT(username, 20)
WHERE LENGTH(username) > 20;

-- Fix usernames with invalid characters (replace with underscores)
UPDATE public.profiles 
SET username = REGEXP_REPLACE(username, '[^a-zA-Z0-9_]', '_', 'g')
WHERE username !~ '^[a-zA-Z0-9_]+$';

-- Remove leading/trailing underscores
UPDATE public.profiles 
SET username = TRIM(BOTH '_' FROM username)
WHERE username LIKE '_%' OR username LIKE '%_';

-- Ensure usernames are at least 3 characters after cleaning
UPDATE public.profiles 
SET username = 'user_' || username
WHERE LENGTH(TRIM(BOTH '_' FROM username)) < 3;
```

### Step 3: Handle Duplicate Usernames
```sql
-- Find and fix duplicate usernames by adding numbers
WITH duplicates AS (
  SELECT id, username,
         ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at) as rn
  FROM public.profiles
  WHERE username IS NOT NULL
)
UPDATE public.profiles 
SET username = p.username || '_' || (p.rn - 1)
FROM duplicates p
WHERE public.profiles.id = p.id AND p.rn > 1;
```

### Step 4: Verify Data is Valid
```sql
-- Check for any remaining null usernames
SELECT COUNT(*) as null_usernames 
FROM public.profiles 
WHERE username IS NULL;

-- Check for invalid format usernames
SELECT COUNT(*) as invalid_format_usernames
FROM public.profiles 
WHERE username !~ '^[a-zA-Z0-9_]{3,20}$';

-- Check for duplicate usernames
SELECT username, COUNT(*) as count
FROM public.profiles 
GROUP BY username 
HAVING COUNT(*) > 1;

-- Show all usernames for verification
SELECT 
  id,
  username,
  LENGTH(username) as length,
  username ~ '^[a-zA-Z0-9_]{3,20}$' as valid_format
FROM public.profiles
ORDER BY created_at;
```

### Step 5: Add the Constraints (Only if Step 4 shows no issues)
```sql
-- Now add the NOT NULL constraint
ALTER TABLE public.profiles 
ALTER COLUMN username SET NOT NULL;

-- Add the format validation constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format 
CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$');

-- Add uniqueness constraint (if not already present)
ALTER TABLE public.profiles 
ADD CONSTRAINT username_unique UNIQUE (username);
```

### Step 6: Verify the Setup
```sql
-- Check all profiles have valid usernames
SELECT 
  id,
  username,
  LENGTH(username) as length,
  username ~ '^[a-zA-Z0-9_]{3,20}$' as valid_format
FROM public.profiles
ORDER BY created_at;
```

## Alternative: Complete Table Recreation (If Above Doesn't Work)

If the above approach doesn't work, you can recreate the profiles table:

```sql
-- Backup existing data
CREATE TABLE public.profiles_backup AS 
SELECT * FROM public.profiles;

-- Drop existing table
DROP TABLE public.profiles CASCADE;

-- Recreate with proper constraints
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  time_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]{3,20}$')
);

-- Restore data with fixed usernames
INSERT INTO public.profiles (id, username, avatar_url, time_balance, created_at, updated_at)
SELECT 
  id,
  -- Clean and fix username
  CASE 
    WHEN username IS NULL THEN 'user_' || id::text
    ELSE 
      -- Clean invalid characters, ensure proper length
      LEFT(
        REGEXP_REPLACE(
          TRIM(BOTH '_' FROM username), 
          '[^a-zA-Z0-9_]', 
          '_', 
          'g'
        ), 
        20
      )
  END as cleaned_username,
  avatar_url,
  time_balance,
  created_at,
  updated_at
FROM public.profiles_backup;

-- Handle duplicates
WITH duplicates AS (
  SELECT id, username,
         ROW_NUMBER() OVER (PARTITION BY username ORDER BY created_at) as rn
  FROM public.profiles
)
UPDATE public.profiles 
SET username = p.username || '_' || (p.rn - 1)
FROM duplicates p
WHERE public.profiles.id = p.id AND p.rn > 1;

-- Ensure minimum length
UPDATE public.profiles 
SET username = 'user_' || username
WHERE LENGTH(username) < 3;

-- Drop backup table
DROP TABLE public.profiles_backup;

-- Re-enable RLS and policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view usernames" ON public.profiles
  FOR SELECT USING (true);
```

## Testing After Migration

```sql
-- Test that constraints work
INSERT INTO public.profiles (id, username, avatar_url, time_balance) 
VALUES ('test-uuid-1', 'valid_username123', null, 0);

-- This should fail (duplicate username)
INSERT INTO public.profiles (id, username, avatar_url, time_balance) 
VALUES ('test-uuid-2', 'valid_username123', null, 0);

-- This should fail (invalid format)
INSERT INTO public.profiles (id, username, avatar_url, time_balance) 
VALUES ('test-uuid-3', 'invalid-username!', null, 0);

-- This should fail (null username)
INSERT INTO public.profiles (id, username, avatar_url, time_balance) 
VALUES ('test-uuid-4', null, null, 0);
```

## Next Steps

After running the migration:

1. Test the application to ensure profiles work correctly
2. Verify that new user signups create profiles with usernames
3. Test the profile settings modal for username editing
4. Ensure the AddWantModal and AddOfferModal work with the new constraints 