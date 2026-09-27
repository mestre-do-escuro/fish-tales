// Shared building blocks for the backoffice pages.
import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmBar({
  text,
  busy,
  onCancel,
  onConfirm,
}: {
  text: string;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-2 rounded-xl border border-danger/40 bg-danger/10 p-2 pl-3">
      <span className="mr-auto text-sm font-medium">{text}</span>
      <GhostButton onClick={onCancel} disabled={busy}>
        Cancelar
      </GhostButton>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-danger px-4 text-sm font-semibold text-primary-fg disabled:opacity-60"
      >
        <Trash2 className="size-4" aria-hidden /> Apagar
      </button>
    </div>
  );
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg shadow-[0_0_20px_rgb(40_185_255/0.3)] transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  tone,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "danger" }) {
  const toneClass =
    tone === "danger"
      ? "hover:border-danger/60 hover:text-danger"
      : "hover:border-primary/60 hover:text-primary";
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-bg/60 px-3.5 text-sm font-medium text-fg backdrop-blur transition-colors disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:text-fg ${toneClass}`}
    >
      {children}
    </button>
  );
}


export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

