import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCoachQuery } from "@/store/api/vehiclesSchedule/coachApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsCoachConfigurationProps {
  id: number | null;
}

const DetailsCoachConfiguration: FC<IDetailsCoachConfigurationProps> = ({
  id,
}) => {
  const { data: coachConfigurationData, isLoading: coachConfigurationLoading } =
    useGetSingleCoachQuery(id);
  const { translate } = useCustomTranslator();

  if (coachConfigurationLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  const coachData = coachConfigurationData?.data;

  return (
    <DetailsWrapper
      heading={translate(
        "কোচ কনফিগারেইশন ওভারভিউ",
        "Coach Configuration Overview"
      )}
      subHeading={translate(
        "আপনার কোচ কনফিগারেইশন তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your coach configuration information and recent activities."
      )}
    >
      <GridWrapper columns={3}>
        <LabelDescription
          heading={translate("কোচ আইডি", "Coach ID")}
          paragraph={coachData?.id?.toString()}
        />
        <LabelDescription
          heading={translate("কোচ নম্বর", "Coach Number")}
          paragraph={coachData?.coachNo}
        />
        <LabelDescription
          heading={translate("শিডিউল", "Schedule")}
          paragraph={coachData?.schedule}
        />
        <LabelDescription
          heading={translate("রুট আইডি", "Route ID")}
          paragraph={coachData?.routeId?.toString()}
        />
        <LabelDescription
          heading={translate("শুরু কাউন্টার আইডি", "From Counter ID")}
          paragraph={coachData?.fromCounterId?.toString()}
        />
        <LabelDescription
          heading={translate("গন্তব্য কাউন্টার আইডি", "Destination Counter ID")}
          paragraph={coachData?.destinationCounterId?.toString()}
        />
        <LabelDescription
          heading={translate("সিট প্ল্যান আইডি", "Seat Plan ID")}
          paragraph={coachData?.seatPlanId?.toString()}
        />
        <LabelDescription
          heading={translate("কোচ ক্লাস", "Coach Class")}
          paragraph={coachData?.coachClass?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("কোচ টাইপ", "Coach Type")}
          paragraph={coachData?.coachType}
        />
        <LabelDescription
          heading={translate("ভ্রমণের ধরন", "Trip Type")}
          paragraph={coachData?.type}
        />
        <LabelDescription
          heading={translate("হোল্ডিং টাইম", "Holding Time")}
          paragraph={coachData?.holdingTime}
        />
        <LabelDescription
          heading={translate("ভাড়া অনুমোদিত", "Fare Allowed")}
          paragraph={coachData?.fareAllowed}
        />
        <LabelDescription
          heading={translate("ভিআইপি টাইমআউট", "VIP Timeout")}
          paragraph={coachData?.vipTimeOut}
        />
        <LabelDescription
          heading={translate("অবস্থা", "Status")}
          paragraph={coachData?.active ? "Active" : "Inactive"}
        />
        <LabelDescription
          heading={translate("শুরু কাউন্টার", "From Counter")}
          paragraph={coachData?.fromCounter?.name}
        />
        <LabelDescription
          heading={translate("গন্তব্য কাউন্টার", "Destination Counter")}
          paragraph={coachData?.destinationCounter?.name}
        />
        <LabelDescription
          heading={translate("রুট", "Route")}
          paragraph={coachData?.route?.routeName}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachData?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("আপডেট করা হয়েছে", "Updated At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: coachData?.updatedAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsCoachConfiguration;