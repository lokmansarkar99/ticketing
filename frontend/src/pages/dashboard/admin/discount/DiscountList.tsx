/* eslint-disable @typescript-eslint/ban-ts-comment */
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeleteDiscountMutation,
  useGetAllDiscountsQuery,
} from "@/store/api/discount/discountApi";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import CreateDiscount from "./CreateDiscount";
import EditDiscount from "./EditDiscount";

export interface Discount {
  id: number;
  title: string;
  discountType: "Fixed" | "Percentage";
  discount: number;
  startDate: Date | string;
  endDate: Date | string;
  active?: boolean; // Optional if you have status field
  code?: string; // Optional if you have discount codes
  createdAt?: Date | string; // Optional timestamps
  updatedAt?: Date | string;
}
export const dummyData = [];
interface IDiscountListProps { }
export interface IDiscountStateProps {
  search: string;
  addDiscountOpen: boolean;
  discountsList: Partial<Discount[]>;
  discountId: number | null;
}

const DiscountList: FC<IDiscountListProps> = () => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

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

  const [discountState, setDiscountState] = useState<IDiscountStateProps>({
    search: "",
    addDiscountOpen: false,
    discountsList: [],
    discountId: null,
  });

  const { data: discountsData, isLoading: discountLoading } = useGetAllDiscountsQuery({
    search: discountState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteDiscount] = useDeleteDiscountMutation();

  useEffect(() => {
    const customizeDiscountsData = discountsData?.data?.map(
      (singleDiscount: Discount, discountIndex: number) => ({
        ...singleDiscount,
        index: generateDynamicIndexWithMeta(discountsData, discountIndex),
      })
    );

    setDiscountState((prevState: IDiscountStateProps) => ({
      ...prevState,
      discountsList: customizeDiscountsData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: discountsData?.meta,
    }));
  }, [discountsData]);

  const discountDeleteHandler = async (id: number) => {
    const result = await deleteDiscount(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "ডিসকাউন্ট মুছে ফেলার বার্তা",
          "Message for deleting discount"
        ),
        description: toastMessage("delete", translate("ডিসকাউন্ট", "discount")),
      });
      playSound("remove");
    }
  };



  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      header: translate("টাইটেল", "Title"),
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return `${discount.title}`;
      },
    },
    {
      header: translate("ডিসকাউন্ট", "Discount"),
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return `${discount.discount}`;
      },
    },
    {
      header: translate("ডিস্কাউন্ট এর ধরণ", "Discount Type"),
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return `${discount.discountType}`;
      },
    },
    {
      accessorKey: "startDate",
      header: translate("শুরুর তারিখ", "Start Date"),
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return new Date(discount.startDate).toLocaleDateString();
      },
    },
    {
      accessorKey: "endDate",
      header: translate("শেষ তারিখ", "End Date"),
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return new Date(discount.endDate).toLocaleDateString();
      },
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const discount = row.original as Discount;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রমগুলো", "Actions")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* UPDATE DISCOUNT */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("সম্পাদনা করুন", "Update")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <EditDiscount id={discount?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS DISCOUNT */}
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsDiscount id={discount?.id} />
                </DialogContent>
              </Dialog> */}

              {/* DISCOUNT DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => discountDeleteHandler(discount.id)}
                alertLabel={translate("ডিসকাউন্ট", "Discount")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (discountLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ডিসকাউন্টের তালিকা এবং সকল তথ্য উপাত্ত",
          "Discount list and all relevant information & data"
        )}
        heading={translate("ডিসকাউন্ট", "Discount")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDiscountState((prevState: IDiscountStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate("সার্চ ডিসকাউন্ট", "Search discount")}
              />
            </li>
            <li>
              <Dialog
                open={discountState.addDiscountOpen}
                onOpenChange={(open: boolean) =>
                  setDiscountState((prevState: IDiscountStateProps) => ({
                    ...prevState,
                    addDiscountOpen: open,
                  }))
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="green"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("ডিসকাউন্ট যুক্ত করুন", "Add Discount")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <CreateDiscount setDiscountState={setDiscountState} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="green" size="sm">
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
          data={discountState.discountsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default DiscountList;