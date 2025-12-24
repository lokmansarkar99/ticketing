import Submit from "@/components/common/form/Submit";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCreateExpenseCategoreyMutation } from "@/store/api/accounts/expenseDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface IAddExpenseCategoryProps {
  setOpen: (open: boolean) => void;
}

const AddAccountantExpenseCategorey: FC<IAddExpenseCategoryProps> = ({
  setOpen,
}) => {
  const { translate } = useCustomTranslator();

  const { toast } = useToast();
  const [addSupervisorExpenseCategory, { isLoading, error }] =
    useCreateExpenseCategoreyMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    try {
      // Ensure the name is nested inside `body`
      const result = await addSupervisorExpenseCategory({
        body: { name: data.name },
      });
      if (result.data?.success) {
        toast({
          title: translate(
            "বিভাগ সফলভাবে যোগ করা হয়েছে",
            "Category added successfully!"
          ),
        });
        setOpen(false);
      } else {
        toast({
          title: result.data?.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: translate(
          "বিভাগ যোগ করতে ব্যর্থ হয়েছে",
          "Failed to add category"
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name", { required: true })}
        placeholder={translate("বিভাগের নাম লিখুন", "Enter category name")}
      />
      {errors.name && (
        <p className="text-red-500">
          {translate("বিভাগের নাম আবশ্যক", "Category name is required")}
        </p>
      )}
      <Submit
        loading={isLoading}
        errors={error}
        submitTitle={translate(" যুক্ত করুন", "Add Category")}
        errorTitle={translate(" যোগ করতে ত্রুটি", "Failed to Add Category")}
      />
    </form>
  );
};

export default AddAccountantExpenseCategorey;
