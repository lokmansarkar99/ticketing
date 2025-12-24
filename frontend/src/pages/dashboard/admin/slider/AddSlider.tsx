import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateSliderProps,
  addUpdateSliderSchema,
} from "@/schemas/slider/addupdateSliderSchema";
import { addUpdateSliderForm } from "@/utils/constants/form/addUpdateSliderForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { ISliderStateProps } from "./SliderList";
import { useAddSliderMutation } from "@/store/api/slider/sliderApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { Images } from "lucide-react";
import FileInputArray from "@/components/common/form/FileInputArray";

interface IAddSliderProps {
  setSliderState: (
    userState: (prevState: ISliderStateProps) => ISliderStateProps
  ) => void;
}

const AddSlider: FC<IAddSliderProps> = ({ setSliderState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const [offerSliderOne, setOfferSliderOne] = useState<File | null>(null);
  const [sliderPhoto, setSliderPhoto] = useState<string>(""); // You missed this!

  const { setValue, handleSubmit } = useForm<AddUpdateSliderProps>({
    resolver: zodResolver(addUpdateSliderSchema),
  });

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [addSlider, { isLoading: sliderLoading, error: sliderError }] =
    useAddSliderMutation();

    

  const onSubmit = async () => {
    try {
      let sliderUrl = "";

      if (offerSliderOne) {
        try {
          const uploadResponse = await uploadPhoto(offerSliderOne).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            sliderUrl = uploadResponse.data; // set uploaded file URL
          }
        } catch (error) {
          console.error("Error uploading file:", error);
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

      const addSliderResult = await addSlider({ image: sliderUrl }).unwrap();

      if (addSliderResult?.success) {
        toast({
          title: translate(
            "স্লাইডার সফলভাবে যোগ করা হয়েছে",
            "Slider Successfully Added"
          ),
          description: toastMessage("add", translate("স্লাইডার", "Slider")),
        });

        setSliderState((prevState) => ({
          ...prevState,
          addSliderOpen: false,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({
        title: translate("স্লাইডার যোগ করতে ব্যর্থ", "Failed to Add Slider"),
        variant: "destructive",
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("নতুন স্লাইডার যোগ করুন", "Add New Slider")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন স্লাইডার যোগ করার জন্য।",
        "Fill out the details below to add a new slider."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputWrapper
            className="relative"
            labelFor="image"
            label={translate(
              addUpdateSliderForm.image.label.bn,
              addUpdateSliderForm.image.label.en
            )}
          >
            <div className="absolute right-3 bottom-2.5 z-50">
              <Images className="text-gray-400" />
            </div>

            <FileInputArray
              className="w-full"
              id="image"
              label={translate("ছবি নির্বাচন করুন", "Select Image")}
              value={sliderPhoto}
              setFile={setOfferSliderOne}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setSliderPhoto(previewUrl);
                  setValue("image", previewUrl);
                } else {
                  setSliderPhoto("");
                  setValue("image", "");
                }
              }}
              disabled={sliderLoading}
            />
          </InputWrapper>
        </div>

        <Submit
          loading={sliderLoading || uploadPhotoLoading}
          errors={sliderError}
          submitTitle={translate("স্লাইডার যোগ করুন", "Add Slider")}
          errorTitle={translate(
            "স্লাইডার যোগ করতে ত্রুটি",
            "Error Adding Slider"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSlider;
