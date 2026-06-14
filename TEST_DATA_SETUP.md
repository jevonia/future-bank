# Test Data Setup for FutureBank

## Overview
This document provides test data to populate the FutureBank database with realistic users, offers, and wants for testing the Time Credit Exchange System.

## 🧪 **Test Users**

### 1. Anne (anne@futurebank.test)
- **Username**: anne_gardener
- **Avatar**: 🌱
- **Time Balance**: 12.5 TC
- **Skills**: Gardening, cooking, organization
- **Interests**: Community building, sustainable living

### 2. Bill (bill@futurebank.test)
- **Username**: bill_tech
- **Avatar**: 💻
- **Time Balance**: 8.0 TC
- **Skills**: Tech support, web development, tutoring
- **Interests**: Education, helping others learn

### 3. Callie (callie@futurebank.test)
- **Username**: callie_artist
- **Avatar**: 🎨
- **Time Balance**: 15.0 TC
- **Skills**: Art, crafts, creative projects
- **Interests**: Teaching art, community projects

### 4. David (david@futurebank.test)
- **Username**: david_handyman
- **Avatar**: 🔧
- **Time Balance**: 6.5 TC
- **Skills**: Home repairs, woodworking, general maintenance
- **Interests**: DIY projects, helping neighbors

### 5. Emma (emma@futurebank.test)
- **Username**: emma_teacher
- **Avatar**: 📚
- **Time Balance**: 20.0 TC
- **Skills**: Teaching, tutoring, curriculum development
- **Interests**: Education, community learning

---

## 🌟 **Test Offers**

### Anne's Offers
```sql
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Organic Garden Consultation', 'Help you plan and start your organic garden. Includes soil testing, plant selection, and seasonal planning.', 'Gardening', 'anne_user_id', 3.0),
('Home-Cooked Meal Prep', 'Prepare healthy, delicious meals for your family. Specializing in vegetarian and gluten-free options.', 'Cooking', 'anne_user_id', 2.5),
('Home Organization Session', 'Help declutter and organize your living spaces. Create sustainable systems for ongoing organization.', 'Organization', 'anne_user_id', 2.0);
```

### Bill's Offers
```sql
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Computer Troubleshooting', 'Fix computer issues, virus removal, software installation, and general tech support.', 'Technology', 'bill_user_id', 2.0),
('Web Development Basics', 'Teach you HTML, CSS, and basic web development. Perfect for beginners wanting to build their own website.', 'Education', 'bill_user_id', 4.0),
('Math Tutoring (K-12)', 'Help with homework, test preparation, and building math confidence. All grade levels welcome.', 'Education', 'bill_user_id', 2.5);
```

### Callie's Offers
```sql
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Watercolor Painting Workshop', 'Learn basic watercolor techniques. All supplies provided. Perfect for beginners.', 'Arts & Crafts', 'callie_user_id', 3.5),
('Custom Greeting Cards', 'Handmade cards for any occasion. Personalize with names, dates, and special messages.', 'Arts & Crafts', 'callie_user_id', 1.5),
('Community Mural Project', 'Lead a collaborative mural painting project. Great for community centers or schools.', 'Community', 'callie_user_id', 5.0);
```

### David's Offers
```sql
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Basic Home Repairs', 'Fix leaky faucets, replace light fixtures, repair drywall, and general home maintenance.', 'Home Repair', 'david_user_id', 3.0),
('Custom Wooden Shelves', 'Build and install custom wooden shelves. Measure your space and create perfect storage solutions.', 'Woodworking', 'david_user_id', 4.0),
('Furniture Assembly', 'Assemble IKEA furniture, build flat-pack items, and help with complex furniture setup.', 'Home Help', 'david_user_id', 2.0);
```

### Emma's Offers
```sql
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('English Literature Tutoring', 'Help with reading comprehension, essay writing, and literary analysis. High school and college level.', 'Education', 'emma_user_id', 3.0),
('Study Skills Workshop', 'Learn effective study techniques, time management, and test-taking strategies.', 'Education', 'emma_user_id', 2.5),
('Reading to Children', 'Engaging story time sessions for young children. Includes interactive activities and reading comprehension.', 'Childcare', 'emma_user_id', 2.0);
```

---

## 🎯 **Test Wants**

### Anne's Wants
```sql
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Learn Basic Web Development', 'Want to create a simple website for my gardening business. Need someone patient to teach me the basics.', 'Education', 'anne_user_id', ARRAY['patient', 'beginner_friendly', 'flexible_schedule']),
('Help with Home Repairs', 'Need help fixing a leaky kitchen sink and installing some new light fixtures.', 'Home Repair', 'anne_user_id', ARRAY['reliable', 'experienced', 'weekend_available']),
('Creative Project Collaboration', 'Looking for someone to help me design and create a community garden sign and information board.', 'Community', 'anne_user_id', ARRAY['creative', 'community_minded', 'outdoor_ok']);
```

### Bill's Wants
```sql
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Garden Maintenance Help', 'Need help maintaining my small vegetable garden. I travel often and need reliable help.', 'Gardening', 'bill_user_id', ARRAY['reliable', 'experienced', 'flexible_schedule']),
('Learn to Cook Healthy Meals', 'Want to learn basic cooking skills and meal prep. Prefer vegetarian options.', 'Cooking', 'bill_user_id', ARRAY['patient', 'vegetarian_friendly', 'evening_available']),
('Home Organization Help', 'My home office is a mess. Need help creating a functional workspace.', 'Organization', 'bill_user_id', ARRAY['organized', 'efficient', 'weekend_available']);
```

### Callie's Wants
```sql
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Computer Setup Help', 'Need help setting up a new computer and transferring files from my old one.', 'Technology', 'callie_user_id', ARRAY['patient', 'experienced', 'weekend_available']),
('Math Tutoring for Art Projects', 'Want to learn basic geometry and proportions for my art projects. Need patient teacher.', 'Education', 'callie_user_id', ARRAY['patient', 'creative_approach', 'flexible_schedule']),
('Community Event Planning', 'Planning an art fair for our neighborhood. Need help with logistics and organization.', 'Community', 'callie_user_id', ARRAY['organized', 'community_minded', 'evening_available']);
```

### David's Wants
```sql
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Learn Basic Computer Skills', 'Want to learn email, internet browsing, and basic word processing for my business.', 'Education', 'david_user_id', ARRAY['patient', 'beginner_friendly', 'weekend_available']),
('Healthy Meal Planning', 'Need help planning and preparing healthy meals. I work long hours and need simple solutions.', 'Cooking', 'david_user_id', ARRAY['simple_recipes', 'time_efficient', 'weekend_available']),
('Creative Project Help', 'Want to build a custom treehouse for my kids. Need creative input and planning help.', 'Community', 'david_user_id', ARRAY['creative', 'child_friendly', 'outdoor_ok']);
```

### Emma's Wants
```sql
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Garden Design Help', 'Want to create a beautiful flower garden in my backyard. Need design advice and planting help.', 'Gardening', 'emma_user_id', ARRAY['experienced', 'creative', 'weekend_available']),
('Home Organization Session', 'Need help organizing my home office and creating a better workspace for remote teaching.', 'Organization', 'emma_user_id', ARRAY['organized', 'efficient', 'weekend_available']),
('Creative Writing Workshop', 'Want to improve my creative writing skills. Looking for a writing group or workshop.', 'Education', 'emma_user_id', ARRAY['creative', 'supportive', 'evening_available']);
```

---

## 🔄 **Sample Exchange Requests**

### Pending Exchanges
```sql
-- Anne wants to learn web development from Bill
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes) VALUES
(2, 1, 'bill_user_id', 'anne_user_id', 'pending', 4.0, '2024-01-20 14:00:00+00', 'Community Center', 'Looking forward to learning web development basics!');

-- Bill wants garden help from Anne
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes) VALUES
(1, 4, 'anne_user_id', 'bill_user_id', 'pending', 3.0, '2024-01-22 10:00:00+00', 'Bill''s Garden', 'Need help maintaining my vegetable garden while I travel.');

-- Callie wants computer help from David
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes) VALUES
(4, 7, 'david_user_id', 'callie_user_id', 'pending', 2.0, '2024-01-25 15:00:00+00', 'Callie''s Home', 'Help setting up new computer and transferring files.');
```

### Accepted Exchanges
```sql
-- Emma accepted Callie's art workshop
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes) VALUES
(7, 12, 'callie_user_id', 'emma_user_id', 'accepted', 3.5, '2024-01-28 13:00:00+00', 'Community Center', 'Excited to learn watercolor painting!');
```

### Completed Exchanges
```sql
-- David helped Emma with home repairs (completed)
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes, completed_at, completion_notes) VALUES
(10, 11, 'david_user_id', 'emma_user_id', 'completed', 3.0, '2024-01-15 10:00:00+00', 'Emma''s Home', 'Help organizing home office workspace', '2024-01-15 12:00:00+00', 'Great session! Office is now much more functional and organized.');
```

---

## 📊 **Sample Transactions**

```sql
-- Transaction for completed exchange (David helped Emma)
INSERT INTO public.transactions (exchange_id, transaction_type, from_user_id, to_user_id, amount, from_balance_before, from_balance_after, to_balance_before, to_balance_after, description) VALUES
(5, 'exchange', 'emma_user_id', 'david_user_id', 3.0, 20.0, 17.0, 6.5, 9.5, 'Exchange completed: Home organization session');
```

---

## 🚀 **Setup Instructions**

### 1. **Create Test Users**
```sql
-- First, create the users in Supabase Auth (manually through dashboard)
-- Then update their profiles with the test data
```

### 2. **Update User Profiles**
```sql
-- Update existing profiles with test data
UPDATE public.profiles 
SET username = 'anne_gardener', time_balance = 12.5 
WHERE email = 'anne@futurebank.test';

UPDATE public.profiles 
SET username = 'bill_tech', time_balance = 8.0 
WHERE email = 'bill@futurebank.test';

-- Continue for all users...
```

### 3. **Insert Test Data**
```sql
-- Run the INSERT statements above for offers, wants, and exchanges
-- Make sure to replace 'user_id' placeholders with actual UUIDs
```

### 4. **Verify Data**
```sql
-- Check that all data was inserted correctly
SELECT COUNT(*) FROM public.offers;
SELECT COUNT(*) FROM public.wants;
SELECT COUNT(*) FROM public.exchanges;
SELECT COUNT(*) FROM public.transactions;
```

---

## 🎯 **Testing Scenarios**

### 1. **Basic Exchange Flow**
- Anne requests web development help from Bill
- Bill accepts the request
- Bill completes the exchange
- Verify time credits transfer correctly

### 2. **Multiple Exchanges**
- Test multiple pending exchanges
- Test exchange cancellation
- Test exchange completion with notes

### 3. **Edge Cases**
- User with insufficient credits
- Duplicate exchange requests
- Exchange between same user

### 4. **UI Testing**
- Exchange modal functionality
- Transaction history display
- Exchange status updates

---

## 📝 **Notes**

- **User IDs**: Replace 'user_id' placeholders with actual UUIDs from your Supabase auth.users table
- **Time Credits**: All amounts are realistic for time banking (0.5 - 5.0 TC per exchange)
- **Criteria**: Uses the predefined criteria from the WANT_CRITERIA array
- **Dates**: All dates are set in the future for testing purposes
- **Variety**: Covers different categories, skill levels, and user types

This test data provides a comprehensive foundation for testing all aspects of the Time Credit Exchange System!











