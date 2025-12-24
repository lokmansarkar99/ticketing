import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { Images } from "lucide-react";
import FileInputArray from "@/components/common/form/FileInputArray";
import { useAddCoreValueMutation } from "@/store/api/corevalue/coreValueApi";
import { addUpdateCoreValueForm } from "@/utils/constants/form/addUpdateCoreValueForm";
import { AddUpdateCoreValueProps, addUpdateCoreValueSchema } from "@/schemas/coreValue/addUpdateCoreValueSchema";

interface IAddCoreValueProps {
  setCoreValueState: (state: (prev: any) => any) => void;
}

const AddCoreValue: FC<IAddCoreValueProps> = ({ setCoreValueState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const [coreValueFile, setCoreValueFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { register, setValue, handleSubmit } =
    useForm<AddUpdateCoreValueProps>({
      resolver: zodResolver(addUpdateCoreValueSchema),
    });

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [addCoreValue, { isLoading: coreValueLoading, error: coreValueError }] =
    useAddCoreValueMutation();

  const onSubmit = async (data: AddUpdateCoreValueProps) => {
    try {
      let imageUrl = "";

      if (coreValueFile) {
        try {
          const uploadResponse = await uploadPhoto(coreValueFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            imageUrl = uploadResponse.data;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: translate("ছবি আপলোড করতে ব্যর্থ", "Failed to upload image"),
            description: translate(
              "ফাইল আপলোড করার সময় একটি ত্রুটি ঘটেছে।",
              "An error occurred while uploading the file."
            ),
            variant: "destructive",
          });
          return;
        }
      }

      const addResult = await addCoreValue({
        image: imageUrl,
        title: data.title,
        description: data.description,
      }).unwrap();

      if (addResult?.success) {
        toast({
          title: translate(
            "কোর ভ্যালু সফলভাবে যোগ করা হয়েছে",
            "Core Value Successfully Added"
          ),
          description: toastMessage(
            "add",
            translate("কোর ভ্যালু", "Core Value")
          ),
        });

        setCoreValueState((prev) => ({
          ...prev,
          addCoreValueOpen: false,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: translate(
          "কোর ভ্যালু যোগ করতে ব্যর্থ",
          "Failed to Add Core Value"
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("নতুন কোর ভ্যালু যোগ করুন", "Add New Core Value")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন কোর ভ্যালু যোগ করার জন্য।",
        "Fill out the details below to add a new core value."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
        <InputWrapper
          className="relative"
          labelFor="image"
          label={"Select a Icon"}
        >
          <div className="absolute right-3 bottom-2.5 z-50">
            <Images className="text-gray-400" />
          </div>
          <FileInputArray
            className="w-full"
            id="image"
            label={translate("ছবি নির্বাচন করুন", "Select Icon")}
            value={imagePreview}
            setFile={setCoreValueFile}
            onChange={(file) => {
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
                setValue("image", previewUrl);
              } else {
                setImagePreview("");
                setValue("image", "");
              }
            }}
            disabled={coreValueLoading}
          />
        </InputWrapper>

        {/* Title */}
        <InputWrapper
          labelFor="title"
          label={translate(
            addUpdateCoreValueForm.title.label.bn,
            addUpdateCoreValueForm.title.label.en
          )}
        >
          <input
            type="text"
            {...register("title")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder={translate(
              addUpdateCoreValueForm.title.placeholder.bn,
              addUpdateCoreValueForm.title.placeholder.en
            )}
          />
        </InputWrapper>

        {/* Description */}
        <InputWrapper
          labelFor="description"
          label={translate(
            addUpdateCoreValueForm.description.label.bn,
            addUpdateCoreValueForm.description.label.en
          )}
        >
          <textarea
            {...register("description")}
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows={4}
            placeholder={translate(
              addUpdateCoreValueForm.description.placeholder.bn,
              addUpdateCoreValueForm.description.placeholder.en
            )}
          />
        </InputWrapper>

        <Submit
          loading={coreValueLoading || uploadPhotoLoading}
          errors={coreValueError}
          submitTitle={translate("কোর ভ্যালু যোগ করুন", "Add Core Value")}
          errorTitle={translate(
            "কোর ভ্যালু যোগ করতে ত্রুটি",
            "Error Adding Core Value"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddCoreValue;
