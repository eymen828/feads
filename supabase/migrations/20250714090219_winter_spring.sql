/*
  # Initial Schema for Fead App

  1. New Tables
    - `businesses`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `qr_code` (text, unique)
      - `reward_threshold` (integer, default 10)
      - `reward_description` (text)
      - `created_at` (timestamp)
    
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `business_id` (uuid, references businesses)
      - `rating` (integer, 1-5)
      - `comment` (text, optional)
      - `created_at` (timestamp)
    
    - `stamps`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `business_id` (uuid, references businesses)
      - `feedback_id` (uuid, references feedback)
      - `created_at` (timestamp)
    
    - `rewards_claimed`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `business_id` (uuid, references businesses)
      - `stamps_used` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  qr_code text UNIQUE NOT NULL,
  reward_threshold integer DEFAULT 10,
  reward_description text DEFAULT 'Gratis Getränk oder 10% Rabatt',
  created_at timestamptz DEFAULT now()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create stamps table
CREATE TABLE IF NOT EXISTS stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  feedback_id uuid REFERENCES feedback(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(feedback_id) -- One stamp per feedback
);

-- Create rewards claimed table
CREATE TABLE IF NOT EXISTS rewards_claimed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  stamps_used integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_claimed ENABLE ROW LEVEL SECURITY;

-- Policies for businesses (public read)
CREATE POLICY "Businesses are publicly readable"
  ON businesses
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for feedback
CREATE POLICY "Users can read own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for stamps
CREATE POLICY "Users can read own stamps"
  ON stamps
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps"
  ON stamps
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for rewards_claimed
CREATE POLICY "Users can read own rewards"
  ON rewards_claimed
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON rewards_claimed
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample businesses
INSERT INTO businesses (name, description, qr_code, reward_threshold, reward_description) VALUES
  ('Café Zentral', 'Gemütliches Café im Stadtzentrum', 'CAFE_ZENTRAL_001', 8, 'Gratis Kaffee nach 8 Besuchen'),
  ('Pizza Mario', 'Authentische italienische Pizza', 'PIZZA_MARIO_002', 10, '20% Rabatt auf nächste Bestellung'),
  ('Bäckerei Schmidt', 'Frische Backwaren täglich', 'BAECKEREI_SCHMIDT_003', 5, 'Gratis Croissant nach 5 Stempeln'),
  ('Restaurant Adler', 'Traditionelle deutsche Küche', 'RESTAURANT_ADLER_004', 12, 'Gratis Hauptgericht nach 12 Besuchen');