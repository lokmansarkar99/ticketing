import Submit from "@/components/common/form/Submit";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useGetExpenseCategoreyAccountListQuery } from "@/store/api/accounts/expenseDashboardApi";
import { useCreateExpenseSubCategoreyMutation } from "@/store/api/accounts/expenseSubCategory";

import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

interface IAddSubExpenseCategoryProps {
  setOpen: (open: boolean) => void;
}

const AddSubExpenseCategory: FC<IAddSubExpenseCategoryProps> = ({
  setOpen,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();

  const [createSubCategory, { isLoading, error }] =
    useCreateExpenseSubCategoreyMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useGetExpenseCategoreyAccountListQuery({});

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    if (!selectedCategory) {
      toast({
        title: translate("ক্যাটেগরি নির্বাচন করুন", "Please select a category"),
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createSubCategory({
        body: { name: data.name, expenseCategoryId: selectedCategory }, // Changed to 'expenseCategoryId'
      });

      if (result.data?.success) {
        toast({
          title: translate(
            "সফলভাবে যোগ হয়েছে",
            "Subcategory added successfully!"
          ),
        });
        setOpen(false);
      } else {
        toast({
          title:
            result.data?.message ||
            translate("যোগ করতে ব্যর্থ হয়েছে", "Failed to add subcategory"),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: translate("যোগ করতে ব্যর্থ হয়েছে", "Failed to add subcategory"),
        variant: "destructive",
      });
    }
  };

  if (categoriesLoading)
    return <p>{translate("লোড হচ্ছে...", "Loading...")}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name", { required: true })}
        placeholder={translate("উপবিভাগের নাম", "Subcategory Name")}
      />
      {errors.name && (
        <p className="text-red-500">
          {translate("উপবিভাগের নাম আবশ্যক", "Subcategory name is required")}
        </p>
      )}

      <div className="mt-4">
        <label className="block mb-2">
          {translate("ক্যাটেগরি নির্বাচন করুন", "Select a Category")}
        </label>
        <Select onValueChange={(value) => setSelectedCategory(Number(value))}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={translate(
                "ক্যাটেগরি নির্বাচন করুন",
                "Select a Category"
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {categories?.data?.map((category: { id: number; name: string }) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Submit
        loading={isLoading}
        errors={error}
        submitTitle={translate("যোগ করুন", "Add Subcategory")}
        errorTitle={translate("যোগ করতে ত্রুটি", "Failed to Add")}
      />
    </form>
  );
};

export default AddSubExpenseCategory;
