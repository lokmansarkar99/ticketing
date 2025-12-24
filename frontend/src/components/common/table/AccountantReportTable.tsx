import React from "react";

interface AccountantReportTableProps {
  data: Array<{ [key: string]: any }>;
  mainHeader: string;
  subHeaders: string[];
  onFileClick: (file: string | null) => void;
  maxRows: number; // Maximum number of rows to align table heights
}

const AccountantReportTable: React.FC<AccountantReportTableProps> = ({
  data,
  mainHeader,
  subHeaders,
  onFileClick,
  maxRows,
}) => {
  // Calculate the total for the "Taka" column
  const totalAmount = data.reduce((sum, row) => sum + (row.amount || 0), 0);

  return (
    <div className="w-full mb-0">
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr>
            <th colSpan={subHeaders.length} className="text-center p-2">
              {mainHeader}
            </th>
          </tr>
          <tr>
            {subHeaders.map((header, index) => (
              <th key={index} className="border border-gray-300 p-2 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render data rows */}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border border-gray-300 p-2">
                {row.counterName || row.expenseCategory || "-"}
              </td>
              <td className="border border-gray-300 p-2">{row.amount || 0}</td>
              <td className="border border-gray-300 p-2">
                {row.file ? (
                  <button
                    onClick={() => onFileClick(row.file)}
                    className="text-blue-500"
                  >
                    View File
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}

          {/* Add empty rows to match maxRows */}
          {Array.from({ length: maxRows - data.length }).map((_, index) => (
            <tr key={`empty-row-${index}`}>
              {subHeaders.map((_, colIndex) => (
                <td
                  key={`empty-cell-${colIndex}-${index}`}
                  className="border border-gray-300 p-2"
                >
                  -
                </td>
              ))}
            </tr>
          ))}

          {/* Total row */}
          <tr>
            <td className="border border-gray-300 p-2 font-bold">Total</td>
            <td className="border border-gray-300 p-2 font-bold">
              {totalAmount}
            </td>
            <td className="border border-gray-300 p-2">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AccountantReportTable;
