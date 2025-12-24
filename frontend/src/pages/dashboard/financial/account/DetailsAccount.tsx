import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleAccountQuery } from "@/store/api/finance/accountApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsAccountProps {
  id: number | null;
}

const DetailsAccount: FC<IDetailsAccountProps> = ({ id }) => {
  const { data: accountData, isLoading: accountLoading } =
    useGetSingleAccountQuery(id);
  const { translate } = useCustomTranslator();

  if (accountLoading) {
    return <DetailsSkeleton columns={3} items={9} />;
  }
  return (
    <DetailsWrapper
      heading={translate("একাউন্ট ওভারভিউ", "Account Overview")}
      subHeading={translate(
        "আপনার একাউন্টের তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your account information and recent activities."
      )}
    >
      <GridWrapper>

        <LabelDescription
          heading={translate("ব্যাংকের নাম", "Bank Name")}
          paragraph={accountData?.data?.bankName}
        />
        <LabelDescription
          heading={translate("হিসাবধারীর নাম", "Account Holder Name")}
          paragraph={accountData?.data?.accountHolderName}
        />
        <LabelDescription
          heading={translate("হিসাবের নাম", "Account Name")}
          paragraph={accountData?.data?.accountName}
        />
        <LabelDescription
          heading={translate("হিসাব নম্বর", "Account Number")}
          paragraph={accountData?.data?.accountNumber}
        />
        <LabelDescription
          heading={translate("হিসাবের ধরন", "Account Type")}
          paragraph={accountData?.data?.accountType}
        />
        <LabelDescription
          heading={translate("প্রারম্ভিক ব্যালেন্স", "Opening Balance")}
          paragraph={formatter({
            type: "amount",
            amount: accountData?.data?.openingBalance,
          })}
        />
        <LabelDescription
          heading={translate("বর্তমান ব্যালেন্স", "Current Balance")}
          paragraph={formatter({
            type: "amount",
            amount: accountData?.data?.currentBalance,
          })}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: accountData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsAccount;
