import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddExpenseAccountsRole from "@/pages/dashboard/accountsRole/expenseManagement/addExpense/AddExpense";
import AddFuelPayment from "@/pages/dashboard/admin/fuel/AddFuelPayment";
import AddExtraIncome from "@/pages/dashboard/supervisor/AddExtraIncome";
import AddExpense from "@/pages/dashboard/supervisor/expense/AddExpense";

const ModalSystem = ({
  activeModal,
  setActiveModal,
}: {
  activeModal: any;
  setActiveModal: any;
}) => {
  return (
    <Dialog
      open={!!activeModal}
      onOpenChange={(open) => !open && setActiveModal(null)}
    >
      <DialogContent>
        {activeModal === "AddFuelPayment" && (
          <AddFuelPayment setPaymentOpen={() => setActiveModal(null)} />
        )}
        {activeModal === "AddExtraIncome" && (
          <AddExtraIncome
            setCollectionState={() => {}} // Add appropriate function
            setIncomeOpen={() => setActiveModal(null)}
          />
        )}
        {activeModal === "AddExpense" && (
          <AddExpense
            setOpen={() => {}} // Add appropriate function
            setExpenseOpen={() => setActiveModal(null)}
          />
        )}
        {activeModal === "AddAccountsRoleExpense" && (
          <AddExpenseAccountsRole
            setOpen={() => {}} // Add appropriate function
            setExpenseOpen={() => setActiveModal(null)}
            //@ts-ignore
            setExpenseState={(stateUpdater: any) => {}}
          />
        )}
        {/* Add other modals dynamically */}
      </DialogContent>
    </Dialog>
  );
};

export default ModalSystem;
