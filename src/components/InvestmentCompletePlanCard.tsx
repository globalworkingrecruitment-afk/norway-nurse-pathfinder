import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, PiggyBank, Sparkles, BadgeCheck, Globe2 } from "lucide-react";
import { ProgramServicesList } from "@/components/ProgramServicesList";

interface InvestmentCompletePlanCardProps {
  onSelect?: () => void;
  disableActions?: boolean;
}

export const InvestmentCompletePlanCard = ({
  onSelect = () => {},
  disableActions = false,
}: InvestmentCompletePlanCardProps) => {
  return (
    <Card className="relative flex h-full flex-col border-primary border-2 bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
        <Crown className="h-4 w-4" />
        Premium
      </div>
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">Inversión Completa</CardTitle>
        <ProgramServicesList className="mx-auto max-w-xs text-left" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4">
          <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/10 p-4">
            <div className="flex items-start gap-2">
              <PiggyBank className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pago mensual fijo</p>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <p className="text-lg font-semibold text-foreground">1.325€/mes</p>
                  <p className="text-sm font-medium text-muted-foreground">
                    en los 4 primeros meses del Programa
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
              <p className="text-sm text-muted-foreground">
                Disfruta de la formación completa y el acompañamiento profesional sin necesidad de trabajar en la RedGW para amortizar la inversión.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-primary/20 bg-background/60 p-4 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Ideal si buscas</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Total flexibilidad</p>
                  <p className="text-sm text-muted-foreground">
                    Organiza tu llegada a Noruega con libertad absoluta, sin compromisos de permanencia ni amortización.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Globe2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Apoyo a medida</p>
                  <p className="text-sm text-muted-foreground">
                    Aprovecha el acompañamiento personalizado del equipo Global Working antes, durante y después de tu traslado.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {!disableActions && (
          <Button
            onClick={onSelect}
            className="mt-6 w-full bg-gradient-to-r from-primary to-accent font-semibold text-primary-foreground hover:opacity-90"
          >
            Seleccionar Inversión Completa
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
