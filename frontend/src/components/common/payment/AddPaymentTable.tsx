import { cn } from "@/lib/utils";
import { ChangeEvent, FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuPlus, LuTrash } from "react-icons/lu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fallback } from "@/utils/constants/common/fallback";
import { InputWrapper } from "../form/InputWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useAppContext } from "@/utils/hooks/useAppContext";
import SelectSkeleton from "../skeleton/SelectSkeleton";
import { useGetAccountsQuery } from "@/store/api/finance/accountApi";



export interface IPaymentTable {
  index: number;
  accountId: number | null;
  paymentAmount: string;
  currentBalance: number | null;
}

interface IAddPaymentTableProps {
  watch: any;
  property: string;
  paymentTable: IPaymentTable[];
  setPaymentTable: (paymentTable: IPaymentTable[]) => void;
  setError?: any;
  scrollable?: boolean;
  className?: string;
  shrink?: boolean;
  required?: boolean;
}

const AddPaymentTable: FC<IAddPaymentTableProps> = ({
  watch,
  property,
  paymentTable,
  setPaymentTable,
  setError,
  scrollable,
  className,
  shrink,
}) => {
  const { sidebarOpen } = useAppContext();
  const { translate } = useCustomTranslator();
  // THIS STATE PREVENT TO SET VALUE WHEN DROPDOWN IS CLOSE
  const [accountUpdate, setAccountUpdate] = useState<boolean>(false);
  // GET ALL THE BANK ACCOUNT QUERY
  const { data: accountsData, isLoading: accountLoading } = useGetAccountsQuery(
    "All"
  ) as any;
  
  // REMOVE PAYMENT TABLE HANDLER
  const removePaymentTableHandler = (index: number) => {
    // FILTER OUT THE TABLE WITH THE SPECIFIC INDEX
    const updatedPaymentMethodTable = paymentTable.filter(
      (singleTable: IPaymentTable) => singleTable.index !== index
    );

    // UPDATE THE INDEX OF THE REMAINING ITEMS
    updatedPaymentMethodTable.forEach(
      (singleTable: IPaymentTable, tableIndex: number) => {
        singleTable.index = tableIndex;
      }
    );
    // SET THE UPDATED TABLE IN THE STATE
    setPaymentTable(updatedPaymentMethodTable);
  };

  const addPaymentTableHandler = () => {
    // GET THE HIGHEST INDEX NUMBER
    const maxIndex = Math.max(
      ...paymentTable.map((account: any) => +account.index)
    );
    // CREATE A NEW OBJECT WITH THE REQUIRE PROPERTIES
    const newItem = {
      index: +maxIndex + 1,
      accountId: null,
      paymentAmount: "",
      currentBalance: null,
    };
    // UPDATE THE DATA ON THE STATE
    setPaymentTable([...paymentTable, newItem]);
  };

  return (
    <aside className={cn(className)}>
      <div
        className={cn(
          scrollable && "max-h-[350px] overflow-y-auto scroll-hidden"
        )}
      >
        {paymentTable?.map((singleAccount: any, accountIndex: number) => (
          <ul key={accountIndex} className="flex mt-3 grid-flow-col gap-x-2 gap-y-1">
            <li>
              {accountIndex === 0 ? (
                <InputWrapper label="#" labelFor={"add_account" + accountIndex}>
                  {/* ADD PAYMENT METHOD TABLE */}
                  <Button
                    type="button"
                    className="group relative -mt-2.5"
                    disabled={
                      watch(property)?.length === accountsData?.data?.length
                    }
                    onClick={() => addPaymentTableHandler()}
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus className="h-4 w-4" />
                    {/* TOOLTIP TEXT */}
                    <span className="custom-tooltip-right">
                      {translate(
                        "পেইমেন্ট মেথড যুক্ত করুন",
                        "Add Payment Method"
                      )}
                    </span>
                    <span className="sr-only">
                      Add Another Pay Method Button
                    </span>
                  </Button>
                </InputWrapper>
              ) : (
                <InputWrapper label="#" labelFor="add_new_method">
                  {/* REMOVE PAYMENT METHOD TABLE */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        className="group relative"
                        variant="destructive"
                        size="icon"
                      >
                        <LuTrash className="h-4 w-4" />
                        {/* TOOLTIP TEXT */}
                        <span className="custom-tooltip-right">
                          {translate(
                            "পেইমেন্ট মেথড সরিয়ে দিন",
                            "Remove Payment Method"
                          )}
                        </span>
                        <span className="sr-only">
                          Remove Pay Method Button
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {translate(
                            "পেমেন্ট পদ্ধতি অপসারণের নিশ্চিতকরণ",
                            "Payment Method Removal Confirmation"
                          )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {translate(
                            "Are you sure you want to remove this payment method? This action cannot be undone.",
                            "আপনি কি নিশ্চিত যে আপনি এই পেমেন্ট পদ্ধতি অপসারণ করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {translate("বাতিল করুন", "Cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            removePaymentTableHandler(accountIndex)
                          }
                        >
                          {translate("নিশ্চিত করুন", "Confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </InputWrapper>
              )}
            </li>
            <li className="w-full">
              <InputWrapper
                labelFor={"paying_method" + accountIndex}
                label={translate(
                  "পেমেন্ট মেথড নির্বাচন করুন",
                  "Select Payment Method"
                )}
                className={`w-full  ${
                  sidebarOpen && shrink
                    ? "lg:w-[94px] xl:w-[128px] truncate"
                    : "lg:w-[134px] xl:w-full"
                }`}
              >
                <Select
                  onOpenChange={(open: boolean) => setAccountUpdate(open)}
                  onValueChange={(value: any) => {
                    if (accountUpdate) {
                      const updatedTable = paymentTable.map(
                        (singleTable: any) =>
                          singleTable.index === accountIndex
                            ? {
                                ...singleTable,
                                accountId: +value,
                                currentBalance: accountsData?.data?.find(
                                  (singleAccount: any) =>
                                    singleAccount?.id === +value
                                )?.currentBalance,
                              }
                            : singleTable
                      );
                      setPaymentTable(updatedTable);
                      setError(`payments[${accountIndex}].accountId`, {
                        type: "custom",
                        message: "",
                      });
                    }
                  }}
                  value={singleAccount.accountId ? singleAccount.accountId : ""}
                >
                  <SelectTrigger
                    id={"paying_method" + accountIndex}
                    className={`w-full ${
                      sidebarOpen && shrink
                        ? "lg:w-[90px] xl:w-[120px] truncate"
                        : "lg:w-[130px] xl:w-full"
                    }`}
                  >
                    <SelectValue
                      placeholder={translate(
                        "পেমেন্ট মেথড নির্বাচন করুন",
                        "Select payment method"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {!accountsData?.data?.length && accountLoading && (
                      <div className="w-full h-24 flex items-center justify-center">
                        {accountLoading && <SelectSkeleton />}
                      </div>
                    )}
                    {accountLoading ||
                      (accountsData?.data &&
                        accountsData?.data?.length > 0 &&
                        accountsData?.data.map((singleAccount: any) => (
                          <SelectItem
                            disabled={watch(property)?.some(
                              (accountItem2: any) =>
                                accountItem2?.accountId === singleAccount?.id
                            )}
                            className="cursor-pointer"
                            key={singleAccount?.id}
                            value={singleAccount?.id}
                          >
                            <div className="flex items-center gap-2">
                              <p>{singleAccount?.bankName}</p>
                              <p
                                className={`font-[600] opacity-85 ${
                                  singleAccount?.currentBalance <= 0 &&
                                  "text-destructive "
                                }`}
                              >
                                {singleAccount?.currentBalance?.toFixed(2) ||
                                  fallback.amount}
                              </p>
                            </div>
                          </SelectItem>
                        )))}
                  </SelectContent>
                </Select>
              </InputWrapper>
            </li>
            <li className="w-full">
              <InputWrapper
                label={translate(
                  "পেমেন্ট এমাউন্ট লিখুন",
                  "Enter Payment Amount"
                )}
                labelFor={"paying_amount" + accountIndex}
                error={
                  singleAccount?.paymentAmount > singleAccount?.currentBalance
                    ? "Insufficient balance"
                    : ""
                }
              >
                {/* ENTER AMOUNT FILED */}
                <Input
                  className={`${
                    singleAccount?.paymentAmount >
                      singleAccount?.currentBalance &&
                    "border-destructive !ring-destructive/80 placeholder:text-destructive"
                  } `}
                  type="number"
                  onWheel={(event) => event.currentTarget.blur()}
                  value={singleAccount.paymentAmount || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const updatedTable = paymentTable.map((singleTable: any) =>
                      singleTable.index === accountIndex
                        ? { ...singleTable, paymentAmount: +e.target.value }
                        : singleTable
                    );
                    setPaymentTable(updatedTable);
                  }}
                  id={"paying_amount" + accountIndex}
                  placeholder={translate(
                    "পেমেন্ট এমাউন্ট লিখুন",
                    "Enter payment amount"
                  )}
                />
              </InputWrapper>
            </li>
          </ul>
        ))}
      </div>
    </aside>
  );
};

export default AddPaymentTable;
