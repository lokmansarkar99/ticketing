import { useState, useEffect } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiSearch } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { TableWrapper, TableToolbar } from "@/components/common/wrapper/TableWrapper";
import { DataTable } from "@/components/common/table/DataTable";
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";
import { Loader } from "@/components/common/Loader";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeletePostMutation,
  useGetAllPostsQuery,
} from "@/store/api/blog/blogApi";
import { ColumnDef } from "@tanstack/react-table";

const BlogPost = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
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

  const { data, isLoading, refetch } = useGetAllPostsQuery({
    sort: pagination.sort,
    page: pagination.page,
    size: pagination.size,
    search: searchTerm,
  });

  const [deletePost] = useDeletePostMutation();

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

  

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id).unwrap();
      toast({
        title: "Deleted successfully",
        description: "The blog post has been deleted.",
      });
      refetch();
    } catch (err) {
      toast({ title: "Error deleting post" });
    }
  };

  const columns: ColumnDef<any>[] = [
    { accessorKey: "index", header: "SL" },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="text-blue-600 font-medium cursor-pointer hover:underline">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Author",
      cell: ({ row }) => row.original.author || "N/A",
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
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-GB"),
    },
    {
      header: "Action",
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            {/* Edit Blog Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="xs" className="w-full flex justify-start">
                  Edit Blog
                </Button>
              </DialogTrigger>
              <DialogContent size="sm">
                <DialogTitle>Edit Blog</DialogTitle>
                {/* You can import and use your <EditBlogForm /> component here */}
                <p className="text-gray-500 text-sm">Edit blog form goes here.</p>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <DeleteAlertDialog
              position="start"
              actionHandler={() => handleDelete(row.original.id)}
              alertLabel="Blog"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (isLoading) return <Loader />;

  const customizedData =
    data?.data?.map((item: any, index: number) => ({
      ...item,
      index: index + 1 + (pagination.page - 1) * pagination.size,
    })) || [];

  return (
    <PageWrapper>
      <TableWrapper heading="Blog Posts" subHeading="Manage all blog posts">
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
              <Link to="/admin/add-blog-post">
                <Button variant="outline" size="icon">
                  <Plus />
                </Button>
              </Link>
            </li>
          </ul>
        </TableToolbar>

        <DataTable columns={columns} data={customizedData} />
      </TableWrapper>
    </PageWrapper>
  );
};

export default BlogPost;
