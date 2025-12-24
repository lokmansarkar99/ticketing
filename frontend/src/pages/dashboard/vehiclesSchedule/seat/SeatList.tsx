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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeleteSeatMutation,
  useGetSeatsQuery,
} from "@/store/api/vehiclesSchedule/seatApi";
import { Seat } from "@/types/dashboard/vehicleeSchedule.ts/seat";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddSeat from "./AddSeat";
import UpdateSeat from "./UpdateSeat";

interface ISeatListProps {}

export interface ISeatStateProps {
  search: string;
  addSeatOpen: boolean;
  seatsList: Seat[];
}

const SeatList: FC<ISeatListProps> = () => {
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

  const [seatState, setSeatState] = useState<ISeatStateProps>({
    search: "",
    addSeatOpen: false,
    seatsList: [],
  });

  const { data: seatsData, isLoading: seatsLoading } = useGetSeatsQuery({
    search: seatState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteSeat] = useDeleteSeatMutation({});

  useEffect(() => {
    const customizeSeatsData = seatsData?.data?.map(
      (singleSeat: Seat & { name: string }, seatIndex: number) => ({
        ...singleSeat,
        name: singleSeat?.name?.toUpperCase(),
        index: generateDynamicIndexWithMeta(seatsData, seatIndex),
      })
    );

    setSeatState((prevState: ISeatStateProps) => ({
      ...prevState,
      seatsList: customizeSeatsData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: seatsData?.meta,
    }));
  }, [seatsData]);

  const seatDeleteHandler = async (id: number) => {
    const result = await deleteSeat(id);

    if (result.data?.success) {
      toast({
        title: translate("আসন মুছে ফেলার বার্তা", "Message for deleting seat"),
        description: toastMessage("delete", translate("আসন", "seat")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "name",
      header: translate("আসনের নাম", "Seat's Name"),
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const seat = row.original as Seat;
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
              {/* UPDATE SEAT */}
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
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateSeat setSeatState={setSeatState} id={seat?.id} />
                </DialogContent>
              </Dialog>

              {/* SEAT DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => seatDeleteHandler(seat?.id)}
                alertLabel={translate("আসন", "Seat")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (seatsLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "আসনের তালিকা এবং সকল তথ্য উপাত্ত",
          "Seat list and all ralevnet information & data"
        )}
        heading={translate("আসন", "Seat")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.seat.placeholder.bn,
                  searchInputLabelPlaceholder.seat.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={seatState.addSeatOpen}
                onOpenChange={(open: boolean) =>
                  setSeatState((prevState: ISeatStateProps) => ({
                    ...prevState,
                    addSeatOpen: open,
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
                      {translate("আসন যুক্ত করুন", "Add Seat")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddSeat setSeatState={setSeatState} />
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
          data={seatState.seatsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SeatList;
