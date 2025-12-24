import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleOrderDetailsQuery } from "@/store/api/counter/counterSalesBookingApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ICancelTicketRequestDetailsProps {
  id: number | null;
}

const CancelTicketRequestDetails: FC<ICancelTicketRequestDetailsProps> = ({
  id,
}) => {
  
  const { translate } = useCustomTranslator();
  const { data: cancelData, isLoading: cancelLoading } =
  useGetSingleOrderDetailsQuery(id);

  if (cancelLoading) {
   return <DetailsSkeleton columns={3} items={15} />;
  }

  return (
    <DetailsWrapper
      heading={translate(
        "আজকের টিকিট বাতিলের ওভারভিউ",
        "Today's Ticket Cancel Overview"
      )}
      subHeading={translate(
        "আজকের টিকিট বাতিলের তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of today's ticket cancel request information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("অর্ডার আইডি", "Order ID")}
          paragraph={cancelData?.data?.id}
        />
        <LabelDescription
          heading={translate("গ্রাহকের নাম", "Customer Name")}
          paragraph={cancelData?.data?.customerName}
        />
        <LabelDescription
          heading={translate("ফোন", "Phone")}
          paragraph={cancelData?.data?.phone}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Email")}
          paragraph={cancelData?.data?.email || "N/A"}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={cancelData?.data?.address}
        />
        <LabelDescription
          heading={translate("সর্বমোট পরিমাণ", "Total Amount")}
          paragraph={cancelData?.data?.amount}
        />
        <LabelDescription
          heading={translate("পেমেন্ট", "Payment")}
          paragraph={
            cancelData?.data?.payment
              ? "Paid"
              : translate("অপরিশোধিত", "Unpaid")
          }
        />
        <LabelDescription
          heading={translate("বাকি পরিমাণ", "Due Amount")}
          paragraph={
            cancelData?.data?.dueAmount === 0
              ? "No Due"
              : cancelData?.data?.dueAmount
          }
        />
        <LabelDescription
          heading={translate("পেমেন্ট পদ্ধতি", "Payment Method")}
          paragraph={cancelData?.data?.paymentMethod}
        />
        <LabelDescription
          heading={translate("বুকিং টাইপ", "Booking Type")}
          paragraph={cancelData?.data?.paymentType}
        />
        <LabelDescription
          heading={translate("বোর্ডিং পয়েন্ট", "Boarding Point")}
          paragraph={cancelData?.data?.boardingPoint}
        />
        <LabelDescription
          heading={translate("ড্রপিং পয়েন্ট", "Dropping Point")}
          paragraph={cancelData?.data?.droppingPoint}
        />
        <LabelDescription
          heading={translate("আসন সংখ্যা", "No of Seats")}
          paragraph={cancelData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("তৈরির তারিখ", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: cancelData?.data?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("হালনাগাদ তারিখ", "Updated At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: cancelData?.data?.updatedAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
    
  );
};

export default CancelTicketRequestDetails;
