/*
# School Asset Management Schema

1. New Tables
- `categories` — asset groups (e.g. Computers, Projectors, Furniture)
- `locations` — rooms / departments where assets are placed
- `assets` — individual tracked assets with code, status, value, depreciation
- `inventory_sessions` — inventory rounds (đợt kiểm kê)
- `inventory_items` — per-asset results within a session (tốt/hỏng/thiếu/cần sửa)
- `transfers` — asset movement between locations (điều chuyển)
- `repairs` — repair records (sửa chữa)
- `disposals` — disposal/liquidation records (thanh lý)

2. Security
- Single-tenant app (no sign-in requested). RLS enabled on all tables with anon+authenticated CRUD policies.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE TO anon, authenticated USING (true);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  building text,
  floor text,
  person_in_charge text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_locations" ON locations;
CREATE POLICY "anon_select_locations" ON locations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_locations" ON locations;
CREATE POLICY "anon_insert_locations" ON locations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_locations" ON locations;
CREATE POLICY "anon_update_locations" ON locations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_locations" ON locations;
CREATE POLICY "anon_delete_locations" ON locations FOR DELETE TO anon, authenticated USING (true);

-- Assets
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'good' CHECK (status IN ('good','damaged','missing','under_repair','disposed')),
  condition_note text,
  purchase_date date,
  purchase_value numeric(14,2) DEFAULT 0,
  current_value numeric(14,2) DEFAULT 0,
  useful_life_years int DEFAULT 5,
  person_in_charge text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_assets" ON assets;
CREATE POLICY "anon_select_assets" ON assets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_assets" ON assets;
CREATE POLICY "anon_insert_assets" ON assets FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_assets" ON assets;
CREATE POLICY "anon_update_assets" ON assets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_assets" ON assets;
CREATE POLICY "anon_delete_assets" ON assets FOR DELETE TO anon, authenticated USING (true);

-- Inventory sessions
CREATE TABLE IF NOT EXISTS inventory_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','completed')),
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inventory_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_inventory_sessions" ON inventory_sessions;
CREATE POLICY "anon_select_inventory_sessions" ON inventory_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_inventory_sessions" ON inventory_sessions;
CREATE POLICY "anon_insert_inventory_sessions" ON inventory_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_inventory_sessions" ON inventory_sessions;
CREATE POLICY "anon_update_inventory_sessions" ON inventory_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_inventory_sessions" ON inventory_sessions;
CREATE POLICY "anon_delete_inventory_sessions" ON inventory_sessions FOR DELETE TO anon, authenticated USING (true);

-- Inventory items (per-asset results within a session)
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES inventory_sessions(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  result text NOT NULL DEFAULT 'good' CHECK (result IN ('good','damaged','missing','needs_repair')),
  note text,
  checked_at timestamptz DEFAULT now(),
  UNIQUE (session_id, asset_id)
);
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_inventory_items" ON inventory_items;
CREATE POLICY "anon_select_inventory_items" ON inventory_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_inventory_items" ON inventory_items;
CREATE POLICY "anon_insert_inventory_items" ON inventory_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_inventory_items" ON inventory_items;
CREATE POLICY "anon_update_inventory_items" ON inventory_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_inventory_items" ON inventory_items;
CREATE POLICY "anon_delete_inventory_items" ON inventory_items FOR DELETE TO anon, authenticated USING (true);

-- Transfers (điều chuyển)
CREATE TABLE IF NOT EXISTS transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  from_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  to_location_id uuid NOT NULL REFERENCES locations(id) ON DELETE SET NULL,
  reason text,
  transfer_date date NOT NULL DEFAULT CURRENT_DATE,
  performed_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_transfers" ON transfers;
CREATE POLICY "anon_select_transfers" ON transfers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_transfers" ON transfers;
CREATE POLICY "anon_insert_transfers" ON transfers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_transfers" ON transfers;
CREATE POLICY "anon_update_transfers" ON transfers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_transfers" ON transfers;
CREATE POLICY "anon_delete_transfers" ON transfers FOR DELETE TO anon, authenticated USING (true);

-- Repairs (sửa chữa)
CREATE TABLE IF NOT EXISTS repairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  description text NOT NULL,
  cost numeric(14,2) DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  performed_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_repairs" ON repairs;
CREATE POLICY "anon_select_repairs" ON repairs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_repairs" ON repairs;
CREATE POLICY "anon_insert_repairs" ON repairs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_repairs" ON repairs;
CREATE POLICY "anon_update_repairs" ON repairs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_repairs" ON repairs;
CREATE POLICY "anon_delete_repairs" ON repairs FOR DELETE TO anon, authenticated USING (true);

-- Disposals (thanh lý)
CREATE TABLE IF NOT EXISTS disposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  reason text NOT NULL,
  method text CHECK (method IN ('sell','scrap','donate','other')),
  residual_value numeric(14,2) DEFAULT 0,
  disposal_date date NOT NULL DEFAULT CURRENT_DATE,
  approved_by text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE disposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_disposals" ON disposals;
CREATE POLICY "anon_select_disposals" ON disposals FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_disposals" ON disposals;
CREATE POLICY "anon_insert_disposals" ON disposals FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_disposals" ON disposals;
CREATE POLICY "anon_update_disposals" ON disposals FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_disposals" ON disposals;
CREATE POLICY "anon_delete_disposals" ON disposals FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_session ON inventory_items(session_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_asset ON inventory_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_transfers_asset ON transfers(asset_id);
CREATE INDEX IF NOT EXISTS idx_repairs_asset ON repairs(asset_id);
CREATE INDEX IF NOT EXISTS idx_disposals_asset ON disposals(asset_id);
