import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LogOut, ShieldCheck, Package, Mail, Phone, MapPin, Search, KeyRound,
  Filter, Eye, History, CalendarRange, X, Settings, Save,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin — Orders" },
      { name: "description", content: "Admin panel: view all client orders." },
      { name: "robots", content: "noindex,nofollow" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: Dashboard,
});

type Order = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
  service: string;
  budget: string | null;
  details: string;
  status: string;
  created_at: string;
};

type HistoryEntry = {
  id: string;
  old_status: string | null;
  new_status: string;
  changed_by_email: string | null;
  note: string | null;
  customer_notified?: boolean;
  notification_channel?: string | null;
  created_at: string;
};

type NotificationSettings = {
  notify_customer_default: boolean;
  subject_template: string;
  body_template: string;
};

const STATUSES = ["new", "in_progress", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-700",
  in_progress: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  notify_customer_default: false,
  subject_template: "[EHR Cyber] Order #{order_short_id} — Status: {status}",
  body_template: [
    "Hello {customer_name},",
    "",
    "Thank you for choosing EHR Software & Cyber Solution.",
    "We're writing to update you on the status of your order.",
    "",
    "────────────────────────────────────────",
    "  ORDER UPDATE",
    "────────────────────────────────────────",
    "  Order ID   : {order_id}",
    "  Service    : {service}",
    "  Previous   : {old_status}",
    "  Current    : {status}  ✓",
    "────────────────────────────────────────",
    "",
    "{note}",
    "",
    "If you have any questions or need further assistance,",
    "simply reply to this email — we're here to help.",
    "",
    "Warm regards,",
    "EHR Software & Cyber Solution Team",
    "",
    "──",
    "🛡  EHR Software & Cyber Solution",
    "✉  ehrcybersecurity@gmail.com",
    "🌐  https://free-shop-joy.lovable.app",
    "Established: 08-03-2024",
  ].join("\n"),
};

function renderTemplate(template: string, order: Order, nextStatus: string, note: string) {
  const cleanedNote = note.trim();
  const values: Record<string, string> = {
    customer_name: order.name?.trim() || "there",
    status: nextStatus.replace("_", " "),
    old_status: order.status.replace("_", " "),
    service: order.service,
    order_id: order.id,
    order_short_id: order.id.slice(0, 8).toUpperCase(),
    note: cleanedNote ? `Note: ${cleanedNote}` : "",
  };
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  ).replace(/\n{3,}/g, "\n\n").trim();
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "border-slate-200 bg-slate-50 text-slate-700";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cls}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // filters
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // password
  const [newPw, setNewPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // details sheet
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // status change confirmation
  const [pendingChange, setPendingChange] = useState<{ order: Order; next: string } | null>(null);
  const [changeNote, setChangeNote] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(false);
  const [changing, setChanging] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPw.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) { toast.error(error.message); return; }
    setNewPw("");
    toast.success("Password updated.");
  }

  const loadOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("id,name,email,phone,country,address,service,budget,details,status,created_at")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Couldn't load orders."); return; }
    setOrders((data ?? []) as Order[]);
  }, []);

  const loadHistory = useCallback(async (orderId: string) => {
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("order_status_history")
      .select("id,old_status,new_status,changed_by_email,note,customer_notified,notification_channel,created_at")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });
    setHistoryLoading(false);
    if (error) { toast.error("Couldn't load history."); return; }
    setHistory((data ?? []) as HistoryEntry[]);
  }, []);

  const loadNotificationSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from("notification_settings")
      .select("notify_customer_default,subject_template,body_template")
      .eq("id", true)
      .maybeSingle();
    if (error) {
      toast.error("Couldn't load notification settings.");
      return;
    }
    setNotificationSettings((data as NotificationSettings | null) ?? DEFAULT_NOTIFICATION_SETTINGS);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      setUserId(u.user.id);
      const { data: roles } = await supabase
        .from("user_roles").select("role").eq("user_id", u.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        loadOrders();
        loadNotificationSettings();
      } else {
        toast.error("Admin access required.");
        setTimeout(() => navigate({ to: "/", replace: true }), 1200);
      }
    })();
  }, [loadNotificationSettings, loadOrders, navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin.php", replace: true });
  }

  async function openDetails(o: Order) {
    setDetailOrder(o);
    setHistory([]);
    await loadHistory(o.id);
  }

  function requestStatusChange(o: Order, next: string) {
    if (next === o.status) return;
    setChangeNote("");
    setNotifyCustomer(notificationSettings.notify_customer_default && !!o.email);
    setPendingChange({ order: o, next });
  }

  async function saveNotificationSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!notificationSettings.subject_template.trim() || !notificationSettings.body_template.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    setSettingsSaving(true);
    const { error } = await supabase.from("notification_settings").upsert({
      id: true,
      notify_customer_default: notificationSettings.notify_customer_default,
      subject_template: notificationSettings.subject_template.trim(),
      body_template: notificationSettings.body_template.trim(),
      updated_by: userId,
    });
    setSettingsSaving(false);
    if (error) {
      toast.error("Couldn't save notification settings.");
      return;
    }
    toast.success("Notification settings saved.");
  }

  async function confirmStatusChange() {
    if (!pendingChange || !userId) return;
    const { order, next } = pendingChange;
    setChanging(true);

    const prev = orders;
    setOrders((os) => os.map((o) => (o.id === order.id ? { ...o, status: next } : o)));

    const { error: upErr } = await supabase
      .from("orders").update({ status: next }).eq("id", order.id);
    if (upErr) {
      setOrders(prev);
      setChanging(false);
      toast.error("Couldn't update status.");
      return;
    }

    const { error: logErr } = await supabase.from("order_status_history").insert({
      order_id: order.id,
      old_status: order.status,
      new_status: next,
      changed_by: userId,
      changed_by_email: email,
      note: changeNote.trim() || null,
      customer_notified: notifyCustomer && !!order.phone,
      notification_channel: notifyCustomer && order.phone ? "whatsapp" : null,
    });
    if (logErr) toast.warning("Status updated, but log failed.");

    if (notifyCustomer && order.phone) {
      const digits = order.phone.replace(/[^\d]/g, "");
      if (digits.length >= 8) {
        const subject = renderTemplate(notificationSettings.subject_template, order, next, changeNote);
        const body = renderTemplate(notificationSettings.body_template, order, next, changeNote);
        const text = encodeURIComponent(`${subject}\n\n${body}`);
        window.open(`https://wa.me/${digits}?text=${text}`, "_blank", "noopener,noreferrer");
      }
    }

    if (detailOrder?.id === order.id) {
      setDetailOrder({ ...order, status: next });
      loadHistory(order.id);
    }

    setChanging(false);
    setPendingChange(null);
    toast.success(`Status → ${next.replace("_", " ")}`);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() + 86_400_000 : null;
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      const t = new Date(o.created_at).getTime();
      if (from && t < from) return false;
      if (to && t > to) return false;
      if (!s) return true;
      return (
        (o.name ?? "").toLowerCase().includes(s) ||
        (o.phone ?? "").toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.id.slice(0, 8).toLowerCase().includes(s)
      );
    });
  }, [orders, q, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setQ(""); setStatusFilter("all"); setDateFrom(""); setDateTo("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster richColors position="top-center" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold">EHR Admin</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Order Panel</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">{email}</span>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {isAdmin === null ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading…
          </div>
        ) : !isAdmin ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h1 className="text-xl font-bold text-amber-900">Admin access required</h1>
            <p className="mt-2 text-sm text-amber-800">Redirecting…</p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">Client Orders</h1>
              <p className="text-sm text-slate-500">
                {orders.length} total · {filtered.length} shown
              </p>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-sky-600" />
                <h2 className="text-sm font-bold">Filters</h2>
                {(q || statusFilter !== "all" || dateFrom || dateTo) && (
                  <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={clearFilters}>
                    <X className="mr-1 h-3 w-3" /> Clear
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Name, phone, or order ID"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="pl-9" aria-label="From date" />
                </div>
                <div className="relative">
                  <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="pl-9" aria-label="To date" />
                </div>
              </div>
            </div>

            {/* Password */}
            <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-sky-600" />
                <h2 className="text-sm font-bold">Change admin password</h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="password" placeholder="New password (min 6 characters)"
                  value={newPw} onChange={(e) => setNewPw(e.target.value)}
                  minLength={6} className="sm:flex-1"
                />
                <Button type="submit" disabled={pwLoading || newPw.length < 6}>
                  {pwLoading ? "Updating…" : "Update password"}
                </Button>
              </div>
            </form>

            {/* Notification settings */}
            <form onSubmit={saveNotificationSettings} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-sky-600" />
                  <div>
                    <h2 className="text-sm font-bold">Status email template</h2>
                    <p className="text-xs text-slate-500">Customize the subject, message, and default notify option.</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={notificationSettings.notify_customer_default}
                    onChange={(e) => setNotificationSettings((s) => ({ ...s, notify_customer_default: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Notify customer by default
                </label>
              </div>
              <div className="grid gap-3 lg:grid-cols-[0.9fr_1.4fr]">
                <div className="space-y-1.5">
                  <Label htmlFor="email-subject" className="text-xs">Subject</Label>
                  <Input
                    id="email-subject"
                    value={notificationSettings.subject_template}
                    maxLength={160}
                    onChange={(e) => setNotificationSettings((s) => ({ ...s, subject_template: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-body" className="text-xs">Email body</Label>
                  <Textarea
                    id="email-body"
                    rows={10}
                    value={notificationSettings.body_template}
                    maxLength={4000}
                    className="font-mono text-xs"
                    onChange={(e) => setNotificationSettings((s) => ({ ...s, body_template: e.target.value }))}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Variables: {"{customer_name}"}, {"{status}"}, {"{old_status}"}, {"{service}"}, {"{order_id}"}, {"{order_short_id}"}, {"{note}"}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNotificationSettings((s) => ({
                      ...s,
                      subject_template: DEFAULT_NOTIFICATION_SETTINGS.subject_template,
                      body_template: DEFAULT_NOTIFICATION_SETTINGS.body_template,
                    }))}
                  >
                    Load branded template
                  </Button>
                  <Button type="submit" disabled={settingsSaving} className="bg-slate-950 text-white hover:bg-slate-800">
                    <Save className="mr-2 h-3.5 w-3.5" /> {settingsSaving ? "Saving…" : "Save template"}
                  </Button>
                </div>
              </div>

            </form>

            {/* Orders list */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                <Package className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                No orders match your filters.
              </div>
            ) : (
              <ul className="space-y-3">
                {filtered.map((o) => (
                  <li key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-mono text-slate-400">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </div>
                        <h3 className="mt-0.5 text-base font-bold">{o.name ?? "—"}</h3>
                        <div className="mt-0.5 text-sm font-semibold text-sky-700">{o.service}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={o.status} />
                        <span className="text-xs text-slate-500">
                          {new Date(o.created_at).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Select
                            value={o.status}
                            onValueChange={(v) => requestStatusChange(o, v)}
                          >
                            <SelectTrigger className="h-8 w-[140px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {s.replace("_", " ")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="h-8" onClick={() => openDetails(o)}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {/* Order details */}
      <Sheet open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {detailOrder && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  Order #{detailOrder.id.slice(0, 8).toUpperCase()}
                  <StatusBadge status={detailOrder.status} />
                </SheetTitle>
                <SheetDescription>
                  Placed {new Date(detailOrder.created_at).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5 text-sm">
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</h3>
                  <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="font-semibold">{detailOrder.name ?? "—"}</div>
                    {detailOrder.email && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="h-3.5 w-3.5" /> {detailOrder.email}
                      </div>
                    )}
                    {detailOrder.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="h-3.5 w-3.5" /> {detailOrder.phone}
                      </div>
                    )}
                    {(detailOrder.country || detailOrder.address) && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {[detailOrder.address, detailOrder.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Order Summary</h3>
                  <div className="rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 p-3">
                      <div>
                        <div className="font-semibold">{detailOrder.service}</div>
                        <div className="text-xs text-slate-500">Service</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{detailOrder.budget ?? "—"}</div>
                        <div className="text-xs text-slate-500">Budget</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 text-sm font-bold">
                      <span>Total (estimate)</span>
                      <span>{detailOrder.budget ?? "—"}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Details</h3>
                  <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                    {detailOrder.details}
                  </p>
                </section>

                <section>
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <History className="h-3.5 w-3.5" /> Status History
                  </h3>
                  {historyLoading ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">Loading…</div>
                  ) : history.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-500">
                      No changes recorded yet.
                    </div>
                  ) : (
                    <ol className="space-y-2">
                      {history.map((h) => (
                        <li key={h.id} className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="flex items-center gap-2 text-xs">
                            {h.old_status && (
                              <>
                                <StatusBadge status={h.old_status} />
                                <span className="text-slate-400">→</span>
                              </>
                            )}
                            <StatusBadge status={h.new_status} />
                          </div>
                          <div className="mt-1.5 text-xs text-slate-500">
                            {new Date(h.created_at).toLocaleString()} · {h.changed_by_email ?? "system"}
                          </div>
                          {h.customer_notified && (
                            <div className="mt-1.5 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              Customer notified by {h.notification_channel ?? "email"}
                            </div>
                          )}
                          {h.note && <p className="mt-1.5 text-xs text-slate-700">{h.note}</p>}
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Confirm status change */}
      <AlertDialog open={!!pendingChange} onOpenChange={(o) => !o && !changing && setPendingChange(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm status change</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingChange && (
                <>
                  Change order <strong>#{pendingChange.order.id.slice(0, 8).toUpperCase()}</strong> from{" "}
                  <strong>{pendingChange.order.status.replace("_", " ")}</strong> to{" "}
                  <strong>{pendingChange.next.replace("_", " ")}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="note" className="text-xs">Note (optional, logged)</Label>
              <Textarea
                id="note" rows={3} maxLength={500}
                placeholder="e.g. Payment received, starting work…"
                value={changeNote} onChange={(e) => setChangeNote(e.target.value)}
              />
            </div>
            {pendingChange?.order.email && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox" checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                Notify customer by email
              </label>
            )}
            {pendingChange?.order.email && notifyCustomer && (
              <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs text-slate-700">
                <div className="font-bold text-slate-900">
                  {renderTemplate(notificationSettings.subject_template, pendingChange.order, pendingChange.next, changeNote)}
                </div>
                <p className="mt-2 whitespace-pre-wrap">
                  {renderTemplate(notificationSettings.body_template, pendingChange.order, pendingChange.next, changeNote)}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={changing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange} disabled={changing}>
              {changing ? "Updating…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
