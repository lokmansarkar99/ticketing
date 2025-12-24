import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCoachQuery } from "@/store/api/vehiclesSchedule/coachApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsCounterProps {
  id: number | null;
}

const DetailsCoach: FC<IDetailsCounterProps> = ({ id }) => {
  const { data: coachData, isLoading: coachLoading } =
    useGetSingleCoachQuery(id);
  const { translate } = useCustomTranslator();

  if (coachLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  return (
    <DetailsWrapper
      heading={translate("কোচ ওভারভিউ", "Coach Overview")}
      subHeading={translate(
        "আপনার কোচ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your coach information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("কোচের নম্বর", "Coach Number")}
          paragraph={coachData?.data?.coachNo}
        />
        <LabelDescription
          heading={translate("আসনের সংখ্যা", "No Of Seat")}
          paragraph={coachData?.data?.noOfSeat}
        />
        <LabelDescription
          heading={translate("সময়সূচি", "Schedule")}
          paragraph={coachData?.data?.schedule}
        />
        <LabelDescription
          heading={translate("রুট", "Route")}
          paragraph={coachData?.data?.route?.routeName}
        />
        <LabelDescription
          heading={translate("অবস্থা", "Status")}
          paragraph={coachData?.data?.active ? "Activate" : "Deactivated"}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsCoach;
