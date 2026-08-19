import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Lock,
  LogOut,
  Loader2,
  Ticket,
  Clock,
  CheckCircle2,
  Wallet,
  Trash2,
  Trophy,
  ArrowLeft,
} from "lucide-react";
import { pad, brl } from "../data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem("mq_admin_token") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [winners, setWinners] = useState(["", "", "", ""]);

  const client = useCallback(
    () => axios.create({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  const loadAll = useCallback(async () => {
    if (!token) return;
    try {
      const c = client();
      const [s, o, w] = await Promise.all([
        c.get(`${API}/admin/stats`),
        c.get(`${API}/admin/orders`),
        c.get(`${API}/admin/winners`),
      ]);
      setStats(s.data);
      setOrders(o.data.orders);
      setPrizes(w.data.prizes);
      setWinners(w.data.winners.map((n) => (n ? String(n) : "")));
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("mq_admin_token");
        setToken("");
      } else {
        toast.error("Erro ao carregar o painel.");
      }
    }
  }, [token, client]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const login = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem("mq_admin_token", res.data.token);
      setToken(res.data.token);
      toast.success("Bem-vindo ao painel!");
    } catch {
      toast.error("Senha incorreta.");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await client().post(`${API}/admin/orders/${id}/paid`);
      toast.success("Pedido marcado como pago!");
      loadAll();
    } catch {
      toast.error("Erro ao atualizar pedido.");
    }
  };

  const release = async (id) => {
    if (!window.confirm("Liberar esta reserva? Os números voltarão a ficar disponíveis.")) return;
    try {
      await client().delete(`${API}/admin/orders/${id}`);
      toast.success("Reserva liberada.");
      loadAll();
    } catch {
      toast.error("Erro ao liberar reserva.");
    }
  };

  const saveWinners = async () => {
    const nums = winners.map((w) => (w.trim() === "" ? null : Number(w)));
    try {
      await client().put(`${API}/admin/winners`, { winners: nums });
      toast.success("Números ganhadores salvos!");
      loadAll();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Erro ao salvar ganhadores.");
    }
  };

  const logout = () => {
    localStorage.removeItem("mq_admin_token");
    setToken("");
  };

  const holderOf = (n) => orders.find((o) => o.numbers.includes(Number(n)));

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night px-4">
        <div className="grain-overlay" />
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-night-soft p-8"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <img src="/images/mq-logo.png" alt="MQ Assistência" className="h-16 w-auto" />
            <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white">
              Painel Admin
            </h1>
            <p className="mt-1 text-sm text-zinc-500">Acesso restrito da MQ Assistência</p>
          </div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">
            Senha
          </label>
          <input
            data-testid="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite a senha"
            className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/30"
          />
          <button
            data-testid="admin-login-btn"
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-volt py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            Entrar
          </button>
          <Link
            data-testid="admin-back-home"
            to="/"
            className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500 transition-colors hover:text-volt"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night text-white">
      <div className="grain-overlay" />
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <img src="/images/mq-logo.png" alt="MQ Assistência" className="h-10 w-auto" />
            <div>
              <h1 className="font-display text-lg font-extrabold tracking-tight">
                Painel <span className="text-volt">Admin</span>
              </h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Rifa MQ Assistência</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              data-testid="admin-view-site"
              to="/"
              className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-volt sm:block"
            >
              Ver site
            </Link>
            <button
              data-testid="admin-logout-btn"
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:border-red-400 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main data-testid="admin-dashboard" className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        {stats && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { icon: Ticket, label: "Números vendidos", value: `${stats.sold} / ${stats.total_numbers}`, testid: "stat-sold" },
              { icon: Clock, label: "Aguardando pagamento", value: stats.pending_orders, testid: "stat-pending" },
              { icon: CheckCircle2, label: "Pedidos pagos", value: stats.paid_orders, testid: "stat-paid" },
              { icon: Wallet, label: "Arrecadado (pago)", value: brl(stats.paid_revenue), testid: "stat-revenue" },
            ].map((c) => (
              <div
                key={c.testid}
                data-testid={c.testid}
                className="rounded-2xl border border-white/10 bg-night-soft p-5"
              >
                <c.icon className="h-5 w-5 text-volt" />
                <p className="mt-3 font-display text-2xl font-extrabold text-white">{c.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        <section className="mt-10 rounded-2xl border border-volt/30 bg-night-soft p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-6 w-6 text-volt" />
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-tight">Números ganhadores</h2>
              <p className="text-xs text-zinc-500">Um número ganhador para cada prêmio. Visível apenas aqui no painel.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {prizes.map((prize, i) => {
              const n = winners[i].trim();
              const holder = n ? holderOf(n) : null;
              return (
                <div key={prize} className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <p className="text-sm font-bold text-white">
                    <span className="mr-2 font-mono text-volt">{String(i + 1).padStart(2, "0")}</span>
                    {prize}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      data-testid={`winner-input-${i}`}
                      type="number"
                      min={1}
                      max={500}
                      value={winners[i]}
                      onChange={(e) =>
                        setWinners((prev) => prev.map((w, j) => (j === i ? e.target.value : w)))
                      }
                      placeholder="Nº (1-500)"
                      className="w-32 rounded-lg border border-white/15 bg-black/60 px-3 py-2 font-mono text-sm text-white outline-none transition-colors focus:border-volt focus:ring-2 focus:ring-volt/30"
                    />
                    {n && (
                      <span
                        data-testid={`winner-holder-${i}`}
                        className={`text-xs ${holder ? "text-volt" : "text-zinc-500"}`}
                      >
                        {holder
                          ? `${holder.name} • ${holder.phone} • ${holder.status === "pago" ? "pago" : "aguardando"}`
                          : "Número ainda não vendido"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            data-testid="save-winners-btn"
            onClick={saveWinners}
            className="mt-6 rounded-full bg-volt px-8 py-3 text-xs font-bold uppercase tracking-[0.15em] text-night transition-all duration-300 hover:bg-volt-dim active:scale-95"
          >
            Salvar ganhadores
          </button>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 font-display text-xl font-extrabold tracking-tight">
            Pedidos <span className="text-zinc-500">({orders.length})</span>
          </h2>
          {orders.length === 0 ? (
            <p data-testid="orders-empty" className="rounded-2xl border border-white/10 bg-night-soft p-10 text-center text-sm text-zinc-500">
              Nenhum pedido até agora.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div
                  key={o.id}
                  data-testid={`order-row-${o.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-night-soft p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold text-white">{o.name}</p>
                      <span
                        className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
                          o.status === "pago"
                            ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-400"
                            : "border border-volt/40 bg-volt/10 text-volt"
                        }`}
                      >
                        {o.status === "pago" ? "Pago" : "Aguardando pagamento"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">
                      {o.phone} • {brl(o.total)} • {new Date(o.created_at).toLocaleString("pt-BR")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {o.numbers.map((n) => (
                        <span key={n} className="rounded bg-volt px-2 py-0.5 font-mono text-[11px] font-bold text-night">
                          {pad(n)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {o.status !== "pago" && (
                      <button
                        data-testid={`mark-paid-${o.id}`}
                        onClick={() => markPaid(o.id)}
                        className="flex items-center gap-1.5 rounded-full bg-volt px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-night transition-colors hover:bg-volt-dim"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Marcar pago
                      </button>
                    )}
                    <button
                      data-testid={`release-${o.id}`}
                      onClick={() => release(o.id)}
                      className="flex items-center gap-1.5 rounded-full border border-red-400/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-red-400 transition-colors hover:bg-red-400 hover:text-night"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Liberar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
