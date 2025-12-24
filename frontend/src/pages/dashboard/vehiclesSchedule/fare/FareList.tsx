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
import { cn } from "@/lib/utils";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react"; // Add ChangeEvent import
import { LuDownload, LuPlus } from "react-icons/lu";

import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteFareMutation,
  useGetFaresQuery,
} from "@/store/api/vehiclesSchedule/fareApi";
import { Fare } from "@/types/dashboard/vehicleeSchedule.ts/fare";
import formatter from "@/utils/helpers/formatter";
import { playSound } from "@/utils/helpers/playSound";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import AddFare from "./AddFare";
import DetailsFare from "./DetailsFare";
import UpdateFare from "./UpdateFare";

interface IFareListProps {}

export interface IFareStateProps {
  search: string;
  addFareOpen: boolean;
  faresList: any[];
}

const FareList: FC<IFareListProps> = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
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

  const [fareState, setFareState] = useState<IFareStateProps>({
    search: "",
    addFareOpen: false,
    faresList: [],
  });

  const { data: faresData, isLoading: faresLoading } = useGetFaresQuery({
    search: fareState.search, // Ensure this is passed correctly
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteFare] = useDeleteFareMutation({});

  useEffect(() => {
    const customizeFaresData = faresData?.data?.map(
      (singleFare: Fare, fareIndex: number) => ({
        ...singleFare,
        amount: formatter({ type: "amount", amount: singleFare?.amount }),
        type: singleFare?.type,
        index: generateDynamicIndexWithMeta(faresData, fareIndex),
      })
    );

    setFareState((prevState: IFareStateProps) => ({
      ...prevState,
      faresList: customizeFaresData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: faresData?.meta,
    }));
  }, [faresData]);

  const fareDeleteHandler = async (id: number) => {
    const result = await deleteFare(id);

    if (result.data?.success) {
      toast({
        title: translate("ভাড়া মুছে ফেলার বার্তা", "Message for deleting fare"),
        description: toastMessage("delete", translate("ভাড়া", "fare")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "route.routeName",
      header: translate("রুট", "Route"),
    },
    {
      accessorKey: "seatPlan.name",
      header: translate("সিট প্ল্যান", "Seat Plan"),
    },
    {
      accessorKey: "type",
      header: translate("কোচের ধরন", "Coach Type"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const fare = row.original as Fare;
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
              {/* UPDATE FARE */}
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
                <DialogContent size="xl">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateFare setFareState={setFareState} id={fare?.id} />
                </DialogContent>
              </Dialog>
              {/* UPDATE FARE */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Details")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsFare id={fare.id} />
                </DialogContent>
              </Dialog>

              {/* FARE DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => fareDeleteHandler(fare?.id)}
                alertLabel={translate("ভাড়া", "Fare")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (faresLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ভাড়ার তালিকা এবং সকল তথ্য উপাত্ত",
          "Fare list and all relevant information & data"
        )}
        heading={translate("ভাড়া", "Fare")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.fare.placeholder.bn,
                  searchInputLabelPlaceholder.fare.placeholder.en
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  setFareState((prevState: IFareStateProps) => ({
                    ...prevState,
                    search: searchValue, // Update the search state
                  }));
                }}
              />
            </li>
            <li>
              <Dialog
                open={fareState.addFareOpen}
                onOpenChange={(open) =>
                  setFareState((prevState: IFareStateProps) => ({
                    ...prevState,
                    addFareOpen: open,
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
                      {translate("ভাড়া যুক্ত করুন", "Add Fare")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="md" className="sm:max-w-[1200px]">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddFare setFareState={setFareState} />
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
          data={fareState.faresList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default FareList;
