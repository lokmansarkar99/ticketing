import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FileInputArray from "@/components/common/form/FileInputArray";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import {
  useGetSingleSisterConcernQuery,
  useUpdateSisterConcernMutation,
} from "@/store/api/sisterConcern/sisterConcernApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AddUpdateSisterConcernProps, addUpdateSisterConcernSchema } from "@/schemas/sisterConcern/addUpdateSisterConcernSchema";
import { addUpdateSisterConcernForm } from "@/utils/constants/form/addUpdateSisterConcern";

interface ISisterConcernProps {
  id: number | null;
}

const UpdateSisterConcern: FC<ISisterConcernProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { setValue, setError, handleSubmit } =
    useForm<AddUpdateSisterConcernProps>({
      resolver: zodResolver(addUpdateSisterConcernSchema),
    });

  const { data: singleSisterConcern, isLoading: singleConcernLoading } =
    useGetSingleSisterConcernQuery(id);

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [updateSisterConcern, { isLoading: concernLoading, error: concernError }] =
    useUpdateSisterConcernMutation();

  //@ts-ignore
  const [concernPhoto, setConcernPhoto] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (singleSisterConcern) {
      const image = singleSisterConcern.data?.image || "";
      setConcernPhoto(image);
      setValue("image", image);
    }
  }, [singleSisterConcern, setValue]);

  const onSubmit = async (formData: AddUpdateSisterConcernProps) => {
    try {
      if (imageFile) {
        const uploadResult = await uploadPhoto(imageFile).unwrap();
        if (uploadResult?.success) {
          formData.image = uploadResult.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const result = await updateSisterConcern({ id, data: formData }).unwrap();

      if (result?.success) {
        toast({
          title: translate(
            "সিস্টার কনসার্ন সফলভাবে হালনাগাত করা হয়েছে",
            "Sister Concern Successfully Updated"
          ),
          description: toastMessage(
            "update",
            translate("সিস্টার কনসার্ন", "Sister Concern")
          ),
        });
      }
    } catch (error) {
      setError("image", { message: "Image upload failed" });
    }
  };

  if (singleConcernLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("সিস্টার কনসার্ন হালনাগাত করুন", "Update Sister Concern")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন সিস্টার কনসার্ন হালনাগাত করার জন্য।",
        "Fill out the details below to update the sister concern."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <div className="absolute right-3 bottom-2.5 z-50">
            <Images className="text-gray-400" />
          </div>
          <InputWrapper
            labelFor="image"
            label={translate(
              addUpdateSisterConcernForm.image.label.bn,
              addUpdateSisterConcernForm.image.label.en
            )}
          >
            <FileInputArray
              className="w-full"
              id="image"
              label={translate("ছবি নির্বাচন করুন", "Select Image")}
              value={singleSisterConcern.data?.image}
              setFile={setImageFile}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setValue("image", previewUrl);
                  setConcernPhoto(previewUrl);
                } else {
                  setValue("image", "");
                  setConcernPhoto("");
                }
              }}
              disabled={concernLoading}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={concernLoading || uploadPhotoLoading}
          errors={concernError}
          submitTitle={translate(
            "সিস্টার কনসার্ন হালনাগাত করুন",
            "Update Sister Concern"
          )}
          errorTitle={translate(
            "সিস্টার কনসার্ন হালনাগাত করতে ত্রুটি",
            "Error Updating Sister Concern"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSisterConcern;
