
import { useState } from "react";
import { FiEdit, FiSearch, FiTrash2 } from "react-icons/fi";
import { Plus } from "lucide-react";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ButtonLoader from "@/components/common/typography/ButtonLoader";
import {
  useAddBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogCategoriesQuery,
  useUpdateBlogCategoryMutation,
} from "@/store/api/blog/blogCategoryApi";
import AddEditBlogCategoryModal from "./AddEditBlogCategoryModal"; // ✅ keep this

interface BlogCategory {
  id: number;
  name: string;
}

const CategoryLists = () => {
  const {toast} = useToast();
  const [searchCategory, setSearchCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | undefined>(undefined);

  const { data, isLoading, isError, refetch } = useGetBlogCategoriesQuery({
    sort: "asc",
    page: 1,
    size: 50,
    search: searchCategory,
  });

  const [addCategory, { isLoading: addLoading }] = useAddBlogCategoryMutation();
  const [updateCategory, { isLoading: editLoading }] = useUpdateBlogCategoryMutation();
  const [deleteCategory, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteBlogCategoryMutation();

  const categories = data?.data || [];
const handleSaveCategory = async (id: number | null, name: string) => {
  try {
    const result = id
      ? await updateCategory({ id, name }).unwrap()
      : await addCategory({ name }).unwrap();

    if (result.success) {
      toast({
        title: id ? "Category Updated Successfully" : "Category Added Successfully",
        description: "Your changes have been saved.",
      });
      setModalOpen(false);
      refetch();
    }
  } catch (err) {
    console.error("Error saving category:", err);
    toast({
      title: "Failed to Save Category",
      description: "Please try again later.",
    });
  }
};

const handleDeleteCategory = async (id: number) => {
  try {
    await deleteCategory(id).unwrap();
    toast({
      title: "Category Deleted",
      description: "The category has been removed successfully.",
    });
    refetch();
  } catch (err) {
    console.error("Error deleting category:", err);
    toast({
      title: "Failed to Delete Category",
      description: "Please try again later.",
    });
  }
};


  const handleEditCategory = (category: BlogCategory) => {
    setCurrentCategory(category);
    setModalOpen(true);
  };

  const handleAddCategory = () => {
    setCurrentCategory(undefined);
    setModalOpen(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-3 sm:p-6 dark:bg-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <h1 className="text-2xl font-semibold">Blog Categories</h1>
        <Button
          variant="outline"
          onClick={handleAddCategory}
          className="flex items-center bg-primary text-white"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-black rounded-lg p-3 mb-4">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search category..."
            className="border rounded pl-10 pr-3 py-2 text-gray-700 w-full dark:text-white dark:bg-black"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
      </div>

      {/* Table-like Layout */}
      <div className="overflow-x-auto bg-white dark:bg-[#111] rounded-lg shadow">
        <div className="grid grid-cols-3 sm:grid-cols-4 font-semibold border-b px-4 py-3 dark:border-gray-700">
          <span>SL</span>
          <span>Category Name</span>
          <span className="hidden sm:block">Actions</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <ButtonLoader />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-6">
            Failed to load categories.
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No categories found.</div>
        ) : (
          categories.map((row: BlogCategory, index: number) => (
            <div
              key={row.id}
              className="grid grid-cols-3 sm:grid-cols-4 items-center border-b px-4 py-3 text-sm dark:border-gray-700"
            >
              <span>{index + 1}</span>
              <span>{row.name}</span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditCategory(row)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiEdit />
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-600 hover:text-red-800">
                      <FiTrash2 />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-[#F53E32] hover:bg-[#F53E32]"
                        onClick={() => handleDeleteCategory(row.id)}
                      >
                        {deleteLoading ? <ButtonLoader /> : "Confirm"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteError && "data" in deleteError && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Delete Error</AlertTitle>
          <AlertDescription>
            {(deleteError.data as { message?: string })?.message ||
              "Something went wrong!"}
          </AlertDescription>
        </Alert>
      )}

      {/* ✅ Keep your existing modal exactly as before */}
      <AddEditBlogCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        currentCategory={currentCategory}
        loading={addLoading || editLoading}
      />
    </div>
  );
};

export default CategoryLists;
