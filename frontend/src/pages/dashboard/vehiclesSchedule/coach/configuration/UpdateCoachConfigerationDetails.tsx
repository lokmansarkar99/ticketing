import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCoachConfigurationQuery } from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IUpdateCoachConfigarationDetailsProps {
  id: number | null;
}

const UpdateCoachConfigarationDetails: FC<
  IUpdateCoachConfigarationDetailsProps
> = ({ id }) => {
  const { data: coachConfigurationData, isLoading: coachConfigurationLoading } =
    useGetSingleCoachConfigurationQuery(id);
  const { translate } = useCustomTranslator();

  if (coachConfigurationLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }
  return (
    <DetailsWrapper
      heading={translate(
        "হালনাগাদ কোচ কনফিগারেইশন ওভারভিউ",
        "Update Coach Configuration Overview"
      )}
      subHeading={translate(
        "আপনার হালনাগাদ কনফিগারেইশন ওভারভিউ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your update coach configuration information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("কোচ নম্বর", "Coach Number")}
          paragraph={coachConfigurationData?.data?.coach?.coachNo}
        />
        <LabelDescription
          heading={translate("কোচ টাইপ", "Coach Type")}
          paragraph={coachConfigurationData?.data?.coachType}
        />
        <LabelDescription
          heading={translate("কোচ ক্লাস", "Coach Class")}
          paragraph={coachConfigurationData?.data?.coachClass?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("আসন প্রাপ্য", "Seat Available")}
          paragraph={coachConfigurationData?.data?.seatAvailable}
        />
        <LabelDescription
          heading={translate("প্রস্থানের তারিখ", "Departure Date")}
          paragraph={formatter({
            type: "date",
            dateTime: coachConfigurationData?.data?.departureDate,
          })}
        />
        <LabelDescription
          heading={translate("শিডিউল", "Schedule")}
          paragraph={coachConfigurationData?.data?.coach?.schedule}
        />
        <LabelDescription
          heading={translate("রুট", "Route")}
          paragraph={coachConfigurationData?.data?.coach?.route?.routeName}
        />
        <LabelDescription
          heading={translate("শুরু", "From")}
          paragraph={coachConfigurationData?.data?.coach?.route?.fromStation?.name}
        />
        <LabelDescription
          heading={translate("গন্তব্য", "To")}
          paragraph={coachConfigurationData?.data?.coach?.route?.toStation?.name}
        />
        <LabelDescription
          heading={translate("ভ্রমণের ধরন", "Trip Type")}
          paragraph={coachConfigurationData?.data?.type}
        />
        <LabelDescription
          heading={translate("অবস্থা", "Status")}
          paragraph={coachConfigurationData?.data?.active ? "Active" : "Inactive"}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachConfigurationData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default UpdateCoachConfigarationDetails;
