// Shared (client-safe) plans, roles and the feature catalog behind each plan.
// Defaults mirror the "Planos de Subscrição" popup in public/peixe.html; the
// backoffice (/admin/access) stores overrides in the plan_features table.

export const PLANS = ["free", "standard", "pro"] as const;
export type Plan = (typeof PLANS)[number];
export const PLAN_LABEL: Record<Plan, string> = { free: "Free", standard: "Standard", pro: "PRO" };

export const ROLES = ["user", "admin"] as const;
export type Role = (typeof ROLES)[number];
export const ROLE_LABEL: Record<Role, string> = { user: "Pescador", admin: "Administrador" };

export const STATUSES = ["active", "suspended"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<Status, string> = { active: "Ativo", suspended: "Suspenso" };

export interface Feature {
  key: string;
  label: string;
  /** The cheapest plan that includes it by default. */
  tier: Plan;
}

export const FEATURES: Feature[] = [
  { key: "dashboard", label: "Dashboard principal", tier: "free" },
  { key: "day_hour", label: "Seleção de dias e horas", tier: "free" },
  { key: "tides_24h", label: "Marés em tempo real · 24h", tier: "free" },
  { key: "score_basic", label: "Score de pesca básico", tier: "free" },
  { key: "kpis", label: "KPIs marítimos atuais", tier: "free" },
  { key: "catch_log", label: "Diário de capturas básico", tier: "free" },
  { key: "gamification", label: "Gamificação, badges e descontos", tier: "free" },
  { key: "library_free", label: "Biblioteca com conteúdos Free", tier: "free" },
  { key: "forecast_advanced", label: "Forecast avançado detalhado", tier: "standard" },
  { key: "sea_map", label: "Mapa marítimo com profundidades", tier: "standard" },
  { key: "heatmap", label: "Heatmap de atividade detalhado", tier: "standard" },
  { key: "personal_stats", label: "Estatísticas pessoais", tier: "standard" },
  { key: "compare_spots", label: "Comparação de spots", tier: "standard" },
  { key: "insights_basic", label: "Insights básicos inteligentes", tier: "standard" },
  { key: "ads_reduced", label: "Menos publicidade", tier: "standard" },
  { key: "ai_recommendations", label: "Recomendações inteligentes com IA", tier: "pro" },
  { key: "custom_alerts", label: "Alertas personalizados", tier: "pro" },
  { key: "secret_spots", label: "Spots secretos", tier: "pro" },
  { key: "library_pro", label: "Biblioteca PRO: vídeos, tutoriais e espécies", tier: "pro" },
  { key: "golden_windows", label: "Janelas douradas detalhadas", tier: "pro" },
  { key: "score_advanced", label: "Score avançado de pesca", tier: "pro" },
  { key: "deep_stats", label: "Estatísticas profundas", tier: "pro" },
  { key: "private_groups", label: "Grupos privados e comunidade premium", tier: "pro" },
  { key: "ads_none", label: "Sem publicidade", tier: "pro" },
];

export const FEATURE_KEYS = new Set(FEATURES.map((f) => f.key));

export type PlanMatrix = Record<Plan, Record<string, boolean>>;

/** A plan includes every feature of the cheaper plans by default. */
export function defaultEnabled(plan: Plan, feature: Feature) {
  return PLANS.indexOf(plan) >= PLANS.indexOf(feature.tier);
}

/** Defaults overlaid with the stored overrides. */
export function buildMatrix(overrides: { plan: Plan; feature: string; enabled: boolean }[]): PlanMatrix {
  const matrix = Object.fromEntries(
    PLANS.map((plan) => [plan, Object.fromEntries(FEATURES.map((f) => [f.key, defaultEnabled(plan, f)]))]),
  ) as PlanMatrix;
  for (const o of overrides) {
    if (FEATURE_KEYS.has(o.feature)) matrix[o.plan][o.feature] = o.enabled;
  }
  return matrix;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
  status: Status;
  phone: string | null;
  location: string | null;
  bio: string | null;
  hasPassword: boolean;
  createdAt: string;
  lastSeenAt: string | null;
}
