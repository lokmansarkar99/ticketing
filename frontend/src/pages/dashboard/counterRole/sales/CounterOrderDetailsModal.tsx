import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper"; // Import Dialog components
import { useGetSingleOrderDetailsQuery } from "@/store/api/counter/counterSalesBookingApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ICounterOrderDetailsModalProps {
  id: number | null;
}

const CounterOrderDetailsModal: FC<ICounterOrderDetailsModalProps> = ({
  id,
}: any) => {
  
  const { data: orderData, isLoading: orderLoading } =
    useGetSingleOrderDetailsQuery(id);

  const { translate } = useCustomTranslator();

  if (orderLoading) {
    return <DetailsSkeleton columns={3} items={15} />;
  }

  return (
    <DetailsWrapper
      heading={translate("অর্ডার ওভারভিউ", "Order Overview")}
      subHeading={translate(
        "এই অর্ডারের তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of this order's information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("অর্ডার আইডি", "Order ID")}
          paragraph={orderData?.data?.id}
        />
        <LabelDescription
          heading={translate("গ্রাহকের নাম", "Customer Name")}
          paragraph={orderData?.data?.customerName}
        />
        <LabelDescription
          heading={translate("ফোন", "Phone")}
          paragraph={orderData?.data?.phone}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Email")}
          paragraph={orderData?.data?.email || "N/A"}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={orderData?.data?.address}
        />
        <LabelDescription
          heading={translate("সর্বমোট পরিমাণ", "Total Amount")}
          paragraph={orderData?.data?.amount}
        />
        <LabelDescription
          heading={translate("পেমেন্ট", "Payment")}
          paragraph={
            orderData?.data?.payment ? "Paid" : translate("অপরিশোধিত", "Unpaid")
          }
        />
        <LabelDescription
          heading={translate("বাকি পরিমাণ", "Due Amount")}
          paragraph={
            orderData?.data?.dueAmount === 0
              ? "No Due"
              : orderData?.data?.dueAmount
          }
        />
        <LabelDescription
          heading={translate("পেমেন্ট পদ্ধতি", "Payment Method")}
          paragraph={orderData?.data?.paymentMethod}
        />
        <LabelDescription
          heading={translate("বুকিং টাইপ", "Booking Type")}
          paragraph={orderData?.data?.paymentType}
        />
        <LabelDescription
          heading={translate("বোর্ডিং পয়েন্ট", "Boarding Point")}
          paragraph={orderData?.data?.boardingPoint}
        />
        <LabelDescription
          heading={translate("ড্রপিং পয়েন্ট", "Dropping Point")}
          paragraph={orderData?.data?.droppingPoint}
        />
        <LabelDescription
          heading={translate("আসন সংখ্যা", "No of Seats")}
          paragraph={orderData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("তৈরির তারিখ", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: orderData?.data?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("হালনাগাদ তারিখ", "Updated At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: orderData?.data?.updatedAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default CounterOrderDetailsModal;
