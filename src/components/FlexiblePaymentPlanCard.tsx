import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface SharedInvestmentOption {
  key: string;
  name: string;
  amortization: number;
  monthlyPayment: number;
  description: string;
}

interface FlexiblePaymentPlanCardProps {
  features: string[];
  onSelect: (plan: SharedInvestmentOption) => void;
}

const subPlans: SharedInvestmentOption[] = [
  {
    key: "aurora",
    name: "Modalidad Aurora",
    amortization: 16,
    monthlyPayment: 125,
    description: "Equilibrio entre cuota reducida y rápida amortización en la RedGW.",
  },
  {
    key: "fiordo",
    name: "Modalidad Fiordo",
    amortization: 22,
    monthlyPayment: 375,
    description: "Mayor tiempo de amortización con una cuota mensual intermedia.",
  },
  {
    key: "vikinga",
    name: "Modalidad Vikinga",
    amortization: 18,
    monthlyPayment: 625,
    description: "Impulso intensivo para completar la amortización con rapidez.",
  },
];

export const FlexiblePaymentPlanCard = ({
  features,
  onSelect,
}: FlexiblePaymentPlanCardProps) => {
  const [selectedSubPlan, setSelectedSubPlan] = useState<SharedInvestmentOption | null>(null);

  const handleConfirm = () => {
    if (!selectedSubPlan) return;
    onSelect(selectedSubPlan);
  };

  return (
    <Card className="relative border-accent border-2 shadow-md">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
        Más Popular
      </div>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Inversión Compartida</CardTitle>
        <p className="text-sm text-muted-foreground">Tres modalidades con la misma formación</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-4 border-t border-border pt-3">
          <div>
            <p className="mb-3 text-sm font-semibold">Selecciona la modalidad de inversión:</p>
            <RadioGroup
              value={selectedSubPlan?.key ?? ""}
              onValueChange={(value) => {
                const plan = subPlans.find((p) => p.key === value) ?? null;
                setSelectedSubPlan(plan);
              }}
            >
              {subPlans.map((plan) => (
                <div key={plan.key} className="flex items-start gap-3 rounded-lg border p-3 transition hover:border-accent">
                  <RadioGroupItem value={plan.key} id={`plan-${plan.key}`} />
                  <Label htmlFor={`plan-${plan.key}`} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-foreground">{plan.name}</span>
                      <span className="text-sm font-semibold text-accent">
                        {plan.monthlyPayment.toLocaleString("es-ES")}€ al mes
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">{plan.amortization} meses en la RedGW</span>
                      <span>{plan.description}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {selectedSubPlan && (
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

          <Button onClick={handleConfirm} className="w-full" disabled={!selectedSubPlan}>
            Seleccionar Modalidad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};