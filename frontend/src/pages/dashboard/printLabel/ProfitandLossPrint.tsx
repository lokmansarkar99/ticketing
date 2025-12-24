import { Paragraph } from "@/components/common/typography/Paragraph";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { format } from "date-fns";
import React from "react";

interface IProfitandLossPrintProps {
  profitData: any;
  logo: any;
  dateRange: any;
  selectedRegistrationNo: any;
}

const ProfitandLossPrint = React.forwardRef<
  HTMLDivElement,
  IProfitandLossPrintProps
>(
  (
    { profitData: profitInfo, logo, dateRange, selectedRegistrationNo },
    ref
  ) => {
    const { appName } = appConfiguration;

    return (
      <section
        ref={ref}
        className="w-[1336px] mx-auto pt-5 pb-5"
        style={{ pageBreakInside: "avoid" }}
      >
        {/* Legal Landscape Width: 1336px */}
        <section className="w-full h-full text-black font-anek px-5">
          {/* Header */}
          <div className="my-3 flex justify-center items-center text-center">
            <div>
              <img
                src={logo?.companyLogoBangla}
                alt="app logo"
                className="w-40"
              />
              <Paragraph className="font-bold pl-3" size={"lg"}>
                {appName}
              </Paragraph>
              <Paragraph className="pl-3" size={"md"}>
                Bus No wise report
              </Paragraph>
            </div>
          </div>

          <div className="flex justify-between">
            <h2 className="font-medium text-lg">
              Bus No: {selectedRegistrationNo}
            </h2>
            <h2 className="font-medium text-lg">Date: {dateRange}</h2>
          </div>
          {/* Main Table */}
          <div className="mt-5">
            <table className="table-auto text-center w-full border-collapse border border-gray-200 text-xs">
              {/* Table Header */}
              <thead className="bg-gray-100">
                <tr>
                  {[
                    { label: "Date" },
                    { label: "Trip No" },
                    { label: "Bus No" },
                    { label: "Up Date" },
                    { label: "Down Date" },
                    { label: "Passenger Up", width: "40px" },
                    { label: "Passenger Down", width: "40px" },
                    { label: "Passenger Total", width: "40px" },
                    { label: "Up Income" },
                    { label: "Down Income" },
                    { label: "Up-Down Total Amount" },
                    { label: "Road Expenses" },
                    { label: "Total Balance" },
                    { label: "Iconic Express GP" },
                    { label: "Trip Wise Profit" },
                  ].map((header, index) => (
                    <th
                      key={index}
                      className={`border border-gray-300 px-2 py-2 text-center font-semibold whitespace-nowrap`}
                      style={{ width: header.width }}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {profitInfo?.length > 0 ? (
                  profitInfo.map((row: any, rowIndex: any) => (
                    <tr key={row.id || rowIndex}>
                      {[
                        format(new Date(row.date), "dd-MM-yyyy") ?? "N/A",
                        row.id ?? "N/A",
                        row.registrationNo ?? "N/A",
                        format(new Date(row.upDate), "dd-MM-yyyy") ?? "N/A",
                        format(new Date(row.downDate), "dd-MM-yyyy") ?? "N/A",
                        row.passengerUpWay ?? "0",
                        row.passengerDownWay ?? "0",
                        row.totalPassenger ?? "0",
                        row.upWayIncome?.toFixed(2) ?? "0.00",
                        row.downWayIncome?.toFixed(2) ?? "0.00",
                        (row.upWayIncome + row.downWayIncome)?.toFixed(2) ??
                          "0.00",
                        row.totalExpense?.toFixed(2) ?? "0.00",
                        row.cashOnHand?.toFixed(2) ?? "0.00",
                        row.gp?.toFixed(2) ?? "0.00",
                        (row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00",
                      ].map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 px-2 py-2 text-center whitespace-nowrap"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={15}
                      className="text-center text-gray-500 py-4 border border-gray-300"
                    >
                      No data available
                    </td>
                  </tr>
                )}

                {/* Totals Row */}
                <tr className="font-semibold bg-gray-100">
                  <td className="border border-gray-300 px-2 py-2">Totals</td>
                  {[...Array(9)].map((_, i) => (
                    <td
                      key={i}
                      className="border border-gray-300 px-2 py-2"
                    ></td>
                  ))}
                  <td className="border border-gray-300 px-2 py-2">
                    {profitInfo
                      ?.reduce(
                        (acc: any, row: any) =>
                          acc + (row.upWayIncome + row.downWayIncome || 0),
                        0
                      )
                      .toFixed(2) ?? "0.00"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {profitInfo
                      ?.reduce(
                        (acc: any, row: any) => acc + (row.totalExpense || 0),
                        0
                      )
                      .toFixed(2) ?? "0.00"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {profitInfo
                      ?.reduce(
                        (acc: any, row: any) => acc + (row.cashOnHand || 0),
                        0
                      )
                      .toFixed(2) ?? "0.00"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {profitInfo
                      ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                      .toFixed(2) ?? "0.00"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {profitInfo
                      ?.reduce(
                        (acc: any, row: any) =>
                          acc + (row.cashOnHand - row.gp || 0),
                        0
                      )
                      .toFixed(2) ?? "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Table */}
          <div className="flex justify-end overflow-hidden mt-10">
            <div className="border w-5/12">
              <table className="font-semibold table-auto w-full border-collapse border border-gray-200 mx-auto text-xs">
                <tbody>
                  {[
                    {
                      label: "Total Up & Down Income",
                      value: `${
                        profitInfo
                          ?.reduce(
                            (acc: any, row: any) =>
                              acc + (row.upWayIncome + row.downWayIncome || 0),
                            0
                          )
                          .toFixed(2) ?? "0.00"
                      }`,
                    },
                    {
                      label: "Road Expenses",
                      value: `${
                        profitInfo
                          ?.reduce(
                            (acc: any, row: any) =>
                              acc + (row.totalExpense || 0),
                            0
                          )
                          .toFixed(2) ?? "0.00"
                      }`,
                    },
                    {
                      label: "Total Balance",
                      value: `${
                        profitInfo
                          ?.reduce(
                            (acc: any, row: any) => acc + (row.cashOnHand || 0),
                            0
                          )
                          .toFixed(2) ?? "0.00"
                      }`,
                    },
                    {
                      label: "GP",
                      value: `${
                        profitInfo
                          ?.reduce(
                            (acc: any, row: any) => acc + (row.gp || 0),
                            0
                          )
                          .toFixed(2) ?? "0.00"
                      }`,
                    },
                    {
                      label: "Total Profit",
                      value: `${
                        profitInfo
                          ?.reduce(
                            (acc: any, row: any) =>
                              acc + (row.cashOnHand - row.gp || 0),
                            0
                          )
                          .toFixed(2) ?? "0.00"
                      }`,
                    },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-2 font-semibold whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    );
  }
);

export default ProfitandLossPrint;
