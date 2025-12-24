import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGetExpenseAccountDashboardQuery } from "@/store/api/accounts/accountsDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import AuthorizeExpenseModal from "./AuthorizeExpenseModal";

import ExpenseDetails from "./ExpenseDetails";

export interface IExpenseStateProps {
  search: string;
  expensesList: any[];
  authorizeModalOpen: boolean;
  detailsModalOpen: boolean;
  selectedExpenseId: number | null;
  selectedEditStatus: boolean;
}

export interface IAccountsManagementDashboardProps {}

const AccountsManagement: FC<IAccountsManagementDashboardProps> = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const [expenseState, setExpenseState] = useState<IExpenseStateProps>({
    search: "",
    authorizeModalOpen: false,
    detailsModalOpen: false,
    expensesList: [],
    selectedExpenseId: null,
    selectedEditStatus: false,
  });

  const { data: expenseData, isLoading: expenseLoading } =
    useGetExpenseAccountDashboardQuery({
      search: expenseState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  useEffect(() => {
    if (expenseData) {
      setExpenseState((prev) => ({
        ...prev,
        expensesList: expenseData?.data || [],
      }));
      setQuery((prev) => ({ ...prev, meta: expenseData?.meta }));
    }
  }, [expenseData]);

  const handleAuthorizeClick = (id: number, editStatus: boolean) => {
    setExpenseState((prev) => ({
      ...prev,
      authorizeModalOpen: true,
      selectedExpenseId: id,
      selectedEditStatus: editStatus,
    }));
  };

  const handleDetailsClick = (id: number) => {
    setExpenseState((prev) => ({
      ...prev,
      detailsModalOpen: true,
      selectedExpenseId: id,
    }));
  };

  const closeAuthorizeModal = () => {
    setExpenseState((prev) => ({
      ...prev,
      authorizeModalOpen: false,
      selectedExpenseId: null,
      selectedEditStatus: false,
    }));
  };

  const closeDetailsModal = () => {
    setExpenseState((prev) => ({
      ...prev,
      detailsModalOpen: false,
      selectedExpenseId: null,
    }));
  };

  const selectedExpense = expenseState.expensesList.find(
    (item) => item.id === expenseState.selectedExpenseId
  );

  const columns = [
    { accessorKey: "id", header: translate("আইডি", "ID") },
    {
      accessorKey: "coachConfig.coachNo",
      header: translate("কোচ নম্বর", "Coach Number"),
    },
    {
      accessorKey: "expenseCategory.name",
      header: translate("ক্যাটেগরি", "Category"),
    },
    {
      accessorKey: "routeDirection",
      header: translate("রুট নির্দেশ", "Route Direction"),
    },
    { accessorKey: "amount", header: translate("পরিমাণ", "Amount") },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
      cell: ({ row }: { row: any }) =>
        new Date(row.original.date).toLocaleDateString(),
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: any }) => {
        const expense = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রম", "Action")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Button
                onClick={() => handleDetailsClick(expense.id)}
                variant="outline"
                className="w-full flex justify-start"
                size="xs"
              >
                {translate("বিস্তারিত", "Details")}
              </Button>

              <Button
                onClick={() => handleAuthorizeClick(expense.id, expense.edit)}
                variant="outline"
                className="w-full flex justify-start"
                size="xs"
              >
                {translate("অনুমোদন করুন", "Authorize")}
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (expenseLoading) return <TableSkeleton columns={7} />;

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ব্যয়ের তালিকা এবং সকল তথ্য উপাত্ত",
          "Expense list and all relevant information & data"
        )}
        heading={translate("ব্যয়", "Expense")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExpenseState((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("search", "search")}
              />
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", "Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "PDF")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {translate("এক্সেল", "Excel")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={expenseState.expensesList}
        />
      </TableWrapper>

      <Dialog
        open={expenseState.authorizeModalOpen}
        onOpenChange={closeAuthorizeModal}
      >
        <DialogContent size="lg">
          <DialogTitle>{translate("অনুমোদন করুন", "Authorize")}</DialogTitle>
          {expenseState.selectedExpenseId && selectedExpense && (
            <AuthorizeExpenseModal
              expenseId={expenseState.selectedExpenseId}
              editStatus={expenseState.selectedEditStatus}
              closeModal={closeAuthorizeModal}
              amount={selectedExpense.amount}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={expenseState.detailsModalOpen}
        onOpenChange={closeDetailsModal}
      >
        <DialogContent size="lg">
          <DialogTitle>{translate("বিস্তারিত", "Details")}</DialogTitle>
          {selectedExpense && (
            <ExpenseDetails expense={{ expensesList: [selectedExpense] }} />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default AccountsManagement;
