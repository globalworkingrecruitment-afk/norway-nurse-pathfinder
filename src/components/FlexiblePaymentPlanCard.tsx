import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Building2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SubPlan {
  price: number;
  amortization: number;
  label: string;
  description: string;
}

interface FlexiblePaymentPlanCardProps {
  features: string[];
  onSelect: (price: number, amortization: number, paymentMethod: string, installments: number) => void;
}

const subPlans: SubPlan[] = [
  { price: 1500, amortization: 22, label: "Plan A", description: "Amortización estimada en 22 meses" },
  { price: 2500, amortization: 18, label: "Plan B", description: "Amortización estimada en 18 meses" },
  { price: 3500, amortization: 12, label: "Plan C", description: "Amortización estimada en 12 meses" },
];

export const FlexiblePaymentPlanCard = ({
  features,
  onSelect,
}: FlexiblePaymentPlanCardProps) => {
  const [selectedSubPlan, setSelectedSubPlan] = useState<SubPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "financing">("direct");
  const [directInstallments, setDirectInstallments] = useState<1 | 3>(1);
  const [financingInstallments, setFinancingInstallments] = useState<number>(6);

  const handleConfirm = () => {
    if (!selectedSubPlan) return;

    const installments = paymentMethod === "direct" ? directInstallments : financingInstallments;
    const paymentMethodLabel = paymentMethod === "direct" ? "Pago directo a GW" : "Con financiación";
    
    onSelect(selectedSubPlan.price, selectedSubPlan.amortization, paymentMethodLabel, installments);
  };

  return (
    <Card className="relative border-accent border-2 shadow-md">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
        Más Popular
      </div>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Inversión Compartida</CardTitle>
        <p className="text-sm text-muted-foreground">Elige tu inversión y método de pago</p>
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

        <div className="pt-2 border-t border-border space-y-4">
          {/* Step 1: Select Investment Amount */}
          <div>
            <p className="text-sm font-semibold mb-3">1. Elige tu inversión:</p>
            <RadioGroup
              value={selectedSubPlan?.price.toString()}
              onValueChange={(value) => {
                const plan = subPlans.find(p => p.price === parseInt(value));
                setSelectedSubPlan(plan || null);
              }}
            >
              {subPlans.map((plan) => (
                <div key={plan.price} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                  <RadioGroupItem value={plan.price.toString()} id={`plan-${plan.price}`} />
                  <Label htmlFor={`plan-${plan.price}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{plan.label}</span>
                    <span className="block text-xs text-muted-foreground">{plan.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Step 2: Payment Method (only if plan selected) */}
          {selectedSubPlan && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold mb-3">2. Método de pago:</p>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "direct" | "financing") => setPaymentMethod(value)}
              >
                <div className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                  <RadioGroupItem value="direct" id="payment-direct" />
                  <Label htmlFor="payment-direct" className="cursor-pointer flex-1 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Pago directo a GW</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded border hover:bg-muted/50">
                  <RadioGroupItem value="financing" id="payment-financing" />
                  <Label htmlFor="payment-financing" className="cursor-pointer flex-1 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    <span>Con financiación</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Installments Selection */}
          {selectedSubPlan && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold mb-3">3. Número de mensualidades:</p>
              
              {paymentMethod === "direct" ? (
                <RadioGroup
                  value={directInstallments.toString()}
                  onValueChange={(value) => setDirectInstallments(parseInt(value) as 1 | 3)}
                >
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <RadioGroupItem value="1" id="direct-1" />
                    <Label htmlFor="direct-1" className="cursor-pointer flex-1">
                      1 pago único
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50">
                    <RadioGroupItem value="3" id="direct-3" />
                    <Label htmlFor="direct-3" className="cursor-pointer flex-1">
                      3 mensualidades
                    </Label>
                  </div>
                </RadioGroup>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="financing-installments" className="text-sm">
                    Elige el número de mensualidades que prefieras:
                  </Label>
                  <Input
                    id="financing-installments"
                    type="number"
                    min="1"
                    value={financingInstallments}
                    onChange={(e) => setFinancingInstallments(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Confirmation Summary */}
          {selectedSubPlan && (
            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20 animate-fade-in">
              <p className="text-sm font-semibold mb-2">Tu selección:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>📅 Amortización: <span className="font-semibold text-foreground">{selectedSubPlan.amortization} meses</span></li>
                <li>💳 Método: <span className="font-semibold text-foreground">{paymentMethod === "direct" ? "Pago directo a GW" : "Con financiación"}</span></li>
                <li>🔢 Mensualidades: <span className="font-semibold text-foreground">{paymentMethod === "direct" ? directInstallments : financingInstallments}</span></li>
              </ul>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            className="w-full"
            disabled={!selectedSubPlan}
          >
            Seleccionar Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};