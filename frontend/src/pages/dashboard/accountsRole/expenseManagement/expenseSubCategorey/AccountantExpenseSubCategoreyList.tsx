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

import { useGetExpenseCategoreyAccountListQuery } from "@/store/api/accounts/expenseDashboardApi";
import {
  useDeleteExpenseSubCategoreyOfAccountantMutation,
  useGetExpenseSubCategoreyAccountListQuery,
} from "@/store/api/accounts/expenseSubCategory";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import AddSubExpenseCategory from "./AddSubExpenseCategory";
import UpdateSubExpenseCategory from "./UpdateSubExpenseCategory";
// src/types/Category.ts

export interface ISubExpenseStateProps {
  search: string;
  subExpensesList: any[];
  addModalOpen: boolean;
  updateModalOpen: boolean;
  selectedSubExpense: {
    id: number | null;
    name: string;
    categoryId: number | null;
  } | null;
}

const AccountantExpenseSubCategoreyList: FC = () => {
  const { translate } = useCustomTranslator();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 100, totalPage: 10 },
  });

  const [subExpenseState, setSubExpenseState] = useState<ISubExpenseStateProps>(
    {
      search: "",
      subExpensesList: [],
      addModalOpen: false,
      updateModalOpen: false,
      selectedSubExpense: null,
    }
  );

  const { data: subExpenseData, isLoading: subExpenseLoading } =
    useGetExpenseSubCategoreyAccountListQuery({});

  const [deleteSubExpenseCategory] =
    useDeleteExpenseSubCategoreyOfAccountantMutation();

  useEffect(() => {
    if (subExpenseData) {
      setSubExpenseState((prev) => ({
        ...prev,
        subExpensesList: subExpenseData?.data || [],
      }));
      setQuery((prev) => ({ ...prev, meta: subExpenseData?.meta }));
    }
  }, [subExpenseData]);

  const handleDeleteClick = async (id: number) => {
    try {
      await deleteSubExpenseCategory(id).unwrap();
      setSubExpenseState((prev) => ({
        ...prev,
        subExpensesList: prev.subExpensesList.filter(
          (subExpense) => subExpense.id !== id
        ),
      }));
    } catch (error) {
      console.error("Failed to delete expense subcategory:", error);
    }
  };

  const closeUpdateModal = () => {
    setSubExpenseState((prev) => ({
      ...prev,
      updateModalOpen: false,
      selectedSubExpense: null, // Reset selected subexpense data
    }));
  };

  const handleUpdateClick = (subcategory: {
    id: number;
    name: string;
    expenseCategoryId: number;
  }) => {
    setSubExpenseState((prev) => ({
      ...prev,
      updateModalOpen: true,
      selectedSubExpense: {
        id: subcategory.id,
        name: subcategory.name,
        categoryId: subcategory.expenseCategoryId, // Corrected to use expenseCategoryId
      },
    }));
  };
  const { data: categoryData } = useGetExpenseCategoreyAccountListQuery({});

  const categoryMap = categoryData?.data?.reduce(
    (acc: Record<number, string>, category: { id: number; name: string }) => {
      acc[category.id] = category.name;
      return acc;
    },
    {}
  );
  const columns = [
    { accessorKey: "name", header: translate("নাম", "Name") },
    {
      accessorKey: "expenseCategoryId",
      header: translate("ক্যাটেগরি নাম", "Category Name"),
      cell: ({ row }: { row: any }) => {
        const categoryName = categoryMap?.[row.original.expenseCategoryId];
        return categoryName || translate("অজানা", "Unknown");
      },
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      //@ts-ignore
      cell: ({ row }) => {
        //@ts-ignore
        const subCategory = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuItem onClick={() => handleUpdateClick(subCategory)}>
                {translate("সম্পাদনা করুন", "Update")}
              </DropdownMenuItem>
              <DeleteAlertDialog
                actionHandler={() => handleDeleteClick(subCategory.id)}
                alertLabel={translate("খরচের উপবিভাগ", "Expense Subcategory")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (subExpenseLoading) return <TableSkeleton columns={3} />;

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ব্যয়ের উপবিভাগ তালিকা এবং সকল তথ্য উপাত্ত",
          "Expense subcategory list and all relevant information & data"
        )}
        heading={translate("ব্যয় উপবিভাগ", "Expense Subcategories")}
      >
        <TableToolbar alignment="responsive">
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSubExpenseState((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            className="lg:w-[300px] md:w-[250px] w-[200px]"
            placeholder={translate("অনুসন্ধান", "Search")}
          />
          <Button
            onClick={() =>
              setSubExpenseState((prev) => ({ ...prev, addModalOpen: true }))
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
          data={subExpenseState.subExpensesList}
        />
      </TableWrapper>

      {/* Add Modal */}
      <Dialog
        open={subExpenseState.addModalOpen}
        onOpenChange={(open) =>
          setSubExpenseState((prev) => ({ ...prev, addModalOpen: open }))
        }
      >
        <DialogContent>
          <DialogTitle>
            {translate(
              "নতুন ব্যয়ের উপবিভাগ যোগ করুন",
              "Add New Expense Subcategory"
            )}
          </DialogTitle>
          <AddSubExpenseCategory
            setOpen={(open) =>
              setSubExpenseState((prev) => ({ ...prev, addModalOpen: open }))
            }
          />
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog
        open={subExpenseState.updateModalOpen}
        onOpenChange={closeUpdateModal}
      >
        <DialogContent>
          <DialogTitle>
            {translate("সম্পাদনা করুন", "Edit Expense Subcategory")}
          </DialogTitle>
          {subExpenseState.selectedSubExpense && (
            <UpdateSubExpenseCategory
              subExpenseId={subExpenseState.selectedSubExpense.id!}
              closeModal={closeUpdateModal}
              initialData={{
                name: subExpenseState.selectedSubExpense.name,
                categoryId: subExpenseState.selectedSubExpense.categoryId!,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default AccountantExpenseSubCategoreyList;
