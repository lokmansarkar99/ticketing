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
  useDeletePermissionMutation,
  useGetAllUserPermissionListQuery,
} from "@/store/api/contact/userPermissionApi";
import { Permission } from "@/types/dashboard/contacts/user";
import { searchInputLabelPlaceholder } from "@/utils/constants/form/searchInputLabePlaceholder";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";

import AddPermission from "./userPermissionList/AddPermission";
import UpdatePermission from "./userPermissionList/UpdatePermission";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfPermissionList from "./pdf/PdfPermissionList";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import PermissionListExcel from "./excel/ExcelPermissionList";
export const dummyData = [];
interface IPermissionListProps { }
export interface IPermissionStateProps {
  permissionTypeId: number | null;
  search: string;
  name?: string;
  addPermissionOpen: boolean;
  PermissionList: Partial<Permission[]>;
}
const PermissionList: FC<IPermissionListProps> = () => {
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
  const { data: singleCms } = useGetSingleCMSQuery(
        {}
      );
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [permissionState, setPermissionState] = useState<IPermissionStateProps>(
    {
      search: "",
      // actionData: {},
      addPermissionOpen: false,
      PermissionList: [],
      permissionTypeId: null,
    }
  );

  //
  const { data: permissionData, isLoading: permissionLoading } =
    useGetAllUserPermissionListQuery({});
  const [deletePermission] = useDeletePermissionMutation({});
  const handleAddPermissionSuccess = (newPermission: any) => {
    setPermissionState((prevState) => ({
      ...prevState,
      PermissionList: [...prevState.PermissionList, newPermission],
    }));
  };
  const permissionDeleteHandler = async (id: number) => {
    const result = await deletePermission(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "অনুমতি মুছে ফেলার বার্তা",
          "Message for deleting permission"
        ),
        description: toastMessage("delete", translate("অনুমতি", "permission")),
      });
      playSound("remove");

      // Remove the deleted permission from the state
      setPermissionState((prevState: IPermissionStateProps) => ({
        ...prevState,
        PermissionList: prevState.PermissionList.filter(
          (permission) => permission!.id !== id
        ),
      }));
    }
  };
  const handleUpdatePermissionSuccess = (updatedPermission: any) => {
    // Update the permission in the list
    const updatedPermissionList = permissionState.PermissionList.map(
      (permission) =>
        permission!.id === updatedPermission.id ? updatedPermission : permission
    );

    // Regenerate the index after the update
    const indexedPermissions = updatedPermissionList.map(
      (permission, permissionIndex) => ({
        ...permission,
        index: permissionIndex + 1, // Generate index for each permission
      })
    );

    // Update the state with the new indexed permission list
    setPermissionState((prevState) => ({
      ...prevState,
      PermissionList: indexedPermissions,
    }));
  };
  useEffect(() => {
    if (permissionData) {
      //
      const customizedPermissionData = permissionData.data.map(
        (singlePermission: Permission, permissionIndex: number) => ({
          ...singlePermission,
          name: singlePermission?.name || "No Name", // Ensure the name field exists
          index: permissionIndex + 1, // Add index based on the array position
        })
      );

      setPermissionState((prevState: IPermissionStateProps) => ({
        ...prevState,
        PermissionList: customizedPermissionData || [],
      }));
    }
  }, [permissionData]);
  //
  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      //@ts-ignore
      accessorFn: (row) => row.index ?? "N/A",
    },

    {
      accessorKey: "name",
      header: translate("নাম", "Name"),
      //@ts-ignore
      accessorFn: (row) => row.name ?? "Unknown Name",
    },
    {
      accessorKey: "permissionType.name", // Accessing nested permission type name
      header: translate("অনুমতির ধরন", "Permission Type"), // Column Header
      //@ts-ignore
      accessorFn: (row) => row.permissionType?.name ?? "Unknown Type", // Fallback if undefined
    },
    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const permission = row.original as Permission;
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

              {/* UPDATE USER */}
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
                  <UpdatePermission
                    //@ts-ignore
                    onUpdateSuccess={handleUpdatePermissionSuccess}
                    id={permission?.id}
                  />
                </DialogContent>
              </Dialog>

              {/* DETAILS USER */}
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
                  {/* <DetailsUser id={user?.id} /> */}
                </DialogContent>
              </Dialog>

              {/* USER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => permissionDeleteHandler(permission.id)}
                alertLabel={translate("অনুমতি", "Permission")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (permissionLoading || !permissionData) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "অনুমতি তালিকা এবং সকল তথ্য উপাত্ত",
          "Permission list and all ralevnet information"
        )}
        heading={translate("অনুমতি তালিকা", "Permission List")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPermissionState((prevState) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
                placeholder={translate(
                  searchInputLabelPlaceholder.permission.placeholder.bn,
                  searchInputLabelPlaceholder.permission.placeholder.en
                )}
              />
            </li>
            <li>
              <Dialog
                open={permissionState.addPermissionOpen}
                onOpenChange={(open: boolean) =>
                  setPermissionState((prevState) => ({
                    ...prevState,
                    addPermissionOpen: open,
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
                      {translate("অনুমতি যুক্ত করুন", "Add Permission")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddPermission
                    //@ts-ignore
                    onAddSuccess={handleAddPermissionSuccess}
                    setPermissionState={setPermissionState}
                  />
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
                        <PdfPermissionList
                          result={permissionState.PermissionList || []}
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
                    <PermissionListExcel result={permissionState.PermissionList || []} />
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
          data={permissionState.PermissionList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};
export default PermissionList;
