import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleHelperQuery } from "@/store/api/contact/helperApi";
import {
  bloodGroupOptions,
  IBloodGroupsProps,
} from "@/utils/constants/common/bloodGroupOptions";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsDriverProps {
  id: number | null;
}

const DetailsHelper: FC<IDetailsDriverProps> = ({ id }) => {
  const { data: driverData, isLoading: driverLoading } =
    useGetSingleHelperQuery(id);
  const { translate } = useCustomTranslator();

  if (driverLoading) {
    return <DetailsSkeleton columns={3} items={16} />;
  }

  return (
    <DetailsWrapper
      heading={translate("প্রোফাইল ওভারভিউ", "Profile Overview")}
      subHeading={translate(
        "আপনার গাড়ি সাহায্যকারী তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your helper information and recent activities."
      )}
    >
      <GridWrapper>

        <LabelDescription
          heading={translate("নাম", "Name")}
          paragraph={driverData?.data?.name}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Email")}
          paragraph={driverData?.data?.email}
        />

        <LabelDescription
          heading={translate("জরুরী যোগাগোগ নম্বর", "Emergency Contact Number")}
          paragraph={driverData?.data?.emergencyNumber}
        />
        <LabelDescription
          heading={translate("রেফারেন্সকারী", "Reference By")}
          paragraph={driverData?.data?.referenceBy}
        />
        <LabelDescription
          heading={translate("যোগাযোগ নম্বর", "Contact Number")}
          paragraph={driverData?.data?.contactNo}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={driverData?.data?.address}
        />
        <LabelDescription
          heading={translate("সক্রিয়", "Active")}
          paragraph={driverData?.data?.active ? "Yes" : "No"}
        />
        <LabelDescription
          heading={translate("জন্ম তারিখ", "Date of Birth")}
          paragraph={formatter({
            type: "date",
            dateTime: driverData?.data?.dateOfBirth,
          })}
        />
        <LabelDescription
          heading={translate("বৈবাহিক অবস্থা", "Marital Status")}
          paragraph={driverData?.data?.maritalStatus}
        />
        <LabelDescription
          heading={translate("লিঙ্গ", "Gender")}
          paragraph={driverData?.data?.gender}
        />
        <LabelDescription
          heading={translate("রক্তের গ্রুপ", "Blood Group")}
          paragraph={
            (driverData?.data?.bloodGroup &&
              bloodGroupOptions?.find(
                (singleGroup: IBloodGroupsProps) =>
                  singleGroup?.key === driverData?.data?.bloodGroup
              )?.label.en) ||
            ""
          }
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: driverData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsHelper;
