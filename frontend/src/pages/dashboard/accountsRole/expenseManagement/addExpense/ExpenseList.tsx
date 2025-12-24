import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteExpenseAccountMutation,
  useGetAllExpenseAccountsQuery,
} from "@/store/api/extraExpense/extraExpenseApi";
import { IExtraExpense } from "@/types/dashboard/extraExpense/extraExpense";

import { cn } from "@/lib/utils";
import { fallback } from "@/utils/constants/common/fallback";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddExpense from "./AddExpense";
import ExtraExpenseDetails from "./ExtraExpenseDetails";

interface IExpenseListProps {}
export interface IExpenseStateProps {
  search: string;
  addExpenseOpen: boolean;
  expenseList: IExtraExpense[];
  expenseId: number | null;
}

const ExpenseList: FC<IExpenseListProps> = () => {
  const [actionItem, setActionItem] = useState<any>();
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  // PAGINATION STATE
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: 0,
      size: 10,
      total: 100,
      totalPage: 10,
    },
  });
  const [expenseState, setExpenseState] = useState<IExpenseStateProps>({
    search: "",
    addExpenseOpen: false,
    expenseList: [],
    expenseId: null,
  });
  // GET ALL EXPENSES QUERY
  const { data: expensesData, isLoading: expensesLoading } =
    useGetAllExpenseAccountsQuery({
      search: expenseState.search,
      page: query?.page,
      size: query?.size,
      sort: query?.sort,
    }) as any;

  // DELETE EXPENSE MUTATION
  const [deleteExpense] = useDeleteExpenseAccountMutation({}) as any;

  useEffect(() => {
    if (expensesData?.data?.length > 0) {
      const customizeExpense = expensesData?.data?.map(
        (singleExpense: any, expenseIndex: number) => ({
          ...singleExpense,
          index: generateDynamicIndexWithMeta(expensesData.data, expenseIndex),
          dummyCategory:
            singleExpense?.expenseCategoryAccount?.name || fallback.notFound,
          dummySubCategory:
            singleExpense?.expenseSubCategoryAccount?.name || fallback.notFound,
          dummyDate: singleExpense?.date,
          dummyTotalAmount:
            (singleExpense?.totalAmount?.toFixed(2) || fallback.amount) + "৳",
        })
      );
      setExpenseState((prevState: IExpenseStateProps) => ({
        ...prevState,
        expenseList: customizeExpense || [],
      }));
      setQuery((prevState: IQueryProps) => ({
        ...prevState,
        meta: expensesData?.meta,
      }));
    }
  }, [expensesData]);

  const expenseDeleteHandler = async (id: number) => {
    const result = await deleteExpense(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যয় মুছে ফেলার বার্তা",
          "Message for deleting expense"
        ),
        description: toastMessage("delete", translate("ব্যয়", "expense")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: "Index",
    },
    {
      accessorKey: "image",
      header: "Thumb",
      size: 20,
      cell: ({ row }) => {
        const expense = row.original as any;
        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-[2]"
              src={expense?.file}
              alt={`Image ${expense.name}`}
            />
          </div>
        );
      },
    },

    {
      accessorKey: "dummyCategory",
      header: "Category Name",
    },
    {
      accessorKey: "dummySubCategory",
      header: "Sub-category Name",
    },
    {
      accessorKey: "dummyTotalAmount",
      header: "Total Amount",
    },
    {
      accessorKey: "dummyDate",
      header: "Date",
    },
    {
      size: 20,
      header: "Action",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const category = row.original as any;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                onMouseEnter={() => setActionItem(category)}
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>Expense Actions</DropdownMenuLabel>

              {/* EXPENSE UPDATE BUTTON */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                    disabled
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90%] overflow-y-auto">
                  {/* EDIT EXPENSE FORM CONTAINER */}
                  {/* <EditExpense actionItem={actionItem} /> */}
                </DialogContent>
              </Dialog>
              {/* EXPENSE DETAILS BUTTON */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90%] overflow-y-auto">
                  {/* EXPENSE DETAILS */}

                  <ExtraExpenseDetails actionItem={actionItem} />
                </DialogContent>
              </Dialog>

              {/* EXPENSE DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => expenseDeleteHandler(category.id)}
                alertLabel="Slider Image"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // EXPENSE DATA LOADER
  if (expensesLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "খরচ অ্যাকাউন্টের তালিকা এবং সকল তথ্য উপাত্ত",
          "Expense Account list and all relevant information & data"
        )}
        heading={translate("খরচ অ্যাকাউন্ট", "Expense Account")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setExpenseState((prevState: IExpenseStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.expenseAccount.placeholder.bn,
                  searchInputLabelPlaceholder.expenseAccount.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={expenseState.addExpenseOpen}
                onOpenChange={(open: boolean) =>
                  setExpenseState((prevState: IExpenseStateProps) => ({
                    ...prevState,
                    addExpenseOpen: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate(" যুক্ত করুন", "Add Expense Account")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddExpense setExpenseState={setExpenseState} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" />
                    {translate("এক্সপোর্ট", " Export")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>
                    {translate("পিডিএফ", "Pdf")}
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
          data={expenseState.expenseList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default ExpenseList;
