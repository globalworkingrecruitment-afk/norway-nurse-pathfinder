import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, ArrowRight, Sparkles, Info, ArrowLeft } from "lucide-react";
import redGWLogo from "@/assets/redgw-logo.png";
import amandaPhoto from "@/assets/amanda-casado.jpg";
import { cn } from "@/lib/utils";

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
  const isFiordoPlan = selectedPlan.id === "inversion-compartida-fiordo";
  const isAuroraPlan = selectedPlan.id === "inversion-compartida-aurora";
  const isVikingPlan = selectedPlan.id === "inversion-compartida-vikinga";

  const contactSectionTitle = isFiordoPlan
    ? "Da el paso a la Modalidad Fiordo"
    : isAuroraPlan
      ? "Activa tu camino con la Modalidad Aurora"
      : isVikingPlan
        ? "Impulsa tu candidatura con la Modalidad Vikinga"
        : isFinancingPlan
          ? "Activa tu camino con el Modelo de Amortización Total"
          : undefined;
  const contactSectionDescription = isFiordoPlan
    ? "Déjanos tus datos para confirmar que la Modalidad Fiordo es la opción que te interesa y te guiaremos para que puedas aprovecharla al máximo, resolviendo todas tus dudas."
    : isAuroraPlan
      ? "Déjanos tus datos para confirmar que la Modalidad Aurora es la opción que te interesa y te guiaremos para que puedas aprovecharla al máximo, resolviendo todas tus dudas."
      : isVikingPlan
        ? "Déjanos tus datos para confirmar que la Modalidad Vikinga es la opción que te interesa y te guiaremos para que puedas aprovecharla al máximo, resolviendo todas tus dudas."
        : isFinancingPlan
          ? "Déjanos tus datos y te guiaremos para que puedas aprovechar al máximo esta modalidad y resolveremos todas tus dudas."
          : undefined;

  const shouldShowAmandaContact =
    isAuroraPlan || isFiordoPlan || isVikingPlan || isFinancingPlan;
  const shouldUsePremiumFormStyle = isFiordoPlan;

  const netMonthlySalary = 3077;
  const workingDaysPerMonth = 20;
  const netDailySalary = netMonthlySalary / workingDaysPerMonth;
  const daysToRecoverInvestment = selectedPlan.totalInvestment
    ? Math.ceil((selectedPlan.totalInvestment || 0) / netDailySalary)
    : null;
  const monthsToRecoverInvestment = daysToRecoverInvestment
    ? (daysToRecoverInvestment / workingDaysPerMonth).toFixed(1)
    : null;

  const formatCurrency = (
    value: number,
    options: Intl.NumberFormatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  ) => value.toLocaleString("es-ES", { useGrouping: true, ...options });

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

  const fiordoScenarios = [
    {
      key: "between5And12",
      label: "Trabajando como enfermera entre 5 y 12 meses en la RedGW",
    },
    {
      key: "between13And20",
      label: "Trabajando como enfermera entre 13 y 20 meses en la RedGW",
    },
    {
      key: "between21And22",
      label: "Trabajando como enfermera entre 21 y 22 meses en la RedGW",
    },
    {
      key: "moreThan22",
      label: "Trabajando como enfermera más de 22 meses en la RedGW",
    },
  ] as const;

  type FiordoScenarioKey = (typeof fiordoScenarios)[number]["key"];

  interface FiordoRow {
    label: string;
    values: Record<FiordoScenarioKey, string>;
  }

  const fiordoRows: FiordoRow[] = isFiordoPlan
    ? [
        {
          label: "Descuento del que te beneficias por trabajar en la RedGW",
          values: {
            between5And12: "0€",
            between13And20: "1.500€",
            between21And22: "3.000€",
            moreThan22: "No es necesario abonar ningún importe",
          },
        },
        {
          label:
            "% de descuento que recibes por trabajar en la RedGW como enfermera",
          values: {
            between5And12: "0,0%",
            between13And20: "39,47%",
            between21And22: "78,95%",
            moreThan22: "",
          },
        },
      ]
    : [];

  const vikingScenarios = [
    {
      key: "between5And12",
      label: "Trabajando como enfermera entre 5 y 12 meses en la RedGW",
    },
    {
      key: "between13And18",
      label: "Trabajando como enfermera entre 13 y 18 meses en la RedGW",
    },
    {
      key: "moreThan18",
      label: "Trabajando como enfermera más de 18 meses en la RedGW",
    },
  ] as const;

  type VikingScenarioKey = (typeof vikingScenarios)[number]["key"];

  interface VikingRow {
    label: string;
    values: Record<VikingScenarioKey, string>;
  }

  const vikingRows: VikingRow[] = isVikingPlan
    ? [
        {
          label: "Cantidad a abonar si se abandona la RedGW",
          values: {
            between5And12: "2.800€",
            between13And18: "1.300€",
            moreThan18: "0€",
          },
        },
        {
          label: "Descuento del que te beneficias por trabajar en la RedGW",
          values: {
            between5And12: "0€",
            between13And18: "1.500€",
            moreThan18: "2.800€",
          },
        },
        {
          label:
            "% de descuento que recibes por trabajar en la RedGW como enfermera",
          values: {
            between5And12: "0,00%",
            between13And18: "28,30%",
            moreThan18: "52,83%",
          },
        },
      ]
    : [];

  const auroraScenarios = [
    {
      key: "between5And12",
      label: "Trabajando como enfermera entre 5 y 12 meses en la RedGW",
    },
    {
      key: "between13And18",
      label: "Trabajando como enfermera entre 13 y 18 meses en la RedGW",
    },
    {
      key: "from19Onwards",
      label: "Trabajando como enfermera a partir del mes 19 en la RedGW",
    },
  ] as const;

  type AuroraScenarioKey = (typeof auroraScenarios)[number]["key"];

  interface AuroraRow {
    label: string;
    values: Record<AuroraScenarioKey, string>;
  }

  const auroraRows: AuroraRow[] = isAuroraPlan
    ? [
        {
          label: "Descuento del que te beneficias por trabajar en la RedGW",
          values: {
            between5And12: "0€",
            between13And18: "1.550€",
            from19Onwards: "No es necesario abonar ningún importe",
          },
        },
        {
          label:
            "% de descuento que recibes por trabajar en la RedGW como enfermera",
          values: {
            between5And12: "0%",
            between13And18: "29%",
            from19Onwards: "",
          },
        },
      ]
    : [];

  const fiordoMonthlyPaymentMessage =
    "375€/mes en los 4 primeros meses del Programa";

  const monthlyPaymentText =
    isFiordoPlan && !selectedPlan.monthlyPayment.includes("€/mes")
      ? fiordoMonthlyPaymentMessage
      : selectedPlan.monthlyPayment;

  const getMonthlyPaymentParts = (value: string) => {
    const slashMesMatch = value.match(/^(?<main>[^a-zA-Z]*€\/mes)(?<detail>.*)$/u);

    if (slashMesMatch?.groups) {
      const detail = slashMesMatch.groups.detail.trim();
      return {
        main: slashMesMatch.groups.main.trim(),
        detail: detail.length > 0 ? detail : null,
      };
    }

    if (value.includes("durante")) {
      const [mainPart, ...rest] = value.split("durante");
      const detail = rest.join("durante").trim();

      return {
        main: mainPart.trim(),
        detail: detail ? `durante ${detail}` : null,
      };
    }

    return { main: value, detail: null };
  };

  const { main: monthlyPaymentMain, detail: monthlyPaymentDetail } =
    getMonthlyPaymentParts(monthlyPaymentText);

  const renderMonthlyPayment = () => {
    if (monthlyPaymentDetail) {
      return (
        <span className="inline-flex flex-col items-end gap-0 whitespace-nowrap text-accent sm:flex-row sm:items-baseline sm:gap-2">
          <span className="text-lg font-semibold leading-none">{monthlyPaymentMain}</span>
          <span className="text-sm font-medium leading-none text-muted-foreground">
            {monthlyPaymentDetail}
          </span>
        </span>
      );
    }

    return (
      <span className="text-lg font-semibold text-accent">
        {monthlyPaymentMain}
      </span>
    );
  };

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
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">Pago mensual</span>
                    {renderMonthlyPayment()}
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
                        {formatCurrency(selectedPlan.totalInvestment)}€
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
                          💰 Recuperación de tu inversión de {formatCurrency(selectedPlan.totalInvestment)}€
                        </p>
                        <div className="space-y-3">
                          <div className="rounded-lg bg-white/50 p-4 dark:bg-black/30">
                            <p className="mb-1 text-xs text-muted-foreground">
                              Trabajando en Noruega como enfermero/a necesitas:
                            </p>
                            <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                              ~{daysToRecoverInvestment ?? 0} días
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              de trabajo para recuperar tu inversión completa
                            </p>
                          </div>
                          {monthsToRecoverInvestment && (
                            <div className="text-sm font-medium text-foreground">
                              ¡En menos de {monthsToRecoverInvestment} meses habrás recuperado el 100% de tu inversión!
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Esto equivale a un salario neto diario aproximado de {formatCurrency(netDailySalary, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}€ trabajando {workingDaysPerMonth} días al mes.
                          </p>
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
                        <li>💶 {monthlyPaymentText}</li>
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
                      <div className="mt-2 border-t pt-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Salario neto mensual:</span>
                          <span className="text-sm font-semibold text-accent">~{formatCurrency(netMonthlySalary)}€</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Salario neto diario aproximado:
                          </span>
                          <span className="text-sm font-semibold text-accent">
                            ~
                            {formatCurrency(netDailySalary, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            €
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
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
                      Te acompañamos en cada paso del camino hacia tu nueva vida profesional en Noruega
                      <img
                        src="/norway-flag.svg"
                        alt="Bandera de Noruega"
                        className="ml-1 inline h-4 w-auto align-middle"
                      />
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
                Programa de Formación y Desarrollo del Talento Global Working - Amortización Total
              </h3>
              <p className="text-sm text-muted-foreground">
                Descubre cómo evoluciona el coste del programa en función de tu
                permanencia en la Red Global Working.
              </p>
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

      {isFiordoPlan && (
        <div className="mt-8 space-y-4 rounded-xl border bg-muted/40 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Programa de Formación y Desarrollo del Talento Global Working - Modalidad Fiordo
              </h3>
              <p className="text-sm text-muted-foreground">
                Descubre cómo evoluciona tu inversión en función del tiempo que trabajes en la
                Red Global Working.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th scope="col" className="sr-only px-4 py-3 font-semibold text-muted-foreground">
                    Concepto
                  </th>
                  {fiordoScenarios.map((scenario) => (
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
                {fiordoRows.map((row, rowIndex) => (
                  <tr key={row.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="bg-muted/40 px-4 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {row.label}
                    </th>
                    {fiordoScenarios.map((scenario) => {
                      if (scenario.key === "moreThan22") {
                        if (rowIndex === 0) {
                          return (
                            <td
                              key={`${row.label}-${scenario.key}`}
                              rowSpan={fiordoRows.length}
                              className="px-4 py-4 text-center text-sm font-semibold text-foreground"
                            >
                              {row.values[scenario.key]}
                            </td>
                          );
                        }

                        return <Fragment key={`${row.label}-${scenario.key}`} />;
                      }

                      return (
                        <td
                          key={`${row.label}-${scenario.key}`}
                          className="px-4 py-4 text-sm text-muted-foreground"
                        >
                          {row.values[scenario.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isVikingPlan && (
        <div className="mt-8 space-y-4 rounded-xl border bg-muted/40 p-6">
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Programa de Formación y Desarrollo del Talento Global Working - Modalidad Vikinga
                </h3>
                <p className="text-sm text-muted-foreground">
                  Descubre cómo evoluciona tu inversión en función del tiempo que trabajes en la Red Global Working.
                </p>
              </div>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th scope="col" className="sr-only px-4 py-3 font-semibold text-muted-foreground">
                    Concepto
                  </th>
                  {vikingScenarios.map((scenario) => (
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
                {vikingRows.map((row, rowIndex) => (
                  <tr key={row.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="bg-muted/40 px-4 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {row.label}
                    </th>
                    {vikingScenarios.map((scenario) => (
                      <td
                        key={`${row.label}-${scenario.key}`}
                        className={cn(
                          "px-4 py-4 text-center text-sm",
                          scenario.key === "moreThan18"
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {row.values[scenario.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            El valor del Programa de Formación y Desarrollo del Talento de Global Working es de
            5.300€. Eligiendo la Modalidad Vikinga, tendrás un descuento de 1.300€ (un 24% de ahorro)
            al trabajar entre 13 y 18 meses. Además, te beneficiarás de hasta 2.800€ de ahorro (un
            52,83%) al trabajar más de 18 meses en la Red Global Working como enfermera/o. Una
            estupenda opción que te permite amortizar todo el Programa en tan solo un año y medio de
            experiencia en la RedGW y al mismo tiempo disfrutar de la experiencia de vivir en
            Noruega.
          </p>
        </div>
      )}

      {isAuroraPlan && (
        <div className="mt-8 space-y-4 rounded-xl border bg-muted/40 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Programa de Formación y Desarrollo del Talento Global Working - Modalidad Aurora
              </h3>
              <p className="text-sm text-muted-foreground">
                Descubre cómo evoluciona tu inversión en función del tiempo que trabajes en la Red Global Working.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left">
                  <th scope="col" className="sr-only px-4 py-3 font-semibold text-muted-foreground">
                    Concepto
                  </th>
                  {auroraScenarios.map((scenario) => (
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
                {auroraRows.map((row, rowIndex) => (
                  <tr key={row.label} className="border-t border-border">
                    <th
                      scope="row"
                      className="bg-muted/40 px-4 py-4 text-left text-sm font-semibold text-foreground"
                    >
                      {row.label}
                    </th>
                    {auroraScenarios.map((scenario) => {
                      if (scenario.key === "from19Onwards") {
                        if (rowIndex === 0) {
                          return (
                            <td
                              key={`${row.label}-${scenario.key}`}
                              rowSpan={auroraRows.length}
                              className="px-4 py-4 text-center text-sm font-semibold text-foreground"
                            >
                              {row.values[scenario.key]}
                            </td>
                          );
                        }

                        return <Fragment key={`${row.label}-${scenario.key}`} />;
                      }

                      return (
                        <td
                          key={`${row.label}-${scenario.key}`}
                          className="px-4 py-4 text-sm text-muted-foreground"
                        >
                          {row.values[scenario.key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mt-10 rounded-xl border bg-muted/40 p-6",
          shouldUsePremiumFormStyle &&
            "overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-accent/10 p-8 shadow-[0_25px_70px_-35px_rgba(59,130,246,0.4)]",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-2xl text-center space-y-2",
            shouldUsePremiumFormStyle && "max-w-3xl",
          )}
        >
          {contactSectionTitle && (
            <h3 className="text-xl font-semibold text-foreground">
              {contactSectionTitle}
            </h3>
          )}
          {contactSectionDescription && (
            <p className="text-sm text-muted-foreground">
              {contactSectionDescription}
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "max-w-2xl mx-auto mt-6",
            shouldUsePremiumFormStyle && "max-w-3xl mt-8",
          )}
        >
          <div
            className={cn(
              "space-y-4",
              shouldUsePremiumFormStyle && "grid gap-6 sm:grid-cols-2",
            )}
          >
            <div
              className={cn(
                "space-y-2",
                shouldUsePremiumFormStyle && "sm:col-span-1",
              )}
            >
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

            <div
              className={cn(
                "space-y-2",
                shouldUsePremiumFormStyle && "sm:col-span-1",
              )}
            >
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

            <div
              className={cn(
                "bg-primary/5 p-4 rounded-lg border border-primary/10 mt-6",
                shouldUsePremiumFormStyle && "sm:col-span-2 mt-0",
              )}
            >
              <p className="text-xs text-muted-foreground">
                Al enviar este formulario, aceptas que GlobalWorking se ponga en contacto contigo
                para ofrecerte información sobre el programa seleccionado.
              </p>
            </div>

            <div
              className={cn(
                "flex gap-3 pt-4",
                shouldUsePremiumFormStyle && "sm:col-span-2 flex-col sm:flex-row",
              )}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className={cn(
                  "flex-1 transition-all duration-200 hover:scale-[1.02]",
                  shouldUsePremiumFormStyle && "w-full sm:w-auto",
                )}
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-lg",
                  shouldUsePremiumFormStyle && "w-full sm:w-auto",
                )}
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {shouldShowAmandaContact && (
        <div className="mt-10 overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" aria-hidden />
                <img
                  src={amandaPhoto}
                  alt="Amanda Casado"
                  className="relative h-40 w-40 rounded-full border-4 border-white object-cover shadow-xl"
                />
              </div>
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-foreground">¿Tienes dudas sobre los planes?</h3>
              <p className="text-primary font-semibold">Amanda Casado</p>
              <p className="text-sm text-muted-foreground">Especialista en Selección y Desarrollo del Talento</p>
              <p className="text-muted-foreground">
                Agenda una llamada conmigo para resolver todas tus dudas sobre los planes de inversión y descubrir cuál se
                adapta mejor a tus necesidades.
              </p>
              <Button
                size="lg"
                className="mx-auto mt-2 flex items-center gap-2 md:mx-0"
                onClick={() => window.open("https://calendly.com/amanda-globalworking", "_blank")}
              >
                <Calendar className="h-5 w-5" />
                Agendar llamada con Amanda
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
