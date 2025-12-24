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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

import {
  useDeleteFuelCompanyMutation,
  useGetFuelCompanyAllListQuery,
} from "@/store/api/superviosr/fuelCompanyApi";
import AddFuelCompany from "./AddFuelCompany";
import DetailsFuelCompany from "./DetailsFuelCompany";
import UpdateFuelCompany from "./UpdateFuelCompany";
export interface IFuelStateProps {
  search: string;
  addUserOpen: boolean;
  fuelList: Array<any>;
  userId: number | null;
}
const FuelCompanyList: FC = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();

  const [query, setQuery] = useState<IQueryProps>({
    sort: "asc",
    page: 1,
    size: 10,
    meta: { page: 0, size: 10, total: 0, totalPage: 0 },
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFuelCompanyId, setSelectedFuelCompanyId] = useState<
    number | null
  >(null);
  const [dialogType, setDialogType] = useState<"update" | "details" | null>(
    null
  ); // State to track which dialog to open
  const [fuelState, setFuelState] = useState<IFuelStateProps>({
    search: "",
    addUserOpen: false,
    fuelList: [],
    userId: null,
  });
  const { data: fuelCompaniesData, isLoading } = useGetFuelCompanyAllListQuery({
    search: fuelState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
  });
  const [deleteFuelCompany] = useDeleteFuelCompanyMutation();

  useEffect(() => {
    if (fuelCompaniesData?.meta) {
      setQuery((prev) => ({
        ...prev,
        meta: fuelCompaniesData.meta,
      }));
    }
  }, [fuelCompaniesData]);

  const handleDelete = async (id: number) => {
    const result = await deleteFuelCompany(id);
    if (result.data?.success) {
      toast({
        title: translate(
          "ফুয়েল কোম্পানি মুছে ফেলা হয়েছে",
          "Fuel Company Deleted"
        ),
      });
    }
  };

  const openDialog = (type: "update" | "details", id: number) => {
    setSelectedFuelCompanyId(id);
    setDialogType(type); // Set the type of dialog to open
  };

  const closeDialog = () => {
    setSelectedFuelCompanyId(null);
    setDialogType(null); // Close the dialog
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: translate("ইনডেক্স", "Index"),
      cell: (info) => {
        const rowIndex = info.row.index + 1 + (query.page - 1) * query.size;
        return <span>{rowIndex}</span>;
      },
    },
    {
      accessorKey: "name",
      header: translate("ফুয়েল কোম্পানি", "Fuel Company Name"),
    },
    { accessorKey: "address", header: translate("ঠিকানা", "Address") },
    { accessorKey: "phone", header: translate("ফোন", "Phone") },

    {
      header: translate("কার্যক্রম", "Action"),
      id: "actions",
      cell: ({ row }) => {
        const fuelCompany = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              <DropdownMenuLabel>
                {translate("কার্যক্রম", "Action")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => openDialog("update", fuelCompany.id)}
              >
                {translate("সম্পাদনা করুন", "Update")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => openDialog("details", fuelCompany.id)}
              >
                {translate("বিস্তারিত", "Details")}
              </DropdownMenuItem>

              <DeleteAlertDialog
                actionHandler={() => handleDelete(fuelCompany.id)}
                alertLabel={translate("ফুয়েল কোম্পানি", "Fuel Company")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <PageWrapper>
      <TableWrapper heading={translate("ফুয়েল কোম্পানি", "Fuel Companies")}>
        <TableToolbar alignment="responsive" className="mt-0">
          <ul className="flex items-center gap-x-2">
            <li>
              <Input
                placeholder={translate("অনুসন্ধান", "Search")}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFuelState((prevState) => ({
                    ...prevState,
                    search: e.target.value,
                  }))
                }
                className="lg:w-[300px] md:w-[250px] w-[200px]"
              />
            </li>
            <li>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="green"
                    size="icon"
                    className="group relative"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      {translate(
                        "ফুয়েল কোম্পানি যুক্ত করুন",
                        "Add Fuel Company"
                      )}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="lg">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddFuelCompany setOpen={setIsAddOpen} />
                </DialogContent>
              </Dialog>
            </li>
          </ul>
        </TableToolbar>

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={fuelCompaniesData?.data || []}
        />

        {/* Update Dialog */}
        <Dialog open={dialogType === "update"} onOpenChange={closeDialog}>
          <DialogContent size="lg">
            <DialogTitle className="sr-only">empty</DialogTitle>
            {selectedFuelCompanyId && (
              <UpdateFuelCompany
                id={selectedFuelCompanyId}
                setOpen={closeDialog}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={dialogType === "details"} onOpenChange={closeDialog}>
          <DialogContent size="lg">
            <DialogTitle className="sr-only">empty</DialogTitle>
            {selectedFuelCompanyId && (
              <DetailsFuelCompany id={selectedFuelCompanyId} />
            )}
          </DialogContent>
        </Dialog>
      </TableWrapper>
    </PageWrapper>
  );
};

export default FuelCompanyList;
