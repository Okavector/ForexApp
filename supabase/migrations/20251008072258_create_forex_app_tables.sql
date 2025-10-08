/*
  # Forex Trading App Database Schema

  ## Overview
  Creates tables for a professional Forex trading application with user authentication,
  trading signals, market analysis, and admin functionality.

  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique)
  - `full_name` (text)
  - `is_admin` (boolean, default false)
  - `subscription_status` (text, default 'Free')
  - `subscription_expires` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. trading_signals
  - `id` (uuid, primary key)
  - `pair` (text) - Trading pair like BTC/USD, EUR/USD
  - `signal_type` (text) - BUY or SELL
  - `status` (text) - active or closed
  - `entry_price` (text)
  - `exit_price` (text)
  - `stop_loss` (text)
  - `take_profit` (text)
  - `note` (text, nullable)
  - `created_by` (uuid, references profiles)
  - `created_at` (timestamptz)
  - `closed_at` (timestamptz, nullable)

  ### 3. market_analysis
  - `id` (uuid, primary key)
  - `title` (text)
  - `category` (text) - Crypto, Forex, Stocks, etc.
  - `content` (text)
  - `image_url` (text, nullable)
  - `created_by` (uuid, references profiles)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read signals and analysis
  - Only admins can create/update/delete signals and analysis
  - Users can read their own profile
  - Admins can manage all profiles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  is_admin boolean DEFAULT false,
  subscription_status text DEFAULT 'Free',
  subscription_expires timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create trading_signals table
CREATE TABLE IF NOT EXISTS trading_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('BUY', 'SELL')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  entry_price text DEFAULT '',
  exit_price text DEFAULT '',
  stop_loss text DEFAULT '',
  take_profit text DEFAULT '',
  note text DEFAULT '',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  closed_at timestamptz
);

ALTER TABLE trading_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read signals"
  ON trading_signals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert signals"
  ON trading_signals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update signals"
  ON trading_signals FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete signals"
  ON trading_signals FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create market_analysis table
CREATE TABLE IF NOT EXISTS market_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  image_url text DEFAULT '',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE market_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read analysis"
  ON market_analysis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert analysis"
  ON market_analysis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update analysis"
  ON market_analysis FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete analysis"
  ON market_analysis FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trading_signals_status ON trading_signals(status);
CREATE INDEX IF NOT EXISTS idx_trading_signals_created_at ON trading_signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_analysis_created_at ON market_analysis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_analysis_category ON market_analysis(category);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_market_analysis_updated_at ON market_analysis;
CREATE TRIGGER update_market_analysis_updated_at
  BEFORE UPDATE ON market_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
