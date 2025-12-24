import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCollectionSupervisorQuery } from "@/store/api/superviosr/supervisorCollectionApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ISupervisorCollectionDetailsProps {
  id: number | null;
}

const SupervisorCollectionDetails: FC<ISupervisorCollectionDetailsProps> = ({
  id,
}) => {
  const { data: collectionData, isLoading: collectionLoading } =
    useGetSingleCollectionSupervisorQuery(id);
  const { translate } = useCustomTranslator();

  if (collectionLoading) {
    return <DetailsSkeleton columns={3} items={9} />;
  }

  return (
    <DetailsWrapper
      heading={translate("সংগ্রহের বিস্তারিত", "Collection Details")}
      subHeading={translate(
        "আপনার সংগ্রহের তথ্য এবং কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your collection information and activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("হিসাবধারীর নাম", "Supervisor Name")}
          paragraph={collectionData?.data?.supervisor?.userName}
        />
        <LabelDescription
          heading={translate("কোচ কনফিগ", "Coach Config")}
          paragraph={collectionData?.data?.coachConfig?.coachNo}
        />
        <LabelDescription
          heading={translate("কাউন্টার", "Counter")}
          paragraph={collectionData?.data?.counter?.name}
        />
        <LabelDescription
          heading={translate("সংগ্রহের ধরন", "Collection Type")}
          paragraph={collectionData?.data?.collectionType}
        />
        <LabelDescription
          heading={translate("রুটের দিক", "Route Direction")}
          paragraph={collectionData?.data?.routeDirection}
        />
        <LabelDescription
          heading={translate("যাত্রীর সংখ্যা", "Number of Passengers")}
          paragraph={collectionData?.data?.noOfPassenger}
        />
        <LabelDescription
          heading={translate("পরিমাণ", "Amount")}
          paragraph={formatter({
            type: "amount",
            amount: collectionData?.data?.amount,
          })}
        />
        <LabelDescription
          heading={translate("তারিখ", "Date")}
          paragraph={formatter({
            type: "date&time",
            dateTime: collectionData?.data?.date,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default SupervisorCollectionDetails;
