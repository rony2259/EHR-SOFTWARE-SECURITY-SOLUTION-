import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ShieldCheck, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin.php")({
  head: () => ({
    meta: [
      { title: "Admin Login" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLogin,
});

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleForgot() {
    const target = email.trim() || (window.prompt("Enter your admin email:") ?? "").trim();
    if (!target || !z.string().email().safeParse(target).success) {
      toast.error("Enter a valid email.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error("Couldn't send reset email.");
      return;
    }
    toast.success("Reset link sent — check inbox (and spam).");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error || !data.user) {
      setLoading(false);
      toast.error("Invalid email or password.");
      return;
    }
    // Verify admin role; sign out non-admins.
    const { data: roles, error: roleErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (roleErr || !roles) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("This account is not an admin.");
      return;
    }
    setLoading(false);
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 px-4 py-16">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-sm font-bold text-slate-900">EHR Admin</span>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <Lock className="h-4 w-4 text-sky-600" />
            <h1 className="text-lg font-bold text-slate-900">Admin Panel Login</h1>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Password</Label>
              <Input
                id="p"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <button
              type="button"
              onClick={handleForgot}
              disabled={loading}
              className="mx-auto block text-xs font-semibold text-sky-700 hover:text-sky-900 hover:underline"
            >
              Forgot password?
            </button>
          </form>
        </div>
        <Link to="/" className="mt-6 block text-center text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-sky-600">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
