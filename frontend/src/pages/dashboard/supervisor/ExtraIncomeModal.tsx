// components/modals/ExtraIncomeModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface ExtraIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExtraIncomeModal: FC<ExtraIncomeModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { translate } = useCustomTranslator();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          {translate("অতিরিক্ত আয় যুক্ত করুন", "Add Extra Income")}
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <Input placeholder={translate("টাইটেল লিখুন", "Enter Title")} />
          <Input
            placeholder={translate("পরিমাণ লিখুন", "Enter Amount")}
            type="number"
          />
          <Button onClick={() => onOpenChange(false)}>
            {translate("সাবমিট করুন", "Submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtraIncomeModal;
