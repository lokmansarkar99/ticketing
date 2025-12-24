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
import { CoachConfiguration } from "@/types/dashboard/vehicleeSchedule.ts/coachConfiguration";
import { fallback } from "@/utils/constants/common/fallback";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddCoachConfiguration from "./AddCoachConfiguration";
import DetailsCoachConfiguration from "./DetailsCoachConfiguration";
import UpdateCoachConfiguration from "./UpdateCoachConfiguration";
import {
  useDeleteCoachMutation,
  useGetCoachesQuery,
  useUpdateCoachActiveMutation,
} from "@/store/api/vehiclesSchedule/coachApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSeatPlansQuery } from "@/store/api/vehiclesSchedule/seatPlanApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";

interface ICoachConfigurationListProps {}
export interface ICoachConfigurationStateProps {
  search: string;
  addCoachConfigurationOpen: boolean;
  coachConfigurationsList: CoachConfiguration[];
}

const CoachConfigurationList: FC<ICoachConfigurationListProps> = () => {
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

  const [filters, setFilters] = useState({
    coachNo: "",
    routeId: "",
    seatPlanId: "",
    fromCounterId: "",
    destinationCounterId: "",
    type: "",
    status: "",
    schedule: "",
  });

  const { data: routesData } = useGetRoutesQuery({
    page: 1,
    size: 1000,
  });

  const { data: seatPlansData } = useGetSeatPlansQuery({
    page: 1,
    size: 1000,
  });

  const { data: schedulesData } = useGetSchedulesQuery({
    page: 1,
    size: 1000,
  });

  const [coachConfigurationState, setCoachConfigurationState] =
    useState<ICoachConfigurationStateProps>({
      search: "",
      addCoachConfigurationOpen: false,
      coachConfigurationsList: [],
    });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const {
    data: coachConfigurationsData,
    isLoading: coachConfigurationsLoading,
  } = useGetCoachesQuery({
    search: coachConfigurationState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
    ...appliedFilters,
  });

  const { data: countersData } = useGetCountersQuery({
    page: 1,
    size: 500,
  });

  const [deleteCoachConfiguration] = useDeleteCoachMutation({});
  const [updateCoachConfiguration] = useUpdateCoachActiveMutation();

  useEffect(() => {
    const customizeCoachConfigurationData = coachConfigurationsData?.data?.map(
      (
        singleCoachConfiguration: CoachConfiguration,
        configurationIndex: number
      ) => ({
        ...singleCoachConfiguration,
        coachNo: singleCoachConfiguration?.coachNo || fallback.notFound.en,
        registrationNo:
          singleCoachConfiguration?.registrationNo || fallback.notFound.en,
        schedule: singleCoachConfiguration?.schedule || fallback.notFound.en,
        type: singleCoachConfiguration?.type || fallback.notFound.en,
        coachType: singleCoachConfiguration.coachType,
        index: generateDynamicIndexWithMeta(
          coachConfigurationsData,
          configurationIndex
        ),
        route: singleCoachConfiguration?.route?.routeName,
        fromCounter: singleCoachConfiguration?.fromCounter?.name,
        destinationCounter: singleCoachConfiguration?.destinationCounter?.name,
      })
    );

    setCoachConfigurationState((prevState: ICoachConfigurationStateProps) => ({
      ...prevState,
      coachConfigurationsList: customizeCoachConfigurationData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: coachConfigurationsData?.meta,
    }));
  }, [coachConfigurationsData]);

  const handleToggleSaleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const result = await updateCoachConfiguration({
        id,
        data: { active: !currentStatus },
      });
      if (result.data?.success) {
        toast({
          title: currentStatus
            ? translate(
                "কনফিগারেইশন নিষ্ক্রিয় করা হয়েছে",
                "Configuration deactivated"
              )
            : translate(
                "কনফিগারেইশন সক্রিয় করা হয়েছে",
                "Configuration activated"
              ),
          description: toastMessage(
            "update",
            translate("কোচ কনফিগারেইশন", "coach configuration")
          ),
        });
        // Update local state to reflect the change
        setCoachConfigurationState((prevState) => ({
          ...prevState,
          coachConfigurationsList: prevState.coachConfigurationsList.map(
            (config) =>
              config.id === id ? { ...config, active: !currentStatus } : config
          ),
        }));
      }
    } catch (error) {
      toast({
        title: translate(
          "কোচ স্ট্যাটাস আপডেট করতে ত্রুটি",
          "Failed to update coach status"
        ),
        description: toastMessage("Error", translate("কোচ", "coach")),
        variant: "destructive",
      });
    }
  };

  const coachConfigurationDeleteHandler = async (id: number) => {
    const result = await deleteCoachConfiguration(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "কোচ কনফিগারেইশন মুছে ফেলার বার্তা",
          "Message for deleting coach configuration"
        ),
        description: toastMessage(
          "delete",
          translate("কোচ কনফিগারেইশন", "coach configuration")
        ),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<CoachConfiguration>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "coachNo",
      header: translate("কোচ নম্বর", "Coach No"),
    },
    {
      accessorKey: "route",
      header: translate("কোচ নম্বর", "Route"),
    },
    {
      accessorKey: "coachType",
      header: translate("কোচ ধরন", "Coach Type"),
    },
    {
      accessorKey: "fromCounter",
      header: translate("কোচ নম্বর", "From Counter"),
    },
    {
      accessorKey: "destinationCounter",
      header: translate("কোচ নম্বর", "Destination Counter"),
    },
    {
      accessorKey: "schedule",
      header: translate("সময়সূচী", "Schedule"),
    },

    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const coachConfig = row.original as CoachConfiguration;
        return (
          <button
            onClick={() =>
              handleToggleSaleStatus(coachConfig.id, coachConfig.active)
            }
            className={`
              relative inline-flex h-6 w-[86px] items-center p-2 rounded-full transition-colors duration-300
              ${coachConfig.active ? "bg-green-500" : "bg-red-500"}
            `}
          >
            {coachConfig.active && (
              <span className="text-white text-[12px]">
                {translate("সক্রিয়", "Active")}
              </span>
            )}
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
                ${coachConfig.active ? "translate-x-6" : "translate-x-[-3px]"}
              `}
            />
            {!coachConfig.active && (
              <span className="text-white text-[12px] text-right ml-auto">
                {translate("নিষ্ক্রিয়", "Inactive")}
              </span>
            )}
          </button>
        );
      },
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const coachConfig = row.original as CoachConfiguration;
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
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateCoachConfiguration id={coachConfig?.id} />
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
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsCoachConfiguration id={coachConfig?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() =>
                  coachConfigurationDeleteHandler(coachConfig?.id)
                }
                alertLabel={translate("কোচ কনফিগারেইশন", "Coach Configuration")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (coachConfigurationsLoading) {
    return <TableSkeleton columns={8} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "কোচ কনফিগারেইশনের তালিকা এবং সকল তথ্য উপাত্ত",
          "Coach configuration list and all relevant information & data"
        )}
        heading={translate("কোচ কনফিগারেইশন", "Coach Configuration")}
      >
        <TableToolbar alignment="responsive">
          <div className="grid grid-cols-9 gap-2 bg-muted p-2 border rounded-sm mb-2">
            {/* Contact */}
            <Input
              placeholder={translate("যোগাযোগ", "Coach No")}
              value={filters.coachNo}
              onChange={(e) =>
                setFilters({ ...filters, coachNo: e.target.value })
              }
            />

            {/* Counter */}
            <Select
              value={filters.routeId}
              onValueChange={(value) =>
                setFilters({ ...filters, routeId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Route" />
              </SelectTrigger>
              <SelectContent>
                {routesData?.data?.length > 0 &&
                  routesData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.id}>
                        {r.routeName}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.fromCounterId}
              onValueChange={(value) =>
                setFilters({ ...filters, fromCounterId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="From Counter" />
              </SelectTrigger>
              <SelectContent>
                {countersData?.data?.length > 0 &&
                  countersData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.id}>
                        {r.name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.destinationCounterId}
              onValueChange={(value) =>
                setFilters({ ...filters, destinationCounterId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Destination Counter" />
              </SelectTrigger>
              <SelectContent>
                {countersData?.data?.length > 0 &&
                  countersData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.id}>
                        {r.name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>

            {/* Type */}
            {/* <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">Internal</SelectItem>
                <SelectItem value="EXTERNAL">External</SelectItem>
              </SelectContent>
            </Select> */}

            {/* Status */}
            <Select
              value={filters.seatPlanId}
              onValueChange={(value) =>
                setFilters({ ...filters, seatPlanId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seat Plan" />
              </SelectTrigger>
              <SelectContent>
                {seatPlansData?.data?.length > 0 &&
                  seatPlansData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.id}>
                        {r.name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">
                  {translate("সক্রিয়", "Active")}
                </SelectItem>
                <SelectItem value="false">
                  {translate("নিষ্ক্রিয়", "Inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.schedule}
              onValueChange={(value) =>
                setFilters({ ...filters, schedule: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Schedule" />
              </SelectTrigger>
              <SelectContent>
                {schedulesData?.data?.length > 0 &&
                  schedulesData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.time}>
                        {r.time}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>
            {/* Search Button */}
            <Button
              variant="green"
              onClick={() => {
                setQuery((prev) => ({ ...prev, page: 1 }));
                setAppliedFilters(filters);
              }}
            >
              {translate("অনুসন্ধান", "Search")}
            </Button>

            <ul className="flex items-center gap-x-2">
              <li>
                <Dialog
                  open={coachConfigurationState.addCoachConfigurationOpen}
                  onOpenChange={(open: boolean) =>
                    setCoachConfigurationState(
                      (prevState: ICoachConfigurationStateProps) => ({
                        ...prevState,
                        addCoachConfigurationOpen: open,
                      })
                    )
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
                        {translate(
                          "কোচ কনফিগারেইশন যুক্ত করুন",
                          "Add Coach Configuration"
                        )}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="xl">
                    <DialogTitle className="sr-only">empty</DialogTitle>
                    <AddCoachConfiguration
                      setCoachConfigurationState={setCoachConfigurationState}
                    />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="green" size="sm">
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
          </div>
        </TableToolbar>
        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={coachConfigurationState.coachConfigurationsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CoachConfigurationList;
