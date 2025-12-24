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
import { useAddOfferMutation } from "@/store/api/offer/offerApi";
import {
  AddUpdateOfferProps,
  addUpdateOfferSchema,
} from "@/schemas/offer/addUpdateOfferSchema";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";

interface IAddOfferPromoProps {
  setOfferState: (state: (prev: any) => any) => void;
}

const AddOfferPromo: FC<IAddOfferPromoProps> = ({ setOfferState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { register, setValue, handleSubmit, watch,  formState: { errors }, setError } = useForm<AddUpdateOfferProps>({
    resolver: zodResolver(addUpdateOfferSchema),
  });

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [addOffer, { isLoading: offerLoading, error: offerError }] =
    useAddOfferMutation();

  const onSubmit = async (data: AddUpdateOfferProps) => {
    try {
      let imageUrl = "";

      if (offerFile) {
        try {
          const uploadResponse = await uploadPhoto(offerFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            imageUrl = uploadResponse.data;
          }
        } catch (error) {
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

      const addResult = await addOffer({
        ...data,
        image: imageUrl,
        startDate: new Date(data.startDate + "Z"), 
        endDate: new Date(data.endDate + "Z"),
      }).unwrap();

      if (addResult?.success) {
        toast({
          title: translate(
            "অফার সফলভাবে যোগ করা হয়েছে",
            "Offer Successfully Added"
          ),
          description: toastMessage("add", translate("Offer", "Offer")),
        });

        setOfferState((prev) => ({
          ...prev,
          addOfferOpen: false,
        }));
      }
    } catch (error) {
      toast({
        title: translate("অফার যোগ করতে ব্যর্থ", "Failed to Add Offer"),
        variant: "destructive",
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("নতুন অফার যোগ করুন", "Add New Offer")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন নতুন অফার যোগ করার জন্য।",
        "Fill out the details below to add a new offer."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image */}
        <InputWrapper
          className="relative"
          labelFor="image"
          label={"Select Icon"}
        >
          <div className="absolute right-3 bottom-2.5 z-50">
            <Images className="text-gray-400" />
          </div>
          <FileInputArray
            className="w-full"
            id="image"
            label={translate("ছবি নির্বাচন করুন", "Select Icon")}
            value={imagePreview}
            setFile={setOfferFile}
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
            disabled={offerLoading}
          />
        </InputWrapper>

        <div className="grid grid-cols-2 gap-4">
          {/* Title */}
          <InputWrapper labelFor="title" label={translate("শিরোনাম", "Title")}>
            <input
              type="text"
              {...register("title")}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder={translate("শিরোনাম লিখুন", "Enter Title")}
            />
          </InputWrapper>
          {/* ROUTE */}
          <InputWrapper
            labelFor="route"
            error={errors?.routeId?.message}
            label={translate(
              addUpdateFareForm?.route.label.bn,
              addUpdateFareForm.route.label.en
            )}
          >
            <Select
              value={watch("routeId")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("routeId", Number(value)); // convert back to number
                setError("routeId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="route" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateFareForm.route.placeholder.bn,
                    addUpdateFareForm.route.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!routesLoading &&
                  routesData?.data?.length > 0 &&
                  routesData?.data?.map(
                    (singleRoute: any, routeIndex: number) => (
                      <SelectItem
                        key={routeIndex}
                        value={singleRoute?.id.toString()}
                      >
                        {singleRoute?.routeName}
                      </SelectItem>
                    )
                  )}

                {routesLoading && !routesData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          <InputWrapper labelFor="code" label={translate("কুপন কোড", "Coupon Code")}>
            <input
              type="text"
              {...register("couponCode")}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder={translate("কুপন কোড লিখুন", "Enter Coupon Code")}
            />
          </InputWrapper>
          {/* Description */}
          <InputWrapper
            labelFor="description"
            label={translate("বর্ণনা", "Description")}
          >
            <textarea
              {...register("description")}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={4}
              placeholder={translate("বর্ণনা লিখুন", "Enter Description")}
            />
          </InputWrapper>

          {/* Start Date */}
          <InputWrapper
            labelFor="startDate"
            label={translate("শুরুর তারিখ/সময় ✽", "Start Date/Time ✽")}
          >
            <input
              type="datetime-local"
              step="1"
              id="startDate"
              {...register("startDate")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </InputWrapper>

          {/* End Date */}
          <InputWrapper
            labelFor="endDate"
            label={translate("শেষের তারিখ/সময় ✽", "End Date/Time ✽")}
          >
            <input
              type="datetime-local"
              step="1"
              id="endDate"
              {...register("endDate")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </InputWrapper>
        </div>

        <Submit
          loading={offerLoading || uploadPhotoLoading}
          errors={offerError}
          submitTitle={translate("অফার যোগ করুন", "Add Offer")}
          errorTitle={translate("অফার যোগ করতে ত্রুটি", "Error Adding Offer")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddOfferPromo;
