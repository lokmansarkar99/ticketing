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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { format } from "date-fns";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";

import {
  useDeleteSupervisorExpenseMutation,
  useGetSupervisorExpensesQuery,
} from "@/store/api/superviosr/supervisorExpenseApi";
import { FiEdit } from "react-icons/fi";
import AddExpense from "./AddExpense";
import UpdateExpense from "./UpdateExpense";

const SupervisorExpenseList: FC = () => {
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
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(
    null
  );

  const {
    data: expensesData,
    isLoading,
    refetch,
  } = useGetSupervisorExpensesQuery({});
  const [deleteExpense] = useDeleteSupervisorExpenseMutation();

  useEffect(() => {
    if (expensesData?.meta) {
      setQuery((prev) => ({
        ...prev,
        meta: expensesData.meta,
      }));
    }
  }, [expensesData]);

  const handleDelete = async (id: number) => {
    const result = await deleteExpense(id);
    if (result?.data?.success) {
      toast({
        title: translate(
          "খরচ সফলভাবে মুছে ফেলা হয়েছে",
          "Expense Deleted Successfully"
        ),
      });
      refetch();
    }
  };

  const handleUpdateOpen = (id: number) => {
    setSelectedExpenseId(id);
    setIsUpdateOpen(true);
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
    { accessorKey: "amount", header: translate("টাকার পরিমাণ", "Amount") },
    {
      accessorKey: "routeDirection",
      header: translate("রুট", "Route Direction"),
    },
    {
      accessorKey: "date",
      header: translate("তারিখ", "Date"),
      cell: ({ getValue }: { getValue: any }) => {
        const dateValue = getValue();
        return <span>{format(new Date(dateValue), "dd-MM-yyyy")}</span>;
      },
    },
    {
      header: translate("কার্যক্রম", "Actions"),
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const expense = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateOpen(expense.id)}
            >
              <FiEdit className="mr-1" />
              {translate("সম্পাদনা করুন", "Edit")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(expense.id)}
            >
              <MdDelete className="mr-1 text-red-500" />
              {translate("মুছে ফেলুন", "Delete")}
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <PageWrapper>
      <TableWrapper heading={translate("খরচের তালিকা", "Expense List")}>
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
                      {translate("খরচ যোগ করুন", "Add Expense")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">Add Expense</DialogTitle>
                  <AddExpense setOpen={setIsAddOpen} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <Button variant="default" size="sm">
                <LuDownload className="size-4 mr-1" />
                {translate("এক্সপোর্ট", " Export")}
              </Button>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={expensesData?.data || []}
        />

        <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
          <DialogContent size="lg">
            <DialogTitle className="sr-only">Update Expense</DialogTitle>
            {selectedExpenseId && (
              <UpdateExpense id={selectedExpenseId} setOpen={setIsUpdateOpen} />
            )}
          </DialogContent>
        </Dialog>
      </TableWrapper>
    </PageWrapper>
  );
};

export default SupervisorExpenseList;
