import { InputWrapper } from "@/components/common/form/InputWrapper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IAddExpenseCategoryProps {}

const AddExpenseCategory: FC<IAddExpenseCategoryProps> = () => {
  const { translate } = useCustomTranslator();

  return (
    <FormWrapper
      heading={translate("খরচের ক্যাটাগরি যোগ করুন", "Add Expense Expense")}
      subHeading={translate(
        "সিস্টেমে নতুন খরচের ক্যাটাগরি যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new expense category to the system."
      )}
    >
      <InputWrapper
        label={translate("খরচের ক্যাটাগরি লিখুন", "Enter Expense Category")}
      >
        <Input
          type="text"
          placeholder={translate(
            "খরচের ক্যাটাগরি লিখুন",
            "Enter expense category"
          )}
        />
      </InputWrapper>
    </FormWrapper>
  );
};

export default AddExpenseCategory;
