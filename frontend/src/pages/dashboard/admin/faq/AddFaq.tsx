import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useAddFaqMutation } from "@/store/api/faq/faqApi"; // Your FAQ API slice
import { AddFaqProps, addFaqSchema } from "@/schemas/faq/addEditFaqSchema";

interface IAddFaqProps {
  setFaqState: (state: (prev: any) => any) => void;
}

const AddFaq: FC<IAddFaqProps> = ({ setFaqState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { register, handleSubmit } = useForm<AddFaqProps>({
    resolver: zodResolver(addFaqSchema),
  });

  const [addFaq, { isLoading: faqLoading, error: faqError }] = useAddFaqMutation();

  const onSubmit = async (data: AddFaqProps) => {
    try {
      const result = await addFaq(data).unwrap();

      if (result?.success) {
        toast({
          title: translate("FAQ সফলভাবে যোগ করা হয়েছে", "FAQ Successfully Added"),
          description: toastMessage("add", translate("FAQ", "FAQ")),
        });

        setFaqState((prev) => ({
          ...prev,
          addFaqOpen: false,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: translate("FAQ যোগ করতে ব্যর্থ", "Failed to Add FAQ"),
        variant: "destructive",
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("নতুন FAQ যোগ করুন", "Add New FAQ")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন FAQ যোগ করার জন্য।",
        "Fill out the details below to add a new FAQ."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Question */}
        <InputWrapper labelFor="question" label={translate("প্রশ্ন", "Question")}>
          <input
            type="text"
            {...register("question")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder={translate("প্রশ্ন লিখুন", "Enter Question")}
          />
        </InputWrapper>

        {/* Answer */}
        <InputWrapper labelFor="answer" label={translate("উত্তর", "Answer")}>
          <textarea
            {...register("answer")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={4}
            placeholder={translate("উত্তর লিখুন", "Enter Answer")}
          />
        </InputWrapper>

        <Submit
          loading={faqLoading}
          errors={faqError}
          submitTitle={translate("FAQ যোগ করুন", "Add FAQ")}
          errorTitle={translate("FAQ যোগ করতে ত্রুটি", "Error Adding FAQ")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFaq;
