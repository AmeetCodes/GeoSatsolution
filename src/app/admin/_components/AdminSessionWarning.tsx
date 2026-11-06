'use client';

import { LogOut, ShieldAlert, TimerReset } from 'lucide-react';

interface AdminSessionWarningProps {
  open: boolean;
  secondsRemaining: number;
  onStayActive: () => void | Promise<unknown>;
  onLogout: () => void | Promise<unknown>;
}

function formatCountdown(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export function AdminSessionWarning({
  open,
  secondsRemaining,
  onStayActive,
  onLogout,
}: AdminSessionWarningProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-session-warning-title"
      aria-describedby="admin-session-warning-description"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <ShieldAlert className="size-5" />
          </span>
          <div>
            <h2
              id="admin-session-warning-title"
              className="text-lg font-semibold text-white"
            >
              Session expiring soon
            </h2>
            <p
              id="admin-session-warning-description"
              className="mt-1 text-sm leading-relaxed text-slate-400"
            >
              You have been inactive. For security, you will be signed out automatically.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200/80">
            Time remaining
          </span>
          <span
            className="font-mono text-2xl font-bold tabular-nums text-amber-200"
            aria-live="polite"
          >
            {formatCountdown(secondsRemaining)}
          </span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void onStayActive()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-teal-400 hover:to-cyan-500"
          >
            <TimerReset className="size-4" />
            Stay Signed In
          </button>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSessionWarning;
