import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";

import { MoreHorizontal, Plus } from "lucide-react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import { DataTable } from "@/components/common/table/DataTable";
import {
  TableToolbar,
  TableWrapper,
} from "@/components/common/wrapper/TableWrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  useDeletePageMutation,
  useGetPagesQuery,
} from "@/store/api/page/pageApi";
import { Loader } from "@/components/common/Loader";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

const PageList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const { toast } = useToast();
  const [pagination, setPagination] = useState({
    sort: "asc",
    page: 1,
    size: 10,
    meta: {
      page: null,
      size: null,
      total: null,
      totalPage: null,
    },
  });

  const { data, isLoading, refetch } = useGetPagesQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });
  const [deletePage, { error: deleteError }] = useDeletePageMutation();

  useEffect(() => {
    if (data) {
      setPagination((prev) => ({
        ...prev,
        meta: {
          page: data.meta.page,
          size: data.meta.size,
          total: data.meta.total,
          totalPage: data.meta.totalPage,
        },
      }));
    }
  }, [data]);

  const handleDelete = async () => {
    for (const row of selectedRows) {
      await deletePage(row.id);
    }
    setSelectedRows([]);
    refetch();
  };

  const handleDeletePage = async (id: number) => {
    try {
      await deletePage(id).unwrap();
      toast({
        title: "Page deleted successfully",
        description: "The page has been deleted.",
      });
      refetch();
    } catch (err) {
      console.error("Error deleting page:", err);
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "index", header: "SL" },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="text-blue-500 font-medium cursor-pointer hover:underline">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.original.status === "Published"
              ? "bg-green-100 text-green-700"
              : row.original.status === "Draft"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Action",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <Link to={`/admin/edit-page/${row.original.slug}`}>
              <Button
                variant="outline"
                className="w-full flex justify-start"
                size="xs"
              >
                Edit Page
              </Button>
            </Link>
            <DeleteAlertDialog
              position="start"
              actionHandler={() => handleDeletePage(row.original.id)}
              alertLabel="Page"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  const customizedData =
    data?.data?.map((item: any, index: number) => ({
      id: item.id,
      slug:item.slug,
      title: item.title,
      status: item.status,
      index: index + 1 + (pagination.page - 1) * pagination.size,
    })) || [];

  return (
    <PageWrapper>
      <TableWrapper heading="Pages" subHeading="Page List and Management">
        <TableToolbar alignment="responsive">
          <div className="flex gap-4 items-center my-4">
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded pl-10 pr-3 py-1 text-gray-700 w-60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <ul className="flex items-center gap-x-2">
            <li>
              <Button
                onClick={handleDelete}
                disabled={selectedRows.length === 0}
                className={cn(
                  "px-4 py-1.5 rounded border",
                  selectedRows.length > 0
                    ? "text-red-500 border-red-500 hover:bg-red-50"
                    : "text-gray-400 border-gray-300 cursor-not-allowed"
                )}
              >
                <FiTrash2 className="inline-block mr-1" /> Delete
              </Button>
            </li>
            <li>
              <Link to="/admin/add-page">
                <Button variant="outline" size="icon">
                  <Plus />
                </Button>
              </Link>
            </li>
          </ul>
        </TableToolbar>
        <DataTable columns={columns} data={customizedData} />
        {deleteError && "data" in deleteError && (
          <div className="my-4">
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">
                {(deleteError.data as { message?: string })?.message ||
                  "Something went wrong! Please try again."}
              </span>
            </div>
          </div>
        )}
        <div className="my-10">
          {/* Add Pagination component here if available */}
        </div>
      </TableWrapper>
    </PageWrapper>
  );
};

export default PageList;
