import React from "react";

interface ReportTableProps {
  mainHeaders: string[];
  subHeaders: string[][];
  data: { [key: string]: { [subHeader: string]: any } }[];
  maxRows: number; // Maximum number of rows to ensure all tables have the same height
  bordered?: boolean;
}

const ReportTable: React.FC<ReportTableProps> = ({
  mainHeaders = [],
  subHeaders = [],
  data = [],
  maxRows,
  bordered = true,
}) => {
  const colSpans = subHeaders.map((sub) => sub.length);

  // Calculate totals for each section
  const totals = mainHeaders.map((header) =>
    data.reduce((sum, row) => {
      const value = parseFloat(row[header]?.Taka) || 0;
      return sum + value;
    }, 0)
  );

  return (
    <div className={`w-full  rounded-lg border ${bordered}`}>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr>
            {/* Main Headers */}
            {mainHeaders.map((header, index) => (
              <th
                key={index}
                colSpan={colSpans[index]}
                className="text-center font-semibold border border-gray-300 p-2"
              >
                {header}
              </th>
            ))}
          </tr>
          <tr>
            {/* Sub-Headers */}
            {subHeaders.map((subHeaderGroup, index) =>
              subHeaderGroup.map((subHeader, subIndex) => (
                <th
                  key={`${index}-${subIndex}`}
                  className="text-center font-semibold border border-gray-300 p-2"
                >
                  {subHeader}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {/* Render Data Rows */}
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {mainHeaders.map((header, headerIndex) =>
                subHeaders[headerIndex].map((subHeader, subIndex) => (
                  <td
                    key={`${headerIndex}-${subIndex}-${rowIndex}`}
                    className="p-2 text-center border border-gray-300"
                  >
                    {rowData[header]?.[subHeader] ?? "-"}
                  </td>
                ))
              )}
            </tr>
          ))}

          {/* Fill with Empty Rows to Match maxRows */}
          {Array.from({ length: maxRows - data.length }).map((_, rowIndex) => (
            <tr key={`empty-row-${rowIndex}`}>
              {mainHeaders.map((_, headerIndex) =>
                subHeaders[headerIndex].map((_, colIndex) => (
                  <td
                    key={`empty-cell-${headerIndex}-${colIndex}-${rowIndex}`}
                    className="p-2 text-center border border-gray-300"
                  >
                    -
                  </td>
                ))
              )}
            </tr>
          ))}

          {/* Total Row */}
          <tr>
            {mainHeaders.map(
              (
                _,
                headerIndex: number // Ensure headerIndex is a number
              ) => (
                <React.Fragment key={headerIndex}>
                  <td
                    colSpan={subHeaders[headerIndex]?.length - 1}
                    className="font-semibold text-center p-2 border border-gray-300"
                  >
                    Total
                  </td>
                  <td className="font-semibold text-center p-2 border border-gray-300">
                    {totals[headerIndex] || 0}
                  </td>
                </React.Fragment>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
