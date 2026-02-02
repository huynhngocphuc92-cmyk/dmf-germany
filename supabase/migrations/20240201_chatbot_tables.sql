-- ============================================
-- DMF CHATBOT TABLES
-- Run this in Supabase SQL Editor
-- ============================================

-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  message_count INTEGER DEFAULT 0,
  lead_email TEXT,
  lead_company TEXT,
  lead_phone TEXT,
  lead_interest TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  interest TEXT,
  session_id TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique index on email to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_unique ON leads (email);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS chat_sessions_updated_at_idx ON chat_sessions (updated_at DESC);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies for chat_sessions (allow inserts from anon, reads from authenticated)
CREATE POLICY "Allow anonymous insert" ON chat_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update own session" ON chat_sessions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated read all" ON chat_sessions
  FOR SELECT TO authenticated USING (true);

-- Policies for leads
CREATE POLICY "Allow anonymous insert leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update own lead" ON leads
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated read all leads" ON leads
  FOR SELECT TO authenticated USING (true);

-- Grant permissions
GRANT INSERT, UPDATE ON chat_sessions TO anon;
GRANT SELECT ON chat_sessions TO authenticated;
GRANT INSERT, UPDATE ON leads TO anon;
GRANT SELECT ON leads TO authenticated;
