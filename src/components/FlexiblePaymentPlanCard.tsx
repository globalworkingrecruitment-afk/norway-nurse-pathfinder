import { useState } from "react";
import { Sparkles } from "lucide-react";

import { ProgramServicesList } from "@/components/ProgramServicesList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface SharedInvestmentOption {
  key: string;
  name: string;
  amortization: number;
  monthlyPayment: number;
  description: string;
  totalInvestment?: number;
}

export type AuroraHighlightVariant = "softBlue" | "softOrange" | "accentGlow" | "spotlight";

interface FlexiblePaymentPlanCardProps {
  onSelect?: (plan: SharedInvestmentOption) => void;
  highlightVariant?: AuroraHighlightVariant;
  displayMode?: "full" | "preview";
  className?: string;
  showPopularityBadge?: boolean;
}

const subPlans: SharedInvestmentOption[] = [
  {
    key: "aurora",
    name: "Modalidad Aurora",
    amortization: 18,
    monthlyPayment: 125,
    description: "Equilibrio entre cuota reducida y rápida amortización en la RedGW.",
    totalInvestment: 3750,
  },
  {
    key: "fiordo",
    name: "Modalidad Fiordo",
    amortization: 22,
    monthlyPayment: 375,
    description: "Mayor tiempo de amortización con una cuota mensual intermedia.",
    totalInvestment: 1500,
  },
  {
    key: "vikinga",
    name: "Modalidad Vikinga",
    amortization: 18,
    monthlyPayment: 625,
    description: "Impulso intensivo para completar la amortización con rapidez.",
    totalInvestment: 2500,
  },
];

const highlightConfigs: Record<
  AuroraHighlightVariant,
  {
    container: string;
    badge: string;
    badgeText: string;
    name: string;
    payment: string;
    description: string;
    radio: string;
  }
> = {
  softBlue: {
    container:
      "border-sky-200/80 bg-sky-50/70 shadow-[0_18px_45px_-28px_rgba(14,116,144,0.75)]",
    badge: "bg-sky-500/15 text-sky-700 border border-sky-200/70",
    badgeText: "Modalidad favorita",
    name: "text-sky-800",
    payment: "text-sky-700",
    description: "text-sky-700/80",
    radio:
      "border-sky-400 text-sky-600 data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white",
  },
  softOrange: {
    container:
      "border-amber-300 bg-amber-50/90 shadow-[0_24px_60px_-32px_rgba(217,119,6,0.65)]",
    badge: "bg-amber-500/20 text-amber-700 border border-amber-300/70",
    badgeText: "Opción preferida",
    name: "text-amber-800",
    payment: "text-amber-700",
    description: "text-amber-700/80",
    radio:
      "border-amber-400 text-amber-600 data-[state=checked]:border-amber-500 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white",
  },
  accentGlow: {
    container:
      "border-primary/70 bg-primary/10 shadow-[0_25px_60px_-35px_rgba(59,130,246,0.95)] ring-1 ring-primary/15",
    badge: "bg-primary text-primary-foreground shadow-sm shadow-primary/30",
    badgeText: "Selección destacada",
    name: "text-primary",
    payment: "text-primary",
    description: "text-primary/80",
    radio:
      "border-primary text-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  },
  spotlight: {
    container:
      "border-transparent bg-gradient-to-r from-sky-50 via-white to-primary/15 shadow-lg shadow-sky-200/60 ring-2 ring-sky-100",
    badge: "bg-white/80 text-primary font-semibold shadow-sm",
    badgeText: "Favorita del equipo",
    name: "text-primary",
    payment: "text-primary",
    description: "text-slate-600",
    radio:
      "border-primary/60 text-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
  },
};

export const FlexiblePaymentPlanCard = ({
  onSelect,
  highlightVariant = "softOrange",
  displayMode = "full",
  className,
  showPopularityBadge = true,
}: FlexiblePaymentPlanCardProps) => {
  const isPreview = displayMode === "preview";
  const [selectedSubPlan, setSelectedSubPlan] = useState<SharedInvestmentOption | null>(null);

  const handleConfirm = () => {
    if (isPreview || !selectedSubPlan || !onSelect) return;
    onSelect(selectedSubPlan);
  };

  return (
    <Card className={cn("relative flex h-full flex-col border-accent border-2 shadow-md", className)}>
      {showPopularityBadge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-accent-foreground">
          Más Popular
        </div>
      )}
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Inversión Compartida</CardTitle>
        <ProgramServicesList className="mx-auto max-w-xs text-left" />
        <p className="text-sm text-muted-foreground">Tres modalidades con la misma formación</p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4">
          <div>
            <p className="mb-3 text-sm font-semibold">Selecciona la modalidad de inversión:</p>
            <RadioGroup
              value={isPreview ? "aurora" : selectedSubPlan?.key ?? ""}
              onValueChange={(value) => {
                if (isPreview) return;
                const plan = subPlans.find((p) => p.key === value) ?? null;
                setSelectedSubPlan(plan);
              }}
            >
              {subPlans.map((plan) => {
                const highlight = plan.key === "aurora" ? highlightConfigs[highlightVariant] : null;

                return (
                  <div
                    key={plan.key}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 transition hover:border-accent",
                      highlight?.container,
                    )}
                  >
                    <RadioGroupItem
                      value={plan.key}
                      id={`plan-${plan.key}`}
                      className={cn("mt-1", highlight?.radio, isPreview && "pointer-events-none opacity-80")}
                      disabled={isPreview}
                    />
                    <Label htmlFor={`plan-${plan.key}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("font-semibold text-foreground", highlight?.name)}>{plan.name}</span>
                        <span className={cn("text-sm font-semibold text-accent", highlight?.payment)}>
                          {plan.monthlyPayment.toLocaleString("es-ES")}€ al mes
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-primary">{plan.amortization} meses en la RedGW</span>
                        <span className={cn(highlight?.description)}>{plan.description}</span>
                      </div>
                      {highlight && (
                        <span
                          className={cn(
                            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                            highlight.badge,
                          )}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {highlight.badgeText}
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {!isPreview && selectedSubPlan && (
            <div className="animate-fade-in space-y-2 rounded-lg border border-accent/30 bg-accent/10 p-4">
              <p className="text-sm font-semibold text-foreground">Tu modalidad elegida</p>
              <p className="text-xs text-muted-foreground">{selectedSubPlan.description}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="font-semibold text-primary">
                  {selectedSubPlan.amortization} meses en la RedGW
                </span>
                <span className="font-semibold text-accent">
                  {selectedSubPlan.monthlyPayment.toLocaleString("es-ES")}€ al mes
                </span>
              </div>
            </div>
          )}
        </div>

        {!isPreview && (
          <Button onClick={handleConfirm} className="mt-6 w-full" disabled={!selectedSubPlan}>
            Seleccionar Modalidad
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
