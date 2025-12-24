import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleFuelCompanyQuery } from "@/store/api/superviosr/fuelCompanyApi"; // Query to fetch single fuel company
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsFuelCompanyProps {
  id: number | null;
}

const DetailsFuelCompany: FC<IDetailsFuelCompanyProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { data, isLoading: fuelCompanyLoading } =
    useGetSingleFuelCompanyQuery(id);

  const fuelCompanyData = data?.data;

  if (fuelCompanyLoading) {
    return <DetailsSkeleton columns={3} items={10} />;
  }

  return (
    <DetailsWrapper
      heading={translate(
        "ফুয়েল কোম্পানি বিস্তারিত", // Bengali
        "Fuel Company Details" // English
      )}
      subHeading={translate(
        "ফুয়েল কোম্পানির তথ্য দেখুন।", // Bengali
        "View the information of the fuel company." // English
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("নাম", "Name")}
          paragraph={fuelCompanyData?.name}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={fuelCompanyData?.address}
        />
        <LabelDescription
          heading={translate("ফোন", "Phone")}
          paragraph={fuelCompanyData?.phone}
        />
        <LabelDescription
          heading={translate("ইমেল", "Email")}
          paragraph={fuelCompanyData?.email || translate("নেই", "N/A")}
        />
        <LabelDescription
          heading={translate("ওয়েবসাইট", "Website")}
          paragraph={fuelCompanyData?.website || translate("নেই", "N/A")}
        />
        {/* <LabelDescription
          heading={translate("তৈরির তারিখ", "Created At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: fuelCompanyData?.createdAt,
          })}
        />
        <LabelDescription
          heading={translate("সর্বশেষ আপডেট", "Updated At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: fuelCompanyData?.updatedAt,
          })}
        /> */}
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsFuelCompany;
