# Database RLS Fix for Profile Creation

## Problem
The Row Level Security (RLS) policy for the `profiles` table is preventing profile creation during user signup because the user session is not fully established when the profile insertion is attempted.

## Solution
We need to either:
1. Use a database trigger with `SECURITY DEFINER` (Recommended)
2. Or modify the RLS policy to allow profile creation during signup

## Option 1: Database Trigger (Recommended)

This approach automatically creates profiles when users sign up, bypassing RLS entirely:

```sql
-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, time_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    0.0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Option 2: Modify RLS Policy (Alternative)

If you prefer to keep the application-level profile creation, modify the RLS policy:

```sql
-- Drop the existing insert policy
DROP POLICY "Users can insert their own profile" ON public.profiles;

-- Create a new policy that allows profile creation for authenticated users
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = id AND 
    auth.uid() IS NOT NULL
  );
```

## Option 3: Disable RLS for Profile Creation (Not Recommended)

This is the least secure option but will definitely work:

```sql
-- Temporarily disable RLS for profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

## Recommended Approach

**Use Option 1 (Database Trigger)** because:
- It's the most secure (uses `SECURITY DEFINER`)
- It's automatic and reliable
- It works regardless of when the profile creation happens
- It's the standard pattern for Supabase applications

## Implementation Steps

1. **Run the trigger creation SQL** (Option 1)
2. **Update the LoginModal** to remove manual profile creation
3. **Test the signup flow**

## Updated LoginModal Code

After implementing the trigger, you can simplify the LoginModal by removing the manual profile creation:

```typescript
// In LoginModal.tsx, replace the profile creation code with:
if (signUpError) {
    setError(signUpError.message);
    setLoading(false);
    return;
}

// Profile will be created automatically by the trigger
onClose();
```

## Testing

After implementing the fix:

1. Try signing up a new user
2. Check that the profile is created automatically
3. Verify that the username is set correctly
4. Test that the user can log in and access the dashboard

## Troubleshooting

If you still get RLS errors:

1. **Check if the trigger exists:**
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

2. **Check if the function exists:**
```sql
SELECT * FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
```

3. **Test the trigger manually:**
```sql
-- This should create a profile automatically
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

## Security Notes

- The trigger uses `SECURITY DEFINER` which means it runs with the privileges of the function creator
- This is safe because the function only inserts into the profiles table
- The trigger only fires on INSERT to auth.users, so it's controlled
- The username is validated by the database constraint 