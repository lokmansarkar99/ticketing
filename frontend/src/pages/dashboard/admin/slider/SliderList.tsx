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
  useDeleteSliderMutation,
  useGetSliderAllListQuery,
} from "@/store/api/slider/sliderApi";
import { slider } from "@/types/dashboard/slider/slider";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import AddSlider from "./AddSlider";
import UpdateSlider from "./UpdateSlider";

interface ISliderListProps {}
export interface ISliderStateProps {
  addSliderOpen: boolean;
  sliderList: Partial<slider[]>;
}

const SliderList: FC<ISliderListProps> = () => {
  const { toast } = useToast();

  const [sliderState, setSliderState] = useState<ISliderStateProps>({
    addSliderOpen: false,
    sliderList: [],
  });

  const { data: slidersData, isLoading: sliderLoading } =
    useGetSliderAllListQuery({});

  const [deleteSlider] = useDeleteSliderMutation();

  useEffect(() => {
    const customizeSliderData = slidersData?.data?.map(
      (singleSlider: slider, index: number) => ({
        ...singleSlider,
        index: index + 1,
      })
    );

    setSliderState((prevState) => ({
      ...prevState,
      sliderList: customizeSliderData || [],
    }));
  }, [slidersData]);

  const sliderDeleteHandler = async (id: number) => {
    const result = await deleteSlider(id);

    if (result?.data?.success) {
      toast({
        title: "Slider Deleted",
        description: "The slider image has been successfully deleted.",
      });
    }
  };

  const columns: ColumnDef<slider | undefined>[] = [
    { accessorKey: "index", header: "Index" },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const sliderItem = row.original as slider | undefined;
        return sliderItem ? (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={sliderItem.image}
              alt={`Slider Image ${sliderItem.id}`}
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
        const sliderItem = row.original as slider | undefined;
        return sliderItem ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
              {/* UPDATE SLIDER */}
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
                  <UpdateSlider id={sliderItem.id} />
                </DialogContent>
              </Dialog>

              {/* SLIDER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => sliderDeleteHandler(sliderItem.id)}
                alertLabel="Slider Image"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  if (sliderLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <PageWrapper>
      <TableWrapper
        subHeading="Slider List and Image Management"
        heading="Sliders"
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={sliderState.addSliderOpen}
                onOpenChange={(open) =>
                  setSliderState({ ...sliderState, addSliderOpen: open })
                }
              >
                <DialogTrigger asChild>
                  <Button
                    className="group relative"
                    variant="outline"
                    size="icon"
                  >
                    <LuPlus />
                    <span className="custom-tooltip-top">Add Slider</span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">empty</DialogTitle>
                  <AddSlider setSliderState={setSliderState} />
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
        <DataTable columns={columns} data={sliderState.sliderList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default SliderList;
