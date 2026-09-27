//#region node_modules/.nitro/vite/services/ssr/assets/access-B-_gt6kv.js
var PLANS = [
	"free",
	"standard",
	"pro"
];
var PLAN_LABEL = {
	free: "Free",
	standard: "Standard",
	pro: "PRO"
};
var ROLES = ["user", "admin"];
var ROLE_LABEL = {
	user: "Pescador",
	admin: "Administrador"
};
var STATUSES = ["active", "suspended"];
var STATUS_LABEL = {
	active: "Ativo",
	suspended: "Suspenso"
};
var FEATURES = [
	{
		key: "dashboard",
		label: "Dashboard principal",
		tier: "free"
	},
	{
		key: "day_hour",
		label: "Seleção de dias e horas",
		tier: "free"
	},
	{
		key: "tides_24h",
		label: "Marés em tempo real · 24h",
		tier: "free"
	},
	{
		key: "score_basic",
		label: "Score de pesca básico",
		tier: "free"
	},
	{
		key: "kpis",
		label: "KPIs marítimos atuais",
		tier: "free"
	},
	{
		key: "catch_log",
		label: "Diário de capturas básico",
		tier: "free"
	},
	{
		key: "gamification",
		label: "Gamificação, badges e descontos",
		tier: "free"
	},
	{
		key: "library_free",
		label: "Biblioteca com conteúdos Free",
		tier: "free"
	},
	{
		key: "forecast_advanced",
		label: "Forecast avançado detalhado",
		tier: "standard"
	},
	{
		key: "sea_map",
		label: "Mapa marítimo com profundidades",
		tier: "standard"
	},
	{
		key: "heatmap",
		label: "Heatmap de atividade detalhado",
		tier: "standard"
	},
	{
		key: "personal_stats",
		label: "Estatísticas pessoais",
		tier: "standard"
	},
	{
		key: "compare_spots",
		label: "Comparação de spots",
		tier: "standard"
	},
	{
		key: "insights_basic",
		label: "Insights básicos inteligentes",
		tier: "standard"
	},
	{
		key: "ads_reduced",
		label: "Menos publicidade",
		tier: "standard"
	},
	{
		key: "ai_recommendations",
		label: "Recomendações inteligentes com IA",
		tier: "pro"
	},
	{
		key: "custom_alerts",
		label: "Alertas personalizados",
		tier: "pro"
	},
	{
		key: "secret_spots",
		label: "Spots secretos",
		tier: "pro"
	},
	{
		key: "library_pro",
		label: "Biblioteca PRO: vídeos, tutoriais e espécies",
		tier: "pro"
	},
	{
		key: "golden_windows",
		label: "Janelas douradas detalhadas",
		tier: "pro"
	},
	{
		key: "score_advanced",
		label: "Score avançado de pesca",
		tier: "pro"
	},
	{
		key: "deep_stats",
		label: "Estatísticas profundas",
		tier: "pro"
	},
	{
		key: "private_groups",
		label: "Grupos privados e comunidade premium",
		tier: "pro"
	},
	{
		key: "ads_none",
		label: "Sem publicidade",
		tier: "pro"
	}
];
var FEATURE_KEYS = new Set(FEATURES.map((f) => f.key));
/** A plan includes every feature of the cheaper plans by default. */
function defaultEnabled(plan, feature) {
	return PLANS.indexOf(plan) >= PLANS.indexOf(feature.tier);
}
/** Defaults overlaid with the stored overrides. */
function buildMatrix(overrides) {
	const matrix = Object.fromEntries(PLANS.map((plan) => [plan, Object.fromEntries(FEATURES.map((f) => [f.key, defaultEnabled(plan, f)]))]));
	for (const o of overrides) if (FEATURE_KEYS.has(o.feature)) matrix[o.plan][o.feature] = o.enabled;
	return matrix;
}
//#endregion
export { ROLES as a, STATUS_LABEL as c, PLAN_LABEL as i, buildMatrix as l, FEATURE_KEYS as n, ROLE_LABEL as o, PLANS as r, STATUSES as s, FEATURES as t, defaultEnabled as u };
