/* eslint-disable @typescript-eslint/ban-ts-comment */
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IExpenseDetailsProps {
  expense: {
    expensesList: Array<{
      id: number;
      coachConfigId: number;
      supervisorId: number;
      authorizeBy: string | null;
      fuelCompanyId: number;
      authorizeStatus: boolean;
      edit: boolean;
      expenseCategoryId: number;
      routeDirection: string;
      expenseType: string;
      amount: number;
      paidAmount: number;
      dueAmount: number;
      file: string | null;
      date: string;
      createdAt: string;
      updatedAt: string;
      coachConfig: { coachNo: string };
      expenseCategory: { name: string };
    }>;
  };
}

const ExpenseDetails: FC<IExpenseDetailsProps> = ({ expense }) => {
  const { translate } = useCustomTranslator();
  const expenseDetailsData = expense.expensesList[0]; // Access the first item in expensesList

  if (!expenseDetailsData)
    return <p>{translate("ডেটা পাওয়া যায়নি", "Data not available")}</p>;

  return (
    <DetailsWrapper
      heading={translate("ব্যয় ওভারভিউ", "Expense Overview")}
      subHeading={translate(
        "আপনার ব্যয় তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your expense information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={new Date(expenseDetailsData.createdAt).toLocaleString()}
        />
        <LabelDescription
          heading={translate("হালনাগাদ হয়েছে", "Update At")}
          paragraph={new Date(expenseDetailsData.updatedAt).toLocaleString()}
        />
        <LabelDescription
          heading={translate("কোচ নম্বর", "Coach Number")}
          paragraph={expenseDetailsData.coachConfig?.coachNo || "N/A"}
        />
        <LabelDescription
          heading={translate("ব্যয় বিভাগ", "Expense Category")}
          paragraph={expenseDetailsData.expenseCategory?.name || "N/A"}
        />
        <LabelDescription
          heading={translate("রুট নির্দেশ", "Route Direction")}
          paragraph={
            expenseDetailsData.routeDirection?.replace("_", " ") || "N/A"
          }
        />
        <LabelDescription
          heading={translate("পরিমাণ", "Amount")}
          paragraph={expenseDetailsData.amount?.toString() || "0"}
        />
        <LabelDescription
          heading={translate("পরিশোধিত পরিমাণ", "Paid Amount")}
          paragraph={expenseDetailsData.paidAmount?.toString() || "0"}
        />
        <LabelDescription
          heading={translate("বকেয়া পরিমাণ", "Due Amount")}
          paragraph={expenseDetailsData.dueAmount?.toString() || "0"}
        />
        <LabelDescription
          heading={translate("ফাইল", "File")}
          //@ts-ignore
          paragraph={
            expenseDetailsData.file ? (
              <a
                href={expenseDetailsData.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                {translate("ডাউনলোড", "Download")}
              </a>
            ) : (
              translate("ফাইল পাওয়া যায়নি", "File Not Available")
            )
          }
        />
        <LabelDescription
          heading={translate("তারিখ", "Date")}
          paragraph={new Date(expenseDetailsData.date).toLocaleDateString()}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default ExpenseDetails;
