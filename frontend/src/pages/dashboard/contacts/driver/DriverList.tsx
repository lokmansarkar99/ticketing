import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
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
  useDeleteDriverMutation,
  useGetDriversQuery,
  useUpdateDriverMutation,
} from "@/store/api/contact/driverApi";
import { Driver } from "@/types/dashboard/contacts/driver";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddDriver from "./AddDriver";
import DetailsDriver from "./DetailsDriver";
import UpdateDriver from "./UpdateDriver";
import { Loader } from "@/components/common/Loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfDriverList from "../user/pdf/PdfDriverList";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import DriverListExcel from "../user/excel/ExcelDriverList";

interface IDriverListProps { }

export interface IDriverStateProps {
  search: string;
  addDriverOpen: boolean;
  driversList: Driver[];
}

const DriverList: FC<IDriverListProps> = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
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
  const [driverState, setDriverState] = useState<IDriverStateProps>({
    search: "",
    addDriverOpen: false,
    driversList: [],
  });

  const { data: driversData, isLoading: driverLoading } = useGetDriversQuery({
    search: driverState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });
  const [updateDriver] = useUpdateDriverMutation({});

  const [deleteDriver] = useDeleteDriverMutation({});
  const deactivateDriver = async (id: number, status: boolean) => {
    try {
      const result = await updateDriver({ id, data: { active: !status } });

      if (result.data?.success) {
        toast({
          title: translate("সফল!", "Success!"),
          description: translate(
            "ড্রাইভার হাল নাগাদ করা হয়েছে।",
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
          "ড্রাইভার হাল নাগাদ করতে ব্যর্থ।",
          "Failed to deactivate driver."
        ),
        variant: "destructive",
      });
      playSound("warning");
    }
  };

  useEffect(() => {
    const customizeDriversData = driversData?.data?.map(
      (singleUser: Driver, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.name }),
        dummyActive: singleUser?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(driversData, userIndex),
      })
    );

    setDriverState((prevState: IDriverStateProps) => ({
      ...prevState,
      driversList: customizeDriversData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: driversData?.meta,
    }));
  }, [driversData]);

  const driverDeleteHandler = async (id: number) => {
    const result = await deleteDriver(id);

    if (result.data?.success) {
      toast({
        title: translate(
          "ড্রাইভার মুছে ফেলার বার্তা",
          "Message for deleting driver"
        ),
        description: toastMessage("delete", translate("ড্রাইভার", "driver")),
      });
      playSound("remove");
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "avatar",
      header: translate("অবতার", "Avatar"),
      cell: ({ row }) => {
        const driver = row.original as Driver;
        return (
          <div className="size-8 rounded-md overflow-hidden mx-auto">
            <PhotoViewer
              className="scale-1"
              src={driver?.avatar}
              alt={`Image ${driver.name}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "licensePhoto",
      header: translate("লাইসেন্স", "License"),
      cell: ({ row }) => {
        const driver = row.original as Driver;
        return (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={driver?.licensePhoto}
              alt={`license photo -- ${driver.name}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: translate("পুরো নাম", "Full Name"),
    },

    {
      accessorKey: "contactNo",
      header: translate("যোগাযোগ নম্বর", "Contact No"),
    },

    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const driver = row.original as Driver;

        return (
          <button
            onClick={() =>
              deactivateDriver(driver.id, driver?.active)
            }
            className={`
    relative inline-flex h-6 w-[86px] items-center p-2 rounded-full transition-colors duration-300
    ${driver?.active ? "bg-green-500" : "bg-red-500"}
  `}
          >
            {
              driver?.active &&
              <span className="text-white text-[12px]">
                Active
              </span>
            }
            <span
              className={`
      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
      ${driver?.active ? "translate-x-6" : "translate-x-[-3px]"}
    `}
            />
            {
              !driver?.active &&
              <span className="text-white text-[12px] text-right ml-auto">
                Deactive
              </span>
            }
          </button>
        );
      },
    },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const driver = row.original as Driver;
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
              {/* UPDATE DRIVER */}
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
                <DialogContent className="sm:max-w-[1000px] max-h-[90%] overflow-y-auto">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateDriver id={driver?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS DRIVER */}
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
                <DialogContent className="sm:max-w-[1000px] max-h-[90%] overflow-y-auto">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsDriver id={driver?.id} />
                </DialogContent>
              </Dialog>

              {/* SUPERVISOR DELETE ALERT DIALOG */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => driverDeleteHandler(driver?.id)}
                alertLabel={translate("ড্রাইভার", "Driver")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (driverLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ড্রাইভাদের তালিকা এবং সকল তথ্য উপাত্ত",
          "Driver list and all ralevnet information & data"
        )}
        heading={translate("ড্রাইভার", "Driver")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDriverState((prevState: IDriverStateProps) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.driver.placeholder.bn,
                  searchInputLabelPlaceholder.driver.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={driverState.addDriverOpen}
                onOpenChange={(open: boolean) =>
                  setDriverState((prevState: IDriverStateProps) => ({
                    ...prevState,
                    addDriverOpen: open,
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
                      {translate("ড্রাইভার যুক্ত করুন", "Add Driver")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddDriver setDriverState={setDriverState} />
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
                  <PDFDownloadLink
                    document={
                      <PdfDriverList
                        result={driverState.driversList || []}
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
                  <DropdownMenuItem>
                    <DriverListExcel result={driverState.driversList || []} />
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
          data={driverState.driversList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default DriverList;
