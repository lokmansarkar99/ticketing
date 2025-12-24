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
import {
  useGetSingleOfferQuery,
  useUpdateOfferMutation,
} from "@/store/api/offer/offerApi";
import {
  addUpdateOfferSchema,
  AddUpdateOfferProps,
} from "@/schemas/offer/addUpdateOfferSchema";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";

interface IEditOfferPromoProps {
  id: number | null;
}

const EditOfferPromo: FC<IEditOfferPromoProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AddUpdateOfferProps>({
    resolver: zodResolver(addUpdateOfferSchema),
  });
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: singleOffer, isLoading: offerLoading } =
    useGetSingleOfferQuery(id);
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const [updateOffer, { isLoading: updateLoading, error: updateError }] =
    useUpdateOfferMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [startDateInputValue, setStartDateInputValue] = useState("");
  const [endDateInputValue, setEndDateInputValue] = useState("");

  useEffect(() => {
    if (singleOffer?.data) {
      const {
        image,
        title,
        description,
        startDate,
        endDate,
        couponCode,
        routeId,
      } = singleOffer?.data;

      setValue("image", image || "");
      setValue("title", title || "");
      setValue("description", description || "");
      setValue("couponCode", couponCode || "");
      setValue("routeId", routeId);

      // Convert to local datetime-local format (no timezone)
      const formattedStart = startDate
        ? new Date(startDate).toISOString().slice(0, 19)
        : "";
      const formattedEnd = endDate
        ? new Date(endDate).toISOString().slice(0, 19)
        : "";

      setStartDateInputValue(formattedStart);
      setEndDateInputValue(formattedEnd);
      setValue("startDate", formattedStart);
      setValue("endDate", formattedEnd);
    }
  }, [singleOffer, setValue]);

  const handleDateTimeChange = (field: "start" | "end", value: string) => {
    if (field === "start") {
      setStartDateInputValue(value);
      setValue("startDate", value);
    } else {
      setEndDateInputValue(value);
      setValue("endDate", value);
    }
  };

  const onSubmit = async (formData: AddUpdateOfferProps) => {
    try {
      if (imageFile) {
        const uploadResult = await uploadPhoto(imageFile).unwrap();
        if (uploadResult?.success) {
          formData.image = uploadResult.data;
        } else {
          throw new Error("Image upload failed");
        }
      }
      formData.startDate = new Date(formData.startDate).toISOString();
      formData.endDate = new Date(formData.endDate).toISOString();
      const result = await updateOffer({ id, data: formData }).unwrap();

      if (result?.success) {
        toast({
          title: translate(
            "Offer Promo Successfully Updated",
            "Offer Promo Successfully Updated"
          ),
          description: toastMessage(
            "update",
            translate("Offer Promo", "Offer Promo")
          ),
        });
      }
    } catch (error) {
      setError("image", { message: "Image upload failed" });
    }
  };

  if (offerLoading) {
    return <TableSkeleton columns={5} />;
  }

  return (
    <FormWrapper
      heading={translate("অফার প্রমো হালনাগাত করুন", "Update Offer Promo")}
      subHeading={translate(
        "নিচের বিবরণ পূরণ করুন অফার প্রমো হালনাগাত করার জন্য।",
        "Fill out the details below to update the offer promo."
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
            label={translate("ছবি নির্বাচন করুন", "Select Image")}
          >
            <FileInputArray
              className="w-full"
              id="image"
              value={singleOffer?.data?.image || ""}
              setFile={setImageFile}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setValue("image", previewUrl);
                } else {
                  setValue("image", "");
                }
              }}
              disabled={updateLoading}
              label={""}
            />
          </InputWrapper>
        </div>

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
          <InputWrapper
            labelFor="code"
            label={translate("কুপন কোড", "Coupon Code")}
          >
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
          <div>
            <label htmlFor="startDate">Start Date/Time ✽</label>
            <input
              type="datetime-local"
              step="1"
              id="startDate"
              value={startDateInputValue}
              onChange={(e) => handleDateTimeChange("start", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate">End Date/Time ✽</label>
            <input
              type="datetime-local"
              step="1"
              id="endDate"
              value={endDateInputValue}
              onChange={(e) => handleDateTimeChange("end", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <Submit
          loading={updateLoading || uploadPhotoLoading}
          errors={updateError}
          submitTitle={translate(
            "অফার প্রমো হালনাগাত করুন",
            "Update Offer Promo"
          )}
          errorTitle={translate(
            "অফার প্রমো হালনাগাত করতে ত্রুটি",
            "Error Updating Offer Promo"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default EditOfferPromo;
