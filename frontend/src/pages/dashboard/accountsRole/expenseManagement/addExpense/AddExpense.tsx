import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Loader } from "@/components/common/Loader";
import AddPaymentTable from "@/components/common/payment/AddPaymentTable";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AddEditExtraExpenseSchema,
  AddEditExtraExpenseSchemaDataProps,
} from "@/schemas/extraExpense/addEditExtraExpense";
import { useGetExpenseCategoreyAccountListQuery } from "@/store/api/accounts/expenseDashboardApi";
import { useGetExpenseSubCategoreyAccountListQuery } from "@/store/api/accounts/expenseSubCategory";
import { useAddExpenseAccountMutation } from "@/store/api/extraExpense/extraExpenseApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { fallback } from "@/utils/constants/common/fallback";
import { extraExpenseForm } from "@/utils/constants/form/addEditExtraExpenseForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { LuCheck, LuLoader2 } from "react-icons/lu";
import { IExpenseStateProps } from "./ExpenseList";

interface IAddExpenseProps {
  setOpen?: Dispatch<SetStateAction<boolean>>; // Proper type for setOpen function
  setExpenseOpen?: Dispatch<SetStateAction<boolean>>; // Proper type for setExpenseOpen function
  setExpenseState: (
    userState: (prevState: IExpenseStateProps) => IExpenseStateProps
  ) => void;
}

interface IAddExpenseStateProps {
  date: null | Date;
  calenderOpen: boolean;
}

const AddExpense: FC<IAddExpenseProps> = ({
  setOpen,
  setExpenseState,
  setExpenseOpen,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [addExpenseState, setAddExpenseState] = useState<IAddExpenseStateProps>(
    {
      date: null,
      calenderOpen: false,
    }
  );

  // STATE FOR ADDING NEW PAYMENT OPTION
  const [paymentTable, setPaymentTable] = useState<any>([
    {
      index: 0,
      accountId: 0,
      paymentAmount: 0,
    },
  ]);

  const [
    uploadPhoto,
    { isLoading: uploadPhotoLoading, isSuccess: uploadPhotoSuccess },
  ] = useUploadPhotoMutation({});
  // ADD EXPENSE MUTATION
  const [addExpense, { isLoading: addExpenseLoading, error: addExpenseError }] =
    useAddExpenseAccountMutation({}) as any;

  // GET EXPENSE CATEGORY QUERY
  const { data: expenseCategories, isLoading: expenseCategoryLoading } =
    useGetExpenseCategoreyAccountListQuery(undefined);
  // GET EXPENSE CATEGORY QUERY
  const { data: expensesSubCategories, isLoading: expenseSubCategoryLoading } =
    useGetExpenseSubCategoreyAccountListQuery(undefined);

  // REACT HOOK FORM TO ADD EXPENSE
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm<AddEditExtraExpenseSchemaDataProps>({
    resolver: zodResolver(AddEditExtraExpenseSchema),
  });

  const handleAddExpense = async (data: AddEditExtraExpenseSchemaDataProps) => {
    const updateData = removeFalsyProperties(data, ["note", "file"]);

    const result = await addExpense(updateData);
    if (result?.data?.success) {
      toast({
        title: translate("ব্যয় যোগ করার বার্তা", "Message for adding expense"),
        description: toastMessage("add", translate("ব্যয়", "expense")),
      });
      setExpenseState((prevState: IExpenseStateProps) => ({
        ...prevState,
        addExpenseOpen: false,
      }));
      if (setOpen) setOpen(false);
      if (setExpenseOpen) {
        setExpenseOpen(false);
      }
    }
  };

  const totalAmount = paymentTable.reduce(
    (total: any, item: { paymentAmount: any }) =>
      total + (item.paymentAmount || 0),
    0
  );

  useEffect(() => {
    // Set the totalAmount in the form
    setValue("totalAmount", totalAmount);

    // Update the payments array in the form
    setValue(
      "payments",
      paymentTable.map((account: any) => ({
        accountId: account.accountId,
        paymentAmount: account.paymentAmount || 0,
      }))
    );
  }, [setValue, paymentTable, totalAmount]);

  return (
    <FormWrapper
      heading={translate("ব্যয় যোগ করুন", "Add Expense")}
      subHeading={translate(
        "সিস্টেমে নতুন ব্যয় যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new expense to the system."
      )}
    >
      <div className="flex justify-start mb-4">
        <ul className=" border py-1.5 rounded-md px-2 mt-2 mx-1 w-1/2 ">
          <li>
            <label className="text-sm md:text-base">Total Expense Amount</label>

            <b className="ml-2 text-sm md:text-base">
              {totalAmount.toFixed(2) || fallback.amount}৳
            </b>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit(handleAddExpense)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-1 gap-x-4 md:gap-x-6">
          {/* EXPENSE NAME */}
          {/* <InputWrapper
            label={translate(
              extraExpenseForm?.name.label.bn,
              extraExpenseForm.name.label.en
            )}
            labelFor="expense_name"
            error={errors?.name?.message}
          >
            <Input
              {...register("name")}
              type="text"
              id="expense_name"
              placeholder={translate(
                extraExpenseForm.name.placeholder.bn,
                extraExpenseForm.name.placeholder.en
              )}
            />
          </InputWrapper> */}

          {/* EXPENSE CATEGORY */}
          <InputWrapper
            error={errors?.expenseCategoryId?.message}
            labelFor="expenseCategoryId"
            label={translate(
              extraExpenseForm?.expenseCategoryId.label.bn,
              extraExpenseForm.expenseCategoryId.label.en
            )}
          >
            <Select
              defaultValue={watch("expenseCategoryId")?.toString()}
              onValueChange={(value: string) => {
                setValue("expenseCategoryId", +value);
                setError("expenseCategoryId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="expenseCategoryId">
                <SelectValue
                  placeholder={translate(
                    extraExpenseForm.expenseCategoryId.placeholder.bn,
                    extraExpenseForm.expenseCategoryId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories?.data?.length > 0 &&
                  expenseCategories?.data?.map((singleCategory: any) => (
                    <SelectItem
                      key={singleCategory?.id}
                      value={singleCategory?.id?.toString()}
                    >
                      {singleCategory?.name}
                    </SelectItem>
                  ))}
                {!expenseCategories?.data?.length && expenseCategoryLoading && (
                  <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                    <Loader />
                  </div>
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* EXPENSE SUB-CATEGORY */}
          <InputWrapper
            error={errors?.expenseSubCategoryId?.message}
            labelFor="expenseSubcategoryId"
            label={translate(
              extraExpenseForm?.expenseSubcategoryId.label.bn,
              extraExpenseForm.expenseSubcategoryId.label.en
            )}
          >
            <Select
              defaultValue={watch("expenseSubCategoryId")?.toString()}
              onValueChange={(value: string) => {
                setValue("expenseSubCategoryId", +value);
                setError("expenseSubCategoryId", {
                  type: "custom",
                  message: "",
                });
              }}
            >
              <SelectTrigger id="expenseSubcategoryId">
                <SelectValue
                  placeholder={translate(
                    extraExpenseForm.expenseSubcategoryId.placeholder.bn,
                    extraExpenseForm.expenseSubcategoryId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {expensesSubCategories?.data?.length > 0 &&
                  expensesSubCategories?.data
                    ?.filter(
                      (current: any) =>
                        current.expenseCategoryId === watch("expenseCategoryId")
                    )
                    .map((singleSubCategory: any) => (
                      <SelectItem
                        key={singleSubCategory?.id}
                        value={singleSubCategory?.id?.toString()}
                      >
                        {singleSubCategory?.name}
                      </SelectItem>
                    ))}
                {!expensesSubCategories?.data?.length &&
                  expenseSubCategoryLoading && (
                    <div className="flex justify-center w-full h-8 items-center bg-accent rounded-md">
                      <Loader />
                    </div>
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* EXPENSE DATE  */}
          <InputWrapper
            label={translate(
              extraExpenseForm?.date.label.bn,
              extraExpenseForm.date.label.en
            )}
            labelFor="expense_date"
            error={errors?.date?.message}
          >
            <Popover
              open={addExpenseState.calenderOpen}
              onOpenChange={(open: boolean) =>
                setAddExpenseState((prevState: IAddExpenseStateProps) => ({
                  ...prevState,
                  calenderOpen: open,
                }))
              }
            >
              <PopoverTrigger id="expense_date" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !addExpenseState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addExpenseState.date ? (
                    format(addExpenseState.date, "PPP")
                  ) : (
                    <span className="text-sm">Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  style={{ pointerEvents: "auto" }}
                  className="cursor-pointer"
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={addExpenseState.date || undefined}
                  onSelect={(date) => {
                    const selectedDate = date ?? new Date();

                    setAddExpenseState((prevState: IAddExpenseStateProps) => ({
                      ...prevState,
                      date: selectedDate,
                      calenderOpen: false,
                    }));

                    // Format date to "YYYY-MM-DD" and update the form
                    const formattedDate = selectedDate
                      .toISOString()
                      .split("T")[0];
                    setValue("date", formattedDate);
                    setError("date", { type: "custom" });
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* DOCUMENT ATTACHMENT */}
          <InputWrapper
            error={errors?.file?.message}
            labelFor="file"
            label={translate(
              extraExpenseForm?.file.label.bn,
              extraExpenseForm.file.label.en
            )}
          >
            <div className="relative">
              <Input
                placeholder={translate(
                  extraExpenseForm.file.placeholder.bn,
                  extraExpenseForm.file.placeholder.en
                )}
                onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                  if (event.target.files && event.target.files.length > 0) {
                    const img = event.target.files[0];
                    // const newFormData = new FormData();
                    // newFormData.append("file", img);
                    const result = await uploadPhoto(img).unwrap();
                    setValue("file", result?.data);
                  }
                }}
                id="attachment"
                type="file"
                className="pr-8"
              />
              {uploadPhotoSuccess && (
                <span className="duration-300 cursor-pointer transition-all absolute size-5 top-1/2 right-1 -translate-y-1/2  bg-success/80 flex justify-center items-center rounded-full">
                  <LuCheck className="size-3 text-white" />
                </span>
              )}
              {uploadPhotoLoading && (
                <span className="duration-300 transition-all absolute size-5 top-1/2 right-1 -translate-y-1/2  bg-success/80 flex justify-center items-center rounded-full">
                  <LuLoader2 className="size-3 text-white animate-spin" />
                </span>
              )}
            </div>
          </InputWrapper>

          {/* EXPENSE NOTE */}
          <InputWrapper
            label={translate(
              extraExpenseForm?.note.label.bn,
              extraExpenseForm.note.label.en
            )}
            labelFor="expense_note"
            error={errors?.note?.message}
          >
            <Input
              {...register("note")}
              type="text"
              id="expense_note"
              placeholder={translate(
                extraExpenseForm.note.placeholder.bn,
                extraExpenseForm.note.placeholder.en
              )}
            />
          </InputWrapper>
        </div>

        {/* PAYMENT METHOD */}
        <AddPaymentTable
          scrollable
          paymentTable={paymentTable}
          setPaymentTable={setPaymentTable}
          watch={watch}
          property="payments"
          setError={setError}
        />
        {/* ERROR MESSAGE */}
        <Submit
          loading={addExpenseLoading}
          errors={addExpenseError}
          submitTitle={translate("ব্যয় যোগ করুন", "Add Expense")}
          errorTitle={translate("ব্যয় যোগ করতে ত্রুটি", "Add Expense Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddExpense;
