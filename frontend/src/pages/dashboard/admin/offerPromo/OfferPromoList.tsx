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
import { 
  useDeleteOfferMutation, 
  useGetOfferAllListQuery 
} from "@/store/api/offer/offerApi";
import AddOfferPromo from "./AddOfferPromo";
import EditOfferPromo from "./EditOfferPromo";

interface IOfferListProps {}

export interface IOfferStateProps {
  addOfferOpen: boolean;
  offerList: Partial<any[]>; // replace with actual Offer type if available
}

const OfferPromoList: FC<IOfferListProps> = () => {
  const { toast } = useToast();

  const [offerState, setOfferState] = useState<IOfferStateProps>({
    addOfferOpen: false,
    offerList: [],
  });

  const { data: offerData, isLoading: offerLoading } =
    useGetOfferAllListQuery({});

  const [deleteOffer] = useDeleteOfferMutation();

  useEffect(() => {
    const customizeData = offerData?.data?.map(
      (item: any, index: number) => ({
        ...item,
        index: index + 1,
      })
    );

    setOfferState((prevState) => ({
      ...prevState,
      offerList: customizeData || [],
    }));
  }, [offerData]);

  const handleDeleteOffer = async (id: number) => {
    const result = await deleteOffer(id);

    if (result?.data?.success) {
      toast({
        title: "Offer Deleted",
        description: "The offer has been successfully deleted.",
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
              alt={`Offer Image ${item.id}`}
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
              {/* UPDATE OFFER */}
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
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <EditOfferPromo id={item.id} />
                </DialogContent>
              </Dialog>

              {/* DELETE OFFER */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => handleDeleteOffer(item.id)}
                alertLabel="Offer"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  if (offerLoading) {
    return <TableSkeleton columns={5} />;
  }

  return (
    <PageWrapper>
      <TableWrapper subHeading="Offers List and Management" heading="Offers">
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={offerState.addOfferOpen}
                onOpenChange={(open) =>
                  setOfferState({
                    ...offerState,
                    addOfferOpen: open,
                  })
                }
              >
                <DialogTrigger asChild>
                  <Button className="group relative" variant="outline" size="icon">
                    <LuPlus />
                    <span className="custom-tooltip-top">Add Offer</span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="md">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddOfferPromo setOfferState={setOfferState} />
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
        <DataTable columns={columns} data={offerState.offerList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default OfferPromoList;
