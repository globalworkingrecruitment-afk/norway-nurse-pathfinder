import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";
import { MonthlyData } from "./MonthlyRevenueTable";
import { formatEuro } from "@/lib/utils";

interface MonthlyRevenueChartProps {
  data: MonthlyData[];
}

const MonthlyRevenueChart = ({ data }: MonthlyRevenueChartProps) => {
  const chartData = data.map((item) => ({
    mes: `M${item.month}`,
    Activos: item.activeRevenue,
    Abandonos: item.droppedRevenue,
    Total: item.totalRevenue,
    activosCount: item.activeCount,
    abandonosCount: item.droppedCount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-4">
          <p className="font-semibold mb-2">{data.mes}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              <strong>Activos:</strong> {data.activosCount} personas - {formatEuro(data.Activos)}
            </p>
            <p className="text-red-600">
              <strong>Abandonos:</strong> {data.abandonosCount} personas - {formatEuro(data.Abandonos)}
            </p>
            <p className="text-purple-600 font-semibold pt-1 border-t">
              <strong>Total:</strong> {formatEuro(data.Total)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatCurrencyShort = (value: number) => {
    return `${(value / 1000).toFixed(0)}k€`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis tickFormatter={formatCurrencyShort} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Activos" fill="#22c55e" stackId="stack" />
        <Bar dataKey="Abandonos" fill="#ef4444" stackId="stack" />
        <Line type="monotone" dataKey="Total" stroke="#8b5cf6" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MonthlyRevenueChart;
