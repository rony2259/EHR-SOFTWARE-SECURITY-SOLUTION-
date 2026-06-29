
DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;

CREATE POLICY "Anyone can place an order" ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) > 0 AND length(name) <= 200
  AND service IS NOT NULL AND length(trim(service)) > 0 AND length(service) <= 200
  AND details IS NOT NULL AND length(trim(details)) >= 5 AND length(details) <= 5000
  AND (
    (email IS NOT NULL AND length(trim(email)) > 0)
    OR (phone IS NOT NULL AND length(trim(phone)) > 0)
  )
  AND (email IS NULL OR (length(email) <= 320 AND email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'))
  AND (phone IS NULL OR length(phone) <= 40)
  AND (country IS NULL OR length(country) <= 100)
  AND (address IS NULL OR length(address) <= 500)
  AND (budget IS NULL OR length(budget) <= 50)
);
