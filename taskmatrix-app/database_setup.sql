-- TASKMATRIX SUPABASE SETUP SCRIPT
-- Copy and paste this entire file into your Supabase Dashboard -> SQL Editor -> New Query

-------------------------------------------------------------------------------
-- 1. Create a public profiles table safely cloning user data
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text
);

-------------------------------------------------------------------------------
-- 2. Turn on Security and make it visible so users can be searched/assigned
-------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- If policy exists it might error, but assuming it doesn't:
CREATE POLICY "Profiles are viewable by all users" ON public.profiles FOR SELECT USING (true);

-------------------------------------------------------------------------------
-- 3. Backfill (copies your existing registered users so they don't get left behind)
-------------------------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, raw_user_meta_data->>'full_name'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-------------------------------------------------------------------------------
-- 4. Set up an automatic trigger to sync profiles when new users register
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it previously existed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-------------------------------------------------------------------------------
-- 5. Upgrade your tasks table to support assigning users
-------------------------------------------------------------------------------
-- Add column if not exists (using a DO block for safety)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='assignee_id') THEN
    ALTER TABLE tasks ADD COLUMN assignee_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END $$;
