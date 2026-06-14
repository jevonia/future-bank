# Test Data Setup Guide - Quick Start

## 🚀 **Quick Setup in 5 Steps**

### Step 1: Create Test Users in Supabase Auth
1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add User" and create these 5 test accounts:

| Email | Password | Username |
|-------|----------|----------|
| `anne@futurebank.test` | `testpass123` | `anne_gardener` |
| `bill@futurebank.test` | `testpass123` | `bill_tech` |
| `callie@futurebank.test` | `testpass123` | `callie_artist` |
| `david@futurebank.test` | `testpass123` | `david_handyman` |
| `emma@futurebank.test` | `testpass123` | `emma_teacher` |

### Step 2: Run the Database Schema Scripts
1. Go to Supabase Dashboard → SQL Editor
2. Run the scripts from `DATABASE_EXCHANGE_SYSTEM.md` to create:
   - `exchanges` table
   - `transactions` table
   - RLS policies
   - Database functions

### Step 3: Get User IDs
1. In SQL Editor, run this query to get the actual user IDs:
```sql
SELECT id, email, username FROM public.profiles WHERE username IS NOT NULL;
```
2. Copy the UUIDs for each user (you'll need these for the next step)

### Step 4: Insert Test Data
1. Open `TEST_DATA_QUICK_SETUP.sql` in the SQL Editor
2. Replace all placeholder user IDs with the actual UUIDs from Step 3:
   - `anne_user_id` → actual Anne's UUID
   - `bill_user_id` → actual Bill's UUID
   - `callie_user_id` → actual Callie's UUID
   - `david_user_id` → actual David's UUID
   - `emma_user_id` → actual Emma's UUID
3. Run the script section by section

### Step 5: Verify the Data
Run this query to confirm everything was inserted:
```sql
SELECT 
    p.username,
    COUNT(o.id) as offers,
    COUNT(w.id) as wants,
    p.time_balance
FROM public.profiles p
LEFT JOIN public.offers o ON p.id = o.user_id
LEFT JOIN public.wants w ON p.id = w.user_id
WHERE p.username IS NOT NULL
GROUP BY p.id, p.username, p.time_balance
ORDER BY p.username;
```

## 📊 **Expected Results**

After setup, you should have:
- **5 users** with realistic usernames and time balances
- **15 offers** across different categories (3 per user)
- **15 wants** with various criteria (3 per user)
- **Realistic time credit values** (1.5 - 5.0 TC per offer)

## 🧪 **Test the System**

### 1. **Login as Different Users**
- Test each account: `anne@futurebank.test` / `testpass123`
- Verify profiles show correct usernames and balances

### 2. **Browse Offers and Wants**
- Check that all 15 offers and 15 wants are visible
- Verify criteria badges display correctly
- Confirm categories are properly set

### 3. **Test Exchange Flow** (after UI integration)
- Request an exchange between users
- Accept/decline exchange requests
- Complete exchanges and verify credit transfers

## 🔧 **Troubleshooting**

### Common Issues:

**"User not found" errors:**
- Make sure you created the users in Supabase Auth first
- Check that the email addresses match exactly

**"Column does not exist" errors:**
- Run the database schema scripts first
- Make sure `exchanges` and `transactions` tables exist

**"Foreign key constraint" errors:**
- Verify user IDs are correct UUIDs
- Check that profiles exist before inserting offers/wants

**"RLS policy violation" errors:**
- Make sure RLS policies are created correctly
- Check that users are authenticated

## 📝 **Quick Commands**

### Check Current Data:
```sql
-- See all profiles
SELECT * FROM public.profiles WHERE username IS NOT NULL;

-- Count offers and wants
SELECT COUNT(*) FROM public.offers;
SELECT COUNT(*) FROM public.wants;

-- See offers by category
SELECT category, COUNT(*) FROM public.offers GROUP BY category;
```

### Reset Test Data (if needed):
```sql
-- Clear all test data
DELETE FROM public.wants;
DELETE FROM public.offers;
UPDATE public.profiles SET username = NULL, time_balance = 0 WHERE email LIKE '%@futurebank.test';
```

## 🎯 **Next Steps After Test Data Setup**

1. **Test the Exchange System** - Try creating exchanges between users
2. **Verify API Endpoints** - Test all the exchange and transaction APIs
3. **UI Integration** - Add exchange buttons to the dashboard
4. **End-to-End Testing** - Complete full exchange workflows

## 💡 **Tips**

- **Use different browsers** or incognito windows to test multiple users
- **Keep the user IDs handy** - you'll need them for testing
- **Start small** - test with 1-2 users first, then add more
- **Document any issues** - this helps with debugging

This test data gives you a realistic foundation to test all aspects of the Time Credit Exchange System!











