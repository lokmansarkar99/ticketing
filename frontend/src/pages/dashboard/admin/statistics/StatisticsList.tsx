/* eslint-disable @typescript-eslint/ban-ts-comment */
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import PhotoViewer from "@/components/common/photo/PhotoViewer";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { DataTable } from "@/components/common/table/DataTable";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import { useDeleteUserStatisticMutation, useGetUserStatisticAllListQuery } from "@/store/api/statistics/statisticsApi";
import UpdateStatistics from "./EditStatistics";
import AddStatistics from "./AddStatistics";

interface IStatisticsListProps {}

export interface ICoreValueStateProps {
  addCoreValueOpen: boolean;
  StatisticsList: Partial<any[]>; 
}

const StatisticsList: FC<IStatisticsListProps> = () => {
  const { toast } = useToast();

  const [coreValueState, setCoreValueState] = useState<ICoreValueStateProps>({
    addCoreValueOpen: false,
    StatisticsList: [],
  });

  const { data: coreValueData, isLoading: valueLoading } =
    useGetUserStatisticAllListQuery({});

  const [deleteCoreValue] = useDeleteUserStatisticMutation();
  

  useEffect(() => {
    const customizeData = coreValueData?.data?.map(
      (item: any, index: number) => ({
        ...item,
        index: index + 1,
      })
    );
    setCoreValueState((prevState) => ({
      ...prevState,
      StatisticsList: customizeData || [],
    }));
  }, [coreValueData]);

  const handleDeleteCoreValue = async (id: number) => {
    const result = await deleteCoreValue(id);

    if (result?.data?.success) {
      toast({
        title: "Core Value Deleted",
        description: "The core value has been successfully deleted.",
      });
    }
  };
  const columns: ColumnDef<any | undefined>[] = [
    { accessorKey: "index", header: "Index" },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={item.image}
              alt={`Core Value Image ${item.id}`}
            />
          </div>
        ) : null;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? <span>{item.title}</span> : null;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? <span>{item.description}</span> : null;
      },
    },
    {
      header: "Actions",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              {/* UPDATE CORE VALUE */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex justify-start"
                    size="xs"
                  >
                    Update
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <UpdateStatistics id={item.id} />
                </DialogContent>
              </Dialog>

              {/* DELETE CORE VALUE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => handleDeleteCoreValue(item.id)}
                alertLabel="Core Value"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  if (valueLoading) {
    return <TableSkeleton columns={5} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading="Statistics List and Management"
        heading="Statistics"
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={coreValueState.addCoreValueOpen}
                onOpenChange={(open) =>
                  setCoreValueState({
                    ...coreValueState,
                    addCoreValueOpen: open,
                  })
                }
              >
                <DialogTrigger asChild>
                  <Button className="group relative" variant="outline" size="icon">
                    <LuPlus />
                    <span className="custom-tooltip-top">Add Core Value</span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddStatistics setCoreValueState={setCoreValueState} />
                </DialogContent>
              </Dialog>
            </li>
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LuDownload className="size-4 mr-1" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cn("w-[100px] space-y-2")}
                  align="end"
                >
                  <DropdownMenuItem>PDF</DropdownMenuItem>
                  <DropdownMenuItem>Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          </ul>
        </TableToolbar>
        <DataTable columns={columns} data={coreValueState.StatisticsList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default StatisticsList;
