import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgramServicesList } from "@/components/ProgramServicesList";
import { Calendar, PiggyBank } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PlanHighlight {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface PaymentPlanCardProps {
  title: string;
  monthlyPayment?: string;
  amortization?: string;
  note?: string;
  recommended?: boolean;
  highlights?: PlanHighlight[];
  onSelect?: () => void;
  disableActions?: boolean;
}

export const PaymentPlanCard = ({
  title,
  monthlyPayment,
  amortization,
  note,
  recommended = false,
  highlights,
  onSelect = () => {},
  disableActions = false,
}: PaymentPlanCardProps) => {
  return (
    <Card
      className={`relative flex h-full flex-col transition-all hover:shadow-lg ${
        recommended ? "border-accent border-2 shadow-md" : ""
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Más Popular
        </div>
      )}
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        <ProgramServicesList className="mx-auto max-w-xs text-left" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4">
          {(monthlyPayment || amortization || note) && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
              {monthlyPayment && (
                <div className="flex items-start gap-2">
                  <PiggyBank className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Pago mensual
                    </p>
                    <p className="text-base font-semibold text-foreground">{monthlyPayment}</p>
                  </div>
                </div>
              )}
              {amortization && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Compromiso en la RedGW
                    </p>
                    <p className="text-base font-semibold text-foreground">{amortization}</p>
                  </div>
                </div>
              )}
              {note && (
                <p className="text-sm text-muted-foreground">{note}</p>
              )}
            </div>
          )}
          {highlights?.length ? (
            <div className="space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">Ventajas destacadas</p>
              <ul className="space-y-3">
                {highlights.map(({ icon: Icon, title: highlightTitle, description }) => (
                  <li key={highlightTitle} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{highlightTitle}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {!disableActions && (
          <Button
            onClick={onSelect}
            className="mt-6 w-full"
            variant={recommended ? "default" : "outline"}
          >
            Seleccionar Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
