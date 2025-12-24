import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FileInputArray from "@/components/common/form/FileInputArray"; // reused
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSliderProps,
  addUpdateSliderSchema,
} from "@/schemas/slider/addupdateSliderSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import {
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
} from "@/store/api/slider/sliderApi";
import { addUpdateSliderForm } from "@/utils/constants/form/addUpdateSliderForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Images } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ISliderProps {
  id: number | null;
}

const UpdateSlider: FC<ISliderProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const { setValue, setError, handleSubmit } = useForm<AddUpdateSliderProps>({
    resolver: zodResolver(addUpdateSliderSchema),
  });

  const { data: singleSlider, isLoading: singleSliderLoading } =
    useGetSingleSliderQuery(id);
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [updateSlider, { isLoading: sliderLoading, error: sliderError }] =
    useUpdateSliderMutation();

    //@ts-ignore
  const [sliderPhoto, setSliderPhoto] = useState<string>(""); // holds preview
  const [imageFile, setImageFile] = useState<File | null>(null); // holds raw file

  useEffect(() => {
    if (singleSlider) {
      const image = singleSlider.data?.image || "";
      setSliderPhoto(image);
      setValue("image", image);
    }
  }, [singleSlider, setValue]);

  const onSubmit = async (formData: AddUpdateSliderProps) => {
    try {
      if (imageFile) {
        const uploadResult = await uploadPhoto(imageFile).unwrap();
        if (uploadResult?.success) {
          formData.image = uploadResult.data;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const result = await updateSlider({ id, data: formData }).unwrap();

      if (result?.success) {
        toast({
          title: translate(
            "স্লাইডার সফলভাবে হালনাগাত করা হয়েছে",
            "Slider Successfully Updated"
          ),
          description: toastMessage("update", translate("স্লাইডার", "Slider")),
        });
      }
    } catch (error) {
      setError("image", { message: "Image upload failed" });
    }
  };

  if (singleSliderLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("স্লাইডার হালনাগাত করুন", "Update Slider")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন স্লাইডার হালনাগাত করার জন্য।",
        "Fill out the details below to update the slider."
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
              addUpdateSliderForm.image.label.bn,
              addUpdateSliderForm.image.label.en
            )}
          >
            <FileInputArray
              className="w-full"
              id="image"
              label={translate("ছবি নির্বাচন করুন", "Select Image")}
              value={singleSlider.data?.image}
              setFile={setImageFile}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setValue("image", previewUrl);
                  setSliderPhoto(previewUrl);
                } else {
                  setValue("image", "");
                  setSliderPhoto("");
                }
              }}
              disabled={sliderLoading}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={sliderLoading || uploadPhotoLoading}
          errors={sliderError}
          submitTitle={translate("স্লাইডার হালনাগাত করুন", "Update Slider")}
          errorTitle={translate(
            "স্লাইডার হালনাগাত করতে ত্রুটি",
            "Error Updating Slider"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateSlider;
