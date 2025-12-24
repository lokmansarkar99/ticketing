import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { Images } from "lucide-react";
import { IAboutStateProps } from "./AboutUsList";
import { useAddAboutUsMutation } from "@/store/api/aboutUs/aboutUsApi";
import {
  AboutUsSchemaProps,
  addUpdateAboutUsSchema,
} from "@/schemas/aboutus/addUpdateAboutUsSchema";
import { addUpdateAboutUsForm } from "@/utils/constants/form/addUpdateAboutUsForm";

interface IAddAboutUsProps {
  setAboutState: (
    aboutState: (prevState: IAboutStateProps) => IAboutStateProps
  ) => void;
}

const AddAboutUs: FC<IAddAboutUsProps> = ({ setAboutState }) => {
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

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [addAboutUs, { isLoading: sliderLoading, error: sliderError }] =
    useAddAboutUsMutation();

  const onSubmit = async (formData: AboutUsSchemaProps) => {
    if (formData.image) {
      const uploadResult = await uploadPhoto(formData.image).unwrap();

      // Check if the upload was successful
      if (uploadResult?.success) {
        formData.image = uploadResult.data;
      }
    }

    const addAboutResult = await addAboutUs(formData).unwrap();

    if (addAboutResult?.success) {
      // Show success toast
      toast({
        title: translate(
          " সফলভাবে যোগ করা হয়েছে",
          "About Us Successfully Added"
        ),
        description: toastMessage("add", translate("স্লাইডার", "About Us")),
      });

      // Close the slider form
      setAboutState((prevState) => ({
        ...prevState,
        addAboutOpen: false,
      }));
    }
  };

  const [sliderPhoto, setSliderPhoto] = useState<string | undefined>("");

  return (
    <FormWrapper
      heading={translate("নতুন স্লাইডার যোগ করুন", "Add New About Us")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন স্লাইডার যোগ করার জন্য।",
        "Fill out the details below to add a new about us."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div>
          <InputWrapper
            className="relative"
            labelFor="image"
            label={translate(
              addUpdateAboutUsForm.image.label.bn,
              addUpdateAboutUsForm.image.label.en
            )}
          >
            <div className="absolute right-3 bottom-2.5 z-50">
              <Images className="text-gray-400" />
            </div>
            <PhotoCropper
              ratio={undefined}
              id="image"
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
        <Submit
          loading={sliderLoading || uploadPhotoLoading}
          errors={sliderError}
          submitTitle={translate("আমাদের সম্পর্কে যোগ করুন", "Add AboutUs")}
          errorTitle={translate(
            "আমাদের সম্পর্কে যোগ করতে ত্রুটি",
            "Error Adding About us"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddAboutUs;
