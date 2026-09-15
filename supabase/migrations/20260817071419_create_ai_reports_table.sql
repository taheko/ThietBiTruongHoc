/*
# Create ai_reports table for storing generated AI reports

1. New Tables
- `ai_reports` — stores AI-generated reports (inventory report, condition summary, replacement suggestions)
  with type, title, content, and source data snapshot.

2. Security
- Single-tenant app. RLS enabled with anon+authenticated CRUD.
*/

CREATE TABLE IF NOT EXISTS ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('inventory_report','condition_summary','replacement_suggestions')),
  title text NOT NULL,
  content text NOT NULL,
  source_data jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_ai_reports" ON ai_reports;
CREATE POLICY "anon_select_ai_reports" ON ai_reports FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ai_reports" ON ai_reports;
CREATE POLICY "anon_insert_ai_reports" ON ai_reports FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ai_reports" ON ai_reports;
CREATE POLICY "anon_delete_ai_reports" ON ai_reports FOR DELETE TO anon, authenticated USING (true);
