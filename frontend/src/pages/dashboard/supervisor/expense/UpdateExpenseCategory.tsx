/* eslint-disable @typescript-eslint/no-unused-vars */
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetSingleSupervisorExpenseCategoryQuery,
  useUpdateSupervisorExpenseCategoryMutation,
} from "@/store/api/superviosr/supervisorExpenseCategoryApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IUpdateExpenseCategoryProps {
  id: number | null;
  setOpen: (open: boolean) => void;
}

const UpdateExpenseCategory: FC<IUpdateExpenseCategoryProps> = ({
  id,
  setOpen,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();

  const { data: categoryData, isLoading: categoryLoading } =
    useGetSingleSupervisorExpenseCategoryQuery(id, {
      skip: !id, // Ensure query runs only if ID exists
    });

  const [updateCategory, { isLoading: updateLoading, error: errorSubmit }] =
    useUpdateSupervisorExpenseCategoryMutation();

  const {
    register,
    handleSubmit,
    reset, // Use reset to set the form values dynamically
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", // Initial value
    },
  });

  useEffect(() => {
    if (categoryData?.data) {
      reset({
        name: categoryData.data.name, // Reset the form with fetched data
      });
    }
  }, [categoryData, reset]);

  const onSubmit = async (data: { name: string }) => {
    if (!id) return; // Prevent submission if no ID is available

    const result = await updateCategory({ id, data }); // Ensure correct data structure
    if (result?.data?.success) {
      toast({
        title: translate(
          "বিভাগ সফলভাবে আপডেট হয়েছে",
          "Category Updated Successfully"
        ),
      });
      setOpen(false); // Close the modal on success
    }
  };

  if (categoryLoading) {
    return <FormSkeleton columns={1} inputs={1} />;
  }

  return (
    <DialogContent>
      <DialogTitle>
        {translate("বিভাগ আপডেট করুন", "Update Category")}
      </DialogTitle>
      <FormWrapper
        heading={translate("বিভাগ আপডেট করুন", "Update Category")}
        subHeading={translate(
          "নিচে বিভাগ আপডেট করার জন্য তথ্য প্রদান করুন।",
          "Provide the information below to update the category."
        )}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder={translate("বিভাগের নাম লিখুন", "Enter category name")}
            className="mb-4"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <Submit
            errors={errorSubmit}
            loading={updateLoading}
            submitTitle={translate("আপডেট করুন", "Update")}
            errorTitle={translate(" আপডেট করতে ত্রুটি", "Add Expense Error")}
          />
        </form>
      </FormWrapper>
    </DialogContent>
  );
};

export default UpdateExpenseCategory;
