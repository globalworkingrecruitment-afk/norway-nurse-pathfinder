import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatEuro } from "@/lib/utils";

export interface MonthlyData {
  month: number;
  activeCount: number;
  droppedCount: number;
  activeRevenue: number;
  droppedRevenue: number;
  totalRevenue: number;
}

interface MonthlyRevenueTableProps {
  data: MonthlyData[];
}

const MonthlyRevenueTable = ({ data }: MonthlyRevenueTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Mes</TableHead>
            <TableHead className="text-right">Activos</TableHead>
            <TableHead className="text-right">Abandonos</TableHead>
            <TableHead className="text-right">Ing. Activos</TableHead>
            <TableHead className="text-right">Ing. Abandonos</TableHead>
            <TableHead className="text-right font-bold">Total Mes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.month}>
              <TableCell className="font-medium">{row.month}</TableCell>
              <TableCell className="text-right">{row.activeCount}</TableCell>
              <TableCell className="text-right">{row.droppedCount}</TableCell>
              <TableCell className="text-right text-green-600">
                {formatEuro(row.activeRevenue)}
              </TableCell>
              <TableCell className={`text-right ${row.droppedRevenue < 0 ? "text-red-600" : "text-blue-600"}`}>
                {formatEuro(row.droppedRevenue)}
              </TableCell>
              <TableCell className="text-right font-bold">
                {formatEuro(row.totalRevenue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MonthlyRevenueTable;
