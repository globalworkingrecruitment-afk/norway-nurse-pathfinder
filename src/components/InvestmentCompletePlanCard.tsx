import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown, PiggyBank, Sparkles } from "lucide-react";

interface InvestmentCompletePlanCardProps {
  features: string[];
  onSelect: () => void;
}

export const InvestmentCompletePlanCard = ({
  features,
  onSelect,
}: InvestmentCompletePlanCardProps) => {
  return (
    <Card className="relative border-primary border-2 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
        <Crown className="h-4 w-4" />
        Premium
      </div>
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Inversión Completa</CardTitle>
        <p className="text-sm text-muted-foreground">Accede a todo sin compromiso de permanencia</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-start gap-2">
            <PiggyBank className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pago mensual fijo</p>
              <p className="text-lg font-semibold text-foreground">1.325€ al mes</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
            <p className="text-sm text-muted-foreground">
              Disfruta de la formación completa y el acompañamiento profesional sin necesidad de trabajar en la RedGW para amortizar la inversión.
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button onClick={onSelect} className="w-full bg-gradient-to-r from-primary to-accent font-semibold text-primary-foreground hover:opacity-90">
          Seleccionar Inversión Completa
        </Button>
      </CardContent>
    </Card>
  );
};