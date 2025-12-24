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
  useDeleteCounterMutation,
  useGetCountersQuery,
  useUpdateCounterMutation,
} from "@/store/api/contact/counterApi";
import { Counter } from "@/types/dashboard/vehicleeSchedule.ts/counter";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddCounter from "./AddCounter";
import DetailsCounter from "./DetailsCounter";
import UpdateCounter from "./UpdateCounter";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfCounterList from "../user/pdf/PdfCounterList";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import CounterListExcel from "../user/excel/ExcelCounterList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";

interface ICounterListProps {}
export interface ICounterStateProps {
  search: string;
  addCounterOpen: boolean;
  countersList: Counter[];
}

const CounterList: FC<ICounterListProps> = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const { toast } = useToast();
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
    name: "",
    address: "",
    stationId: "",
    status: "",
    type: "",
  });

  const [counterState, setCounterState] = useState<ICounterStateProps>({
    search: "",
    addCounterOpen: false,
    countersList: [],
  });

  const { data: stationsData } = useGetStationsQuery({
    page: 1,
    size: 500,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { data: countersData, isLoading: counterLoading } = useGetCountersQuery(
    {
      search: counterState.search,
      sort: query.sort,
      page: query.page,
      size: query.size,
      ...appliedFilters,
    }
  );

  const [deleteCounter] = useDeleteCounterMutation({});
  const [updateCounter] = useUpdateCounterMutation({});

  useEffect(() => {
    const customizeCountersData = countersData?.data?.map(
      (singleUser: Counter, userIndex: number) => ({
        ...singleUser,
        name: formatter({
          type: "words",
          words: singleUser?.name,
        }),
        dummyType: singleUser?.type?.replace("_", " "),
        dummyPrimaryContactPersonName: formatter({
          type: "words",
          words: singleUser?.primaryContactPersonName,
        }),
        dummyStatus: singleUser?.status ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(countersData, userIndex),
        stationName: singleUser?.station?.name,
      })
    );

    setCounterState((prevState: ICounterStateProps) => ({
      ...prevState,
      countersList: customizeCountersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: countersData?.meta,
    }));
  }, [countersData]);

  const counterDeleteHandler = async (id: number) => {
    const result = await deleteCounter(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "কাউন্টার মুছে ফেলার বার্তা",
          "Message for deleting counter"
        ),
        description: toastMessage("delete", translate("কাউন্টার", "counter")),
      });
      playSound("remove");
    }
  };
  const deactivateCounter = async (id: number, status: boolean) => {
    try {
      const result = await updateCounter({ id, data: { status: !status } });

      if (result.data?.success) {
        toast({
          title: translate("হাল নাগাদ সফল!", "Counter Update Success!"),
          description: translate(
            "কাউন্টারের হাল নাগাদ করা হয়েছে।",
            "Update Success."
          ),
        });
        playSound("success");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "হাল নাগাদ হাল নাগাদ করতে ব্যর্থ।",
          "Failed to deactivate driver."
        ),
        variant: "destructive",
      });
      playSound("warning");
    }
  };
  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "name",
      header: translate("কাউন্টারের নাম", "Counter Name"),
    },
    {
      accessorKey: "address",
      header: translate("কাউন্টারের নাম", "Counter Address"),
    },
    {
      accessorKey: "stationName",
      header: translate("কাউন্টারের নাম", "Station"),
    },
    {
      accessorKey: "dummyPrimaryContactPersonName",
      header: translate("যোগাযোগকারী ব্যক্তি", "Contact Person"),
    },
    {
      accessorKey: "dummyType",
      header: translate("ধরণ", "Type"),
    },
    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const user = row.original as Counter & { dummyStatus: string };
        return (
          <button
            onClick={() => deactivateCounter(user.id, user?.status)}
            className={`
    relative inline-flex h-6 w-[86px] items-center p-2 rounded-full transition-colors duration-300
    ${user?.status ? "bg-green-500" : "bg-red-500"}
  `}
          >
            {user?.status && (
              <span className="text-white text-[12px]">Active</span>
            )}
            <span
              className={`
      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
      ${user?.status ? "translate-x-6" : "translate-x-[-3px]"}
    `}
            />
            {!user?.status && (
              <span className="text-white text-[12px] text-right ml-auto">
                Deactive
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
        const counter = row.original as Counter;
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
                {translate("কার্যক্রম", "Action")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* UPDATE COUNTER */}
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
                  <UpdateCounter id={counter?.id} />
                </DialogContent>
              </Dialog>

              {/* UPDATE COUNTER */}
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
                  <DetailsCounter id={counter?.id} />
                </DialogContent>
              </Dialog>

              {/* COUNTER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => counterDeleteHandler(counter?.id)}
                alertLabel={translate("ব্যবহারকারী", "User")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (counterLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "কাউন্টারের তালিকা এবং সকল তথ্য উপাত্ত",
          "Counter list and all ralevnet information & data"
        )}
        heading={translate("কাউন্টার", "Counter")}
      >
        <TableToolbar alignment="responsive">
          <div className="grid grid-cols-7 gap-2 bg-muted p-2 border rounded-sm mb-2">
            {/* Name */}
            <Input
              placeholder={translate("নাম", "Name")}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />

            {/* Address */}
            <Input
              placeholder={translate("ঠিকানা", "Address")}
              value={filters.address}
              onChange={(e) =>
                setFilters({ ...filters, address: e.target.value })
              }
            />

            {/* Station */}
            <Select
              value={filters.stationId}
              onValueChange={(value) =>
                setFilters({ ...filters, stationId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Station" />
              </SelectTrigger>
              <SelectContent>
                {/* Map stations dynamically */}
                {stationsData?.data.length > 0 &&
                  stationsData?.data?.map((s: any) => (
                    <>
                      <SelectItem key={s?.id} value={s?.id}>
                        {s?.name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>

            {/* Status */}
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
                  {translate("সক্রিয়", "Enable")}
                </SelectItem>
                <SelectItem value="false">
                  {translate("নিষ্ক্রিয়", "Disable")}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Type */}
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own_Counter">Own Counter</SelectItem>
                <SelectItem value="Commission_Counter">
                  Commission Counter
                </SelectItem>
                <SelectItem value="Head_Office">Head Office</SelectItem>
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
                  open={counterState.addCounterOpen}
                  onOpenChange={(open: boolean) =>
                    setCounterState((prevState: ICounterStateProps) => ({
                      ...prevState,
                      addCounterOpen: open,
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
                        {translate("ব্যবহারকারী যুক্ত করুন", "Add User")}
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent size="lg">
                    <DialogTitle className="sr-only">empty</DialogTitle>
                    <AddCounter setCounterState={setCounterState} />
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
                          <PdfCounterList
                            result={counterState.countersList || []}
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
                      <CounterListExcel
                        result={counterState.countersList || []}
                      />
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
          data={counterState.countersList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default CounterList;
