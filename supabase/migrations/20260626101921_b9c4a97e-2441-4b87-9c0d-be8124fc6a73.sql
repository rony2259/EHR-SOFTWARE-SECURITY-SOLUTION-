
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS country text;

ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Verified clients create orders" ON public.orders;
DROP POLICY IF EXISTS "Clients view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins update orders" ON public.orders;

GRANT INSERT ON public.orders TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;

CREATE POLICY "Anyone can place an order"
  ON public.orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(trim(name)) > 0
    AND service IS NOT NULL AND length(trim(service)) > 0
    AND details IS NOT NULL AND length(trim(details)) >= 5
    AND (
      (email IS NOT NULL AND length(trim(email)) > 0)
      OR (phone IS NOT NULL AND length(trim(phone)) > 0)
    )
  );

CREATE POLICY "Clients view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));
