import Submit from "@/components/common/form/Submit";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAddSupervisorExpenseCategoryMutation } from "@/store/api/superviosr/supervisorExpenseCategoryApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { useForm } from "react-hook-form";

interface IAddExpenseCategoryProps {
  setOpen: (open: boolean) => void;
}

const AddExpenseCategory: FC<IAddExpenseCategoryProps> = ({ setOpen }) => {
  const { translate } = useCustomTranslator();

  const { toast } = useToast();
  const [addSupervisorExpenseCategory, { isLoading, error }] =
    useAddSupervisorExpenseCategoryMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await addSupervisorExpenseCategory(data);
      if (result.data?.success) {
        toast({ title: "Category added successfully!" });
        setOpen(false);
      }
    } catch (error) {
      toast({ title: "Failed to add category", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name", { required: true })}
        placeholder="Enter category name"
      />
      {errors.name && <p>Category name is required</p>}
      <Submit
        loading={isLoading}
        errors={error}
        submitTitle={translate(" যুক্ত করুন", "Add Category")}
        errorTitle={translate(" যোগ করতে ত্রুটি", "Add Category")}
      />
    </form>
  );
};

export default AddExpenseCategory;
