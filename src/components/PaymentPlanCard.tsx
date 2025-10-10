import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PaymentPlanCardProps {
  title: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}

export const PaymentPlanCard = ({
  title,
  features,
  recommended = false,
  onSelect,
}: PaymentPlanCardProps) => {
  return (
    <Card 
      className={`relative transition-all hover:shadow-lg ${
        recommended ? 'border-accent border-2 shadow-md' : ''
      }`}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Más Popular
        </div>
      )}
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
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

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Habla con nuestro equipo para conocer las condiciones económicas de este plan.
          </p>
        </div>
        
        <Button 
          onClick={onSelect}
          className="w-full"
          variant={recommended ? "default" : "outline"}
        >
          Seleccionar Plan
        </Button>
      </CardContent>
    </Card>
  );
};
