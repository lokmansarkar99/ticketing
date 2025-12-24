import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleUserQuery } from "@/store/api/contact/userApi";
import { User } from "@/types/dashboard/contacts/user";
import {
  bloodGroupOptions,
  IBloodGroupsProps,
} from "@/utils/constants/common/bloodGroupOptions";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsUserProps {
  id: number | null;
}

const DetailsUser: FC<IDetailsUserProps> = ({ id }) => {
  const { data, isLoading: userLoading } = useGetSingleUserQuery(id);
  const { translate } = useCustomTranslator();

  const userData = data?.data as User & {
    createdAt: string;
    updatedAt: string;
  };

  if (userLoading) {
    return <DetailsSkeleton columns={3} items={12} />;
  }
  return (
    <DetailsWrapper
      heading={translate("প্রোফাইল ওভারভিউ", "Profile Overview")}
      subHeading={translate(
        "আপনার ব্যবহারকারীর তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your user information and recent activities."
      )}
    >
      <GridWrapper>

        <LabelDescription
          heading={translate("নাম", "Name")}
          paragraph={userData?.userName}
        />
        <LabelDescription
          heading={translate("ইমেইল", "Email")}
          paragraph={userData?.email}
        />
        <LabelDescription
          heading={translate("ভূমিকা", "Role")}
          paragraph={userData?.role.name}
        />
        <LabelDescription
          heading={translate("যোগাযোগ নম্বর", "Contact Number")}
          paragraph={userData?.contactNo}
        />
        <LabelDescription
          heading={translate("ঠিকানা", "Address")}
          paragraph={userData?.address}
        />
        <LabelDescription
          heading={translate("সক্রিয়", "Active")}
          paragraph={userData?.active ? "Yes" : "No"}
        />
        <LabelDescription
          heading={translate("জন্ম তারিখ", "Date of Birth")}
          paragraph={formatter({
            type: "date",
            dateTime: userData?.dateOfBirth,
          })}
        />
        <LabelDescription
          heading={translate("বৈবাহিক অবস্থা", "Marital Status")}
          paragraph={userData?.maritalStatus}
        />
        <LabelDescription
          heading={translate("লিঙ্গ", "Gender")}
          paragraph={userData?.gender}
        />
        <LabelDescription
          heading={translate("রক্তের গ্রুপ", "Blood Group")}
          paragraph={
            (userData?.bloodGroup &&
              bloodGroupOptions?.find(
                (singleGroup: IBloodGroupsProps) =>
                  singleGroup?.key === userData?.bloodGroup
              )?.label.en) ||
            ""
          }
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: userData?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsUser;
