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
  useDeleteCoachMutation,
  useGetCoachesQuery,
} from "@/store/api/vehiclesSchedule/coachApi";
import { Coach } from "@/types/dashboard/vehicleeSchedule.ts/coach";
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
import AddCoach from "./AddCoach";
import DetailsCoach from "./DetailsCoach";
import UpdateCoach from "./UpdateCoach";

interface ICoachListProps {}
export interface ICoachStateProps {
  search: string;
  addCoachOpen: boolean;
  coachesList: Coach[];
  coachId: number | null;
}

const CoachList: FC<ICoachListProps> = () => {
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
  const [coachState, setCoachState] = useState<ICoachStateProps>({
    search: "",
    addCoachOpen: false,
    coachesList: [],
    coachId: null,
  });

  const { data: coachesData, isLoading: coachesLoading } = useGetCoachesQuery({
    search: coachState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });

  const [deleteCoach] = useDeleteCoachMutation({});

  useEffect(() => {
    const customizeCoachesData = coachesData?.data?.map(
      (singleCoach: Coach, userIndex: number) => ({
        ...singleCoach,
        noOfSeat: singleCoach?.noOfSeat || fallback.quantity,
        schedule: singleCoach?.schedule,
        // fare: singleCoach?.fare?.amount,
        // fromCounter: singleCoach?.fromCounter?.name,
        // destinationCounter: singleCoach?.destinationCounter?.name,
        route: singleCoach?.route?.routeName,
        // dummyActive: singleCoach?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(coachesData, userIndex),
      })
    );

    setCoachState((prevState: ICoachStateProps) => ({
      ...prevState,
      coachesList: customizeCoachesData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: coachesData?.meta,
    }));
  }, [coachesData]);
  // const [updateCoach] = useUpdateCoachMutation();
  // const handleToggleStatus = async (id: number, currentStatus: boolean) => {
  //   try {
  //     const result = await updateCoach({
  //       id,
  //       data: { active: !currentStatus },
  //     });
  //     if (result.data?.success) {
  //       toast({
  //         title: currentStatus
  //           ? translate("কোচ নিষ্ক্রিয় করা হয়েছে", "Coach deactivated")
  //           : translate("কোচ সক্রিয় করা হয়েছে", "Coach activated"),
  //         description: toastMessage("update", translate("কোচ", "coach")),
  //       });

  //       // Update local state to reflect the change
  //       setCoachState((prevState) => ({
  //         ...prevState,
  //         coachesList: prevState.coachesList.map((coach) =>
  //           coach.id === id ? { ...coach, active: !currentStatus } : coach
  //         ),
  //       }));
  //     }
  //   } catch (error) {
  //     toast({
  //       title: translate("কোচ যোগ করতে ত্রুটি", "Failed to update status"),
  //       description: toastMessage("add", translate("কোচ", "coach")),
  //     });
  //   }
  // };
  const coachDeleteHandler = async (id: number) => {
    const result = await deleteCoach(id);

    if (result.data?.success) {
      toast({
        title: translate("কোচ মুছে ফেলার বার্তা", "Message for deleting coach"),
        description: toastMessage("delete", translate("কোচ", "coach")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "coachNo",
      header: translate("কোচ নম্বর", "Coach No"),
    },

    {
      accessorKey: "noOfSeat",
      header: translate("আসন সংখ্যা", "Number of Seat"),
    },
    {
      accessorKey: "schedule",
      header: translate("সময়সূচী", "Schedule"),
    },
    // {
    //   accessorKey: "fare",
    //   header: translate("ভাড়া", "Fare"),
    // },
    // {
    //   accessorKey: "fromCounter",
    //   header: translate("প্রস্থান কাউন্টার", "From Counter"),
    // },
    // {
    //   accessorKey: "destinationCounter",
    //   header: translate("গন্তব্য কাউন্টার", "Destination Counter"),
    // },
    {
      accessorKey: "route",
      header: translate("রুট", "Route"),
    },

    // {
    //   header: translate("অবস্থা", "Status"),
    //   cell: ({ row }) => {
    //     const coach = row.original as Coach & { dummyActive: string };
    //     return (
    //       <Button
    //         variant={coach.active ? "success" : "destructive"}
    //         className=" flex justify-center px-4 py-1"
    //         size="xs"
    //         shape="pill"
    //         onClick={() => handleToggleStatus(coach.id, coach.active)}
    //       >
    //         {coach.active
    //           ? translate("সক্রিয় করুন", "Activate")
    //           : translate("নিষ্ক্রিয় করুন", "Deactivate")}
    //       </Button>
    //     );
    //   },
    // },
    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coach = row.original as Coach;
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
              {/* UPDATE COACH */}
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
                  <UpdateCoach id={coach?.id} />
                </DialogContent>
              </Dialog>
              {/* DETAILS COACH */}
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
                <DialogContent size="lg">
                  <DetailsCoach id={coach?.id} />
                </DialogContent>
              </Dialog>
              {/* Activate COACH */}

              {/* USER DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => coachDeleteHandler(coach?.id)}
                alertLabel={translate("কোচ", "Coach")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (coachesLoading) {
    return <TableSkeleton columns={6} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "কোচের তালিকা এবং সকল তথ্য উপাত্ত",
          "Coach list and all ralevnet information & data"
        )}
        heading={translate("কোচ", "Coach")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCoachState((prevState: ICoachStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.coach.placeholder.bn,
                  searchInputLabelPlaceholder.coach.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={coachState.addCoachOpen}
                onOpenChange={(open: boolean) =>
                  setCoachState((prevState: ICoachStateProps) => ({
                    ...prevState,
                    addCoachOpen: open,
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
                      {translate("কোচ যুক্ত করুন", "Add Coach")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddCoach setCoachState={setCoachState} />
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
          data={coachState.coachesList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CoachList;
