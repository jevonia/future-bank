# Database Trigger Setup for Automatic Profile Creation

## Run This SQL to Fix RLS Issues

After confirming that disabling RLS works, run these commands to implement the proper solution:

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

## Re-enable RLS

After creating the trigger, re-enable RLS:

```sql
-- Re-enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

## Test the Setup

```sql
-- Check if trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT * FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
```

## What This Does

- **Automatic Profile Creation**: Every new user gets a profile automatically
- **Username Handling**: Uses the username from signup or email prefix
- **Bypasses RLS**: Uses SECURITY DEFINER to avoid permission issues
- **Maintains Security**: RLS is still enabled for other operations 