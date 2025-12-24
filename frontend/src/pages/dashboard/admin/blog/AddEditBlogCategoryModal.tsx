import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import ButtonLoader from "@/components/common/typography/ButtonLoader";

interface AddEditBlogCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number | null, name: string) => void;
  currentCategory?: { id: number | null; name: string };
  loading: boolean;
  err?: { data: { message?: string }}
}

export default function AddEditBlogCategoryModal({
  isOpen,
  onClose,
  onSave,
  currentCategory,
  loading,
  err,
}: AddEditBlogCategoryModalProps) {
const {toast}=useToast()
  const [name, setName] = useState(currentCategory?.name || "");


  useEffect(() => {
    setName(currentCategory?.name || "");
  }, [currentCategory]);

  const handleSave = () => {
    if (name.trim() === "") {
      return;
    }
    try {
      onSave(currentCategory?.id || null, name.trim());
    } catch (error) {
      console.error(error);
      toast({
        title:"Something went wrong! Please try again."
      });

    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentCategory ? "Edit Blog Category" : "Add Blog Category"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        {err && "data" in err && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Category Error</AlertTitle>
            <AlertDescription>
              {(err.data as { message?: string })?.message ||
                "Something went wrong! Please try again."}
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={'outline'}
            onClick={handleSave}
            className="bg-primary hover:bg-primary dark:bg-primary dark:text-white hover:text-white text-white"
            disabled={!name.trim()}
          >
            {loading && <ButtonLoader />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
