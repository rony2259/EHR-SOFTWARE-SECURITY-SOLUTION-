CREATE TABLE public.notification_settings (
  id boolean PRIMARY KEY DEFAULT true,
  notify_customer_default boolean NOT NULL DEFAULT false,
  subject_template text NOT NULL DEFAULT 'Update on your order #{order_short_id}',
  body_template text NOT NULL DEFAULT 'Hi {customer_name},\n\nYour order status is now: {status}.\n\nService: {service}\nOrder ID: {order_id}\n\n{note}\n\n— EHR Software & Cyber Solution',
  updated_by uuid,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notification_settings_singleton CHECK (id = true)
);

GRANT SELECT, INSERT, UPDATE ON public.notification_settings TO authenticated;
GRANT ALL ON public.notification_settings TO service_role;

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage notification settings"
  ON public.notification_settings
  FOR ALL
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER set_notification_settings_updated_at
  BEFORE UPDATE ON public.notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.notification_settings (id) VALUES (true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.order_status_history
  ADD COLUMN IF NOT EXISTS customer_notified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notification_channel text;
