-- =====================================================
-- FutureBank Test Data Setup
-- =====================================================
-- 
-- IMPORTANT: Before running this script:
-- 1. Create 5 test users in Supabase Auth dashboard
-- 2. Replace the placeholder user IDs below with actual UUIDs
-- 3. Make sure the exchange system tables are created first
--
-- =====================================================

-- First, let's see what users exist and get their IDs
SELECT id, email, username FROM public.profiles LIMIT 10;

-- =====================================================
-- STEP 1: Update existing profiles with test data
-- =====================================================

-- Update Anne's profile (replace 'anne@futurebank.test' with actual email)
UPDATE public.profiles 
SET username = 'anne_gardener', time_balance = 12.5 
WHERE email = 'anne@futurebank.test';

-- Update Bill's profile (replace 'bill@futurebank.test' with actual email)
UPDATE public.profiles 
SET username = 'bill_tech', time_balance = 8.0 
WHERE email = 'bill@futurebank.test';

-- Update Callie's profile (replace 'callie@futurebank.test' with actual email)
UPDATE public.profiles 
SET username = 'callie_artist', time_balance = 15.0 
WHERE email = 'callie@futurebank.test';

-- Update David's profile (replace 'david@futurebank.test' with actual email)
UPDATE public.profiles 
SET username = 'david_handyman', time_balance = 6.5 
WHERE email = 'david@futurebank.test';

-- Update Emma's profile (replace 'emma@futurebank.test' with actual email)
UPDATE public.profiles 
SET username = 'emma_teacher', time_balance = 20.0 
WHERE email = 'emma@futurebank.test';

-- =====================================================
-- STEP 2: Get the actual user IDs for use in inserts
-- =====================================================

-- Run this to see the updated profiles and get their IDs
SELECT id, email, username, time_balance FROM public.profiles WHERE username IS NOT NULL;

-- =====================================================
-- STEP 3: Insert test offers (replace user_id placeholders)
-- =====================================================

-- Anne's Offers (replace 'anne_user_id' with actual UUID)
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Organic Garden Consultation', 'Help you plan and start your organic garden. Includes soil testing, plant selection, and seasonal planning.', 'Gardening', 'anne_user_id', 3.0),
('Home-Cooked Meal Prep', 'Prepare healthy, delicious meals for your family. Specializing in vegetarian and gluten-free options.', 'Cooking', 'anne_user_id', 2.5),
('Home Organization Session', 'Help declutter and organize your living spaces. Create sustainable systems for ongoing organization.', 'Organization', 'anne_user_id', 2.0);

-- Bill's Offers (replace 'bill_user_id' with actual UUID)
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Computer Troubleshooting', 'Fix computer issues, virus removal, software installation, and general tech support.', 'Technology', 'bill_user_id', 2.0),
('Web Development Basics', 'Teach you HTML, CSS, and basic web development. Perfect for beginners wanting to build their own website.', 'Education', 'bill_user_id', 4.0),
('Math Tutoring (K-12)', 'Help with homework, test preparation, and building math confidence. All grade levels welcome.', 'Education', 'bill_user_id', 2.5);

-- Callie's Offers (replace 'callie_user_id' with actual UUID)
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Watercolor Painting Workshop', 'Learn basic watercolor techniques. All supplies provided. Perfect for beginners.', 'Arts & Crafts', 'callie_user_id', 3.5),
('Custom Greeting Cards', 'Handmade cards for any occasion. Personalize with names, dates, and special messages.', 'Arts & Crafts', 'callie_user_id', 1.5),
('Community Mural Project', 'Lead a collaborative mural painting project. Great for community centers or schools.', 'Community', 'callie_user_id', 5.0);

-- David's Offers (replace 'david_user_id' with actual UUID)
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('Basic Home Repairs', 'Fix leaky faucets, replace light fixtures, repair drywall, and general home maintenance.', 'Home Repair', 'david_user_id', 3.0),
('Custom Wooden Shelves', 'Build and install custom wooden shelves. Measure your space and create perfect storage solutions.', 'Woodworking', 'david_user_id', 4.0),
('Furniture Assembly', 'Assemble IKEA furniture, build flat-pack items, and help with complex furniture setup.', 'Home Help', 'david_user_id', 2.0);

-- Emma's Offers (replace 'emma_user_id' with actual UUID)
INSERT INTO public.offers (title, description, category, user_id, value) VALUES
('English Literature Tutoring', 'Help with reading comprehension, essay writing, and literary analysis. High school and college level.', 'Education', 'emma_user_id', 3.0),
('Study Skills Workshop', 'Learn effective study techniques, time management, and test-taking strategies.', 'Education', 'emma_user_id', 2.5),
('Reading to Children', 'Engaging story time sessions for young children. Includes interactive activities and reading comprehension.', 'Childcare', 'emma_user_id', 2.0);

-- =====================================================
-- STEP 4: Insert test wants (replace user_id placeholders)
-- =====================================================

-- Anne's Wants (replace 'anne_user_id' with actual UUID)
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Learn Basic Web Development', 'Want to create a simple website for my gardening business. Need someone patient to teach me the basics.', 'Education', 'anne_user_id', ARRAY['patient', 'beginner_friendly', 'flexible_schedule']),
('Help with Home Repairs', 'Need help fixing a leaky kitchen sink and installing some new light fixtures.', 'Home Repair', 'anne_user_id', ARRAY['reliable', 'experienced', 'weekend_available']),
('Creative Project Collaboration', 'Looking for someone to help me design and create a community garden sign and information board.', 'Community', 'anne_user_id', ARRAY['creative', 'community_minded', 'outdoor_ok']);

-- Bill's Wants (replace 'bill_user_id' with actual UUID)
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Garden Maintenance Help', 'Need help maintaining my small vegetable garden. I travel often and need reliable help.', 'Gardening', 'bill_user_id', ARRAY['reliable', 'experienced', 'flexible_schedule']),
('Learn to Cook Healthy Meals', 'Want to learn basic cooking skills and meal prep. Prefer vegetarian options.', 'Cooking', 'bill_user_id', ARRAY['patient', 'vegetarian_friendly', 'evening_available']),
('Home Organization Help', 'My home office is a mess. Need help creating a functional workspace.', 'Organization', 'bill_user_id', ARRAY['organized', 'efficient', 'weekend_available']);

-- Callie's Wants (replace 'callie_user_id' with actual UUID)
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Computer Setup Help', 'Need help setting up a new computer and transferring files from my old one.', 'Technology', 'callie_user_id', ARRAY['patient', 'experienced', 'weekend_available']),
('Math Tutoring for Art Projects', 'Want to learn basic geometry and proportions for my art projects. Need patient teacher.', 'Education', 'callie_user_id', ARRAY['patient', 'creative_approach', 'flexible_schedule']),
('Community Event Planning', 'Planning an art fair for our neighborhood. Need help with logistics and organization.', 'Community', 'callie_user_id', ARRAY['organized', 'community_minded', 'evening_available']);

-- David's Wants (replace 'david_user_id' with actual UUID)
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Learn Basic Computer Skills', 'Want to learn email, internet browsing, and basic word processing for my business.', 'Education', 'david_user_id', ARRAY['patient', 'beginner_friendly', 'weekend_available']),
('Healthy Meal Planning', 'Need help planning and preparing healthy meals. I work long hours and need simple solutions.', 'Cooking', 'david_user_id', ARRAY['simple_recipes', 'time_efficient', 'weekend_available']),
('Creative Project Help', 'Want to build a custom treehouse for my kids. Need creative input and planning help.', 'Community', 'david_user_id', ARRAY['creative', 'child_friendly', 'outdoor_ok']);

-- Emma's Wants (replace 'emma_user_id' with actual UUID)
INSERT INTO public.wants (title, description, category, user_id, criteria) VALUES
('Garden Design Help', 'Want to create a beautiful flower garden in my backyard. Need design advice and planting help.', 'Gardening', 'emma_user_id', ARRAY['experienced', 'creative', 'weekend_available']),
('Home Organization Session', 'Need help organizing my home office and creating a better workspace for remote teaching.', 'Organization', 'emma_user_id', ARRAY['organized', 'efficient', 'weekend_available']),
('Creative Writing Workshop', 'Want to improve my creative writing skills. Looking for a writing group or workshop.', 'Education', 'emma_user_id', ARRAY['creative', 'supportive', 'evening_available']);

-- =====================================================
-- STEP 5: Verify the data was inserted correctly
-- =====================================================

-- Check offers count
SELECT 'Offers' as table_name, COUNT(*) as count FROM public.offers
UNION ALL
SELECT 'Wants' as table_name, COUNT(*) as count FROM public.wants
UNION ALL
SELECT 'Profiles' as table_name, COUNT(*) as count FROM public.profiles WHERE username IS NOT NULL;

-- Check offers by user
SELECT 
    p.username,
    COUNT(o.id) as offer_count,
    COUNT(w.id) as want_count
FROM public.profiles p
LEFT JOIN public.offers o ON p.id = o.user_id
LEFT JOIN public.wants w ON p.id = w.user_id
WHERE p.username IS NOT NULL
GROUP BY p.id, p.username
ORDER BY p.username;

-- =====================================================
-- STEP 6: Optional - Insert sample exchanges (after tables are created)
-- =====================================================

-- Note: Only run this section AFTER you've created the exchanges and transactions tables
-- from the DATABASE_EXCHANGE_SYSTEM.md file

/*
-- Sample exchange (replace user IDs with actual UUIDs)
INSERT INTO public.exchanges (offer_id, want_id, provider_id, requester_id, status, time_credits, scheduled_date, location, notes) VALUES
(2, 1, 'bill_user_id', 'anne_user_id', 'pending', 4.0, '2024-01-20 14:00:00+00', 'Community Center', 'Looking forward to learning web development basics!');
*/











