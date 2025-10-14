import { useState } from "react";
import { PaymentPlanCard } from "@/components/PaymentPlanCard";
import { FlexiblePaymentPlanCard, SharedInvestmentOption } from "@/components/FlexiblePaymentPlanCard";
import { InvestmentCompletePlanCard } from "@/components/InvestmentCompletePlanCard";
import { EmailSubmissionForm } from "@/components/EmailSubmissionForm";
import logoGW from "@/assets/globalworking-logo.png";
import logoRed from "@/assets/redgw-logo.png";
import norwayHero from "@/assets/norway-fjord-hero.jpg";
import amandaPhoto from "@/assets/amanda-casado.jpg";
import giuseppeNicolo from "@/assets/giuseppe-nicolo.jpeg";
import estherVillagomez from "@/assets/esther-villagomez.jpg";
import lauraCopovi from "@/assets/laura-copovi.png";
import luisTreti from "@/assets/luis-treti.jpeg";
import alejandraRafa from "@/assets/alejandra-rafa.jpeg";
import promo90 from "@/assets/promo-90.png";
import grupoCertificados from "@/assets/grupo-certificados.jpg";
import isaacSakrisoy from "@/assets/isaac-sakrisoy.jpg";
import mariaZamora from "@/assets/maria-zamora.jpg";
import lauraGutierrez from "@/assets/laura-gutierrez.jpeg";
import jordiJaviMartorell from "@/assets/jordi-javi-martorell.jpg";
import jessicaAsensio from "@/assets/jessica-asensio.jpeg";
import guilleMartin from "@/assets/guille-martin.jpg";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Instagram, Calendar, Handshake, ShieldCheck } from "lucide-react";
import {
  ProgramGalleryGrid,
  type ProgramGalleryItem,
} from "@/components/ProgramGalleryGrid";

// Extended plan structure for new system
interface PlanSelection {
  id: string;
  title: string;
  variantName?: string;
  monthlyPayment: string;
  amortization: string;
  totalInvestment?: number;
  notes?: string;
  paymentMethod?: string;
  numberOfInstallments?: number;
}

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanSelection | null>(null);
  const navigate = useNavigate();

  const financingHighlights = [
    {
      icon: Handshake,
      title: "Sin inversión inicial",
      description:
        "Empieza sin desembolsos y amortiza el programa gracias a tu trabajo en Noruega.",
    },
    {
      icon: ShieldCheck,
      title: "Compromiso acompañado",
      description:
        "Cuenta con la Red Global Working durante los 30 meses de permanencia para asegurar tu desarrollo profesional.",
    },
  ];

  const galleryItems: ProgramGalleryItem[] = [
    {
      type: "image",
      src: giuseppeNicolo,
      alt: "Giuseppe y Nicolò - Global Workers en Noruega",
    },
    {
      type: "image",
      src: estherVillagomez,
      alt: "Esther Villagómez - Enfermera en Noruega",
    },
    {
      type: "image",
      src: lauraCopovi,
      alt: "Laura Copoví - Trabajando en Noruega",
    },
    {
      type: "image",
      src: luisTreti,
      alt: "Luis - Disfrutando la vida en Noruega",
    },
    {
      type: "image",
      src: isaacSakrisoy,
      alt: "Isaac Calvo Valls - Sakrisøy, Noruega",
    },
    {
      type: "image",
      src: mariaZamora,
      alt: "María Zamora - Global Working Enfermería Noruega",
    },
    {
      type: "stack",
      items: [
        {
          src: promo90,
          alt: "Promoción 90 - Global Workers",
        },
        {
          src: grupoCertificados,
          alt: "Grupo de certificados - Global Workers",
        },
      ],
    },
    {
      type: "image",
      src: alejandraRafa,
      alt: "Alejandra y Rafa - Aurora Boreal en Noruega",
    },
    {
      type: "image",
      src: lauraGutierrez,
      alt: "Laura Gutiérrez Jiménez - Enfermera en el Valhalla",
    },
    {
      type: "image",
      src: jordiJaviMartorell,
      alt: "Jordi y Javi Martorell - Vengsøy, Troms, Noruega",
    },
    {
      type: "image",
      src: jessicaAsensio,
      alt: "Jessica Asensio - Enfermera en Noruega",
    },
    {
      type: "image",
      src: guilleMartin,
      alt: "Guille Martín Sáez - Enfermero trabajando en Noruega",
    },
  ];

  const handleFinanciacionTotal = () => {
    setSelectedPlan({
      id: "financiacion-total",
      title: "Financiación Total",
      monthlyPayment: "0€ al mes",
      amortization: "30 meses en la RedGW",
      totalInvestment: 0,
      notes: "No pagas nada durante la formación y amortizas la inversión trabajando 30 meses en la Red Global Working.",
    });
  };

  const handleInversionCompartida = (plan: SharedInvestmentOption) => {
    const monthlyPaymentText =
      plan.key === "aurora"
        ? "125€/mes durante 30 meses"
        : `${plan.monthlyPayment.toLocaleString("es-ES")}€ al mes`;

    setSelectedPlan({
      id: `inversion-compartida-${plan.key}`,
      title: "Inversión Compartida",
      variantName: plan.name,
      monthlyPayment: monthlyPaymentText,
      amortization: `${plan.amortization} meses en la RedGW`,
      notes: plan.description,
      totalInvestment: plan.totalInvestment,
    });
  };

  const handleInversionCompleta = () => {
    setSelectedPlan({
      id: "inversion-completa",
      title: "Inversión Completa",
      monthlyPayment: "1.325€ al mes",
      amortization: "0 meses en la RedGW",
      notes: "Accedes a toda la formación y acompañamiento sin compromiso de permanencia ni amortización.",
    });
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <img src={logoGW} alt="GlobalWorking" className="h-12" />
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-accent py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(" + norwayHero + ")" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/75 to-accent/80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMm0tNCAwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMm0tNCAwYzAgMS4xLS45IDItMiAycy0yLS45LTItMiAuOS0yIDItMiAyIC45IDIgMiIvPjwvZz48L2c+PC9zdmc=')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tu Futuro Profesional en Noruega Comienza Aquí
            </h1>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg mb-6">
              <p className="text-lg md:text-xl font-semibold text-primary-foreground">
                Promoción 113 Online
              </p>
              <p className="text-sm md:text-base opacity-90">
                Febrero 2025 - Diciembre 2026
              </p>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Programa de Formación y Desarrollo del Talento para Enfermeros
            </p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Formación completa en noruego, preparación cultural y profesional,
              con inserción garantizada a través de nuestra Red Global Working
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!selectedPlan ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Elige tu Modelo de Inversión
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Selecciona el modelo que mejor se adapte a tus necesidades.
                  A mayor inversión inicial, menor período de amortización en destino.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                {/* Opción 1: Financiación Total */}
                <PaymentPlanCard
                  title="Financiación Total"
                  monthlyPayment="0€ al mes"
                  amortization="30 meses en la RedGW"
                  note="Empieza sin desembolsos y amortiza el programa gracias a tu trabajo en Noruega."
                  highlights={financingHighlights}
                  onSelect={handleFinanciacionTotal}
                />

                {/* Opción 2: Inversión Compartida (Flexible) */}
                <FlexiblePaymentPlanCard onSelect={handleInversionCompartida} />

                {/* Opción 3: Inversión Completa */}
                <InvestmentCompletePlanCard onSelect={handleInversionCompleta} />
              </div>

              {/* Contact Section */}
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg p-8 mb-12 border-2 border-accent/20">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
                      <img
                        src={amandaPhoto}
                        alt="Amanda Casado"
                        className="relative w-64 h-64 object-cover rounded-full border-4 border-white shadow-xl"
                      />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      ¿Tienes dudas sobre los planes?
                    </h3>
                    <p className="text-lg text-primary font-semibold mb-2">
                      Amanda Casado
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Especialista en Selección y Desarrollo del Talento
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Agenda una llamada conmigo para resolver todas tus dudas sobre los
                      planes de inversión y descubrir cuál se adapta mejor a tus necesidades.
                    </p>
                    <Button
                      size="lg"
                      className="gap-2"
                      onClick={() => window.open('https://calendly.com/amanda-globalworking', '_blank')}
                    >
                      <Calendar className="w-5 h-5" />
                      Agendar llamada con Amanda
                    </Button>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="max-w-4xl mx-auto bg-muted/50 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  ¿Qué es el período de amortización?
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  El período de amortización es el tiempo mínimo que deberás trabajar
                  en Noruega a través de nuestra Red Global Working tras completar la formación.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card p-6 rounded-lg">
                    <h4 className="font-semibold mb-2 text-primary">Red Global Working</h4>
                    <p className="text-sm text-muted-foreground">
                      Nuestra red está compuesta por centros públicos de salud y agencias
                      privadas de contratación en Noruega, garantizando múltiples oportunidades
                      de empleo.
                    </p>
                  </div>
                  <div className="bg-card p-6 rounded-lg">
                    <h4 className="font-semibold mb-2 text-accent">Garantía de Inserción</h4>
                    <p className="text-sm text-muted-foreground">
                      Te acompañamos desde la formación hasta tu colocación profesional,
                      asegurando tu éxito en el mercado laboral noruego.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmailSubmissionForm selectedPlan={selectedPlan} onBack={handleBack} />
          )}
        </div>
      </section>

      {/* Instagram CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Descubre Experiencias Reales
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Conoce las historias de otros Global Workers que ya están viviendo su
                sueño profesional en Noruega.
              </p>
            </div>

            {/* Gallery Grid */}
            <ProgramGalleryGrid items={galleryItems} className="mb-10" />

            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Síguenos en Instagram para ver más experiencias, consejos y el día a día en Noruega.
              </p>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => window.open('https://www.instagram.com/globalworking/', '_blank')}
              >
                <Instagram className="w-5 h-5" />
                Síguenos en Instagram
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img src={logoGW} alt="GlobalWorking" className="h-12 mb-4" />
            <p className="text-muted-foreground">
              Global Working Recruitment ofrece programas integrales de formación y acompañamiento para profesionales de la
              enfermería que desean desarrollar su carrera en Noruega.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">Miembros de:</p>
            <img src={logoRed} alt="Red Global Working" className="h-12 ml-auto" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
