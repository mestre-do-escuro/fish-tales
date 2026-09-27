import { Fragment, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import * as Switch from "@radix-ui/react-switch";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/admin-shell";
import { errorMessage } from "@/components/admin/error-message";
import { FEATURES, PLANS, PLAN_LABEL, defaultEnabled, type Plan, type PlanMatrix } from "@/lib/access";
import { getPlanMatrix, setPlanFeature } from "@/lib/users.functions";

export const Route = createFileRoute("/admin/access")({
  loader: () => getPlanMatrix(),
  head: () => ({ meta: [{ title: "Perfis de acesso · O Pescador" }] }),
  component: AccessAdmin,
});

const GROUP_TITLE: Record<Plan, string> = {
  free: "Base (Free)",
  standard: "Pacote Standard",
  pro: "Pacote PRO",
};

function AccessAdmin() {
  const [matrix, setMatrix] = useState<PlanMatrix>(Route.useLoaderData());
  const [saving, setSaving] = useState<string | null>(null);

  async function toggle(plan: Plan, feature: string, enabled: boolean) {
    const key = `${plan}:${feature}`;
    const previous = matrix;
    setSaving(key);
    setMatrix((m) => ({ ...m, [plan]: { ...m[plan], [feature]: enabled } })); // optimistic
    try {
      setMatrix(await setPlanFeature({ data: { plan, feature, enabled } }));
    } catch (err) {
      setMatrix(previous);
      toast.error(errorMessage(err));
    } finally {
      setSaving(null);
    }
  }

  return (
    <AdminShell
      title="Perfis de acesso"
      subtitle="Escolha que funcionalidades cada plano desbloqueia na app. As alterações ficam ativas de imediato para todas as contas desse plano."
      back="admin"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-left">
              <th scope="col" className="px-4 py-3 font-medium text-muted">
                Funcionalidade
              </th>
              {PLANS.map((plan) => {
                const on = FEATURES.filter((f) => matrix[plan][f.key]).length;
                return (
                  <th key={plan} scope="col" className="w-14 px-1 py-3 text-center sm:w-32 sm:px-2">
                    <span className="block font-semibold text-fg">{PLAN_LABEL[plan]}</span>
                    <span className="block text-xs font-normal text-muted">
                      {on}/{FEATURES.length}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {PLANS.map((tier) => (
              <Fragment key={tier}>
                <tr>
                  <th colSpan={4} scope="colgroup" className="bg-bg/40 px-4 pb-2 pt-5 text-left text-xs font-semibold uppercase tracking-wider text-primary">
                    {GROUP_TITLE[tier]}
                  </th>
                </tr>
                {FEATURES.filter((f) => f.tier === tier).map((feature) => (
                  <tr key={feature.key} className="border-t border-line/60">
                    <th scope="row" className="py-3 pl-3 pr-1 text-left font-normal leading-snug sm:px-4">
                      {feature.label}
                    </th>
                    {PLANS.map((plan) => {
                      const on = matrix[plan][feature.key];
                      const changed = on !== defaultEnabled(plan, feature);
                      return (
                        <td key={plan} className="px-1 py-2 text-center sm:px-2">
                          <div className="relative inline-flex">
                            <Switch.Root
                              checked={on}
                              disabled={saving === `${plan}:${feature.key}`}
                              onCheckedChange={(v) => toggle(plan, feature.key, v)}
                              aria-label={`${feature.label} no plano ${PLAN_LABEL[plan]}`}
                              className="relative h-6 w-10 rounded-full border sm:h-7 sm:w-12 border-line bg-bg transition-colors data-[state=checked]:border-primary/60 data-[state=checked]:bg-primary/80 disabled:opacity-60"
                            >
                              <Switch.Thumb className="block size-4 translate-x-1 rounded-full bg-muted shadow transition-transform data-[state=checked]:translate-x-4.5 data-[state=checked]:bg-white sm:size-5 sm:data-[state=checked]:translate-x-6" />
                            </Switch.Root>
                            {changed && (
                              <span
                                className="absolute -right-1.5 -top-1 size-2 rounded-full bg-amber-300"
                                title="Diferente da predefinição do plano"
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <span className="size-2 rounded-full bg-amber-300" aria-hidden /> Diferente da predefinição (cada plano inclui tudo o dos planos
        abaixo).
      </p>
    </AdminShell>
  );
}
