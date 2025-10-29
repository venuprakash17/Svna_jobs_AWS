-- Note: This migration creates test users for development purposes
-- In production, users should be created through the signup flow

-- Create test users with predefined credentials
-- Password for all users: Test@123

-- These are hashed passwords for "Test@123" 
-- You'll need to use Supabase Auth to create these users properly
-- This is a placeholder that will be handled by the edge function

-- For now, let's just ensure the roles can be assigned
-- Users need to sign up first at /signup with these emails:
-- superadmin@test.com
-- admin@test.com  
-- faculty@test.com
-- student@test.com

-- The roles will be automatically assigned when they sign up
