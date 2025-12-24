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
  useDeleteAboutUsMutation,
  useGetAboutUsListQuery,
} from "@/store/api/aboutUs/aboutUsApi";
import { aboutus } from "@/types/dashboard/aboutus/aboutUs";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { LuDownload, LuPlus } from "react-icons/lu";
import UpdateAboutUs from "./UpdateAboutUs";
import AddAboutUs from "./AddAboutUs";

interface IAboutUsListProps {}
export interface IAboutStateProps {
  addAboutOpen: boolean;
  aboutUsList: Partial<aboutus[]>;
}

const AboutUsList: FC<IAboutUsListProps> = () => {
  const { toast } = useToast();

  const [aboutState, setAboutState] = useState<IAboutStateProps>({
    addAboutOpen: false,
    aboutUsList: [],
  });

  const { data: aboutData, isLoading: sliderLoading } = useGetAboutUsListQuery(
    {}
  );

  const [deleteAboutus] = useDeleteAboutUsMutation();

  useEffect(() => {
    const customizeAboutData = aboutData?.data?.map(
      (singleAbout: aboutus, index: number) => ({
        ...singleAbout,
        index: index + 1,
      })
    );

    setAboutState((prevState) => ({
      ...prevState,
      aboutUsList: customizeAboutData || [],
    }));
  }, [aboutData]);

  const sliderDeleteHandler = async (id: number) => {
    const result = await deleteAboutus(id);

    if (result?.data?.success) {
      toast({
        title: "About Us Deleted",
        description: "The about us has been successfully deleted.",
      });
    }
  };

  const columns: ColumnDef<aboutus | undefined>[] = [
    { accessorKey: "index", header: "Index" },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const aboutItem = row.original as aboutus | undefined;
        return aboutItem ? (
          <div className="size-8 rounded-md overflow-hidden">
            <PhotoViewer
              className="scale-1"
              src={aboutItem.image}
              alt={`Image ${aboutItem.id}`}
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
        const aboutItem = row.original as aboutus | undefined;
        return aboutItem ? (
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
                  <UpdateAboutUs id={aboutItem.id} />
                </DialogContent>
              </Dialog>

              {/* SLIDER DELETE */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => sliderDeleteHandler(aboutItem.id)}
                alertLabel="About us"
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
        subHeading="About Us List and Image Management"
        heading="About Us"
      >
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={aboutState.addAboutOpen}
                onOpenChange={(open) =>
                  setAboutState({ ...aboutState, addAboutOpen: open })
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
                  <AddAboutUs setAboutState={setAboutState} />
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
        <DataTable columns={columns} data={aboutState.aboutUsList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default AboutUsList;
