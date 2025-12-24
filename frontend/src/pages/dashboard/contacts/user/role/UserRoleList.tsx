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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeleteRoleMutation,
  useGetAllUserRoleListQuery,
} from "@/store/api/contact/roleApi";
import { Role } from "@/types/dashboard/contacts/user";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddRole from "./AddRole";
import UpdateRole from "./UpdateRole";
import RoleExcel from "../excel/ExcelRole";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfRoleList from "../pdf/PdfRole";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
interface IRoleListProps { }
export interface IRoleStateProps {
  id: number | null;
  search: string;
  name: string;
  addRoleOpen: boolean;
  roleList: Partial<Role[]>;
}

const UserRoleList: FC<IRoleListProps> = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 20,
    meta: {
      page: 0,
      size: 20,
      total: 100,
      totalPage: 1,
    },
  });
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const { data: singleCms } = useGetSingleCMSQuery(
    {}
  );
  const [roleState, setRoleState] = useState<IRoleStateProps>({
    search: "",
    name: "",
    addRoleOpen: false,
    roleList: [],
    id: null,
  });
  const { data: roleListData, isLoading: roleLoading } =
    useGetAllUserRoleListQuery({});
  //
  const handleAddRoleSuccess = (newPermission: any) => {
    setRoleState((prevState) => ({
      ...prevState,
      roleList: [...prevState.roleList, newPermission],
    }));
  };
  const [deleteRole] = useDeleteRoleMutation({});
  const handleUpdateRoleSuccess = (updatedRole: any) => {
    // Update the permission in the list
    const updatedRoleList = roleState.roleList.map((role) =>
      role!.id === updatedRole.id ? updatedRole : role
    );

    // Regenerate the index after the update
    const indexedRole = updatedRoleList.map((role, roleIndex) => ({
      ...role,
      index: roleIndex + 1, // Generate index for each permission
    }));

    // Update the state with the new indexed permission list
    setRoleState((prevState) => ({
      ...prevState,
      roleList: indexedRole,
    }));
  };
  const roleDeleteHandler = async (id: number) => {
    const result = await deleteRole(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "ভূমিকা মুছে ফেলার বার্তা",
          "Message for deleting role"
        ),
        description: toastMessage("delete", translate("ভূমিকা", "role")),
      });
      playSound("remove");

      // Remove the deleted permission from the state
      setRoleState((prevState: IRoleStateProps) => ({
        ...prevState,
        roleList: prevState.roleList.filter((role) => role!.id !== id),
      }));
    }
  };
  useEffect(() => {
    if (roleListData) {
      //
      const customizedRoleData = roleListData.data.map(
        (singleRole: Role, roleIndex: number) => ({
          ...singleRole,
          name: singleRole?.name || "No Name", // Ensure the name field exists
          index: roleIndex + 1, // Add index based on the array position
        })
      );

      setRoleState((prevState: IRoleStateProps) => ({
        ...prevState,
        roleList: customizedRoleData || [],
      }));
    }

    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: roleListData?.meta,
    }));
  }, [roleListData]);
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
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original as Role;
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
                  <UpdateRole
                    onUpdateSuccess={handleUpdateRoleSuccess}
                    id={role?.id}
                  />
                </DialogContent>
              </Dialog>

              {/* USER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => roleDeleteHandler(role.id)}
                alertLabel={translate("ভূমিকা", "Role")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  if (roleLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ভূমিকা তালিকা এবং সকল তথ্য উপাত্ত",
          "Role list and all ralevnet information"
        )}
        heading={translate("ভূমিকা তালিকা", "Role List")}
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={roleState.addRoleOpen}
                onOpenChange={(open: boolean) =>
                  setRoleState((prevState) => ({
                    ...prevState,
                    addRoleOpen: open,
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
                      {translate("ভূমিকা যুক্ত করুন", "Add Role")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddRole
                    //@ts-ignore
                    onAddSuccess={handleAddRoleSuccess}
                    setRoleState={setRoleState}
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
                        <PdfRoleList
                          result={roleState.roleList || []}
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
                    <RoleExcel result={roleState.roleList || []} />
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
          data={roleState.roleList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default UserRoleList;
