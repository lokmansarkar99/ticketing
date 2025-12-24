import { Loader } from "@/components/common/Loader";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
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
import TripWiseReportPDF from "@/pages/dashboard/pdf/TripWiseReportPDF";
import TripWiseReportPrint from "@/pages/dashboard/printLabel/TripWiseReportPrint";
import {
  useFetchTripWiseReportQuery,
  useGetTripDataByDateQuery,
} from "@/store/api/adminReport/adminReportApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useReactToPrint } from "react-to-print";

const TripNoWiseReport = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const { data: singleCms } = useGetSingleCMSQuery({});
  const [selectedTripNo, setSelectedTripNo] = useState<string | undefined>();

  const { data: tripData, isLoading: isTripsLoading } =
    useGetTripDataByDateQuery({
      fromDate: date?.from ? format(date.from, "yyyy-MM-dd") : "",
      toDate: date?.to ? format(date.to, "yyyy-MM-dd") : "",
    });

  const { data: reportData, isLoading: isReportLoading } =
    useFetchTripWiseReportQuery({ tripNumber: selectedTripNo });
  const printSaleRef = useRef(null);

  // Handler to fetch table data when trip number is selected
  // Handler to fetch table data when trip number is selected
  const handleFetchReport = (tripNo: string) => {
    setSelectedTripNo(tripNo);
  };
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `Trip_Wise_Report_${selectedTripNo}`,
  });

  const { upWayCoachInfo = [], downWayCoachInfo = [] } = reportData?.data || {};
  const formattedDateRange = date?.from
    ? date.to
      ? `${format(date.from, "dd-MM-yyyy")} - ${format(date.to, "dd-MM-yyyy")}`
      : format(date.from, "dd-MM-yyyy")
    : "N/A";
  if (isTripsLoading || isReportLoading) {
    return <TableSkeleton />;
  }

  return (
    <section className="p-4">
      <div className="flex gap-3">
        {selectedTripNo && reportData?.data && (
          <div className="mt-4 flex gap-3 py-2">
            <PDFDownloadLink
              document={
                <TripWiseReportPDF
                  reportData={reportData}
                  logo={singleCms?.data}
                  selectedTripNo={selectedTripNo}
                />
              }
              fileName="trip_report.pdf"
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
            <Button onClick={handlePrint} variant="destructive" size="xs">
              Print
            </Button>
          </div>
        )}
      </div>
      {/* Date Range Selector and Trip No Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Select Date Range</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[250px] font-normal text-sm ${
                  !date && "text-muted-foreground"
                }`}
              >
                {date?.from
                  ? date.to
                    ? `${format(date.from, "dd-MM-yyyy")} - ${format(
                        date.to,
                        "dd-MM-yyyy"
                      )}`
                    : format(date.from, "dd-MM-yyyy")
                  : "Pick a Date Range"}
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
        </div>

        <div>
          <label className="text-sm font-semibold">Select Trip No</label>
          <Select
            value={selectedTripNo}
            onValueChange={(value) => handleFetchReport(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Trip No" />
            </SelectTrigger>
            <SelectContent>
              {isTripsLoading ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : tripData?.data?.length > 0 ? (
                tripData?.data?.map((trip: any) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.id}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-trips" disabled>
                  No Trips Available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Selected Trip */}
      {selectedTripNo && (
        <p className="mt-4 text-sm font-semibold">
          Selected Trip: <span className="text-blue-600">{selectedTripNo}</span>
        </p>
      )}

      {/* Previous Table */}
      <div className="border overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Coach ",
                "Coach No",
                "Route Name",
                "Registration No",
                "Supervisor Name",
                "Driver Name",
                "Helper Name",
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
          <tbody>
            {[upWayCoachInfo, downWayCoachInfo].map((info, index) => (
              <tr key={index} className="hover:bg-gray-50 text-center text-sm">
                <td className="border border-gray-300 px-4 py-2">
                  {index === 0 ? "Up Way Coach" : "Down Way Coach"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.coachNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.route?.routeName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.registrationNo}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.supervisor?.userName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.driver?.name || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {info?.helper?.name || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side-by-Side Tables */}
      <div className="flex mt-6">
        {/* Left Table: Income */}
        <div className="flex-1 border border-gray-300">
          <table className="table-auto w-full h-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={6}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
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
                  "Dsicount",
                  "Total Price",
                ].map((header) => (
                  <th
                    key={header}
                    className="border whitespace-nowrap border-gray-300 px-4 py-2 text-center text-sm font-semibold"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData?.data?.collectionReport?.map(
                (row: any, index: any) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 text-center text-sm"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {row.counterName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.counterMasterName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.noOfPassenger}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.fare}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">00.00</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {row.amount}
                    </td>
                  </tr>
                )
              )}
              {/* Total Row */}
              <tr className="font-semibold bg-gray-100">
                <td
                  colSpan={5}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  Total Income
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {reportData?.data?.totalIncome || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Table: Expense */}
        <div className="flex-1 border border-gray-300">
          <table className="table-auto w-full h-full border-collapse text-center">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={2}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Expense
                </th>
                <th
                  colSpan={1}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Total Amount
                </th>
              </tr>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Expense Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Amount
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reportData?.data?.expenseReport?.map((row: any, index: any) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 text-center text-sm"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {row.expenseCategory}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.amount}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="font-semibold bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  Total Expense
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {reportData?.data?.totalExpense || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {reportData?.data?.totalAmount || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* bottom table design total */}
      <div className="flex justify-end">
        <div className="border border-gray-300 w-5/12 flex justify-end mt-6">
          <table className="table-auto w-full border-collapse text-left">
            <thead className="bg-gray-100">
              <tr>
                <th
                  colSpan={2}
                  className="border border-gray-300 px-4 py-2 text-center text-lg font-semibold"
                >
                  Summary
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Balance Row */}
              <tr className="hover:bg-gray-50 text-sm">
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Balance
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {reportData?.data?.totalIncome -
                    reportData?.data?.totalExpense || 0}
                </td>
              </tr>
              {/* Gap Row */}
              <tr className="hover:bg-gray-50 text-sm">
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Gp
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {reportData?.data?.gp}
                </td>
              </tr>
              {/* Gross Income Row */}
              <tr className="hover:bg-gray-50 text-sm">
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  Gross Income
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {reportData?.data?.totalIncome -
                    reportData?.data?.totalExpense -
                    reportData?.data?.gp}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Invisible Print Component */}
      <div className="invisible hidden">
        {selectedTripNo && reportData?.data && (
          <TripWiseReportPrint
            ref={printSaleRef}
            reportData={reportData}
            dateRange={formattedDateRange}
            logo={singleCms?.data}
            selectedTripNo={selectedTripNo}
          />
        )}
      </div>
    </section>
  );
};

export default TripNoWiseReport;
