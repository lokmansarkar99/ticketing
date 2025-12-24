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
  useDeleteVehicleMutation,
  useGetVehiclesQuery,
} from "@/store/api/vehiclesSchedule/vehicleApi";
import formatter from "@/utils/helpers/formatter";
import { generateDynamicIndexWithMeta } from "@/utils/helpers/generateDynamicIndexWithMeta";
import { playSound } from "@/utils/helpers/playSound";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddVehicles from "./AddVehicles";
import DetailsVehicle from "./DetailsVehicle";
import UpdateVehicle from "./UpdateVehicle";

interface IVehiclesListProps {}
// src/types/dashboard/vehicleSchedule/vehicle.ts

export interface Vehicle {
  id: number;
  registrationNo: string;
  registrationFile: string;
  fitnessCertificate: string;
  taxToken: string;
  routePermit: string;
  manufacturerCompany?: string;
  model?: string;
  chasisNo?: string;
  engineNo?: string;
  countryOfOrigin?: string;
  lcCode?: string;
  color?: string;
  deliveryToDipo?: string;
  deliveryDate?: string;
  orderDate?: string;
  isActive: boolean;
  // Add other fields as necessary
}
export interface IVehicleStateProps {
  search: string;
  addVehicleOpen: boolean;
  vehiclesList: Partial<Vehicle[]>;
}

const VehiclesList: FC<IVehiclesListProps> = () => {
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
  const [filters, setFilters] = useState({
    registrationNo: "",
    seatPlan: "",
    isActive: "",
    coachType: "",
  });

  const [vehicleState, setVehicleState] = useState<IVehicleStateProps>({
    search: "",
    addVehicleOpen: false,
    vehiclesList: [],
  });
const [appliedFilters, setAppliedFilters] = useState(filters);
  const {
    data: vehiclesData,
    isLoading: vehiclesLoading,
    refetch,
  } = useGetVehiclesQuery({
    search: vehicleState.search,
    sort: query.sort,
    page: query.page,
    size: query.size,
    ...appliedFilters,
  });

  const [deleteVehicle] = useDeleteVehicleMutation();

  useEffect(() => {
    const customizeVehiclesData = vehiclesData?.data?.map(
      (vehicle: any, index: number) => ({
        ...vehicle,
        registrationNo: formatter({
          type: "words",
          words: vehicle?.registrationNo,
        }),
        index: generateDynamicIndexWithMeta(vehiclesData, index),
      })
    );

    setVehicleState((prevState) => ({
      ...prevState,
      vehiclesList: customizeVehiclesData || [],
    }));
    setQuery((prevState) => ({
      ...prevState,
      meta: vehiclesData?.meta,
    }));
  }, [vehiclesData]);

  const vehicleDeleteHandler = async (id: number) => {
    const result = await deleteVehicle(id);
    if (result?.data?.success) {
      toast({
        title: translate(
          "যানবাহন মুছে ফেলার বার্তা",
          "Message for deleting vehicle"
        ),
        description: toastMessage("delete", translate("যানবাহন", "vehicle")),
      });
      playSound("remove");
      refetch();
    }
  };

  const columns: ColumnDef<unknown>[] = [
    { accessorKey: "index", header: translate("ইনডেক্স", "Index") },
    {
      accessorKey: "registrationNo",
      header: translate("রেজিস্ট্রেশন নম্বর", "Registration Number"),
    },
    {
      accessorKey: "seatPlan",
      header: translate("রেজিস্ট্রেশন নম্বর", "No Of Seat"),
    },
    {
      header: translate("সক্রিয়", "Is Active"),
      cell: ({ row }) => {
        const vehicle = row.original as Vehicle;

        return vehicle?.isActive
          ? translate("হ্যাঁ", "Yes")
          : translate("না", "No");
      },
    },

    {
      accessorKey: "coachType",
      header: translate("রেজিস্ট্রেশন নম্বর", "Coach Type"),
    },
    {
      header: translate("কার্যক্রমগুলো", "Actions"),
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const vehicle = row.original as Vehicle;
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
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <DetailsVehicle id={vehicle?.id} />
                </DialogContent>
              </Dialog>
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
                  <UpdateVehicle id={vehicle?.id} />
                </DialogContent>
              </Dialog>
              <DeleteAlertDialog
                position="start"
                actionHandler={() => vehicleDeleteHandler(vehicle.id)}
                alertLabel={translate("যানবাহন", "Vehicle")}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (vehiclesLoading) {
    return <TableSkeleton columns={4} />;
  }
  return (
    <PageWrapper>
      <TableWrapper
        subHeading={translate(
          "যানবাহন তালিকা এবং সকল তথ্য উপাত্ত",
          "Coach list and all relevant information & data"
        )}
        heading={translate("কোচ", "Coachs")}
      >
        <TableToolbar alignment="responsive"></TableToolbar>
        <div className="grid grid-cols-8 gap-2 bg-muted p-2 border rounded-sm">
          <div></div>
          <div></div>
          {/* Registration Number */}
          <Input
            placeholder={translate("রেজিস্ট্রেশন", "Registration")}
            value={filters.registrationNo}
            onChange={(e) =>
              setFilters({ ...filters, registrationNo: e.target.value })
            }
          />

          {/* No Of Seat */}
          <Input
            placeholder={translate("সিট সংখ্যা", "No Of Seat")}
            value={filters.seatPlan}
            onChange={(e) =>
              setFilters({ ...filters, seatPlan: e.target.value })
            }
          />

          {/* Is Active */}
          <select
            className="border rounded px-2 py-1"
            value={filters.isActive}
            onChange={(e) =>
              setFilters({ ...filters, isActive: e.target.value })
            }
          >
            <option value="">{translate("---", "Is Active")}</option>
            <option value="true">{translate("হ্যাঁ", "Yes")}</option>
            <option value="false">{translate("না", "No")}</option>
          </select>

          {/* Coach Type */}
          <select
            className="border rounded px-2 py-1"
            value={filters.coachType}
            onChange={(e) =>
              setFilters({ ...filters, coachType: e.target.value })
            }
          >
            <option value="">{translate("---", "Coach Type")}</option>
            <option value="Double Deck">Double Deck</option>
            <option value="Single Deck">Single Deck</option>
          </select>

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
                open={vehicleState.addVehicleOpen}
                onOpenChange={(isOpen) =>
                  setVehicleState((prev) => ({
                    ...prev,
                    addVehicleOpen: isOpen,
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
                      {translate("যানবাহন যুক্ত করুন", "Add Coachs")}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="xl">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddVehicles
                    setVehicleState={(newState) => {
                      setVehicleState((prevState) => ({
                        ...prevState,
                        ...newState,
                        addVehicleOpen: false,
                      }));
                      refetch(); // Refresh the list after adding a new vehicle
                    }}
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

        <DataTable
          query={query}
          setQuery={setQuery}
          pagination
          columns={columns}
          data={vehicleState.vehiclesList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default VehiclesList;
