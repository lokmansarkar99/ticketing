import Submit from "@/components/common/form/Submit";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuthorizeExpenseMutation } from "@/store/api/accounts/accountsDashboardApi";
import { useGetAccountsQuery } from "@/store/api/finance/accountApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";

interface AuthorizeExpenseModalProps {
  expenseId: number;
  editStatus: boolean;
  closeModal: () => void;
  amount: number;
}

const AuthorizeExpenseModal: FC<AuthorizeExpenseModalProps> = ({
  expenseId,
  editStatus,
  closeModal,
  amount,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const [authorizeExpense, { isLoading: submitting, error: errorsubmit }] =
    useAuthorizeExpenseMutation();
  const { data: accountList, isLoading: accountListLoading } =
    useGetAccountsQuery("All");

  const [accounts, setAccounts] = useState([{ accountId: "", amount: "" }]);
  const [edit, setEdit] = useState(editStatus);
  const [amountError, setAmountError] = useState<string | null>(null);

  const onSubmit = async () => {
    const totalAmount = accounts.reduce(
      (sum, acc) => sum + Number(acc.amount),
      0
    );

    if (!edit && totalAmount !== amount) {
      setAmountError(
        translate(
          "মোট পরিমাণ অবশ্যই নির্ধারিত পরিমাণের সমান হতে হবে।",
          "Total amount must match the required amount."
        )
      );
      return;
    }

    const result = await authorizeExpense({
      expenseId,
      body: edit
        ? { edit }
        : {
            edit,
            accounts: accounts.map((acc) => ({
              accountId: Number(acc.accountId),
              amount: Number(acc.amount),
            })),
          },
    });

    if (result.data?.success) {
      toast({
        title: translate("ব্যয় অনুমোদিত", "Expense Authorized"),
        description: translate(
          "আপনার পরিবর্তনগুলি সফলভাবে সংরক্ষিত হয়েছে।",
          "Your changes were saved successfully."
        ),
      });
      closeModal();
    } else {
      toast({
        title: translate(
          "অনুমোদন ব্যয় ব্যর্থ",
          "Expense Authorization Failed"
        ),
        description: translate(
          "দয়া করে আবার চেষ্টা করুন।",
          "Please try again."
        ),
        variant: "destructive",
      });
    }
  };

  const addAccountField = () =>
    setAccounts([...accounts, { accountId: "", amount: "" }]);
  const removeAccountField = (index: number) =>
    setAccounts(accounts.filter((_, i) => i !== index));

  const handleInputChange = (
    index: number,
    field: "accountId" | "amount",
    value: string
  ) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
    setAmountError(null);
  };

  if (accountListLoading) return <DetailsSkeleton columns={3} items={10} />;

  return (
    <DialogContent>
      <DialogTitle>
        {translate("অনুমোদন ব্যয়", "Authorize Expense")}
      </DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4 mt-4"
      >
        <label>
          <input
            type="checkbox"
            checked={edit}
            onChange={() => setEdit(!edit)}
          />
          {translate("এডিট মোড", "Edit Mode")}
        </label>

        {!edit &&
          accounts.map((account, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Select
                value={account.accountId}
                onValueChange={(value) =>
                  handleInputChange(index, "accountId", value)
                }
              >
                <SelectTrigger
                  id={`account-select-${index}`}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={translate(
                      "অ্যাকাউন্ট নির্বাচন করুন",
                      "Select Account"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {accountList?.data.map((acc: any) => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>
                      {acc.bankName} - {acc.accountHolderName} (
                      {acc.accountNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder={translate("পরিমাণ", "Amount")}
                value={account.amount}
                onChange={(e) =>
                  handleInputChange(index, "amount", e.target.value)
                }
                className="w-1/2"
              />

              {index > 0 && (
                <Button
                  variant="outline"
                  onClick={() => removeAccountField(index)}
                >
                  {translate("সরান", "Remove")}
                </Button>
              )}
            </div>
          ))}

        {amountError && <p className="text-red-500">{amountError}</p>}

        {!edit && (
          <Button type="button" onClick={addAccountField} variant="outline">
            {translate("আরও যোগ করুন", "Add More")}
          </Button>
        )}

        <Submit
          loading={submitting}
          errors={errorsubmit}
          submitTitle={translate("জমা দিন", "Submit")}
          errorTitle={translate("অনুমোদন ব্যর্থ", "Authorization Failed")}
        />
      </form>
    </DialogContent>
  );
};

export default AuthorizeExpenseModal;
