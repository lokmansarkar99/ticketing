import { Paragraph } from "@/components/common/typography/Paragraph";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import React from "react";

interface ITripWiseReportPrintProps {
  reportData: any;
  logo: any;
  dateRange: any;
  selectedTripNo: any;
}

const TripWiseReportPrint = React.forwardRef<
  HTMLDivElement,
  ITripWiseReportPrintProps
>(({ reportData, logo, selectedTripNo }, ref) => {
  const {
    upWayCoachInfo = [],
    downWayCoachInfo = [],
    collectionReport = [],
    expenseReport = [],
    totalIncome = 0,
    totalExpense = 0,
    totalAmount = 0,
    gp = 0,
  } = reportData?.data || {};
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { appName } = appConfiguration;

  return (
    <section
      ref={ref}
      className="w-full h-full text-black font-anek mx-auto px-10 pt-10 pb-5"
    >
      <div className="my-3 text-center flex flex-col items-center justify-center">
        <img
          src={logo?.companyLogoBangla}
          alt="app logo"
          className="w-40 mx-auto"
        />
        <Paragraph size={"lg"}>{appName}</Paragraph>
        <Paragraph size={"md"}>Trip No Wise Report</Paragraph>
      </div>

      {/* Main Table */}
      <div className="mt-5">
        <div className="flex justify-between py-2">
          <h2>Trip No: {selectedTripNo}</h2>
          <h2>Date: {today}</h2>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Coach",
                "Coach No",
                "Route Name",
                "Registration No",
                "Supervisor Name",
                "Driver Name",
                "Helper Name",
              ].map((header) => (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-2 text-center font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[upWayCoachInfo, downWayCoachInfo].map((info, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index === 0 ? "Up Way Coach" : "Down Way Coach"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.coachNo || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.route?.routeName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.registrationNo || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.supervisor?.userName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.driver?.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {info?.helper?.name || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex my-10 items-stretch  p-2">
        {/* Income Table */}
        <div className="flex-1">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm h-full">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={6}
                  className="border border-gray-300  px-4 py-2 text-center font-semibold text-base"
                >
                  Receive / Income
                </th>
              </tr>
              <tr>
                {[
                  "Counter Name",
                  "Counter Master Name",
                  "Qty",
                  "Fare",
                  "Discount",
                  "Total Price",
                ].map((header) => (
                  <th
                    key={header}
                    className="border text-nowrap border-gray-300 px-2 py-2 text-center font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {collectionReport.map((row: any, index: any) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.counterName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.counterMasterName || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.noOfPassenger || 0}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.fare || 0}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    00.00
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.amount || 0}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td
                  colSpan={5}
                  className="border  border-gray-300 px-4 py-2 text-center"
                >
                  Total Income
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {totalIncome}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Expense Table */}
        <div className="flex-1">
          <table className="table-auto w-full border-collapse border border-gray-300 text-sm h-full">
            <thead className="bg-gray-100">
              <tr className="text-nowrap">
                <th
                  colSpan={2}
                  className="border border-gray-300 px-2 py-2 text-center font-semibold text-base"
                >
                  Expense
                </th>
                <th
                  colSpan={1}
                  className="border border-gray-300 px-2 py-2 text-center font-semibold text-base"
                >
                  Total Amount
                </th>
              </tr>
              <tr className="text-nowrap">
                {["Expense Name", "Amount", "Total Amount"].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-2 py-2 text-center font-semibold"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {expenseReport.map((row: any, index: any) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.expenseCategory || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.amount || 0}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {row.amount || 0}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td className="border border-gray-300 px-2 py-2 text-center">
                  Total Expense
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {totalExpense}
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  {totalAmount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-5/12 ml-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
          <tbody>
            {[
              { label: "Balance", value: totalIncome - totalExpense },
              { label: "GP", value: gp },
              { label: "Gross Income", value: totalIncome - totalExpense - gp },
            ].map((row, index) => (
              <tr key={index}>
                <td className="border font-semibold border-gray-300 px-4 py-2 ">
                  {row.label}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {row.value.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});

export default TripWiseReportPrint;
