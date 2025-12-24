import PhotoViewer from "@/components/common/photo/PhotoViewer";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IExtraExpense {
  actionItem: any;
}

const ExtraExpenseDetails: FC<IExtraExpense> = ({ actionItem }) => {
  const { translate } = useCustomTranslator();
  return (
    <DetailsWrapper
      heading={translate("ব্যয় সংক্ষিপ্ত বিবরণ", "Expense Overview")}
      subHeading={translate(
        "আপনার ব্যয়ের তথ্য এবং সাম্প্রতিক কার্যক্রমের সারসংক্ষেপ।",
        "Summary of your expense information and recent activities."
      )}
    >
      <div className="size-20 rounded-md flex justify-center mb-5 overflow-hidden">
        <PhotoViewer
          className="scale-[2]"
          src={actionItem?.file}
          alt={`Image ${actionItem.name}`}
        />
      </div>
      <GridWrapper>
        <LabelDescription
          heading={translate("ব্যয়ের তারিখ", "Expense Date")}
          paragraph={actionItem?.date}
        />
        <LabelDescription
          heading={translate("ব্যয়ের নাম", "Expense Name")}
          paragraph={actionItem?.name}
        />
        <LabelDescription
          heading={translate("শ্রেণী নাম", "Category Name")}
          paragraph={actionItem?.expenseCategoryAccount?.name}
        />
        <LabelDescription
          heading={translate("উপশ্রেণী নাম", "Expense SubCategory")}
          paragraph={actionItem?.expenseSubCategoryAccount?.name}
        />
        <LabelDescription
          heading={translate("মোট পরিমাণ", "Total Amount")}
          paragraph={actionItem?.totalAmount}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default ExtraExpenseDetails;
