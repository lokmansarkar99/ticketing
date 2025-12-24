import { ChangeEvent, FC, useState } from "react";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/utils/hooks/useAppContext";
import { InputWrapper } from "../form/InputWrapper";
import SelectSkeleton from "../skeleton/SelectSkeleton";
import { useGetAccountsQuery } from "@/store/api/finance/accountApi";

export interface IReceivedPaymentTableRequired {
  index: number;
  accountId: number | null;
  paymentAmount: string;
  accountType: string;
}
interface IAddReceivedPaymentTableRequiredProps {
  watch: any;
  property: string;
  paymentTable: IReceivedPaymentTableRequired[];
  setPaymentTable: (paymentTable: IReceivedPaymentTableRequired[]) => void;
  setError?: any;
  register?: any;
  scrollable?: boolean;
  className?: string;
  shrink?: boolean;
  totalPrice?: number;
}

const AddReceivedPaymentTableRequired: FC<
  IAddReceivedPaymentTableRequiredProps
> = ({
  watch,
  property,
  paymentTable,
  setPaymentTable,
  setError,
  scrollable,
  className,
  shrink,
  totalPrice = 0,
}) => {
  const { sidebarOpen } = useAppContext();
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
      (singleTable: IReceivedPaymentTableRequired) =>
        singleTable.index !== index
    );

    // UPDATE THE INDEX OF THE REMAINING ITEMS
    updatedPaymentMethodTable.forEach(
      (singleTable: IReceivedPaymentTableRequired, tableIndex: number) => {
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
      accountType: "",
    };
    // UPDATE THE DATA ON THE STATE
    setPaymentTable([...paymentTable, newItem]);
  };

  const accountsWithoutCash = paymentTable?.filter(
    (singlePayment: any) =>
      singlePayment.accountType?.toLowerCase() !== "cash" &&
      singlePayment.accountType !== ""
  );

  const totalPaymentByBanking = totalCalculator(
    accountsWithoutCash,
    "paymentAmount"
  );
  const rest =
    totalPrice - totalPaymentByBanking > 0
      ? totalPrice - totalPaymentByBanking
      : 0;

  const addPaymentAmountHandler = (
    inputValue: number,
    singleAccount: any,
    accountIndex: number
  ) => {
    const isCashAccount = singleAccount?.accountType?.toLowerCase() === "cash";
    if (!isCashAccount && rest && rest > inputValue - rest) {
      if (totalPrice >= totalPaymentByBanking) {
        if (totalPrice >= inputValue) {
          const restPayment =
            totalPrice -
            totalCalculator(
              accountsWithoutCash?.filter(
                (account: any) => account.accountId !== singleAccount?.accountId
              ),
              "paymentAmount"
            );
          const updatedTable = paymentTable.map((singleTable: any) =>
            singleTable.index === accountIndex
              ? {
                  ...singleTable,
                  paymentAmount:
                    restPayment < inputValue
                      ? inputValue?.toString().length > 1
                        ? Math.floor(inputValue / 10)
                        : inputValue > restPayment
                        ? ""
                        : inputValue
                      : inputValue,
                }
              : singleTable
          );
          setPaymentTable(updatedTable);
        }
      }
    } else if (isCashAccount) {
      const updatedTable = paymentTable.map((singleTable: any) =>
        singleTable.index === accountIndex
          ? { ...singleTable, paymentAmount: inputValue }
          : singleTable
      );
      setPaymentTable(updatedTable);
    }
  };

  return (
    <aside className={cn("", className)}>
      <div
        className={
          scrollable ? "max-h-[350px] overflow-y-auto scroll-hidden" : ""
        }
      >
        {paymentTable?.map((singleAccount: any, accountIndex: number) => (
          <ul key={accountIndex} className="grid grid-flow-col gap-x-2 gap-y-1">
            <li>
              {accountIndex === 0 ? (
                <InputWrapper label="#" error="" labelFor="add_new_method">
                  {/* ADD PAYMENT METHOD TABLE */}
                  <Button
                    type="button"
                    className="group relative"
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
                      Add Payment Method
                    </span>
                    <span className="sr-only">
                      Add Another Pay Method Button
                    </span>
                  </Button>
                </InputWrapper>
              ) : (
                <InputWrapper label="#" error="" labelFor="add_new_method">
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
                          Remove Payment Method
                        </span>
                        <span className="sr-only">
                          Remove Pay Method Button
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Payment Method Removal Confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this payment method?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            removePaymentTableHandler(accountIndex)
                          }
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </InputWrapper>
              )}
            </li>
            <li className="w-full">
              <InputWrapper
                labelFor="paying_method"
                label=""
                className={`w-full  ${
                  sidebarOpen && shrink
                    ? "lg:w-[94px] xl:w-[128px] truncate"
                    : `${shrink && "lg:w-[130px] xl:w-full"}`
                }`}
              >
                <Select
                  onOpenChange={(open: boolean) => setAccountUpdate(open)}
                  onValueChange={(value: any) => {
                    // THIS CONDITION PREVENT THE UPDATE DATA AUTOMATICALLY
                    if (accountUpdate) {
                      const targetTableAmount =
                        paymentTable.find(
                          (singleTable2: any) => singleTable2?.id === +value
                        )?.paymentAmount || 0;

                      const updatedTable = paymentTable.map(
                        (singleTable: any) =>
                          singleTable.index === accountIndex
                            ? {
                                ...singleTable,
                                accountId: +value,
                                // accountType: accountsData?.data?.find(
                                //   (singleAccount: any) =>
                                //     singleAccount.id === +value
                                // ).accountType,
                                paymentAmount:
                                  +targetTableAmount > 0
                                    ? 0
                                    : targetTableAmount,
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
                    id="paying_method"
                    className={`w-full ${
                      sidebarOpen && shrink
                        ? "lg:w-[90px] xl:w-[120px] truncate"
                        : `${shrink && "lg:w-[130px] xl:w-full"}`
                    }`}
                  >
                    <SelectValue placeholder="" />
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
                            disabled={
                              watch(property).length > 0 &&
                              watch(property)?.some(
                                (accountItem2: any) =>
                                  accountItem2?.accountId === singleAccount?.id
                              )
                            }
                            className="cursor-pointer"
                            key={singleAccount?.id}
                            value={singleAccount?.id}
                          >
                            {singleAccount?.accountName}
                          </SelectItem>
                        )))}
                  </SelectContent>
                </Select>
              </InputWrapper>
            </li>
            <li className="w-full">
              <InputWrapper label="" labelFor="paying_amount">
                {/* ENTER AMOUNT FILED */}
                <Input
                  disabled={!singleAccount?.accountId}
                  type="number"
                  onWheel={(event) => event.currentTarget.blur()}
                  value={singleAccount.paymentAmount || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    addPaymentAmountHandler(
                      +e.target.value,
                      singleAccount,
                      accountIndex
                    )
                  }
                  id="paying_amount"
                  placeholder=""
                />
              </InputWrapper>
            </li>
          </ul>
        ))}
      </div>
    </aside>
  );
};

export default AddReceivedPaymentTableRequired;
