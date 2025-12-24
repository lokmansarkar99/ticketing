import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { TableWrapper } from "@/components/common/wrapper/TableWrapper";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import EditCoachAssignPage from "./EditCoachAssignPage";
import {
  useDeleteCoachAssignMutation,
  useGetCoachAssignAllQuery,
} from "@/store/api/vehiclesSchedule/coachAssignApi";

export interface CoachAssign {
  id: number;
  userId: number;
  counterId: number;
  day: number;
  hour: number;
  minute: number;
  user?: {
    userName: string;
  };
  counter?: {
    name: string;
    address: string;
  };
  BookingRoutePermission?: {
    id: number;
    coachAssignId: number;
    routeId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  SellingRoutePermission?: {
    id: number;
    coachAssignId: number;
    routeId: number;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  index?: number;
}

interface ICoachAssignListProps {}
export interface ICoachAssignStateProps {
  search: string;
  addCoachAssignOpen: boolean;
  coachAssignsList: CoachAssign[];
  coachAssignId: number | null;
}

const CoachAssignToCounterMaster: FC<ICoachAssignListProps> = () => {
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

  const [coachAssignState, setCoachAssignState] =
    useState<ICoachAssignStateProps>({
      search: "",
      addCoachAssignOpen: false,
      coachAssignsList: [],
      coachAssignId: null,
    });

  const {
    data: coachAssignsData,
    isLoading: coachAssignLoading,
  } = useGetCoachAssignAllQuery({
    search: coachAssignState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });


  const [deleteCoachAssign] = useDeleteCoachAssignMutation();

  useEffect(() => {
    if (!coachAssignsData?.data) return;

    const customizeCoachAssignsData = coachAssignsData.data.map(
      (singleCoachAssign: CoachAssign, coachAssignIndex: number) => ({
        ...singleCoachAssign,
        index: generateDynamicIndexWithMeta(coachAssignsData, coachAssignIndex),
      })
    );

    setCoachAssignState((prevState: ICoachAssignStateProps) => ({
      ...prevState,
      coachAssignsList: customizeCoachAssignsData,
    }));

    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: coachAssignsData.meta,
    }));
  }, [coachAssignsData]);

  const coachAssignDeleteHandler = async (id: number) => {
    const result = await deleteCoachAssign(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ অ্যাসাইনমেন্ট মুছে ফেলার বার্তা",
          "Message for deleting coach assignment"
        ),
        description: toastMessage(
          "delete",
          translate("কোচ অ্যাসাইনমেন্ট", "Coach Assignment")
        ),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<CoachAssign>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: ({ row }) => row.original.index ?? "-",
    },

    {
      header: translate("ব্যবহারকারীর নাম", "User Name"),
      cell: ({ row }) => row.original.user?.userName ?? "-",
    },

    {
      header: translate("কাউন্টার", "Counter"),
      cell: ({ row }) => row.original.counter?.name ?? "-",
    },

    {
      header: translate("কাউন্টার ঠিকানা", "Counter Address"),
      cell: ({ row }) => row.original.counter?.address ?? "-",
    },

    {
      header: translate("বুকিং রুট", "Booking Routes"),
      cell: ({ row }) =>
        row.original.BookingRoutePermission?.length
          ? row.original.BookingRoutePermission.map((r) => r.routeId).join(", ")
          : "-",
    },

    {
      header: translate("টিকেট বিক্রয় রুট", "Selling Routes"),
      cell: ({ row }) =>
        row.original.SellingRoutePermission?.length
          ? row.original.SellingRoutePermission.map((r) => r.routeId).join(", ")
          : "-",
    },

    {
      header: translate("বুকিং সময়", "Booking Time"),
      cell: ({ row }) => {
        const c = row.original;
        return `${c.day ?? 0} ${translate("দিন", "Day(s)")}, ${c.hour ?? 0} ${translate("ঘন্টা", "Hour(s)")}, ${c.minute ?? 0} ${translate("মিনিট", "Minute(s)")}`;
      },
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coachAssign = row.original;
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
                  <EditCoachAssignPage id={coachAssign?.id} user={coachAssign?.user?.userName} setCoachAssignState={setCoachAssignState} />
                </DialogContent>
              </Dialog>

              <DeleteAlertDialog
                position="start"
                actionHandler={() => coachAssignDeleteHandler(coachAssign.id)}
                alertLabel={translate("কোচ অ্যাসাইনমেন্ট", "Coach Assignment")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (coachAssignLoading) {
    return <TableSkeleton columns={columns.length} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        heading={translate(
          "কোচ অ্যাসাইন টু কাউন্টার মাস্টার",
          "Coach Assign To Counter Master"
        )}
      >
        <div className="flex justify-end mb-4">
          <Link to="/admin/add_coach_assign">
            <Button className="group relative">
              <LuPlus />
              <span>
                {translate("কোচ অ্যাসাইনমেন্ট যুক্ত করুন", "Add Coach Assignment")}
              </span>
            </Button>
          </Link>
        </div>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachAssignState.coachAssignsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CoachAssignToCounterMaster;
