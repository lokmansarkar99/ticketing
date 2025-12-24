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
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
} from "@/store/api/vehiclesSchedule/scheduleApi";
import { Schedule } from "@/types/dashboard/vehicleeSchedule.ts/schedule";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddSchedule from "./AddSchedule";
import UpdateSchedule from "./UpdateSchedule";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfScheduleList from "../../pdf/PdfScheduleList";
import { Loader } from "@/components/common/Loader";
import ScheduleListExcel from "../../exel/ScheduleListExcel";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

interface IScheduleListProps { }

export interface IScheduleStateProps {
  search: string;
  addScheduleOpen: boolean;
  schedulesList: Schedule[];
}

const ScheduleList: FC<IScheduleListProps> = () => {
    const { data: singleCms } = useGetSingleCMSQuery(
          {}
        );
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

  const [scheduleState, setScheduleState] = useState<IScheduleStateProps>({
    search: "",
    addScheduleOpen: false,
    schedulesList: [],
  });

  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({
      search: scheduleState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });

  const [deleteSchedule] = useDeleteScheduleMutation({});

  useEffect(() => {
    const customizeSchedulesData = schedulesData?.data?.map(
      (singleUser: Schedule, userIndex: number) => ({
        ...singleUser,
        time: singleUser?.time?.toUpperCase(),
        index: generateDynamicIndexWithMeta(schedulesData, userIndex),
      })
    );

    setScheduleState((prevState: IScheduleStateProps) => ({
      ...prevState,
      schedulesList: customizeSchedulesData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: schedulesData?.meta,
    }));
  }, [schedulesData]);

  const scheduleDeleteHandler = async (id: number) => {
    const result = await deleteSchedule(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "সময়সূচী মুছে ফেলার বার্তা",
          "Message for deleting schedule"
        ),
        description: toastMessage("delete", translate("সময়সূচী", "schedule")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "time",
      header: translate("সময়সূচী", "Schedule"),
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const schedule = row.original as Schedule;
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
              {/* UPDATE SCHEDULE */}
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
                  <UpdateSchedule id={schedule?.id} />
                </DialogContent>
              </Dialog>

              {/* STATION DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => scheduleDeleteHandler(schedule?.id)}
                alertLabel={translate("সময়সূচী", "Schedule")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (schedulesLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "সময়সূচী তালিকা এবং সকল তথ্য উপাত্ত",
          "Schedule list and all ralevnet information & data"
        )}
        heading={translate("সময়সূচী", "Schedule")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.schedule.placeholder.bn,
                  searchInputLabelPlaceholder.schedule.placeholder.en
                )}
                //@ts-ignore
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  //
                  setScheduleState((prevState: IScheduleStateProps) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
              />
            </li>
            <li>
              <Dialog
                open={scheduleState.addScheduleOpen}
                onOpenChange={(open: boolean) =>
                  setScheduleState((prevState: IScheduleStateProps) => ({
                    ...prevState,
                    addScheduleOpen: open,
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
                      {translate("সময়সূচী যুক্ত করুন", "Add Schedule")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddSchedule setScheduleState={setScheduleState} />
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
                    <PDFDownloadLink
                      document={
                        <PdfScheduleList
                          result={scheduleState.schedulesList || {}}
                          singleCms={singleCms}
                        />
                      }
                      fileName="today_sales_report.pdf"
                    >
                      {
                        //@ts-ignore
                        (params) => {
                          const { loading } = params;
                          return loading ? (
                            <Button
                              disabled
                              className="transition-all duration-150"
                              variant="destructive"
                              size="xs"
                            >
                              <Loader /> {translate("পিডিএফ", "PDF")}
                            </Button>
                          ) : (
                            <Button variant="destructive" size="xs">
                              {translate("পিডিএফ", "PDF")}
                            </Button>
                          );
                        }
                      }
                    </PDFDownloadLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ScheduleListExcel result={scheduleState.schedulesList || []} />
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
          data={scheduleState.schedulesList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default ScheduleList;
