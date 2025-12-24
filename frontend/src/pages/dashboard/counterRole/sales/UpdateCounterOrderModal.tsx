import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateDuePaymentMutation } from "@/store/api/counter/counterSalesBookingApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IUpdateCounterOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const UpdateCounterOrderModal: FC<IUpdateCounterOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const [updateDuePayment, { isLoading }] = useUpdateDuePaymentMutation();

  const handlePayment = async () => {
    try {
      await updateDuePayment(order.id).unwrap();
      toast({
        title: translate("পেমেন্ট সফল", "Payment Successful"),
        description: translate(
          "দায় মিটিয়ে ফেলা হয়েছে।",
          "Due cleared successfully."
        ),
      });
      onClose();
    } catch (error) {
      toast({
        title: translate("পেমেন্ট ব্যর্থ", "Payment Failed"),
        description: translate(
          "দয়া করে আবার চেষ্টা করুন।",
          "Please try again."
        ),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle>
            {translate("অর্ডার বিস্তারিত", "Order Details")}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
            <div>
              <p className="text-sm font-semibold ">
                {translate("গ্রাহকের নাম", "Customer Name")}
              </p>
              <p className="text-base ">{order?.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold ">
                {translate("অর্ডার আইডি", "Order ID")}
              </p>
              <p className="text-base ">{order?.id}</p>
            </div>
            <div>
              <p className="text-sm font-semibold ">
                {translate("ফোন", "Phone")}
              </p>
              <p className="text-base ">{order?.phone}</p>
            </div>
            <div>
              <p className="text-sm font-semibold ">
                {translate("টিকিট আইডি", "Ticket No")}
              </p>
              <p className="text-base ">{order?.ticketNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
            <div>
              <p className="text-sm font-semibold ">
                {translate("মোট পরিমাণ", "Total Amount")}
              </p>
              <p className="text-base ">{order?.amount}</p>
            </div>
            <div>
              <p className="text-sm font-semibold ">
                {translate("পেমেন্ট পরিমাণ", "Payment Amount")}
              </p>
              <p className="text-base ">{order?.paymentAmount}</p>
            </div>
            <div>
              <p className="text-sm font-semibold ">
                {translate("দায়", "Due")}
              </p>
              <p className="text-base ">{order?.dueAmount}</p>
            </div>
          </div>
          <Button
            onClick={handlePayment}
            disabled={isLoading || order.dueAmount <= 0}
            className="w-full"
          >
            {translate("পেমেন্ট", "Pay")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCounterOrderModal;
