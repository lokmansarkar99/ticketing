import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
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
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateCounterReportSubmitMutation,
  useLazyGetSupervisorCoachDetailsQuery,
} from "@/store/api/superviosr/supervisorExpenseApi";
import { useGetModalCoachInfoByDateQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import logo from "../../../../assets/longeng.png";

import PdfCounterReport from "../../pdf/PdfCounterReport";
import PrintCounterReport from "../../printLabel/PrintCounterReport";
export default function CounterWiseReport() {
  //const tableRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const user = useSelector((state: any) => state.user); // Access logged-in user data
  const [calendarOpen, setCalendarOpen] = useState(false);
  //const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [localData, setLocalData] = useState<any[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<number | null>(null);
  const [filteredCounterData, setFilteredCounterData] = useState<any | null>(
    null
  );

  // Fetch coaches based on the selected date
  const { data: todaysCoachInfo, isLoading: isTodaysCoachLoading } =
    useGetModalCoachInfoByDateQuery(
      format(selectedDate || today, "yyyy-MM-dd")
    );

  const [trigger, { data: reportsData, isLoading: reportLoading, isSuccess }] =
    useLazyGetSupervisorCoachDetailsQuery();

  //report submit
  const [createCounterReportSubmit] = useCreateCounterReportSubmitMutation({});

  useEffect(() => {
    if (isSuccess && reportsData?.data?.counterWiseReport?.length === 0) {
      toast({
        title: translate("কোন ডেটা উপলব্ধ নেই", "No Data Available"),
        description: translate(
          "নির্বাচিত কোচের জন্য কোনও রিপোর্ট পাওয়া যায়নি।",
          "No Report Available For the Selected Coach."
        ),
      });
    }
  }, [isSuccess, reportsData]);

  useEffect(() => {
    if (todaysCoachInfo?.data) {
      setLocalData(todaysCoachInfo.data);
    }
  }, [todaysCoachInfo]);

  useEffect(() => {
    if (reportsData?.data?.counterWiseReport) {
      const counterData = reportsData.data.counterWiseReport.find(
        (counter: any) => counter.counterId === user?.counterId
      );
      setFilteredCounterData(counterData || null);
    }
  }, [reportsData, user]);
  const onSubmit = async () => {
    const result = await createCounterReportSubmit({
      coachConfigId: selectedCoachId,
    });
    if (result?.data?.success) {
      toast({
        title: translate("রিপোর্ট জমা করা হয়েছে", "Report submitted"),
        description: translate(
          "রিপোর্ট জমা সফলভাবে যোগ করা হয়েছে।",
          "Report Submitted successfully."
        ),
      });
    }
  };
  const printSaleRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printSaleRef.current,
    documentTitle: `Counter Wise Report`,
  });
  if (isTodaysCoachLoading || reportLoading) {
    return <DetailsSkeleton />;
  }
  return (
    <div>
      <FormWrapper
        heading="Counter-Wise Report"
        subHeading="View counter-wise details for the selected coach."
      >
        <div className="flex justify-between items-center">
          <div className="flex items-end gap-5 ">
            {/* Date Selector */}
            <div className="">
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate
                      ? format(selectedDate, "yyyy-MM-dd")
                      : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || new Date()}
                    onSelect={(date) => {
                      setSelectedDate(date ?? null); // Handle undefined by setting to null
                      setCalendarOpen(false);
                    }}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                    captionLayout="dropdown-buttons"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Coach Selector */}
            <div className="">
              <label className="block text-sm font-medium mb-2">
                Select Coach
              </label>
              <Select
                value={selectedCoachId?.toString() || undefined}
                onValueChange={(value) => setSelectedCoachId(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Coach" />
                </SelectTrigger>
                <SelectContent>
                  {localData.map((coach: any) => (
                    <SelectItem key={coach.id} value={coach.id.toString()}>
                      {coach.coachNo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="default" size="sm"
              onClick={() => trigger(selectedCoachId || 0)}
              disabled={reportLoading || !selectedCoachId}
            >
              Search
            </Button>
          </div>
          <div className="flex gap-3 mt-6">
            <PDFDownloadLink
              document={
                <PdfCounterReport
                  filteredCounterData={filteredCounterData}
                  reportsData={reportsData}
                  title="Sample Table Report"
                  logo={logo}
                />
              }
              fileName="counter-wise-report.pdf"

            >
              {
                //@ts-ignore
                (params) => {
                  const { loading } = params;
                  return loading || !isSuccess || (reportsData?.data?.counterWiseReport?.length === 0) ? (
                    <Button
                      disabled
                      className="transition-all duration-150"
                      variant="default"
                      size="sm"
                    >
                      Pdf
                    </Button>
                  ) : (
                    <Button variant="default" size="sm">
                      Pdf
                    </Button>
                  );
                }
              }
            </PDFDownloadLink>

            <Button size="sm" onClick={handlePrint} disabled={!isSuccess || (reportsData?.data?.counterWiseReport?.length === 0)}>
              PRINT
            </Button>
          </div>
        </div>

        {/* Table Display */}

        {/* Table Display */}
        <div ref={printSaleRef} className="mt-4">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border px-4 py-2">Counter Name</th>
                <th className="border px-4 py-2">Coach No</th>
                <th className="border px-4 py-2">Total Seat</th>
                <th className="border px-4 py-2">Total Taka</th>
                <th className="border px-4 py-2">Commission (Tk)</th>
                <th className="border px-4 py-2">Payable Amount (Tk)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCounterData ? (
                <tr className="text-center">
                  <td className="border px-4 py-2">
                    {filteredCounterData.counterName || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {reportsData?.data?.coachInfo?.coachNo || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalSeat || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalAmount || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.commission || 0}
                  </td>
                  <td className="border px-4 py-2">
                    {filteredCounterData.totalAmount -
                      filteredCounterData.commission || 0}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-4 py-6 text-center text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Additional Table for Passenger Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Passenger Name</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Seats Booked</th>
                  <th className="border px-4 py-2">Sold By</th>
                </tr>
              </thead>
              <tbody>
                {filteredCounterData?.orderDetails?.length > 0 ? (
                  filteredCounterData.orderDetails.map(
                    (order: any, index: number) => (
                      <tr key={index} className="text-center">
                        <td className="border px-4 py-2">
                          {order.customerName || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {order.phone || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {order.orderSeat
                            .map((seat: any) => seat.seat)
                            .join(", ")}
                        </td>
                        <td className="border px-4 py-2">
                          {order.user?.userName || "N/A"}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="border px-4 py-6 text-center text-gray-500"
                    >
                      No Passenger Details Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCounterData &&
          filteredCounterData?.counterType !== "Own_Counter" &&
          !filteredCounterData.reportSubmitStatus && (
            <Button type="submit" onClick={onSubmit} className="mt-3" size="lg">
              Submit
            </Button>
          )}

        {/* {!filteredCounterData && (
          <div className="mt-4 text-red-500 text-center">
            No data available for your counter.
          </div>
        )} */}
      </FormWrapper>
      <div className="invisible hidden -left-full">
        <PrintCounterReport
          filteredCounterData={filteredCounterData}
          ref={printSaleRef}
          reportsData={reportsData}
          title="Sample Table Report"
          logo={logo}
        />
      </div>
    </div>
  );
}
