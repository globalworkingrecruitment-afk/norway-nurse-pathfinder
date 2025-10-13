import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, ArrowRight, Sparkles, Info, ArrowLeft } from "lucide-react";
import redGWLogo from "@/assets/redgw-logo.png";

const financingGratuityScenarios = [
  {
    key: "between5And12",
    label: "Trabajando como enfermera entre 5 y 12 meses en la RedGW",
  },
  {
    key: "between13And24",
    label: "Trabajando como enfermera entre 13 y 24 meses en la RedGW",
  },
  {
    key: "between25And30",
    label: "Trabajando como enfermera entre 25 y 30 meses en la RedGW",
  },
  {
    key: "moreThan30",
    label: "Trabajando como enfermera más de 30 meses en la RedGW",
  },
] as const;

type FinancingScenarioKey =
  (typeof financingGratuityScenarios)[number]["key"];

interface FinancingGratuityRow {
  label: string;
  values: Record<FinancingScenarioKey, string>;
}

interface EmailSubmissionFormProps {
  selectedPlan: {
    id: string;
    title: string;
    variantName?: string;
    monthlyPayment: string;
    amortization: string;
    totalInvestment?: number;
    notes?: string;
    paymentMethod?: string;
    numberOfInstallments?: number;
  };
  onBack: () => void;
}

export const EmailSubmissionForm = ({ selectedPlan, onBack }: EmailSubmissionFormProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isFinancingPlan = selectedPlan.id === "financiacion-total";

  const financingGratuityRows: FinancingGratuityRow[] = isFinancingPlan
    ? [
        {
          label: "Descuento del que te beneficias por trabajar en la RedGW",
          values: {
            between5And12: "0€",
            between13And24: "2.300€",
            between25And30: "3.000€",
            moreThan30: "5.300€",
          },
        },
        {
          label:
            "% de descuento que recibes por trabajar en la RedGW como enfermera",
          values: {
            between5And12: "0%",
            between13And24: "28,30%",
            between25And30: "56,60%",
            moreThan30: "100%",
          },
        },
      ]
    : [];

  const parseCurrency = (value: string) => {
    const match = value.match(/[\d.,]+/);
    if (!match) return 0;
    const normalized = match[0].replace(/\./g, "").replace(",", ".");
    const result = parseFloat(normalized);
    return Number.isNaN(result) ? 0 : result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const totalPrice = selectedPlan.totalInvestment ?? 0;
      const monthlyPayment = parseCurrency(selectedPlan.monthlyPayment);

      // Extraer meses de amortización (compromiso laboral)
      const amortizationMonths = parseInt(selectedPlan.amortization.match(/\d+/)?.[0] || "0");

      const planTitle = selectedPlan.variantName
        ? `${selectedPlan.title} - ${selectedPlan.variantName}`
        : selectedPlan.title;

      // Guardar en la base de datos
      const { error } = await supabase.from("registrations").insert({
        name,
        email,
        plan_id: selectedPlan.id,
        plan_title: planTitle,
        total_price: totalPrice,
        monthly_payment: monthlyPayment,
        amortization_months: amortizationMonths,
        payment_method: selectedPlan.paymentMethod || "N/A",
        number_of_installments: selectedPlan.numberOfInstallments || 0,
      });

      if (error) throw error;

      toast({
        title: "¡Solicitud enviada!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      
      setEmail("");
      setName("");
      onBack();
    } catch (error) {
      console.error("Error saving registration:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="gap-2 border-2 hover:bg-primary hover:text-primary-foreground font-semibold"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a ver todos los planes
        </Button>
      </div>

      <Card className="overflow-hidden border-2 shadow-[var(--shadow-elegant)]">
        <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <CardTitle className="text-3xl">Confirma tu selección</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/90 text-lg">
            Has seleccionado: <span className="font-bold text-white">{selectedPlan.title}</span>
            {selectedPlan.variantName && (
              <span className="block text-base text-primary-foreground/80">
                Modalidad: {selectedPlan.variantName}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Two Column Section - Plan Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Plan Details & ROI */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  Detalles del Plan
                </h3>
                <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pago mensual</span>
                    <span className="text-lg font-semibold text-accent">{selectedPlan.monthlyPayment}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> Compromiso en la RedGW
                    </span>
                    <span className="font-semibold">{selectedPlan.amortization}</span>
                  </div>
                  {selectedPlan.totalInvestment !== undefined && selectedPlan.totalInvestment > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Inversión directa estimada</span>
                      <span className="text-lg font-bold text-foreground">
                        {selectedPlan.totalInvestment.toLocaleString("es-ES")}€
                      </span>
                    </div>
                  )}
                  {selectedPlan.paymentMethod && selectedPlan.paymentMethod !== "N/A" && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Método de pago</span>
                      <span className="font-semibold text-primary">{selectedPlan.paymentMethod}</span>
                    </div>
                  )}
                  {selectedPlan.numberOfInstallments && selectedPlan.numberOfInstallments > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nº de mensualidades</span>
                      <span className="font-semibold text-accent">{selectedPlan.numberOfInstallments}</span>
                    </div>
                  )}
                  {selectedPlan.notes && (
                    <p className="text-sm text-muted-foreground">{selectedPlan.notes}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Retorno de Inversión (ROI)
                </h3>
                <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                  {selectedPlan.totalInvestment && selectedPlan.totalInvestment > 0 ? (
                    <div className="space-y-4 rounded-lg border-2 border-green-500/40 bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6">
                      <div className="space-y-3 text-center">
                        <p className="text-sm font-medium text-foreground">
                          💰 Recuperación de tu inversión de {selectedPlan.totalInvestment.toLocaleString("es-ES")}€
                        </p>
                        <div className="space-y-2">
                          <div className="rounded-lg bg-white/50 p-4 dark:bg-black/30">
                            <p className="mb-1 text-xs text-muted-foreground">Trabajando en Noruega necesitas:</p>
                            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                              ~{Math.ceil((selectedPlan.totalInvestment || 0) / 161)} días
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              de trabajo para recuperar tu inversión completa
                            </p>
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            ¡En menos de {((Math.ceil((selectedPlan.totalInvestment || 0) / 161)) / 22).toFixed(1)} meses habrás recuperado el 100% de tu inversión!
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-5">
                      <p className="text-sm font-semibold text-foreground">
                        Este plan no requiere una inversión inicial cerrada. Tu compromiso principal es:
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>📅 {selectedPlan.amortization}</li>
                        <li>💶 {selectedPlan.monthlyPayment}</li>
                        {selectedPlan.notes && <li>📝 {selectedPlan.notes}</li>}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">📊 Desglose salarial en Noruega:</p>
                    <div className="space-y-2 rounded-lg bg-white/50 p-4 dark:bg-black/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Salario bruto anual:</span>
                        <span className="text-sm font-semibold text-foreground">~51.282€</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Salario neto anual:</span>
                        <span className="text-sm font-semibold text-foreground">~36.923€</span>
                      </div>
                      <div className="mt-2 border-t pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Salario neto mensual:</span>
                          <span className="text-sm font-semibold text-foreground">~3.077€</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Estos cálculos están basados en la media salarial de enfermería en Noruega.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Disclaimer */}
              <div className="bg-amber-500/10 border-2 border-amber-500/30 p-3 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-start gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>IMPORTANTE:</strong> Cifras aproximadas que varían según número de horas trabajadas, 
                    turnos extra, gastos personales y situación fiscal individual.
                  </span>
                </p>
              </div>
            </div>

            {/* Right Column - Amortization & Next Steps */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  ¿Qué es la Amortización?
                </h3>
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    La <span className="font-semibold text-primary">amortización</span> es el <span className="font-semibold">tiempo comprometido 
                    que trabajarás en Noruega</span> dentro de la <span className="font-semibold text-primary">RedGW</span>, nuestra red de 
                    centros públicos finales y agencias privadas intermediarias.
                  </p>
                  
                  <div className="flex justify-center py-3">
                    <img src={redGWLogo} alt="Red GW" className="h-16 object-contain opacity-80" />
                  </div>

                  <div className="bg-accent/10 p-3 rounded-md border border-accent/20">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-accent">En este plan:</span> Te comprometes a trabajar como enfermera 
                      en Noruega durante <span className="font-semibold text-accent">{selectedPlan.amortization}</span> dentro 
                      de nuestra red de empleadores, garantizando estabilidad laboral y desarrollo profesional continuo. 🏥
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-accent" />
                  Próximos Pasos
                </h3>
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg border">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1.</span>
                      <span>Entrevista de selección final</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">2.</span>
                      <span>Evaluación de tu perfil personal y profesional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3.</span>
                      <span>Respuesta definitiva</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">4.</span>
                      <span>Acceso a la plataforma de Global Working</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">5.</span>
                      <span>Sesión de Presentación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">6.</span>
                      <span>Inicio del Programa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">7.</span>
                      <span>Contacto y presentación a empleadores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">8.</span>
                      <span>Viaje a Noruega</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">9.</span>
                      <span>Inicio de tu aventura en el país nórdico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">10.</span>
                      <span>Desarrollo profesional como enfermera</span>
                    </li>
                  </ul>
                  
                  <div className="pt-3 mt-3 border-t">
                    <p className="text-xs text-center text-muted-foreground italic">
                      Te acompañamos en cada paso del camino hacia tu nueva vida profesional en Noruega 🇳🇴
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {isFinancingPlan && (
        <div className="mt-8 space-y-4 rounded-xl border bg-muted/40 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Gratuidad de los servicios de Global Working
              </h3>
              <p className="text-sm text-muted-foreground">
                Descubre cómo evoluciona el coste del programa en función de tu
                permanencia en la Red Global Working.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <span>Precio del programa</span>
              <span className="text-lg">5.300€</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th
                    scope="col"
                    className="sr-only px-4 py-3 font-semibold text-muted-foreground"
                  >
                    Concepto
                  </th>
                  {financingGratuityScenarios.map((scenario) => (
                    <th
                      key={scenario.key}
                      scope="col"
                      className="px-4 py-3 font-semibold text-muted-foreground"
                    >
                      {scenario.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financingGratuityRows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="bg-muted/40 px-4 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {row.label}
                    </th>
                    {financingGratuityScenarios.map((scenario) => (
                      <td
                        key={`${row.label}-${scenario.key}`}
                        className="px-4 py-4 text-sm text-muted-foreground"
                      >
                        {row.values[scenario.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border bg-muted/40 p-6">
        <h3 className="text-lg font-semibold mb-4">Tus Datos de Contacto</h3>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre completo *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-6">
              <p className="text-xs text-muted-foreground">
                Al enviar este formulario, aceptas que GlobalWorking se ponga en contacto contigo
                para ofrecerte información sobre el programa seleccionado.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 transition-all duration-200 hover:scale-[1.02]"
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg"
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
