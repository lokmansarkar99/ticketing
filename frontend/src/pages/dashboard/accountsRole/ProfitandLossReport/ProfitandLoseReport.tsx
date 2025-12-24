import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Loader } from "@/components/common/Loader";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { Heading } from "@/components/common/typography/Heading";
import { Paragraph } from "@/components/common/typography/Paragraph";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetTripReportQuery } from "@/store/api/adminReport/adminReportApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import { dateFormatter } from "@/utils/helpers/dateFormatter";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useReactToPrint } from "react-to-print";
import PdfProfitandLoss from "../../pdf/PdfProfitandLoss";
import ProfitandLossPrint from "../../printLabel/ProfitandLossPrint";

const ProfitandLoseReport = () => {
  const [selectedRegistrationNo, setSelectedRegistrationNo] = useState<
    string | undefined
  >();
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );
  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});

  const { data: profitAndLossData, isLoading: profitLossLoading } =
    useGetTripReportQuery(
      selectedRegistrationNo &&
        date?.from instanceof Date &&
        date?.to instanceof Date
        ? {
            registrationNo: selectedRegistrationNo,
            fromDate: format(date.from, "yyyy-MM-dd"),
            toDate: format(date.to, "yyyy-MM-dd"),
          }
        : skipToken
    );

  const fromDate = date?.from ? dateFormatter(date?.from) : null;
  const toDate = date?.to ? dateFormatter(date?.to) : null;

  const dateRange = toDate
    ? toDate === fromDate
      ? fromDate
      : `${fromDate} to ${toDate}`
    : fromDate;

  const printSaleRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `${appConfiguration?.appName}_profit_and_loss_report`,
  });

  // Filter data based on selected category
  const handleRegistrationNoChange = (value: string) => {
    setSelectedRegistrationNo(value);
  };

  if (singleCmsLoading || vehiclesLoading || profitLossLoading) {
    return <TableSkeleton columns={5} />;
  }
  return (
    <section className="pt-4 ">
      <Paragraph className="text-center pb-4" size={"lg"}>
        Iconic Transport
      </Paragraph>

      <ul className="flex my-3 space-x-3">
        {profitAndLossData?.data?.length > 0 && (
          <li>
            <PDFDownloadLink
              document={
                <PdfProfitandLoss
                  dateRange={dateRange}
                  profitData={profitAndLossData?.data}
                  logo={singleCms?.data}
                  selectedRegistrationNo={selectedRegistrationNo}
                />
              }
              fileName="profit_and_loss_report.pdf"
            >
              {
                //@ts-ignore
                (params) => {
                  const { loading } = params;
                  return loading ? (
                    <Button
                      disabled
                      className="transition-all duration-150"
                      variant="destructive"
                      size="xs"
                    >
                      <Loader /> Pdf
                    </Button>
                  ) : (
                    <Button variant="destructive" size="xs">
                      Pdf
                    </Button>
                  );
                }
              }
            </PDFDownloadLink>
          </li>
        )}

        {profitAndLossData?.data?.length > 0 && (
          <li>
            <Button onClick={handlePrint} variant="destructive" size="xs">
              Print
            </Button>
          </li>
        )}
      </ul>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label
            className="text-xs lg:text-sm py-2 lg:py-0 font-semibold"
            htmlFor=""
          >
            Select Bus No
          </label>
          <Select
            value={selectedRegistrationNo || ""}
            onValueChange={handleRegistrationNoChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Bus No" />
            </SelectTrigger>
            <SelectContent>
              {vehiclesData?.data?.map((option: any) => (
                <SelectItem key={option.id} value={option.registrationNo}>
                  {option.registrationNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <InputWrapper label="Select Date Range" labelFor="date_range">
            <Popover>
              <PopoverTrigger id="date_range" asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[180px] lg:w-[250px] font-normal text-sm",
                    !date && "text-muted-foreground"
                  )}
                >
                  {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                  {date?.from ? (
                    date.to ? (
                      `${format(date.from, "dd-MM-yyyy")} - ${format(
                        date.to,
                        "dd-MM-yyyy"
                      )}`
                    ) : (
                      format(date.from, "dd-MM-yyyy")
                    )
                  ) : (
                    <span className="text-sm">Pick a Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </div>
      </div>

      <section className="mt-10">
        <Heading
          className="text-xs md:text-xl"
          size={"h6"}
        >{`Bus no wise report for the month of ${
          date?.from && date?.to ? dateRange : ""
        }`}</Heading>
        <div className="border overflow-hidden overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Date",
                  "Trip No",
                  "Bus No",
                  "Up Date",
                  "Down Date",
                  "Passenger Up",
                  "Passenger Down",
                  "Passenger Total",
                  "Up Income",
                  "Down Income",
                  "Up-Down Total Amount",

                  "Road Expenses",
                  "Total Balance",
                  "Iconic Express GP",
                  "Trip Wise Profit",
                ].map((header) => (
                  <th
                    key={header}
                    className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {profitAndLossData?.data?.length > 0 ? (
                profitAndLossData.data.map((row: any, rowIndex: any) => (
                  <tr
                    key={row.id || rowIndex}
                    className="hover:bg-gray-50 text-center"
                  >
                    {[
                      row.date
                        ? format(new Date(row.date), "dd-MM-yyyy")
                        : "N/A",
                      row.id, // Trip No
                      row.registrationNo ?? "N/A", // Bus No
                      row.upDate
                        ? format(new Date(row.upDate), "dd-MM-yyyy")
                        : "N/A",

                      row.downDate
                        ? format(new Date(row.downDate), "dd-MM-yyyy")
                        : "N/A",

                      row.passengerUpWay ?? "N/A", // Down Date
                      row.passengerDownWay ?? "N/A", // Down Date
                      row.totalPassenger ?? "N/A", // Bus No
                      row.upWayIncome ?? "N/A", // Bus No
                      row.downWayIncome ?? "N/A", // Bus No

                      (row.totalIncome - row.totalExpense)?.toFixed(2) ??
                        "0.00",
                      row.totalExpense?.toFixed(2) ?? "0.00",
                      row.cashOnHand?.toFixed(2) ?? "0.00",
                      row.gp?.toFixed(2) ?? "0.00",
                      (row.cashOnHand - row.gp)?.toFixed(2) ?? "0.00",
                    ].map((value, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2 h-12 w-32 text-sm"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center text-red-500 py-4 border border-gray-300"
                  >
                    No data available
                  </td>
                </tr>
              )}

              {/* Footer Row (Totals) */}
              <tr className="font-semibold bg-gray-100 text-center">
                <td className="border border-gray-300 px-4 py-2">Totals</td>
                {[...Array(9)].map((_, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2"></td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) =>
                        acc + (row.totalIncome - row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.totalExpense || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce(
                      (acc: any, row: any) => acc + (row.cashOnHand || 0),
                      0
                    )
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
                    ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                    .toFixed(2) ?? "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {profitAndLossData?.data
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
      </section>

      <section className="flex justify-end my-10">
        <div className="border w-5/12 ">
          <table className="table-auto w-full border-collapse font-bold border border-gray-200">
            <tbody>
              {[
                {
                  label: "Total Up & Down",
                  value: `${
                    profitAndLossData?.data
                      ?.reduce(
                        (acc: any, row: any) => acc + (row.totalIncome || 0),
                        0
                      )
                      .toFixed(2) ?? "00.00"
                  }`,
                },
                {
                  label: "Road Expense",
                  value: `${
                    profitAndLossData?.data
                      ?.reduce(
                        (acc: any, row: any) => acc + (row.totalExpense || 0),
                        0
                      )
                      .toFixed(2) ?? "00.00"
                  }`,
                },
                {
                  label: "Total Amount",
                  value: `${
                    profitAndLossData?.data
                      ?.reduce(
                        (acc: any, row: any) =>
                          acc + (row.totalIncome - row.totalExpense || 0),
                        0
                      )
                      .toFixed(2) ?? "00.00"
                  }`,
                },
                {
                  label: "GP",
                  value: `${
                    profitAndLossData?.data
                      ?.reduce((acc: any, row: any) => acc + (row.gp || 0), 0)
                      .toFixed(2) ?? "00.00"
                  }`,
                },
                {
                  label: "Bus Wise Profit",
                  value: `${
                    profitAndLossData?.data
                      ?.reduce(
                        (acc: any, row: any) =>
                          acc + (row.totalIncome - row.totalExpense - row.gp),
                        0
                      )
                      .toFixed(2) ?? "00.00"
                  }`,
                },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-semibold">
                    {row.label}
                  </td>
                  <td className="border text-right border-gray-300 px-4 font-semibold py-2">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="invisible hidden -left-full">
        {profitAndLossData?.data?.length > 0 && (
          <ProfitandLossPrint
            ref={printSaleRef}
            dateRange={dateRange}
            profitData={profitAndLossData?.data}
            logo={singleCms?.data}
            selectedRegistrationNo={selectedRegistrationNo}
          />
        )}
      </div>
    </section>
  );
};

export default ProfitandLoseReport;
