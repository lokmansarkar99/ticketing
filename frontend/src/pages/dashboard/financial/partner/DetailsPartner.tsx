import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSinglePartnerQuery } from "@/store/api/finance/partnerApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsPartnerProps {
  id: number | null;
}

const DetailsPartner: FC<IDetailsPartnerProps> = ({ id }) => {
  const { data: partnerData, isLoading: partnerLoading } =
    useGetSinglePartnerQuery(id);
  const { translate } = useCustomTranslator();

  if (partnerLoading) {
    return <DetailsSkeleton columns={3} items={12} />;
  }
  return (
    <DetailsWrapper
      heading={translate("অংশিদার ওভারভিউ", "Partner Overview")}
      subHeading={translate(
        "আপনার অংশিদারের তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your partner information and recent activities."
      )}
    >
      <GridWrapper>
        
        <LabelDescription
          heading={translate("ব্যাংকের নাম", "Name")}
          paragraph={partnerData?.data?.name}
        />
        <LabelDescription
          heading={translate("হিসাবধারীর নাম", "Phone")}
          paragraph={partnerData?.data?.phone}
        />
        <LabelDescription
          heading={translate("হিসাবের নাম", "Email")}
          paragraph={partnerData?.data?.email}
        />
        <LabelDescription
          heading={translate("হিসাব নম্বর", "Address")}
          paragraph={partnerData?.data?.address}
        />
        <LabelDescription
          heading={translate("হিসাবের ধরন", "City")}
          paragraph={partnerData?.data?.city}
        />
        <LabelDescription
          heading={translate("প্রারম্ভিক ব্যালেন্স", "Postal Code")}
          paragraph={partnerData?.data?.postalCode}
        />
        <LabelDescription
          heading={translate("বর্তমান ব্যালেন্স", "country")}
          paragraph={partnerData?.data?.country}
        />
        <LabelDescription
          heading={translate("বর্তমান ব্যালেন্স", "dueAmount")}
          paragraph={formatter({
            type: "amount",
            amount: partnerData?.data?.dueAmount,
          })}
        />
        <LabelDescription
          heading={translate("বর্তমান ব্যালেন্স", "advanceAmount")}
          paragraph={formatter({
            type: "amount",
            amount: partnerData?.data?.advanceAmount,
          })}
        />
        <LabelDescription
          heading={translate("বর্তমান ব্যালেন্স", "active")}
          paragraph={partnerData?.data?.active ? "Activate" : "Deactivate"}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: partnerData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsPartner;
