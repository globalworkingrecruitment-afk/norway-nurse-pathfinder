import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Registration {
  id: string;
  created_at: string;
  name: string;
  email: string;
  plan_id: string;
  plan_title: string;
  total_price: number;
  monthly_payment: number;
  amortization_months: number;
}

export const useRegistrations = () => {
  return useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Registration[];
    },
  });
};

export const useDeleteAllRegistrations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData<Registration[]>(["registrations"], []);
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
};

export const getStatsByPlan = (registrations: Registration[]) => {
  const planCounts = registrations.reduce((acc, reg) => {
    acc[reg.plan_title] = (acc[reg.plan_title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = registrations.length;
  const planStats = Object.entries(planCounts).map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? ((count / total) * 100).toFixed(1) : "0",
  }));

  return planStats;
};

export const getTotalStats = (registrations: Registration[]) => {
  const totalRevenue = registrations.reduce((sum, reg) => sum + reg.total_price, 0);
  const averageRevenue = registrations.length > 0 ? totalRevenue / registrations.length : 0;

  const mostPopular = getStatsByPlan(registrations).sort((a, b) => b.count - a.count)[0];

  return {
    totalRegistrations: registrations.length,
    totalRevenue,
    averageRevenue,
    mostPopularPlan: mostPopular?.name || "N/A",
  };
};
