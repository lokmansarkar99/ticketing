/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

import {
  useDeleteSupervisorExpenseCategoryMutation,
  useGetSupervisorExpenseCategoriesQuery,
} from "@/store/api/superviosr/supervisorExpenseCategoryApi";
import AddExpenseCategory from "./AddExpenseCategory";
import UpdateExpenseCategory from "./UpdateExpenseCategory";

const ExpenseCategoryList: FC = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  //@ts-ignore
  const {
    data: expenseCategoriesData,
    isLoading,
    refetch,
    //@ts-ignore
  } = useGetSupervisorExpenseCategoriesQuery();
  //@ts-ignore
  const [deleteExpenseCategory] = useDeleteSupervisorExpenseCategoryMutation();

  useEffect(() => {
    if (expenseCategoriesData?.meta) {
      setQuery((prev) => ({
        ...prev,
        meta: expenseCategoriesData.meta,
      }));
    }
  }, [expenseCategoriesData]);

  const handleDelete = async (id: number) => {
    const result = await deleteExpenseCategory(id);
    if (result.data?.success) {
      toast({
        title: translate(
          "খরচের বিভাগ মুছে ফেলা হয়েছে",
          "Expense Category Deleted"
        ),
      });
      refetch(); // Refetch data after delete
    }
  };

  const handleUpdateOpen = (id: number) => {
    setSelectedCategoryId(id);
    setIsUpdateOpen(true); // Open the update modal
  };

  const columns = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info: any) => {
        const rowIndex = info.row.index + 1 + (query.page - 1) * query.size;
        return <span>{rowIndex}</span>;
      },
    },
    {
      accessorKey: "name",
      header: translate("বিভাগের নাম", "Category Name"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      //@ts-ignore
      cell: ({ row }) => {
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
              <DropdownMenuItem onClick={() => handleUpdateOpen(category.id)}>
                {translate("সম্পাদনা করুন", "Update")}
              </DropdownMenuItem>
              <DeleteAlertDialog
                actionHandler={() => handleDelete(category.id)}
                alertLabel={translate("খরচের বিভাগ", "Expense Category")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <PageWrapper>
      <TableWrapper heading={translate("খরচের বিভাগ", "Expense Categories")}>
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                placeholder={translate("অনুসন্ধান", "Search")}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setQuery((prev) => ({ ...prev, search: e.target.value }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
              />
            </li>
            <li>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="icon"
                    className="group relative"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("বিভাগ যোগ করুন", "Add Category")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">Add Category</DialogTitle>
                  <AddExpenseCategory setOpen={setIsAddOpen} />
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={expenseCategoriesData?.data || []}
        />

        {/* Update Dialog */}
        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent size="lg">
            <DialogTitle className="sr-only">Update Category</DialogTitle>
            {selectedCategoryId && (
              <UpdateExpenseCategory
                id={selectedCategoryId}
                setOpen={(open) => {
                  setIsUpdateOpen(open);
                  if (!open) refetch(); // Refetch data on close
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </TableWrapper>
    </PageWrapper>
  );
};

export default ExpenseCategoryList;
