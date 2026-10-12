-- Imported ads may not quote a USD asking price, year or manufacturer.
ALTER TABLE aircraft ALTER COLUMN price DROP NOT NULL;
ALTER TABLE aircraft ALTER COLUMN year DROP NOT NULL;
ALTER TABLE aircraft ALTER COLUMN make DROP NOT NULL;
ALTER TABLE aircraft ALTER COLUMN hours TYPE DOUBLE PRECISION;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS price_text TEXT;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS source_seller TEXT;
