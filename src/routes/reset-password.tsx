import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoUrl from "@/assets/logo.png";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — EHR" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            setReady(true);
            url.searchParams.delete("code");
            window.history.replaceState({}, "", url.pathname + url.search);
            return;
          }
        }
        // Legacy hash-token flow: detectSessionInUrl handles it
        const { data } = await supabase.auth.getSession();
        if (data.session) setReady(true);
      } catch {
        /* noop */
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (password !== confirm) return toast.error("Passwords don't match.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error("Couldn't update password. Open the reset link again.");
        return;
      }
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      navigate({ to: "/admin.php", replace: true });
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-10 flex items-center gap-2.5 self-center">
          <img src={logoUrl} alt="EHR logo" width={40} height={40} className="h-10 w-10 rounded-xl object-contain" />
          <div className="leading-tight">
            <div className="text-base font-bold text-slate-900">EHR</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-sky-600">Reset Password</div>
          </div>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-30px_rgba(2,132,199,0.25)]">
          <h1 className="text-2xl font-bold text-slate-900">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">
            {ready
              ? "Choose a strong password (min 8 characters)."
              : "Open this page from the reset link in your email."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="pw" className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                New password
              </Label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                  disabled={!ready}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/60 pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cpw" className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                Confirm password
              </Label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="cpw"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                  disabled={!ready}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50/60 pl-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !ready}
              className="h-12 w-full rounded-xl bg-sky-600 text-base font-bold text-white shadow-lg shadow-sky-200 hover:bg-sky-700"
            >
              {loading ? "Updating…" : (<>Update password <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </form>
        </div>

        <Link to="/admin.php" className="mt-6 self-center text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-sky-600">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
