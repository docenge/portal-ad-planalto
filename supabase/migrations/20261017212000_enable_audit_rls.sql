-- Applied through the Supabase dashboard on 2026-10-17.
-- Audit logs must not be publicly readable or writable.
-- No client-facing policies are added. Future audit writes should use
-- trusted server-side code or a reviewed security-definer function.
ALTER TABLE public.logs_auditoria ENABLE ROW LEVEL SECURITY;
