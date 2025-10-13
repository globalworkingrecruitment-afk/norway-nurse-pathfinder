import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  type TooltipProps,
} from "recharts";
import { MonthlyData } from "./MonthlyRevenueTable";
import { formatEuro } from "@/lib/utils";

interface MonthlyRevenueChartProps {
  data: MonthlyData[];
}

type ChartDataPoint = {
  mes: string;
  Activos: number;
  Abandonos: number;
  Total: number;
  activosCount: number;
  abandonosCount: number;
};

const isChartDataPoint = (value: unknown): value is ChartDataPoint => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.mes === "string" &&
    typeof candidate.Activos === "number" &&
    typeof candidate.Abandonos === "number" &&
    typeof candidate.Total === "number" &&
    typeof candidate.activosCount === "number" &&
    typeof candidate.abandonosCount === "number"
  );
};

const MonthlyRevenueChart = ({ data }: MonthlyRevenueChartProps) => {
  const chartData: ChartDataPoint[] = data.map((item) => ({
    mes: `M${item.month}`,
    Activos: item.activeRevenue,
    Abandonos: item.droppedRevenue,
    Total: item.totalRevenue,
    activosCount: item.activeCount,
    abandonosCount: item.droppedCount,
  }));

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload;

      if (!isChartDataPoint(point)) {
        return null;
      }

      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-4">
          <p className="font-semibold mb-2">{point.mes}</p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600">
              <strong>Activos:</strong> {point.activosCount} personas - {formatEuro(point.Activos)}
            </p>
            <p className="text-red-600">
              <strong>Abandonos:</strong> {point.abandonosCount} personas - {formatEuro(point.Abandonos)}
            </p>
            <p className="text-purple-600 font-semibold pt-1 border-t">
              <strong>Total:</strong> {formatEuro(point.Total)}
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
