import { InputWrapper } from "@/components/common/form/InputWrapper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addUpdateFinanceForm } from "@/utils/constants/form/addUpdateFinanceForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IAddCoachProps {}

const AddFinance: FC<IAddCoachProps> = () => {
  const { translate } = useCustomTranslator();

  return (
    <FormWrapper
      className="grid grid-cols-2 gap-x-4 gap-y-2"
      heading={translate("ফাইন্যান্স যোগ করুন", "Add Finance")}
      subHeading={translate(
        "সিস্টেমে নতুন ফাইন্যান্স যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new Finance to the system."
      )}
    >
      <InputWrapper
        label={translate(
          addUpdateFinanceForm?.interest.label.bn,
          addUpdateFinanceForm.interest.label.en
        )}
      >
        <Input
          type="number"
          placeholder={translate(
            addUpdateFinanceForm.interest.placeholder.bn,
            addUpdateFinanceForm.interest.placeholder.en
          )}
        />
      </InputWrapper>
      <InputWrapper
        label={translate(
          addUpdateFinanceForm?.investingBalances.label.bn,
          addUpdateFinanceForm.investingBalances.label.en
        )}
      >
        <Input
          type="number"
          placeholder={translate(
            addUpdateFinanceForm.investingBalances.placeholder.bn,
            addUpdateFinanceForm.investingBalances.placeholder.en
          )}
        />
      </InputWrapper>
      <InputWrapper
        label={translate(
          addUpdateFinanceForm?.investorId.label.bn,
          addUpdateFinanceForm.investorId.label.en
        )}
      >
        <Input
          type="text"
          placeholder={translate(
            addUpdateFinanceForm.investorId.placeholder.bn,
            addUpdateFinanceForm.investorId.placeholder.en
          )}
        />
      </InputWrapper>

      <InputWrapper
        label={translate(
          addUpdateFinanceForm?.investorId.label.bn,
          addUpdateFinanceForm.investorId.label.en
        )}
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                addUpdateFinanceForm.investorId.placeholder.bn,
                addUpdateFinanceForm.investorId.placeholder.en
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single_Deck">
              {translate("সিঙ্গেল ডেক", "Single Deck")}
            </SelectItem>
            <SelectItem value="Double_Deck">
              {translate("ডাবল ডেক", "Double Deck")}
            </SelectItem>
          </SelectContent>
        </Select>
      </InputWrapper>

      <InputWrapper
        className="col-span-2"
        label={translate(
          addUpdateFinanceForm?.note.label.bn,
          addUpdateFinanceForm.note.label.en
        )}
      >
        <Textarea
          placeholder={translate(
            addUpdateFinanceForm.note.placeholder.bn,
            addUpdateFinanceForm.note.placeholder.en
          )}
        />
      </InputWrapper>
    </FormWrapper>
  );
};

export default AddFinance;
