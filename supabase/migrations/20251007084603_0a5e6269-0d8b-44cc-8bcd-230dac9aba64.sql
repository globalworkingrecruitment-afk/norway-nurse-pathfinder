-- Actualizar Francisco Aragón (Plan Estándar)
UPDATE registrations 
SET 
  monthly_payment = 416.67,
  amortization_months = 6
WHERE email = 'fcara@gmail.me';

-- Actualizar Pablo Fuentes (Plan Avanzado)
UPDATE registrations 
SET 
  monthly_payment = 583.33,
  amortization_months = 6
WHERE email = 'pf@hotmail.com';