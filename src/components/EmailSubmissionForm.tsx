import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, ArrowRight, Sparkles, Info, ArrowLeft } from "lucide-react";
import redGWLogo from "@/assets/redgw-logo.png";

interface EmailSubmissionFormProps {
  selectedPlan: {
    id: string;
    title: string;
    price: string;
    monthlyPayment: string;
    amortization: string;
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
      // Extraer datos del plan
      const totalPrice = parseFloat(selectedPlan.price.replace(/[€.,]/g, ""));
      
      // Extraer pago mensual del texto
      const monthlyPaymentMatch = selectedPlan.monthlyPayment.match(/^([\d.,]+)€/);
      const monthlyPayment = monthlyPaymentMatch 
        ? parseFloat(monthlyPaymentMatch[1].replace(/[.,]/g, ""))
        : 0;
      
      // Extraer meses de amortización (compromiso laboral)
      const amortizationMonths = parseInt(selectedPlan.amortization.match(/\d+/)?.[0] || "0");

      // Guardar en la base de datos
      const { error } = await supabase.from("registrations").insert({
        name,
        email,
        plan_id: selectedPlan.id,
        plan_title: selectedPlan.title,
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
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Precio Total</span>
                    <span className="font-bold text-lg text-foreground">{selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pago Mensual</span>
                    <span className="font-semibold text-accent">{selectedPlan.monthlyPayment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Amortización
                    </span>
                    <span className="font-semibold">{selectedPlan.amortization}</span>
                  </div>
                  {selectedPlan.paymentMethod && selectedPlan.paymentMethod !== "N/A" && (
                    <>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-muted-foreground">Método de Pago</span>
                        <span className="font-semibold text-primary">{selectedPlan.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Nº Mensualidades</span>
                        <span className="font-semibold text-accent">{selectedPlan.numberOfInstallments}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Retorno de Inversión (ROI)
                </h3>
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg border">
                  {/* Main ROI Message - Highlighted */}
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-lg border-2 border-green-500/40">
                    <div className="text-center space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        💰 Recuperación de tu inversión de {selectedPlan.price}
                      </p>
                      <div className="space-y-2">
                        <div className="bg-white/50 dark:bg-black/30 p-4 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Trabajando en Noruega necesitas:</p>
                          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                            ~{Math.ceil(parseFloat(selectedPlan.price.replace(/[€.]/g, '')) / 161)} días
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">de trabajo para recuperar tu inversión completa</p>
                        </div>
                        <div className="text-sm text-foreground font-medium">
                          ¡En menos de {(Math.ceil(parseFloat(selectedPlan.price.replace(/[€.]/g, '')) / 161) / 22).toFixed(1)} meses habrás recuperado el 100% de tu inversión!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">📊 Desglose salarial en Noruega:</p>
                    <div className="space-y-2 bg-white/50 dark:bg-black/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Salario bruto anual:</span>
                        <span className="text-sm font-semibold text-foreground">~51.282€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Salario neto anual:</span>
                        <span className="text-sm font-semibold text-foreground">~36.923€</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Salario neto mensual:</span>
                          <span className="text-base font-bold text-accent">~3.077€</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-muted-foreground">Salario neto diario:</span>
                          <span className="text-base font-bold text-accent">~161€/día</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                      <p className="text-xs text-foreground">
                        <span className="font-semibold">✅ Cálculo simple:</span> Con un salario neto de ~161€ por día, 
                        solo necesitas trabajar {Math.ceil(parseFloat(selectedPlan.price.replace(/[€.]/g, '')) / 161)} días 
                        para recuperar tu inversión de {selectedPlan.price}. 
                        <span className="font-bold text-blue-600 dark:text-blue-400"> Después de eso, todo lo que ganes es ganancia pura.</span>
                      </p>
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

          {/* Full Width Contact Form Section */}
          <div className="border-t pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
};