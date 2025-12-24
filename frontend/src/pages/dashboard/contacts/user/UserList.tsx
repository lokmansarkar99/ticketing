/* eslint-disable @typescript-eslint/ban-ts-comment */
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable, IQueryProps } from "@/components/common/table/DataTable";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import { Badge } from "@/components/ui/badge";
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
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/store/api/contact/userApi";
import { User } from "@/types/dashboard/contacts/user";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddUser from "./AddUser";
import DetailsUser from "./DetailsUser";
import UpdateUser from "./UpdateUser";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfUserList from "./pdf/PdfUserList";
import { Loader } from "@/components/common/Loader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import UserListExcel from "./excel/ExcelUserList";
import AdminChangePassword from "../../admin/changePassword/AdminChangePassword";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllUserRoleListQuery } from "@/store/api/contact/roleApi";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";

export const dummyData = [];
interface IUserListProps {}
export interface IUserStateProps {
  search: string;
  addUserOpen: boolean;
  usersList: Partial<User[]>;
  userId: number | null;
}

const UserList: FC<IUserListProps> = () => {
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
    userName: "",
    contactNo: "",
    roleId: "",
    counterId: "",
    type: "",
    status: "",
  });

  const [userState, setUserState] = useState<IUserStateProps>({
    search: "",
    addUserOpen: false,
    usersList: [],
    userId: null,
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const { data: usersData, isLoading: userLoading } = useGetUsersQuery({
    search: userState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
    ...appliedFilters,
  });
  const { data: roleListData } = useGetAllUserRoleListQuery({});
  const { data: countersData } = useGetCountersQuery({
    page: 1,
    size: 500,
  });

  const { data: singleCms } = useGetSingleCMSQuery({});

  const [deleteUser] = useDeleteUserMutation({});
  const [updateUser] = useUpdateUserMutation({});
  useEffect(() => {
    const customizeUsersData = usersData?.data?.map(
      (singleUser: User, userIndex: number) => ({
        ...singleUser,
        name: formatter({ type: "words", words: singleUser?.userName }),
        role: formatter({ type: "words", words: singleUser?.role.name }),
        dummyActive: singleUser?.active ? "Activate" : "Deactivate",
        index: generateDynamicIndexWithMeta(usersData, userIndex),
      })
    );

    setUserState((prevState: IUserStateProps) => ({
      ...prevState,
      usersList: customizeUsersData || [],
    }));
    setQuery((prevState: IQueryProps) => ({
      ...prevState,
      meta: usersData?.meta,
    }));
  }, [usersData]);
  useEffect(() => {
    if (usersData?.data) {
      setUserState((prev) => ({
        ...prev,
        usersList: usersData.data.map((user: any, index: any) => ({
          ...user,
          index: query.page * query.size + index + 1,
        })),
      }));
      setQuery((prev) => ({ ...prev, meta: usersData.meta }));
    }
  }, [usersData]);
  const userDeleteHandler = async (id: number) => {
    const result = await deleteUser(id);

    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী মুছে ফেলার বার্তা",
          "Message for deleting user"
        ),
        description: toastMessage("delete", translate("ব্যবহারকারী", "user")),
      });
      playSound("remove");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      // API call to update the user's active status
      const result = await updateUser({
        id,
        data: { active: !currentStatus }, // Ensure the payload matches API expectations
      });

      if (result.data?.success) {
        toast({
          title: !currentStatus
            ? translate("সক্রিয় করা হয়েছে", "Activated Successfully")
            : translate("নিষ্ক্রিয় করা হয়েছে", "Deactivated Successfully"),
          description: toastMessage("update", translate("ব্যবহারকারী", "User")),
        });

        // Update the usersList state
        setUserState((prevState) => ({
          ...prevState,
          usersList: prevState.usersList.map((user) =>
            user && user.id === id ? { ...user, active: !currentStatus } : user
          ),
        }));
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
      accessorKey: "avatar",
      header: translate("অবতার", "Avatar"),
      cell: ({ row }) => {
        const user = row.original as User;
        return (
          <div className="size-8 rounded-md overflow-hidden mx-auto">
            <PhotoViewer
              className="scale-1"
              src={user?.avatar}
              alt={`Image ${user.userName}`}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: translate("পুরো নাম", "Full Name"),
    },

    {
      accessorKey: "contactNo",
      header: translate("যোগাযোগ নম্বর", "Contact No"),
    },
    {
      header: translate("ভূমিকা", "Role"),
      cell: ({ row }) => {
        //@ts-ignore

        const user = row?.original as any;

        return (
          <Badge
            size="sm"
            shape="pill"
            className="w-[110px]"
            variant={
              user?.role?.name?.toLowerCase() === "admin"
                ? "tertiary"
                : user?.role?.name?.toLowerCase() === "supervisor"
                ? "primary"
                : user?.role?.name?.toLowerCase() === "counter"
                ? "secondary"
                : user?.role?.name?.toLowerCase() === "subadmin"
                ? "green"
                : "warning"
            }
          >
            {user?.role?.name}
          </Badge>
        );
      },
    },
    {
      header: translate("অবস্থা", "Status"),
      cell: ({ row }) => {
        const user = row.original as User & { dummyActive: string };
        return (
          <button
            onClick={() => handleToggleStatus(user.id, user?.active)}
            className={`
    relative inline-flex h-6 w-[86px] items-center p-2 rounded-full transition-colors duration-300
    ${user?.active ? "bg-green-500" : "bg-red-500"}
  `}
          >
            {user?.active && (
              <span className="text-white text-[12px]">Active</span>
            )}
            <span
              className={`
      inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300
      ${user?.active ? "translate-x-6" : "translate-x-[-3px]"}
    `}
            />
            {!user?.active && (
              <span className="text-white text-[12px] text-right ml-auto">
                Deactive
              </span>
            )}
          </button>
        );
      },
    },

    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original as User;
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
                <DialogContent size="lg" className="overflow-hidden">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateUser id={user?.id} />
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
                  <DetailsUser id={user?.id} />
                </DialogContent>
              </Dialog>

              {/* CHANGE PASSWORD */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    {translate("বিস্তারিত", "Change Password")}
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  {/* <DetailsUser id={user?.id} /> */}
                  <AdminChangePassword id={user?.id} />
                </DialogContent>
              </Dialog>

              {/* USER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => userDeleteHandler(user.id)}
                alertLabel={translate("ব্যবহারকারী", "User")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (userLoading) {
    return <TableSkeleton columns={7} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "ব্যবহারকারীদের তালিকা এবং সকল তথ্য উপাত্ত",
          "User list and all ralevnet information & data"
        )}
        heading={translate("ব্যবহারকারী", "User")}
      >
        <TableToolbar alignment="responsive">
          <div className="grid grid-cols-7 gap-2 bg-muted p-2 border rounded-sm mb-2">
            {/* User Name */}
            <Input
              placeholder={translate("ব্যবহারকারীর নাম", "User Name")}
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
            />

            {/* Contact */}
            <Input
              placeholder={translate("যোগাযোগ", "Contact")}
              value={filters.contactNo}
              onChange={(e) =>
                setFilters({ ...filters, contactNo: e.target.value })
              }
            />

            {/* Role / User Groups */}
            <Select
              value={filters.roleId}
              onValueChange={(value) =>
                setFilters({ ...filters, roleId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleListData?.data?.length > 0 &&
                  roleListData?.data?.map((r: any) => (
                    <>
                      <SelectItem key={r?.id} value={r?.id}>
                        {r.name}
                      </SelectItem>
                    </>
                  ))}
              </SelectContent>
            </Select>

            {/* Counter */}
            <Select
              value={filters.counterId}
              onValueChange={(value) =>
                setFilters({ ...filters, counterId: value })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Counter" />
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

            <ul className="flex  gap-x-2">
              <li>
                <Dialog
                  open={userState.addUserOpen}
                  onOpenChange={(open: boolean) =>
                    setUserState((prevState: IUserStateProps) => ({
                      ...prevState,
                      addUserOpen: open,
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
                    <AddUser setUserState={setUserState} />
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
                          <PdfUserList
                            result={userState?.usersList || []}
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
                      <UserListExcel result={userState.usersList || []} />
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
          data={userState.usersList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default UserList;
