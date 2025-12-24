
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
  useGetRoutesQuery,
} from "@/store/api/vehiclesSchedule/routeApi";
import { Route } from "@/types/dashboard/vehicleeSchedule.ts/route";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddRoute from "./AddRoute";
import DetailsRoute from "./DetailsRoute";
import UpdateRoute from "./UpdateRoute";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Loader } from "@/components/common/Loader";
import RouteListExcel from "../../exel/RouteListExcel";
import PdfRouteList from "../../pdf/PdfRouteList";

interface IRouteListProps {}
export interface IRouteStateProps {
  search: string;
  addRouteOpen: boolean;
  routesList: Route[];
  routeId: number | null;
}

const RouteList: FC<IRouteListProps> = () => {
    const { data: singleCms } = useGetSingleCMSQuery(
          {}
        );
  // const { toast } = useToast();
  const { translate } = useCustomTranslator();
  // const { toastMessage } = useMessageGenerator();
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
  const [routeState, setRouteState] = useState<IRouteStateProps>({
    search: "",
    addRouteOpen: false,
    routesList: [],
    routeId: null,
  });

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery({
    search: routeState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });
  // const [deleteRoute] = useDeleteRouteMutation({});

  useEffect(() => {
    const customizeRoutesData = routesData?.data?.map(
      (singleUser: Route, userIndex: number) => ({
        ...singleUser,
        routeName: singleUser.routeName,
        index: generateDynamicIndexWithMeta(routesData, userIndex),
      })
    );

    setRouteState((prevState: IRouteStateProps) => ({
      ...prevState,
      routesList: customizeRoutesData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: routesData?.meta,
    }));
  }, [routesData]);
  // const routeDeleteHandler = async (id: number) => {
  //   const result = await deleteRoute(id);

  //   if (result.data?.success) {
  //     toast({
  //       title: translate("রুট মুছে ফেলার বার্তা", "Message for deleting route"),
  //       description: toastMessage("delete", translate("রুট", "route")),
  //     });
  //     playSound("remove");
  //   }
  // };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },

    {
      accessorKey: "routeName",
      header: translate("রুট নাম", "Routes Name"),
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const route = row.original as Route;
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
              {/* UPDATE ROUTE */}
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
                  <UpdateRoute id={route?.id} />
                </DialogContent>
              </Dialog>

              {/* DETAILS ROUTE */}
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
                  <DetailsRoute id={route?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE ALERT DIALOG */}
              {/* <DeleteAlertDialog
                position="start"
                actionHandler={() => routeDeleteHandler(route?.id)}
                alertLabel={translate("রুট", "Route")}
              /> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (routesLoading) {
    return <TableSkeleton columns={3} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "রুটের তালিকা এবং সকল তথ্য উপাত্ত",
          "Route list and all ralevnet information & data"
        )}
        heading={translate("রুট", "Route")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const searchValue = e.target.value;

                  setRouteState((prevState: IRouteStateProps) => ({
                    ...prevState,
                    search: searchValue,
                  }));
                }}
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.route.placeholder.bn,
                  searchInputLabelPlaceholder.route.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={routeState.addRouteOpen}
                onOpenChange={(open: boolean) =>
                  setRouteState((prevState: IRouteStateProps) => ({
                    ...prevState,
                    addRouteOpen: open,
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
                      {translate("রুট যুক্ত করুন", "Add Route")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddRoute setRouteState={setRouteState} />
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
                        <PdfRouteList
                          result={routeState.routesList || []}
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
                    <RouteListExcel result={routeState.routesList || []} />
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
          data={routeState.routesList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default RouteList;
