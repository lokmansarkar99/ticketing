import Submit from "@/components/common/form/Submit";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateExpenseCategoreyMutation } from "@/store/api/accounts/expenseDashboardApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IUpdateExpenseCategoryProps {
  expenseId: number;
  closeModal: () => void;
  initialData?: { name: string };
}

const UpdateAccountantExpenseCategorey: FC<IUpdateExpenseCategoryProps> = ({
  expenseId,
  closeModal,
  initialData,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();

  const [updateExpenseCategorey, { isLoading, error }] =
    useUpdateExpenseCategoreyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: initialData || { name: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData); // Pre-fill form with initial data
    }
  }, [initialData, reset]);

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await updateExpenseCategorey({
        id: expenseId,
        body: { name: data.name },
      });
      if (result.data?.success) {
        toast({
          title: translate("সফলভাবে আপডেট হয়েছে", "Updated successfully!"),
        });
        closeModal();
      } else {
        toast({
          title:
            result.data?.message ||
            translate("আপডেট ব্যর্থ হয়েছে", "Update failed"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: translate("আপডেট করতে ব্যর্থ হয়েছে", "Failed to update"),
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
        submitTitle={translate("আপডেট করুন", "Update Category")}
        errorTitle={translate(" আপডেট করতে ত্রুটি", "Failed to Update")}
      />
    </form>
  );
};

export default UpdateAccountantExpenseCategorey;
