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
import {
  useDeleteSisterConcernMutation,
  useGetSisterConcernAllListQuery,
} from "@/store/api/sisterConcern/sisterConcernApi";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddSisterConcern from "./AddSisterConcern";
import UpdateSisterConcern from "./UpdateSisterConcern";

interface ISisterConcernListProps {}

export interface ISisterConcernStateProps {
  addSisterConcernOpen: boolean;
  sisterConcernList: Partial<any[]>; // your data type
}

const SisterConcernList: FC<ISisterConcernListProps> = () => {
  const { toast } = useToast();

  const [sisterConcernState, setSisterConcernState] =
    useState<ISisterConcernStateProps>({
      addSisterConcernOpen: false,
      sisterConcernList: [],
    });

  const { data: sisterConcernData, isLoading: concernLoading } =
    useGetSisterConcernAllListQuery({});

  const [deleteSisterConcern] = useDeleteSisterConcernMutation();

  useEffect(() => {
    const customizeData = sisterConcernData?.data?.map(
      (item: any, index: number) => ({
        ...item,
        index: index + 1,
      })
    );

    setSisterConcernState((prevState) => ({
      ...prevState,
      sisterConcernList: customizeData || [],
    }));
  }, [sisterConcernData]);

  const handleDeleteSisterConcern = async (id: number) => {
    const result = await deleteSisterConcern(id);

    if (result?.data?.success) {
      toast({
        title: "Sister Concern Deleted",
        description: "The Sister Concern image has been successfully deleted.",
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
              alt={`Sister Concern Image ${item.id}`}
            />
          </div>
        ) : null;
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
              {/* UPDATE SISTER CONCERN */}
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
                  <UpdateSisterConcern id={item.id} />
                </DialogContent>
              </Dialog>

              {/* DELETE SISTER CONCERN */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => handleDeleteSisterConcern(item.id)}
                alertLabel="Sister Concern Image"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  if (concernLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading="Sister Concern List and Image Management"
        heading="Sister Concerns"
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={sisterConcernState.addSisterConcernOpen}
                onOpenChange={(open) =>
                  setSisterConcernState({
                    ...sisterConcernState,
                    addSisterConcernOpen: open,
                  })
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">
                      Add Sister Concern
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddSisterConcern
                    setSisterConcernState={setSisterConcernState}
                  />
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
        <DataTable
          columns={columns}
          data={sisterConcernState.sisterConcernList}
        />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SisterConcernList;
