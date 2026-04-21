-- PHASE 1: DATABASE HEART (Supabase)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('driver', 'commuter')),
  points INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the pings table (for ride requests from commuters)
CREATE TABLE IF NOT EXISTS pings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  route_destination TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the flood_alerts table (for reporting floods/rainfall)
CREATE TABLE IF NOT EXISTS flood_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('flood', 'rainfall')),
  proof_url TEXT, -- In a real app this would point to a storage bucket
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_pings_user_id ON pings(user_id);
CREATE INDEX IF NOT EXISTS idx_pings_created_at ON pings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_flood_alerts_created_at ON flood_alerts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flood_alerts ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (permissive for MVP hackathon demo)
CREATE POLICY "profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles can insert their own" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles can update their own" ON profiles FOR UPDATE USING (true);

CREATE POLICY "pings are viewable by everyone" ON pings FOR SELECT USING (true);
CREATE POLICY "pings can be created" ON pings FOR INSERT WITH CHECK (true);

CREATE POLICY "flood_alerts are viewable by everyone" ON flood_alerts FOR SELECT USING (true);
CREATE POLICY "flood_alerts can be created" ON flood_alerts FOR INSERT WITH CHECK (true);

-- IMPORTANT: Enable Real-time on tables
-- In Supabase dashboard, go to: Database > Replication > Enable for pings & flood_alerts tables
-- Or run this in SQL Editor: 
-- ALTER PUBLICATION supabase_realtime ADD TABLE pings;
-- ALTER PUBLICATION supabase_realtime ADD TABLE flood_alerts;
