import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useRegistrations,
  getStatsByPlan,
  getTotalStats,
  useDeleteAllRegistrations,
} from "@/hooks/useRegistrations";
import { formatEuro } from "@/lib/utils";
import PlanDistributionChart from "@/components/PlanDistributionChart";
import logoGW from "@/assets/globalworking-logo.png";
import { ArrowLeft, Users, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  { id: "modalidad-amortizacion-total", title: "Modalidad Amortización total" },
  { id: "modalidad-aurora", title: "Modalidad Aurora" },
  { id: "modalidad-fiordo", title: "Modalidad Fiordo" },
  { id: "modalidad-vikinga", title: "Modalidad Vikinga" },
  { id: "modalidad-inversion-completa", title: "Modalidad Inversión Completa" },
];

// Meses de amortización según el plan (compromiso laboral en RedGW)
const PLAN_AMORTIZATION: Record<string, number> = {
  "Modalidad Amortización total": 30,
  "Modalidad Aurora": 0,
  "Modalidad Fiordo": 22,
  "Modalidad Vikinga": 18,
  "Modalidad Inversión Completa": 0,
};

const AdminRegistrations = () => {
  const navigate = useNavigate();
  const { data: registrations = [], isLoading } = useRegistrations();
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { mutateAsync: deleteAllRegistrations, isPending: isDeletingAll } =
    useDeleteAllRegistrations();

  const filteredRegistrations =
    selectedPlans.length === 0
      ? registrations
      : registrations.filter((reg) => selectedPlans.includes(reg.plan_title));

  const stats = getTotalStats(filteredRegistrations);
  const planStats = getStatsByPlan(filteredRegistrations);

  const handleDeleteAll = async () => {
    try {
      await deleteAllRegistrations();
      setSelectedPlans([]);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Registros eliminados",
        description: "Todos los registros han sido eliminados correctamente.",
      });
    } catch (error) {
      setIsDeleteDialogOpen(false);
      toast({
        variant: "destructive",
        title: "Error al eliminar registros",
        description:
          error instanceof Error ? error.message : "No se pudieron eliminar los registros.",
      });
    }
  };

  const togglePlan = (planTitle: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planTitle) ? prev.filter((p) => p !== planTitle) : [...prev, planTitle]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Cargando registros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Proyección
            </Button>
            <h1 className="text-3xl font-bold text-primary">Análisis de Registros</h1>
            <p className="text-muted-foreground">Gestión de candidatos registrados</p>
          </div>
          <div className="flex items-center gap-4">
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={registrations.length === 0 || isDeletingAll}
                >
                  {isDeletingAll ? "Eliminando..." : "Eliminar todos"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar todos los registros</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción eliminará permanentemente todos los registros guardados. No se
                    podrá deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} disabled={isDeletingAll}>
                    {isDeletingAll ? "Eliminando..." : "Confirmar eliminación"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <img src={logoGW} alt="GlobalWorking" className="h-12" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Registros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Plan Más Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <p className="text-lg font-bold">{stats.mostPopularPlan}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingreso Potencial Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                <p className="text-2xl font-bold">{formatEuro(stats.totalRevenue)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingreso Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">{formatEuro(stats.averageRevenue)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Plan</CardTitle>
            <CardDescription>Selecciona los planes que deseas visualizar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {PLANS.map((plan) => (
                <div key={plan.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={plan.id}
                    checked={selectedPlans.includes(plan.title)}
                    onCheckedChange={() => togglePlan(plan.title)}
                  />
                  <label
                    htmlFor={plan.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {plan.title}
                  </label>
                </div>
              ))}
              {selectedPlans.length > 0 && (
                <Button variant="outline" size="sm" onClick={() => setSelectedPlans([])}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Plan (Barras)</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanDistributionChart data={planStats} type="bar" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución por Plan (Porcentaje)</CardTitle>
            </CardHeader>
            <CardContent>
              <PlanDistributionChart data={planStats} type="pie" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registros Completos</CardTitle>
            <CardDescription>
              Mostrando {filteredRegistrations.length} de {registrations.length} registros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Precio Total</TableHead>
                    <TableHead className="text-right">Pago Mensual</TableHead>
                    <TableHead className="text-right">Amortización</TableHead>
                    <TableHead>Método de Pago</TableHead>
                    <TableHead className="text-right">Nº Mensualidades</TableHead>
                    <TableHead className="text-right">Fecha Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground">
                        No hay registros que mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((reg) => {
                      // Type assertion for new fields until Supabase types regenerate
                      const regWithNewFields = reg as typeof reg & { 
                        payment_method?: string | null;
                        number_of_installments?: number | null;
                      };
                      
                      return (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.name}</TableCell>
                          <TableCell>{reg.email}</TableCell>
                          <TableCell>{reg.plan_title}</TableCell>
                          <TableCell className="text-right">
                            {formatEuro(reg.total_price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatEuro(reg.monthly_payment)}
                          </TableCell>
                          <TableCell className="text-right">
                            {reg.amortization_months === 0
                              ? "Sin compromiso"
                              : `${reg.amortization_months} meses`}
                          </TableCell>
                          <TableCell>
                            {regWithNewFields.payment_method || "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {regWithNewFields.number_of_installments || "-"}
                          </TableCell>
                          <TableCell className="text-right">{formatDate(reg.created_at)}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegistrations;
