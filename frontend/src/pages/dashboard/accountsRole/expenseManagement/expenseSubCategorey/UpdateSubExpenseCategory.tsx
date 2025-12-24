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
import { useUpdateExpenseSubCategoreyMutation } from "@/store/api/accounts/expenseSubCategory";

import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateSubExpenseCategoryProps {
  subExpenseId: number;
  closeModal: () => void;
  initialData: { name: string; categoryId: number };
}

const UpdateSubExpenseCategory: FC<IUpdateSubExpenseCategoryProps> = ({
  subExpenseId,
  closeModal,
  initialData,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();

  const [updateSubCategory, { isLoading, error }] =
    useUpdateExpenseSubCategoreyMutation();
  const { data: categories, isLoading: categoriesLoading } =
    useGetExpenseCategoreyAccountListQuery({});

  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialData.categoryId
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    defaultValues: { name: initialData.name },
  });

  useEffect(() => {
    reset({ name: initialData.name });
    setSelectedCategory(initialData.categoryId);
  }, [initialData, reset]);

  const onSubmit = async (data: { name: string }) => {
    if (!selectedCategory) {
      toast({
        title: translate("ক্যাটেগরি নির্বাচন করুন", "Please select a category"),
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await updateSubCategory({
        id: subExpenseId,
        body: { name: data.name, expenseCategoryId: selectedCategory }, // Fixed 'expenseCategoryId'
      });

      if (result.data?.success) {
        toast({
          title: translate(
            "সফলভাবে আপডেট হয়েছে",
            "Subcategory updated successfully!"
          ),
        });
        closeModal();
      } else {
        toast({
          title:
            result.data?.message ||
            translate(
              "আপডেট করতে ব্যর্থ হয়েছে",
              "Failed to update subcategory"
            ),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: translate(
          "আপডেট করতে ব্যর্থ হয়েছে",
          "Failed to update subcategory"
        ),
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
        <Select
          value={selectedCategory ? String(selectedCategory) : undefined}
          onValueChange={(value) => setSelectedCategory(Number(value))}
        >
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
        submitTitle={translate("আপডেট করুন", "Update Subcategory")}
        errorTitle={translate(" আপডেট করতে ত্রুটি", "Failed to Update")}
      />
    </form>
  );
};

export default UpdateSubExpenseCategory;
