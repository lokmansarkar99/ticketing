/* eslint-disable @typescript-eslint/ban-ts-comment */
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
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
  useDeleteFaqMutation,
  useGetFaqAllListQuery,
} from "@/store/api/faq/faqApi";
import AddFaq from "./AddFaq";
import EditFaq from "./EditFaq";

interface IFaqListProps {}

export interface IFaqStateProps {
  addFaqOpen: boolean;
  faqList: Partial<any[]>; // replace with actual FAQ type if available
}

const FaqList: FC<IFaqListProps> = () => {
  const { toast } = useToast();

  const [faqState, setFaqState] = useState<IFaqStateProps>({
    addFaqOpen: false,
    faqList: [],
  });

  const { data: faqData, isLoading: faqLoading } = useGetFaqAllListQuery({});
  const [deleteFaq] = useDeleteFaqMutation();

  useEffect(() => {
    const customizeData = faqData?.data?.map((item: any, index: number) => ({
      ...item,
      index: index + 1,
    }));

    setFaqState((prevState) => ({
      ...prevState,
      faqList: customizeData || [],
    }));
  }, [faqData]);

  const handleDeleteFaq = async (id: number) => {
    const result = await deleteFaq(id);

    if (result?.data?.success) {
      toast({
        title: "FAQ Deleted",
        description: "The FAQ has been successfully deleted.",
      });
    }
  };

  const columns: ColumnDef<any | undefined>[] = [
    { accessorKey: "index", header: "Index" },
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? <span>{item.question}</span> : null;
      },
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => {
        const item = row.original as any | undefined;
        return item ? <span>{item.answer}</span> : null;
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
              {/* UPDATE FAQ */}
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
                  <DialogTitle className="sr-only">Edit FAQ</DialogTitle>
                  <EditFaq id={item.id} />
                </DialogContent>
              </Dialog>

              {/* DELETE FAQ */}
              <DeleteAlertDialog
                position="start"
                actionHandler={() => handleDeleteFaq(item.id)}
                alertLabel="FAQ"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null;
      },
    },
  ];

  if (faqLoading) return <TableSkeleton columns={3} />;

  return (
    <PageWrapper>
      <TableWrapper subHeading="FAQ List and Management" heading="FAQs">
        <TableToolbar alignment="responsive">
          <ul className="flex items-center gap-x-2">
            <li>
              <Dialog
                open={faqState.addFaqOpen}
                onOpenChange={(open) =>
                  setFaqState({
                    ...faqState,
                    addFaqOpen: open,
                  })
                }
              >
                <DialogTrigger asChild>
                  <Button className="group relative" variant="outline" size="icon">
                    <LuPlus />
                    <span className="custom-tooltip-top">Add FAQ</span>
                  </Button>
                </DialogTrigger>
                <DialogContent size="sm">
                  <DialogTitle className="sr-only">Add FAQ</DialogTitle>
                  <AddFaq setFaqState={setFaqState} />
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
        <DataTable columns={columns} data={faqState.faqList} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default FaqList;
