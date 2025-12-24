import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { useGetSingleFaqQuery, useUpdateFaqMutation } from "@/store/api/faq/faqApi";
import { AddFaqProps, addFaqSchema } from "@/schemas/faq/addEditFaqSchema";

interface IEditFaqProps {
  id: number | null;
}

const EditFaq: FC<IEditFaqProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { register, setValue, setError, handleSubmit } = useForm<AddFaqProps>({
    resolver: zodResolver(addFaqSchema),
  });

  const { data: singleFaq, isLoading } = useGetSingleFaqQuery(id);
  const [updateFaq, { isLoading: updateLoading, error: updateError }] = useUpdateFaqMutation();

  useEffect(() => {
    if (singleFaq) {
      const question = singleFaq.data?.question || "";
      const answer = singleFaq.data?.answer || "";

      setValue("question", question);
      setValue("answer", answer);
    }
  }, [singleFaq, setValue]);

  const onSubmit = async (formData: AddFaqProps) => {
    try {
      const result = await updateFaq({ id, data: formData }).unwrap();
      if (result?.success) {
        toast({
          title: translate("FAQ সফলভাবে হালনাগাত করা হয়েছে", "FAQ Successfully Updated"),
          description: toastMessage("update", translate("FAQ", "FAQ")),
        });
      }
    } catch (error) {
      setError("question", { message: "Update failed" });
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={2} />;
  }

  return (
    <FormWrapper
      heading={translate("FAQ হালনাগাত করুন", "Update FAQ")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন FAQ হালনাগাত করার জন্য।",
        "Fill out the details below to update the FAQ."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Question */}
        <InputWrapper
          labelFor="question"
          label={translate("প্রশ্ন", "Question")}
        >
          <input
            type="text"
            {...register("question")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder={translate("প্রশ্ন লিখুন", "Enter question")}
          />
        </InputWrapper>

        {/* Answer */}
        <InputWrapper
          labelFor="answer"
          label={translate("উত্তর", "Answer")}
        >
          <textarea
            {...register("answer")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={4}
            placeholder={translate("উত্তর লিখুন", "Enter answer")}
          />
        </InputWrapper>

        <Submit
          loading={updateLoading}
          errors={updateError}
          submitTitle={translate("FAQ হালনাগাত করুন", "Update FAQ")}
          errorTitle={translate("FAQ হালনাগাত করতে ত্রুটি", "Error Updating FAQ")}
        />
      </form>
    </FormWrapper>
  );
};

export default EditFaq;
