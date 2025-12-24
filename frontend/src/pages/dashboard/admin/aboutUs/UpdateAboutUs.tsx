import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AboutUsSchemaProps,
  addUpdateAboutUsSchema,
} from "@/schemas/aboutus/addUpdateAboutUsSchema";
import {
  useGetSingleAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/store/api/aboutUs/aboutUsApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { addUpdateAboutUsForm } from "@/utils/constants/form/addUpdateAboutUsForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IAboutUsProps {
  id: number | null;
}

const UpdateAboutUs: FC<IAboutUsProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    setValue,
    setError,
    handleSubmit,
  } = useForm<AboutUsSchemaProps>({
    resolver: zodResolver(addUpdateAboutUsSchema),
  });

  const { data: singleAbout, isLoading: singleAboutLoading } =
    useGetSingleAboutUsQuery(id);
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [updateAbout, { isLoading: aboutLoading, error: aboutError }] =
    useUpdateAboutUsMutation();

  const [sliderPhoto, setSliderPhoto] = useState<string | undefined>("");

  useEffect(() => {
    if (singleAbout) {
      const image = singleAbout.data?.image || "";
      setSliderPhoto(image);
      setValue("image", image);
    }
  }, [setValue, singleAbout]);

  const onSubmit = async (formData: AboutUsSchemaProps) => {
    const imageData = formData.image ? formData.image.slice(0, 4) : null;
    if (imageData && imageData === "data") {
      const uploadResult = await uploadPhoto(formData.image).unwrap();

      // Check if the upload was successful
      if (uploadResult?.success) {
        formData.image = uploadResult.data;
      }
    }
    const addAboutResult = await updateAbout({
      id,
      data: formData,
    }).unwrap();

    if (addAboutResult?.success) {
      // Show success toast
      toast({
        title: translate(
          "আমাদের সম্পর্কে সফলভাবে হালনাগাত করা হয়েছে",
          "About Successfully Updated"
        ),
        description: toastMessage(
          "update",
          translate("আমাদের সম্পর্কে", "About")
        ),
      });
    }
  };

  if (singleAboutLoading) {
    return <TableSkeleton columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("আমাদের সম্পর্কে হালনাগাত করুন", "Update About")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন আমাদের সম্পর্কে হালনাগাত করার জন্য।",
        "Fill out the details below to update About."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="flex flex-col  gap-5">
          {/* <div>
            <InputWrapper
              label={translate(
                addUpdateAboutUsForm.description.label.bn,
                addUpdateAboutUsForm.description.label.en
              )}
              labelFor="new_message"
              error={errors?.description?.message}
            >
              <Textarea
                className="mt-2"
                {...register("description")}
                id="new_message"
                placeholder={translate(
                  addUpdateAboutUsForm.description.placeholder.bn,
                  addUpdateAboutUsForm.description.placeholder.en
                )}
              />
            </InputWrapper>
          </div> */}
          <div className="relative">
            <InputWrapper
              labelFor="image"
              label={translate(
                addUpdateAboutUsForm.image.label.bn,
                addUpdateAboutUsForm.image.label.en
              )}
            >
              <PhotoCropper
                ratio={3 / 4}
                id="avatar"
                setPhoto={(value: string | undefined) => {
                  const photoValue = value || "";
                  setSliderPhoto(photoValue);
                  setValue("image", photoValue);
                  setError("image", { type: "", message: "" });
                }}
                photo={sliderPhoto}
                placeholder={translate(
                  addUpdateAboutUsForm.image.placeholder.bn,
                  addUpdateAboutUsForm.image.placeholder.en
                )}
              />
            </InputWrapper>
          </div>
        </div>
        <Submit
          loading={aboutLoading || uploadPhotoLoading}
          errors={aboutError}
          submitTitle={translate(
            "আমাদের সম্পর্কে হালনাগাত করুন",
            "Update About"
          )}
          errorTitle={translate(
            "আমাদের সম্পর্কে হালনাগাত করতে ত্রুটি",
            "Error Updating About"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateAboutUs;
