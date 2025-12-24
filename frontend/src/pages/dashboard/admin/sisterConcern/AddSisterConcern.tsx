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
import {
  AddUpdateSisterConcernProps,
  addUpdateSisterConcernSchema,
} from "@/schemas/sisterConcern/addUpdateSisterConcernSchema";
import { useAddSisterConcernMutation } from "@/store/api/sisterConcern/sisterConcernApi";
import { addUpdateSisterConcernForm } from "@/utils/constants/form/addUpdateSisterConcern";

interface IAddSisterConcernProps {
  setSisterConcernState: (concernState: (prev: any) => any) => void;
}

const AddSisterConcern: FC<IAddSisterConcernProps> = ({
  setSisterConcernState,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const [sisterConcernFile, setSisterConcernFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { setValue, handleSubmit } = useForm<AddUpdateSisterConcernProps>({
    resolver: zodResolver(addUpdateSisterConcernSchema),
  });

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [addSisterConcern, { isLoading: concernLoading, error: concernError }] =
    useAddSisterConcernMutation();

  const onSubmit = async () => {
    try {
      let imageUrl = "";

      if (sisterConcernFile) {
        try {
          const uploadResponse = await uploadPhoto(sisterConcernFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            imageUrl = uploadResponse.data; // uploaded image URL
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

      const addConcernResult = await addSisterConcern({
        image: imageUrl,
      }).unwrap();

      if (addConcernResult?.success) {
        toast({
          title: translate(
            "সিস্টার কনসার্ন সফলভাবে যোগ করা হয়েছে",
            "Sister Concern Successfully Added"
          ),
          description: toastMessage(
            "add",
            translate("সিস্টার কনসার্ন", "Sister Concern")
          ),
        });

        setSisterConcernState((prevState) => ({
          ...prevState,
          addSisterConcernOpen: false,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: translate(
          "সিস্টার কনসার্ন যোগ করতে ব্যর্থ",
          "Failed to Add Sister Concern"
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <FormWrapper
      heading={translate(
        "নতুন সিস্টার কনসার্ন যোগ করুন",
        "Add New Sister Concern"
      )}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন সিস্টার কনসার্ন যোগ করার জন্য।",
        "Fill out the details below to add a new sister concern."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputWrapper
            className="relative"
            labelFor="image"
            label={translate(
              addUpdateSisterConcernForm.image.label.bn,
              addUpdateSisterConcernForm.image.label.en
            )}
          >
            <div className="absolute right-3 bottom-2.5 z-50">
              <Images className="text-gray-400" />
            </div>

            <FileInputArray
              className="w-full"
              id="image"
              label={translate("ছবি নির্বাচন করুন", "Select Image")}
              value={imagePreview}
              setFile={setSisterConcernFile}
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
              disabled={concernLoading}
            />
          </InputWrapper>
        </div>

        <Submit
          loading={concernLoading || uploadPhotoLoading}
          errors={concernError}
          submitTitle={translate(
            "সিস্টার কনসার্ন যোগ করুন",
            "Add Sister Concern"
          )}
          errorTitle={translate(
            "সিস্টার কনসার্ন যোগ করতে ত্রুটি",
            "Error Adding Sister Concern"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSisterConcern;
