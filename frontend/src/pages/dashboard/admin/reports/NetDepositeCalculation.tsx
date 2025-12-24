import { DataTable } from "@/components/common/table/DataTable";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
interface CalculationRow {
  label: string;
  value: number;
  description?: string;
  isTotal?: boolean;
  isFormula?: boolean;
}

interface NetDepositCalculationProps {
  data: {
    totalSold: number;
    totalComplementary: number;
    fareRefund: number;
    totalRefund: number;
    calculationCharge: number;
    migrationCharge: number;
  };
  labels?: {
    totalSold?: string;
    totalComplementary?: string;
    fareRefund?: string;
    totalRefund?: string;
    calculationCharge?: string;
    migrationCharge?: string;
    totalDeposit?: string;
  };
  currencySymbol?: string;
  className?: string;
}

export function NetDepositCalculation({
  data,
  labels = {},
  currencySymbol = "",
  className = "",
}: NetDepositCalculationProps) {
  // Merge default labels with custom labels
  const mergedLabels = {
    totalSold: labels.totalSold || "Total Sold",
    totalComplementary: labels.totalComplementary || "Total Complementary",
    fareRefund: labels.fareRefund || "Fare Refund",
    totalRefund: labels.totalRefund || "Total Refund",
    calculationCharge: labels.calculationCharge || "Calculation Charge",
    migrationCharge: labels.migrationCharge || "Migration Charge",
    totalDeposit: labels.totalDeposit || "Total Deposit",
  };

  // Calculate total deposit
  const totalDeposit = data.totalSold - data.fareRefund + data.migrationCharge;

  // Prepare table data
  const tableData: CalculationRow[] = [
    {
      label: mergedLabels.totalSold,
      value: data.totalSold,
    },
    {
      label: mergedLabels.totalComplementary,
      value: data.totalComplementary,
    },
    {
      label: mergedLabels.fareRefund,
      value: data.fareRefund,
    },
    {
      label: mergedLabels.totalRefund,
      value: data.totalRefund,
    },
    {
      label: mergedLabels.calculationCharge,
      value: data.calculationCharge,
    },
    {
      label: mergedLabels.migrationCharge,
      value: data.migrationCharge,
    },
    {
      label: mergedLabels.totalDeposit,
      value: totalDeposit,
      isTotal: true,
      isFormula: true,
      description: `Total Deposit = Total Sold - Fare Refund + Migration Charge = ${data.totalSold} - ${data.fareRefund} + ${data.migrationCharge}`,
    },
  ];

  // Define columns
  const columns: ColumnDef<CalculationRow>[] = [
    {
      accessorKey: "label",
      header: "Calculation",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.label}
          {row.original.isFormula && (
            <div className="text-lg text-muted-foreground mt-1">
              {row.original.description}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: "Amount",
      cell: ({ row }) => (
        <div
          className={cn(
            "font-mono",
            row.original.isTotal ? "font-bold" : ""
          )}
        >
          {currencySymbol}
          {row.original.value.toFixed(2)}
        </div>
      ),
    },
  ];

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-lg font-semibold mb-2">Net Deposit Calculation</h2>
      <DataTable
        columns={columns}
        data={tableData}
        pagination={false}
      />
    </div>
  );
}