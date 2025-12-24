import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useDeleteExpenseCategoreyOfAccountantMutation,
  useGetExpenseCategoreyAccountListQuery,
} from "@/store/api/accounts/expenseDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import AddAccountantExpenseCategorey from "./AddAccountantExpenseCategorey";
import UpdateAccountantExpenseCategorey from "./UpdateAccountantExpenseCategorey";

export interface IExpenseStateProps {
  search: string;
  expensesList: any[];
  addModalOpen: boolean;
  updateModalOpen: boolean;
  selectedExpenseId: number | null;
  selectedExpenseName: string; // For pre-filling update modal
}

const AccountsExpenseCategoryList: FC = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const [expenseState, setExpenseState] = useState<IExpenseStateProps>({
    search: "",
    addModalOpen: false,
    updateModalOpen: false,
    expensesList: [],
    selectedExpenseId: null,
    selectedExpenseName: "",
  });

  const { data: expenseData, isLoading: expenseLoading } =
    useGetExpenseCategoreyAccountListQuery({});

  const [deleteExpenseCategorey] =
    useDeleteExpenseCategoreyOfAccountantMutation();

  useEffect(() => {
    if (expenseData) {
      setExpenseState((prev) => ({
        ...prev,
        expensesList: expenseData?.data || [],
      }));
      setQuery((prev) => ({ ...prev, meta: expenseData?.meta }));
    }
  }, [expenseData]);

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteExpenseCategorey(id).unwrap();
      setExpenseState((prev) => ({
        ...prev,
        expensesList: prev.expensesList.filter((expense) => expense.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete expense category:", error);
    }
  };

  const handleUpdateClick = (id: number, name: string) => {
    setExpenseState((prev) => ({
      ...prev,
      updateModalOpen: true,
      selectedExpenseId: id,
      selectedExpenseName: name,
    }));
  };

  const closeUpdateModal = () => {
    setExpenseState((prev) => ({
      ...prev,
      updateModalOpen: false,
      selectedExpenseId: null,
      selectedExpenseName: "",
    }));
  };

  const columns = [
    { accessorKey: "id", header: translate("আইডি", "ID") },
    { accessorKey: "name", header: translate("নাম", "Name") },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      //@ts-ignore
      cell: ({ row }: { row: any }) => {
        //@ts-ignore
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuItem
                onClick={() => handleUpdateClick(category.id, category.name)}
              >
                {translate("সম্পাদনা করুন", "Update")}
              </DropdownMenuItem>
              <DeleteAlertDialog
                actionHandler={() => handleDeleteClick(category.id)}
                alertLabel={translate("খরচের বিভাগ", "Expense Category")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (expenseLoading) return <TableSkeleton columns={4} />;

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ব্যয় বিভাগ এবং সকল তথ্য উপাত্ত",
          "Expense Category list and all relevant information & data"
        )}
        heading={translate("ব্যয় বিভাগ", "Expense Category")}
      >
        <TableToolbar alignment="responsive">
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setExpenseState((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="lg:w-[300px] md:w-[250px] w-[200px]"
            placeholder={translate("অনুসন্ধান", "Search")}
          />
          <Button
            onClick={() =>
              setExpenseState((prev) => ({ ...prev, addModalOpen: true }))
            }
          >
            {translate("নতুন যোগ করুন", "Add New")}
          </Button>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={expenseState.expensesList}
        />
      </TableWrapper>

      {/* Add Modal */}
      <Dialog
        open={expenseState.addModalOpen}
        onOpenChange={(open) =>
          setExpenseState((prev) => ({ ...prev, addModalOpen: open }))
        }
      >
        <DialogContent>
          <DialogTitle>
            {translate("নতুন ব্যয় যোগ করুন", "Add New Expense Category")}
          </DialogTitle>
          <AddAccountantExpenseCategorey
            setOpen={(open) =>
              setExpenseState((prev) => ({ ...prev, addModalOpen: open }))
            }
          />
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={expenseState.updateModalOpen}
        onOpenChange={closeUpdateModal}
      >
        <DialogContent>
          <DialogTitle>
            {translate("সম্পাদনা করুন", "Edit Expense Category")}
          </DialogTitle>
          {expenseState.selectedExpenseId && (
            <UpdateAccountantExpenseCategorey
              expenseId={expenseState.selectedExpenseId}
              closeModal={closeUpdateModal}
              initialData={{ name: expenseState.selectedExpenseName }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default AccountsExpenseCategoryList;
