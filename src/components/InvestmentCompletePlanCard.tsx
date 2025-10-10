import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Building2, Crown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface InvestmentCompletePlanCardProps {
  features: string[];
  onSelect: (paymentMethod: string, installments: number) => void;
}

export const InvestmentCompletePlanCard = ({
  features,
  onSelect,
}: InvestmentCompletePlanCardProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "financing">("direct");
  const [financingInstallments, setFinancingInstallments] = useState<number>(12);

  const handleConfirm = () => {
    const installments = paymentMethod === "direct" ? 1 : financingInstallments;
    const paymentMethodLabel = paymentMethod === "direct" ? "Pago directo a GW" : "Con financiación";

    onSelect(paymentMethodLabel, installments);
  };

  return (
    <Card className="relative border-primary border-2 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
        <Crown className="w-4 h-4" />
        Premium
      </div>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Inversión Completa</CardTitle>
        <p className="text-sm text-muted-foreground">Sin compromiso de permanencia</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="pt-2 border-t border-border space-y-4">
          {/* Investment Amount (Fixed) */}
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20 space-y-1">
            <p className="text-sm font-semibold">Inversión Personalizada</p>
            <p className="text-xs text-muted-foreground">
              Nuestro equipo te detallará la inversión necesaria y condiciones económicas durante la asesoría.
            </p>
            <p className="text-xs text-muted-foreground">🎯 Amortización: 0 meses (sin compromiso)</p>
          </div>

          {/* Step 1: Payment Method */}
          <div>
            <p className="text-sm font-semibold mb-3">1. Método de pago:</p>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value: "direct" | "financing") => setPaymentMethod(value)}
            >
              <div className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                <RadioGroupItem value="direct" id="complete-direct" />
                <Label htmlFor="complete-direct" className="cursor-pointer flex-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Pago directo a GW</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                <RadioGroupItem value="financing" id="complete-financing" />
                <Label htmlFor="complete-financing" className="cursor-pointer flex-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span>Con financiación</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Step 2: Installments (only for financing) */}
          {paymentMethod === "financing" && (
            <div className="animate-fade-in space-y-3">
              <p className="text-sm font-semibold">2. Número de pagos (2-37):</p>
              <div className="px-2">
                <Slider
                  value={[financingInstallments]}
                  onValueChange={(value) => setFinancingInstallments(value[0])}
                  min={2}
                  max={37}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2 pagos</span>
                  <span className="font-semibold text-primary">{financingInstallments} pagos</span>
                  <span>37 pagos</span>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Summary */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold mb-2">Tu selección:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>📅 Amortización: <span className="font-semibold text-foreground">0 meses (sin compromiso)</span></li>
              <li>💳 Método: <span className="font-semibold text-foreground">{paymentMethod === "direct" ? "Pago directo a GW" : "Con financiación"}</span></li>
              <li>🔢 Pagos: <span className="font-semibold text-foreground">{paymentMethod === "direct" ? 1 : financingInstallments}</span></li>
            </ul>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            Seleccionar Plan Premium
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};