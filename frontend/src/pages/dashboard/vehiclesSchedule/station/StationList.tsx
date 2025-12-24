
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
import { cn } from "@/lib/utils";
import {
  useGetStationsQuery,
  useUpdateStationMutation,
} from "@/store/api/vehiclesSchedule/stationApi";
import { Station } from "@/types/dashboard/vehicleeSchedule.ts/station";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddStation from "./AddStation";
import UpdateStation from "./UpdateStation";
import { useToast } from "@/components/ui/use-toast";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { AddUpdateStationDataProps } from "@/schemas/vehiclesSchedule/addUpdateStationSchema";
import { Loader } from "@/components/common/Loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfStationList from "../../pdf/PdfStationList";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import StationListExcel from "../../exel/StationListExcel";
interface IStationListProps { }

export interface IStationStateProps {
  search: string;
  addStationOpen: boolean;
  stationsList: Partial<Station[]>;
}

const StationList: FC<IStationListProps> = () => {
  const { translate } = useCustomTranslator();
  const { data: singleCms } = useGetSingleCMSQuery(
        {}
      );
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

  const [stationState, setStationState] = useState<IStationStateProps>({
    search: "",
    addStationOpen: false,
    stationsList: [],
  });

  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [updateStation, { isLoading: isStationUpdateLoading }] = useUpdateStationMutation();

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({
      search: stationState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
    });


  useEffect(() => {
    const customizeStationsData = stationsData?.data?.map(
      (singleUser: Partial<Station>, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.name }),
        index: generateDynamicIndexWithMeta(stationsData, userIndex),
      })
    );

    setStationState((prevState: IStationStateProps) => ({
      ...prevState,
      stationsList: customizeStationsData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: stationsData?.meta,
    }));
  }, [stationsData]);



  const handleToggleStatus = async (id: number, currentStatus: boolean) => {

    try {
      // API call to update the user's active status
      const result = await updateStation({
        id,
        data: { isActive: !currentStatus },
      });

      if (result.data?.success) {
        toast({
          title: !currentStatus
            ? translate("সক্রিয় করা হয়েছে", "Activated Successfully")
            : translate("নিষ্ক্রিয় করা হয়েছে", "Deactivated Successfully"),
          description: toastMessage("update", translate("স্টেশন", "Station")),
        });
      } else {
        throw new Error("API returned failure response");
      }
    } catch (error) {
      toast({
        title: translate(
          "অবস্থা পরিবর্তন ব্যর্থ হয়েছে",
          "Status Update Failed"
        ),
        description: translate(
          "কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
          "Something went wrong. Please try again."
        ),
      });
      console.error("Error toggling status:", error);
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "name",
      header: translate("পুরো নাম", "Station Name"),
    },

    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const station = row.original as AddUpdateStationDataProps;
        return (
          <button
            onClick={() =>
              handleToggleStatus(Number(station.id), station?.isActive as boolean)
            }
            className={`
        relative inline-flex h-6 w-[86px] items-center p-2 rounded-full transition-colors duration-300
        ${station?.isActive ? "bg-green-500" : "bg-red-500"}
      `}
          >
            {
              station?.isActive &&
              <span className="text-white text-[12px]">
                Active
              </span>
            }
            {
              isStationUpdateLoading
                ? <span
                  className={`
                      inline-block  transform transition-transform
                      ${station?.isActive ? "translate-x-6" : "translate-x-[-3px]"}
                    `}
                >
                  <Loader />
                </span>
                : <span
                  className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
          ${station?.isActive ? "translate-x-6" : "translate-x-[-3px]"}
        `}
                />
            }

            {
              !station?.isActive &&
              <span className="text-white text-[12px] text-right ml-auto">
                Deactive
              </span>
            }
          </button>
        );
      },
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const station = row.original as Station;
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
              {/* UPDATE STATION */}
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
                  <UpdateStation id={station?.id} />
                </DialogContent>
              </Dialog>

              {/* STATION DELETE ALERT DIALOG */}
              {/* <DeleteAlertDialog
                position="start"
                actionHandler={() => stationDeleteHandler(station.id)}
                alertLabel={translate("স্টেশন", "Station")}
              /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (stationsLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "স্টেশন তালিকা এবং সকল তথ্য উপাত্ত",
          "Station list and all ralevnet information & data"
        )}
        heading={translate("স্টেশন", "Station")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.station.placeholder.bn,
                  searchInputLabelPlaceholder.station.placeholder.en
                )}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;
                  setStationState((prevState) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
              />
            </li>
            <li>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="green"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate("স্টেশন যুক্ত করুন", "Add Station")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddStation setStationState={setStationState} />
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
                        <PdfStationList
                          result={stationState.stationsList || []}
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
                    <StationListExcel result={stationState.stationsList || []} />
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
          data={stationState.stationsList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default StationList;
