import { Paragraph } from "@/components/common/typography/Paragraph";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { format } from "date-fns";
import React from "react";

interface IReservePrintProps {
  reserSingleData: any;
}

const ReservePrint = React.forwardRef<HTMLDivElement, IReservePrintProps>(
  ({ reserSingleData: reserveInfo }, ref) => {
    const { data: singleCms} = useGetSingleCMSQuery({});
    const currentDate = format(new Date(), "MMMM dd, yyyy");
    return (
        <section
        ref={ref}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="flex flex-col justify-center items-center p-6"
      >
        {/* Client Section */}
        <header className="mb-6 text-center">
          {/* Logo */}
          <img
            src={singleCms?.data?.companyLogoBangla}
            alt="Logo"
            className="w-32 h-auto mx-auto mb-4"
          />
          <Paragraph size={"lg"} className="font-bold pb-2 text-center">
            Reserve List
          </Paragraph>
          <Paragraph size={"sm"}>Date: {currentDate}</Paragraph>
        </header>

        {/* Expense Category Table */}
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Registration No
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Passenger Name
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Contact No
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Paid Amount
                </th>
                <th className="border border-black px-4 py-2 text-left text-sm font-semibold">
                  Due Amount
                </th>
              </tr>
            </thead>
            <tbody>
                <tr className="text-sm">
                  <td className="border border-black px-4 py-2">{reserveInfo?.registrationNo}</td>
                  <td className="border border-black px-4 py-2">{reserveInfo?.passengerName}</td>
                  <td className="border border-black px-4 py-2">
                    {reserveInfo?.contactNo}৳
                  </td>
                  <td className="border border-black px-4 py-2">
                    {reserveInfo?.amount?.toFixed(2)}৳
                  </td>
                  <td className="border border-black px-4 py-2">
                    {reserveInfo?.paidAmount?.toFixed(2)}৳
                  </td>
                  <td className="border border-black px-4 py-2">
                    {reserveInfo?.dueAmount?.toFixed(2)}৳
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }
);

export default ReservePrint;
