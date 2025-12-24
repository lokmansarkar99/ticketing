import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { useGetPaymentDetailsWithHooksQuery } from "@/store/api/bookingApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { FC, useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import TickitPrintClient from "../dashboard/printLabel/TicketPrintClient";
import { toast } from "sonner";
import PdfPrintTickitOnline from "../dashboard/pdf/PdfPrintTickitOnline";
import { pdf } from "@react-pdf/renderer";

interface IPaymentSuccessProps {}

const PaymentSuccess: FC<IPaymentSuccessProps> = () => {
  const { transactionDetails } = useParams<{ transactionDetails: string }>();
  const { data, isLoading } =
    useGetPaymentDetailsWithHooksQuery(transactionDetails);
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  const { data: singleCms } = useGetSingleCMSQuery({});
  const printSaleRef = useRef(null);

  const handlePrintInvoice = useReactToPrint({
    content: () => printSaleRef.current,
  });

  useEffect(() => {
    if (data?.data?.returnOrderId) {
      setIsRoundTrip(true);
    }
  }, [data]);

  // New PDF download function using jsPDF
  const handleDownloadPDF = async () => {
    try {
      // Check if we have the necessary data
      if (!data?.data) {
        toast.error("No ticket data available for download");
        return;
      }

      // Create the PDF using the PdfPrintTickitOnline component
      const pdfInstance = pdf(
        <PdfPrintTickitOnline logo={singleCms?.data} qrData={data.data} />
      );

      // Create a download URL
      const pdfBlob = await pdfInstance.toBlob();
      const url = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket_${data.data?.order?.ticketNo || "unknown"}.pdf`;

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  return (
    <section>
      <PageWrapper>
        <div className="flex justify-center mx-4 md:mx-0">
          <div className="w-full border-2 border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] md:w-5/12 lg:w-5/12 shadow-lg rounded-lg p-4 text-center my-10 border-green-600">
            {/* Success Icon */}
            <FaCheckCircle className="text-3xl text-green-600 mx-auto mb-4" />

            {/* Success Message */}
            <h2 className="text-xl font-semibold my-2">
              Your payment was successful
            </h2>
            <p className="text-[12px] text-gray-600 mb-3">
              Thank you for your payment. We will be in contact with more
              details shortly.
            </p>

            {/* Transaction and Payment Details */}
            <h3 className="text-[12px] font-semibold text-center mb-4">
              Transaction Details
            </h3>
            <div className="my-3 border-t pt-4 text-left grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold text-xs">TXID:</span>{" "}
                <span className="font-semibold text-xs">
                  {transactionDetails}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Bank TXID:</span>{" "}
                <span className="font-semibold text-[10px] md:text-xs">
                  {data?.data?.bankTransId}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Card Type:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.cardType}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Issuer:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.cardIssuer}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Total Amount:</span>{" "}
                <span className="font-semibold text-xs">
                  {isRoundTrip
                    ? data?.data?.order?.amount +
                      data?.data?.order?.order?.amount
                    : data?.data?.order?.amount}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Paid Amount:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.amount}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Due Amount:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.dueAmount}
                </span>
              </p>
            </div>

            {/* Ticket Details */}
            <h3 className="text-[12px] font-semibold text-center mb-4">
              {isRoundTrip ? "Outbound Trip" : "Trip"} Information
            </h3>
            <div className="my-6 border-t pt-4 text-left grid grid-cols-2 gap-2">
              <p>
                <span className="font-semibold text-xs">Ticket No:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.ticketNo}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Customer Name:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.customerName}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Phone:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.phone}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Email:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.email || "N/A"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Boarding Point:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.boardingPoint}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Dropping Point:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.droppingPoint}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Date:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.date}
                </span>
              </p>
              <p>
                <span className="font-semibold text-xs">Seats:</span>{" "}
                <span className="font-semibold text-xs">
                  {data?.data?.order?.noOfSeat}
                </span>
              </p>
            </div>

            {/* Return Trip Details */}
            {isRoundTrip && (
              <>
                <h3 className="text-[12px] font-semibold text-center mb-4">
                  Return Trip Information
                </h3>
                <div className="my-6 border-t pt-4 text-left grid grid-cols-2 gap-2">
                  <p>
                    <span className="font-semibold text-xs">Ticket No:</span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.ticketNo}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">
                      Customer Name:
                    </span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.customerName}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">Phone:</span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.phone}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">Email:</span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.email || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">
                      Boarding Point:
                    </span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.boardingPoint}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">
                      Dropping Point:
                    </span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.droppingPoint}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">Date:</span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.date}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-xs">Seats:</span>{" "}
                    <span className="text-xs">
                      {data?.data?.order?.order?.noOfSeat}
                    </span>
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-center items-center gap-3">
              {/* Print Ticket */}
              <div className="">
                <Button size={"sm"} onClick={handlePrintInvoice}>
                  Print Ticket
                </Button>
              </div>

              {/* PDF Download */}
              <div className="">
                <Button size={"sm"} onClick={handleDownloadPDF}>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Hidden for Print */}
      <div className="hidden">
        <div>
          {data?.data && (
            <TickitPrintClient
              ref={printSaleRef}
              saleData={data?.data}
              logo={singleCms?.data}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
