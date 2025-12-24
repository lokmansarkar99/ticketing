import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleReserveQuery } from "@/store/api/reserve/reserveApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsReserveProps {
  id: number | null;
}

const ReserveDetails: FC<IDetailsReserveProps> = ({ id }) => {
  const { data: reserveData, isLoading: reserveLoading } = useGetSingleReserveQuery(id);
  const { translate } = useCustomTranslator();

  if (reserveLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  return (
    <DetailsWrapper
      heading={translate("রিজার্ভ ওভারভিউ", "Reserve Overview")}
      subHeading={translate(
        "আপনার রিজার্ভ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your reserve information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("যাত্রীর নাম", "Passenger Name")}
          paragraph={reserveData?.data?.passengerName}
        />
        <LabelDescription
          heading={translate("যোগাযোগ নম্বর", "Contact No")}
          paragraph={reserveData?.data?.contactNo}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={reserveData?.data?.address}
        />
        <LabelDescription
          heading={translate("শুরু তারিখ", "From Date")}
          paragraph={formatter({
            type: "date",
            dateTime: reserveData?.data?.fromDate,
          })}
        />
        <LabelDescription
          heading={translate("শেষ তারিখ", "To Date")}
          paragraph={formatter({
            type: "date",
            dateTime: reserveData?.data?.toDate,
          })}
        />
        <LabelDescription
          heading={translate("কোচ শ্রেণী", "Coach Class")}
          paragraph={reserveData?.data?.coachClass?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("আসনের সংখ্যা", "No Of Seat")}
          paragraph={reserveData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("মোট ভাড়া", "Amount")}
          paragraph={reserveData?.data?.amount}
        />
        <LabelDescription
          heading={translate("পরিশোধিত", "Paid Amount")}
          paragraph={reserveData?.data?.paidAmount}
        />
        <LabelDescription
          heading={translate("বকেয়া", "Due Amount")}
          paragraph={reserveData?.data?.dueAmount ?? "N/A"}
        />
        <LabelDescription
          heading={translate("বুকিং অবস্থা", "Booking Status")}
          paragraph={reserveData?.data?.isConfirm ? "Confirmed" : "Pending"}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: reserveData?.data?.createdAt,
          })}
        />
      </GridWrapper>

    </DetailsWrapper>
  );
};

export default ReserveDetails;
