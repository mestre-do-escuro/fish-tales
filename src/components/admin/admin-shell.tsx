import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function WaveLogo() {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true" className="h-8 w-9 shrink-0 drop-shadow-[0_0_8px_rgb(60_200_255/0.45)]">
      <defs>
        <linearGradient id="adminWave" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7ff3ff" />
          <stop offset="1" stopColor="#1aa6e0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#adminWave)" strokeWidth="3.6" strokeLinecap="round">
        <path d="M5 13c5-8 13-8 19-3s13 5 19-2" />
        <path d="M3 22c6-7 14-7 20-2s14 5 21-2" />
        <path d="M6 31c5-5 12-5 17-1s12 4 18-1" />
      </g>
    </svg>
  );
}

/** Page chrome shared by the backoffice pages. */
export function AdminShell({
  title,
  subtitle,
  back,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  back: "app" | "admin";
  actions?: ReactNode;
  children: ReactNode;
}) {
  const backClass =
    "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm text-muted transition-colors hover:border-primary/50 hover:text-fg";
  return (
    <div className="min-h-screen bg-[radial-gradient(90%_60%_at_50%_-10%,rgb(30_110_150/0.28),transparent_70%)] bg-bg font-sans text-fg">
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-4 sm:px-6">
        <a href="/peixe.html" className="flex items-center gap-2" aria-label="O Pescador · voltar à app">
          <WaveLogo />
          <span className="leading-tight">
            <strong className="block text-lg font-semibold italic tracking-tight">O Pescador</strong>
            <span className="block text-[0.65rem] font-medium tracking-[0.18em] text-primary/80">BACKOFFICE</span>
          </span>
        </a>
        <div className="ml-auto">
          {back === "app" ? (
            <a href="/peixe.html" className={backClass}>
              <ArrowLeft className="size-4" aria-hidden /> Voltar à app
            </a>
          ) : (
            <Link to="/admin" className={backClass}>
              <ArrowLeft className="size-4" aria-hidden /> Administração
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
