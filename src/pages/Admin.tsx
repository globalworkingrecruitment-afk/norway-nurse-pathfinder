import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MonthlyRevenueTable, { MonthlyData } from "@/components/MonthlyRevenueTable";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";
import { useNavigate } from "react-router-dom";
import { ListChecks, Loader2 } from "lucide-react";
import logoGW from "@/assets/globalworking-logo.png";
import { formatEuro } from "@/lib/utils";
import { useRegistrations } from "@/hooks/useRegistrations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ABANDONMENT_COST_PER_MONTH = 420; // €7/hora × 60 horas

// Distribución de abandonos en los primeros 6 meses
const DROPOUT_DISTRIBUTION = [
  { month: 1, percentage: 0.30 },
  { month: 2, percentage: 0.30 },
  { month: 3, percentage: 0.10 },
  { month: 4, percentage: 0.10 },
  { month: 5, percentage: 0.10 },
  { month: 6, percentage: 0.10 },
];

const Admin = () => {
  const navigate = useNavigate();
  const { data: registrations, isLoading } = useRegistrations();

  const calculateMonthlyProjection = (): MonthlyData[] => {
    if (!registrations || registrations.length === 0) {
      return [];
    }

    const monthlyData: MonthlyData[] = [];
    const totalRegistrations = registrations.length;
    
    // Dividir 50/50: activos y abandonos
    const activeRegistrations = registrations.slice(0, Math.ceil(totalRegistrations / 2));
    const dropoutRegistrations = registrations.slice(Math.ceil(totalRegistrations / 2));

    for (let month = 1; month <= 12; month++) {
      let activeRevenue = 0;
      let droppedRevenue = 0;
      let activeCount = 0;
      let droppedCount = 0;

      // ACTIVOS: pagan según su plan durante los meses de amortización
      activeRegistrations.forEach(reg => {
        if (month <= reg.amortization_months) {
          activeRevenue += reg.monthly_payment;
          activeCount++;
        }
      });

      // ABANDONOS: distribuidos en los primeros 6 meses, pagan 420€/mes desde que abandonan SOLO HASTA EL MES 6
      dropoutRegistrations.forEach(reg => {
        // Los abandonos solo se producen en los primeros 6 meses
        if (month <= 6) {
          // Determinar en qué mes abandona esta persona
          let dropoutMonth = 1;
          let accumulatedPercentage = 0;
          
          for (const dist of DROPOUT_DISTRIBUTION) {
            accumulatedPercentage += dist.percentage;
            const registrationIndex = dropoutRegistrations.indexOf(reg);
            const registrationPercentile = registrationIndex / dropoutRegistrations.length;
            
            if (registrationPercentile < accumulatedPercentage) {
              dropoutMonth = dist.month;
              break;
            }
          }

          // Si ya abandonó en este mes o antes, paga 420€/mes
          if (month >= dropoutMonth) {
            droppedRevenue += ABANDONMENT_COST_PER_MONTH;
            droppedCount++;
          }
        }
      });

      monthlyData.push({
        month,
        activeCount,
        droppedCount,
        activeRevenue,
        droppedRevenue,
        totalRevenue: activeRevenue + droppedRevenue,
      });
    }

    return monthlyData;
  };

  const monthlyData = calculateMonthlyProjection();
  
  const totalRevenue12Months = monthlyData.reduce((sum, m) => sum + m.totalRevenue, 0);
  const avgMonthlyRevenue = monthlyData.length > 0 ? totalRevenue12Months / 12 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
            <p className="text-muted-foreground">Proyección de ingresos Red GW</p>
          </div>
          <img src={logoGW} alt="GlobalWorking" className="h-12" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div></div>
          <Button onClick={() => navigate("/admin/registrations")} variant="outline">
            <ListChecks className="w-4 h-4 mr-2" />
            Ver Registros
          </Button>
        </div>

        {!registrations || registrations.length === 0 ? (
          <Alert>
            <AlertTitle>Sin datos de registros</AlertTitle>
            <AlertDescription>
              Esperando registros de usuarios para calcular proyecciones reales. Una vez que los usuarios completen el formulario de registro, aparecerán las proyecciones basadas en los planes seleccionados.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Datos Base</CardTitle>
                <CardDescription>Información de los registros recibidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Registros</p>
                    <p className="text-2xl font-bold">{registrations.length}</p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Activos (50%)</p>
                    <p className="text-2xl font-bold text-green-600">{Math.ceil(registrations.length / 2)}</p>
                  </div>
                  <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                    <p className="text-sm text-muted-foreground mb-1">Abandonos (50%)</p>
                    <p className="text-2xl font-bold text-red-600">{Math.floor(registrations.length / 2)}</p>
                  </div>
                </div>
                <div className="pt-4 text-sm text-muted-foreground bg-muted p-3 rounded-md mt-4">
                  <p className="font-semibold mb-1">Metodología de Cálculo:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>50% Activos:</strong> Pagan según su plan elegido durante los meses de amortización</li>
                    <li><strong>50% Abandonos:</strong> Abandonan en los primeros 6 meses, pagan 420€/mes desde que abandonan</li>
                    <li><strong>Distribución de abandonos:</strong> Mes 1 (30%), Mes 2 (30%), Mes 3-6 (10% cada mes)</li>
                    <li><strong>Coste por abandono:</strong> 420€/mes (7€/hora × 60 horas)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen Global (12 Meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border-2 border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ingresos Totales 12 Meses</p>
                    <p className="text-4xl font-bold text-primary">
                      {formatEuro(totalRevenue12Months)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/10 to-accent/10 p-6 rounded-lg border-2 border-secondary/20">
                    <p className="text-sm text-muted-foreground mb-1">Ingreso Promedio/Mes</p>
                    <p className="text-4xl font-bold text-secondary">
                      {formatEuro(avgMonthlyRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proyección Mensual Detallada</CardTitle>
                <CardDescription>Ingresos reales basados en registros - Verde: activos | Rojo: abandonos | Morado: total</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueChart data={monthlyData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tabla Detallada por Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueTable data={monthlyData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-muted-foreground">Tasa de Retención</p>
                    <p className="text-lg font-bold">50%</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">Red de Inserción</p>
                    <p className="text-lg font-bold">Red GW</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">País Destino</p>
                    <p className="text-lg font-bold">Noruega 🇳🇴</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
