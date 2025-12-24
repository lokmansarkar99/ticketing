/* eslint-disable @typescript-eslint/ban-ts-comment */
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ICollectionDetailsProps {
  collectionDetailsData: {
    expensesList: Array<{
      id: number;
      coachConfigId: number;
      counterId: number;
      authorizeBy: string | null;
      authorizeStatus: boolean;
      edit: boolean;
      supervisorId: number;
      collectionType: string;
      routeDirection: string;
      noOfPassenger: number;
      amount: number;
      date: string;
      close: boolean;
      file: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  } | null;
}

const CollectionDetails: FC<ICollectionDetailsProps> = ({
  collectionDetailsData,
}) => {
  const { translate } = useCustomTranslator();

  // Ensure there's data in expensesList and access the first item
  if (!collectionDetailsData || !collectionDetailsData.expensesList.length) {
    return <p>{translate("ডেটা পাওয়া যায়নি", "Data not available")}</p>;
  }

  const details = collectionDetailsData.expensesList[0];

  return (
    <DetailsWrapper
      heading={translate("সংগ্রহ ওভারভিউ", "Collection Overview")}
      subHeading={translate(
        "আপনার সংগ্রহ তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your collection information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Created At")}
          paragraph={new Date(details.createdAt).toLocaleString()}
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Updated At")}
          paragraph={new Date(details.updatedAt).toLocaleString()}
        />
        <LabelDescription
          heading={translate("কোচ কনফিগারেশন আইডি", "Coach Config ID")}
          paragraph={details.coachConfigId.toString()}
        />
        <LabelDescription
          heading={translate("সংগ্রহ প্রকার", "Collection Type")}
          paragraph={details.collectionType}
        />
        <LabelDescription
          heading={translate("রুট নির্দেশ", "Route Direction")}
          paragraph={details.routeDirection.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("যাত্রীর সংখ্যা", "No Of Passenger")}
          paragraph={details.noOfPassenger.toString()}
        />
        <LabelDescription
          heading={translate("পরিমাণ", "Amount")}
          paragraph={details.amount.toString()}
        />
        <LabelDescription
          heading={translate("ফাইল", "File")}
          //@ts-ignore
          paragraph={
            details.file ? (
              <a href={details.file} target="_blank" rel="noopener noreferrer">
                {translate("ডাউনলোড", "Download")}
              </a>
            ) : (
              translate("ফাইল পাওয়া যায়নি", "File Not Available")
            )
          }
        />
        <LabelDescription
          heading={translate("তারিখ", "Date")}
          paragraph={new Date(details.date).toLocaleDateString()}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default CollectionDetails;
