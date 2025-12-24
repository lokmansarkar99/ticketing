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
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";

import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteSeatPlanMutation,
  useGetSeatPlansQuery,
} from "@/store/api/vehiclesSchedule/seatPlanApi";
import { playSound } from "@/utils/helpers/playSound";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import CreateSeatPlan from "./CreateSeatPlan";
import UpdateSeatPlan from "./EditSeatPlan";

interface ISeatPlanListProps {}

export interface SeatPlan {
  id: number;
  name: string;
  noOfSeat: number;
  createdAt: string;
  updatedAt: string;
}
export interface ISeatPlanStateProps {
  search: string;
  addSeatPlanOpen: boolean;
  seatPlansList: SeatPlan[];
}

export interface ISearchInputLabelPlaceholderProps {
  seatPlan?: {
    placeholder: {
      bn: string;
      en: string;
    };
  };
}

const searchInputLabelPlaceholder = {
  seatPlan: {
    placeholder: {
      bn: "সিট প্ল্যান খুঁজুন",
      en: "Search seat plan",
    },
  },
} as ISearchInputLabelPlaceholderProps;

const SeatPlanList: FC<ISeatPlanListProps> = () => {
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

  const [seatPlanState, setSeatPlanState] = useState<ISeatPlanStateProps>({
    search: "",
    addSeatPlanOpen: false,
    seatPlansList: [],
  });

  const { data: seatPlansData, isLoading: seatPlansLoading } =
    useGetSeatPlansQuery({
      search: seatPlanState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const [deleteSeatPlan] = useDeleteSeatPlanMutation({});

  useEffect(() => {
    const customizeSeatPlansData = seatPlansData?.data?.map(
      (singleSeatPlan: SeatPlan, seatPlanIndex: number) => ({
        ...singleSeatPlan,
        noOfSeat: singleSeatPlan?.noOfSeat,
        index: generateDynamicIndexWithMeta(seatPlansData, seatPlanIndex),
      })
    );

    setSeatPlanState((prevState: ISeatPlanStateProps) => ({
      ...prevState,
      seatPlansList: customizeSeatPlansData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: seatPlansData?.meta,
    }));
  }, [seatPlansData]);

  const seatPlanDeleteHandler = async (id: number) => {
    const result = await deleteSeatPlan(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "সিট প্ল্যান মুছে ফেলার বার্তা",
          "Message for deleting seat plan"
        ),
        description: toastMessage(
          "delete",
          translate("সিট প্ল্যান", "seat plan")
        ),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "name",
      header: translate("সিট প্ল্যানের নাম", "Seat Plan Name"),
    },
    {
      accessorKey: "noOfSeat",
      header: translate("সিটের সংখ্যা", "Number of Seats"),
    },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const seatPlan = row.original as SeatPlan;
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
              {/* UPDATE SEAT PLAN */}
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
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateSeatPlan
                    setSeatPlanState={setSeatPlanState}
                    id={seatPlan?.id}
                  />
                </DialogContent>
              </Dialog>
              {/* UPDATE SEAT PLAN */}
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
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsSeatPlan id={seatPlan.id} />
                </DialogContent>
              </Dialog> */}

              {/* SEAT PLAN DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => seatPlanDeleteHandler(seatPlan?.id)}
                alertLabel={translate("সিট প্ল্যান", "Seat Plan")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (seatPlansLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "সিট প্ল্যানের তালিকা এবং সকল তথ্য উপাত্ত",
          "Seat plan list and all relevant information & data"
        )}
        heading={translate("সিট প্ল্যান", "Seat Plan")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.seatPlan?.placeholder?.bn ||
                    "সিট প্ল্যান খুঁজুন",
                  searchInputLabelPlaceholder.seatPlan?.placeholder?.en ||
                    "Search seat plan"
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  setSeatPlanState((prevState: ISeatPlanStateProps) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
              />
            </li>
            <li>
              <Dialog
                open={seatPlanState.addSeatPlanOpen}
                onOpenChange={(open) =>
                  setSeatPlanState((prevState: ISeatPlanStateProps) => ({
                    ...prevState,
                    addSeatPlanOpen: open,
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
                      {translate("সিট প্ল্যান যুক্ত করুন", "Add Seat Plan")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <CreateSeatPlan setSeatPlanState={setSeatPlanState} />
                </DialogContent>
              </Dialog>
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
          data={seatPlanState.seatPlansList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SeatPlanList;
