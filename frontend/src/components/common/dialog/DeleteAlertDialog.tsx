import { FC } from "react";
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
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { cn } from "@/lib/utils";
import { LuTrash2 } from "react-icons/lu";

interface IAlertDialogProps {
  actionHandler: () => void;
  triggerType?: "button" | "icon";
  alertLabel: string;
  position?: "start" | "center" | "end";
}

const DeleteAlertDialog: FC<IAlertDialogProps> = ({
  actionHandler,
  triggerType = "button",
  alertLabel,
  position = "center",
}) => {
  const { translate } = useCustomTranslator();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={cn(
            position === "start" && "justify-start",
            position === "center" && "justify-center",
            position === "end" && "justify-end"
          )}
          size={triggerType ? "xs" : "icon"}
          variant="destructive"
        >
          {triggerType === "icon" ? (
            <LuTrash2 />
          ) : (
            translate("ডিলিট করুন", "Delete")
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {translate(
              "এই ক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না।",
              "Are you absolutely sure?"
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {translate(
              `এই ক্রিয়াটি পূর্বাবস্থায় ফিরিয়ে নেওয়া যাবে না। এটি আপনার ${alertLabel} স্থায়ীভাবে মুছে দেবে এবং আমাদের সার্ভার থেকে আপনার ডেটা অপসারণ করবে।`,
              `This action cannot be undone. This will permanently delete your ${alertLabel} and remove your data from our servers.`
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {translate("বাতিল করুন", "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={actionHandler}>
            {translate("নিশ্চিত করুন", "Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;
