import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleCounterQuery } from "@/store/api/contact/counterApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsCounterProps {
  id: number | null;
}

const DetailsCounter: FC<IDetailsCounterProps> = ({ id }) => {
  const { data: counterData, isLoading: counterLoading } =
    useGetSingleCounterQuery(id);
  const { translate } = useCustomTranslator();

  if (counterLoading) {
    return <DetailsSkeleton columns={3} items={18} />;
  }

  return (
    <DetailsWrapper
      heading={translate("কাউন্টার ওভারভিউ", "Counter Overview")}
      subHeading={translate(
        "আপনার কাউন্টার তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your counter information and recent activities."
      )}
    >

      <GridWrapper>
        {/* Basic identity first */}
        <LabelDescription
          heading={translate("নাম", "Name")}
          paragraph={counterData?.data?.name}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={counterData?.data?.address}
        />
        <LabelDescription
          heading={translate("ল্যান্ডমার্ক", "Landmark")}
          paragraph={counterData?.data?.landMark}
        />
        <LabelDescription
          heading={translate("অবস্থান ইউআরএল", "Location URL")}
          paragraph={counterData?.data?.locationUrl}
        />

        {/* Contact section */}
        <LabelDescription
          heading={translate("ফোন", "Phone")}
          paragraph={counterData?.data?.phone}
        />
        <LabelDescription
          heading={translate("মোবাইল", "Mobile")}
          paragraph={counterData?.data?.mobile}
        />
        <LabelDescription
          heading={translate("ফ্যাক্স", "Fax")}
          paragraph={counterData?.data?.fax}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Email")}
          paragraph={counterData?.data?.email}
        />
        <LabelDescription
          heading={translate("প্রাথমিক ব্যক্তি", "Primary Person")}
          paragraph={counterData?.data?.primaryContactPersonName}
        />

        {/* Location details */}
        <LabelDescription
          heading={translate("দেশ", "Country")}
          paragraph={counterData?.data?.country}
        />
        <LabelDescription
          heading={translate("অঞ্চল", "Zone")}
          paragraph={counterData?.data?.zone}
        />
        <LabelDescription
          heading={translate("স্টেশন", "Station")}
          paragraph={counterData?.data?.station?.name}
        />

        {/* Business/operational info */}
        <LabelDescription
          heading={translate("ধরন", "Type")}
          paragraph={counterData?.data?.type?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("কমিশন ধরন", "commissionType")}
          paragraph={counterData?.data?.commissionType?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("কমিশন", "commission")}
          paragraph={
            counterData?.data?.commission ? counterData?.data?.commission : 0
          }
        />

        {/* Status flags */}
        <LabelDescription
          heading={translate("অবস্থা", "Status")}
          paragraph={counterData?.data?.status ? "Activate" : "Deactivate"}
        />
        <LabelDescription
          heading={translate("বুকিং অবস্থা", "Booking Status")}
          paragraph={counterData?.data?.bookingAllowStatus?.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("বুকিং শ্রেণী", "Booking Class")}
          paragraph={counterData?.data?.bookingAllowClass?.replace("_", " ")}
        />

        {/* Timestamps last */}
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: counterData?.data?.createdAt,
          })}
        />
      </GridWrapper>

    </DetailsWrapper>
  );
};

export default DetailsCounter;
