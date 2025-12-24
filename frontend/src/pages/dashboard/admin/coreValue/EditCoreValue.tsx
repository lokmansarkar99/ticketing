import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FileInputArray from "@/components/common/form/FileInputArray";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetSingleCoreValueQuery, useUpdateCoreValueMutation } from "@/store/api/corevalue/coreValueApi";
import { addUpdateCoreValueForm } from "@/utils/constants/form/addUpdateCoreValueForm";
import { AddUpdateCoreValueProps, addUpdateCoreValueSchema } from "@/schemas/coreValue/addUpdateCoreValueSchema";

interface ICoreValueProps {
  id: number | null;
}

const UpdateCoreValue: FC<ICoreValueProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { register, setValue, setError, handleSubmit } =
    useForm<AddUpdateCoreValueProps>({
      resolver: zodResolver(addUpdateCoreValueSchema),
    });

  const { data: singleCoreValue, isLoading: coreValueLoading } =
    useGetSingleCoreValueQuery(id);

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [updateCoreValue, { isLoading: updateLoading, error: updateError }] =
    useUpdateCoreValueMutation();

  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (singleCoreValue) {
      const image = singleCoreValue.data?.image || "";
      const title = singleCoreValue.data?.title || "";
      const description = singleCoreValue.data?.description || "";

      setImagePreview(image);
      setValue("image", image);
      setValue("title", title);
      setValue("description", description);
    }
  }, [singleCoreValue, setValue]);

  const onSubmit = async (formData: AddUpdateCoreValueProps) => {
    try {
      if (imageFile) {
        const uploadResult = await uploadPhoto(imageFile).unwrap();
        if (uploadResult?.success) {
          formData.image = uploadResult.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const result = await updateCoreValue({ id, data: formData }).unwrap();

      if (result?.success) {
        toast({
          title: translate(
            "কোর ভ্যালু সফলভাবে হালনাগাত করা হয়েছে",
            "Core Value Successfully Updated"
          ),
          description: toastMessage(
            "update",
            translate("কোর ভ্যালু", "Core Value")
          ),
        });
      }
    } catch (error) {
      setError("image", { message: "Image upload failed" });
    }
  };

  if (coreValueLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("কোর ভ্যালু হালনাগাত করুন", "Update Core Value")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন কোর ভ্যালু হালনাগাত করার জন্য।",
        "Fill out the details below to update the core value."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
        <div className="relative">
          <div className="absolute right-3 bottom-2.5 z-50">
            <Images className="text-gray-400" />
          </div>
          <InputWrapper
            labelFor="image"
            label={"Select a Icon"}
          >
            <FileInputArray
              className="w-full"
              id="image"
              label={translate("ছবি নির্বাচন করুন", "Select Icon")}
              value={imagePreview}
              setFile={setImageFile}
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
              disabled={updateLoading}
            />
          </InputWrapper>
        </div>

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
          loading={updateLoading || uploadPhotoLoading}
          errors={updateError}
          submitTitle={translate("কোর ভ্যালু হালনাগাত করুন", "Update Core Value")}
          errorTitle={translate(
            "কোর ভ্যালু হালনাগাত করতে ত্রুটি",
            "Error Updating Core Value"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCoreValue;
