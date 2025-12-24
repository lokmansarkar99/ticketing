import { InputWrapper } from "@/components/common/form/InputWrapper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  genderOptions,
  IGenderOptionsProps,
} from "@/utils/constants/common/genderOptions";
import { addUpdateExpenseForm } from "@/utils/constants/form/addUpdateExpneseForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";

interface IAddExpenseProps {}

const AddExpense: FC<IAddExpenseProps> = () => {
  const { translate } = useCustomTranslator();
  const [date, setDate] = useState<Date>();
  return (
    <FormWrapper
      className="grid grid-cols-3 gap-x-4 gap-y-2"
      heading={translate("খরচ যোগ করুন", "Add Expense")}
      subHeading={translate(
        "সিস্টেমে নতুন খরচ যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new expense to the system."
      )}
    >
      <InputWrapper
        label={translate(
          addUpdateExpenseForm.amount.label.bn,
          addUpdateExpenseForm.amount.label.en
        )}
      >
        <Input
          type="text"
          placeholder={translate(
            addUpdateExpenseForm.amount.placeholder.bn,
            addUpdateExpenseForm.amount.placeholder.en
          )}
        />
      </InputWrapper>
      <InputWrapper
        label={translate(
          addUpdateExpenseForm.coachConfigId.label.bn,
          addUpdateExpenseForm.coachConfigId.label.en
        )}
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                addUpdateExpenseForm?.coachConfigId.placeholder.bn,
                addUpdateExpenseForm.coachConfigId.placeholder.en
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {genderOptions?.length > 0 &&
              genderOptions?.map(
                (singleGender: IGenderOptionsProps, genderIndex: number) => (
                  <SelectItem key={genderIndex} value={singleGender.key}>
                    {translate(singleGender.label.bn, singleGender.label.en)}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
      </InputWrapper>
      <InputWrapper
        label={translate(
          addUpdateExpenseForm.date.label.bn,
          addUpdateExpenseForm.date.label.en
        )}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal text-sm h-10",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, "PPP")
              ) : (
                <span>
                  {translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <Calendar
              mode="single"
              captionLayout="dropdown-buttons"
              selected={date}
              onSelect={setDate}
              fromYear={1900}
              toYear={new Date().getFullYear()}
            />
          </PopoverContent>
        </Popover>
      </InputWrapper>

      <InputWrapper
        label={translate(
          addUpdateExpenseForm.expenseCategoryId.label.bn,
          addUpdateExpenseForm.expenseCategoryId.label.en
        )}
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                addUpdateExpenseForm?.expenseCategoryId.placeholder.bn,
                addUpdateExpenseForm.expenseCategoryId.placeholder.en
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {genderOptions?.length > 0 &&
              genderOptions?.map(
                (singleGender: IGenderOptionsProps, genderIndex: number) => (
                  <SelectItem key={genderIndex} value={singleGender.key}>
                    {translate(singleGender.label.bn, singleGender.label.en)}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
      </InputWrapper>

      <InputWrapper
        label={translate(
          addUpdateExpenseForm?.routeDirection.label.bn,
          addUpdateExpenseForm.routeDirection.label.en
        )}
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                addUpdateExpenseForm.routeDirection.placeholder.bn,
                addUpdateExpenseForm.routeDirection.placeholder.en
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Up_Way">
              {translate("উর্ধ্বগামী", "Up Way")}
            </SelectItem>
            <SelectItem value="Down_Way">
              {translate("নিম্নগামী", "Down Way")}
            </SelectItem>
          </SelectContent>
        </Select>
      </InputWrapper>
      <InputWrapper
        label={translate(
          addUpdateExpenseForm?.supervisorId.label.bn,
          addUpdateExpenseForm.supervisorId.label.en
        )}
      >
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                addUpdateExpenseForm.supervisorId.placeholder.bn,
                addUpdateExpenseForm.supervisorId.placeholder.en
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Up_Way">
              {translate("উর্ধ্বগামী", "Up Way")}
            </SelectItem>
            <SelectItem value="Down_Way">
              {translate("নিম্নগামী", "Down Way")}
            </SelectItem>
          </SelectContent>
        </Select>
      </InputWrapper>
    </FormWrapper>
  );
};

export default AddExpense;
