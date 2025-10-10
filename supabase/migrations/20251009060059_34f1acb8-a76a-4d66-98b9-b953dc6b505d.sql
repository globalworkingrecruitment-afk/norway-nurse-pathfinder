-- Agregar nuevas columnas para método de pago y mensualidades
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS number_of_installments INTEGER;

-- Actualizar periodos de amortización existentes
-- Plan Inicial: 24 → 22 meses
UPDATE registrations 
SET amortization_months = 22 
WHERE plan_title = 'Plan Inicial' AND amortization_months = 24;

-- Plan Estándar: 19 → 18 meses
UPDATE registrations 
SET amortization_months = 18 
WHERE plan_title = 'Plan Estándar' AND amortization_months = 19;

-- Plan Avanzado: 14 → 12 meses
UPDATE registrations 
SET amortization_months = 12 
WHERE plan_title = 'Plan Avanzado' AND amortization_months = 14;