import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import { Label } from "@/components/common/typography/Label";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateVehicleDataProps,
  addUpdateVehicleSchema,
} from "@/schemas/vehiclesSchedule/addUpdateVehicleSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import {
  useGetSingleVehicleQuery,
  useUpdateVehicleMutation,
} from "@/store/api/vehiclesSchedule/vehicleApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateVehicleProps {
  id: number;
}

const UpdateVehicle: FC<IUpdateVehicleProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [
    updateVehicle,
    { isLoading: updateVehicleLoading, error: updateVehicleError },
  ] = useUpdateVehicleMutation();
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();
  const { data: vehicleData, isLoading: vehicleLoading } =
    useGetSingleVehicleQuery(id);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<AddUpdateVehicleDataProps>({
    resolver: zodResolver(addUpdateVehicleSchema),
  });

  const [selectedDates, setSelectedDates] = useState<{
    deliveryDate: Date | null;
    orderDate: Date | null;
    registrationExpiryDate: Date | null;
    fitnessExpiryDate: Date | null;
    routePermitExpiryDate: Date | null;
    taxTokenExpiryDate: Date | null;
  }>({
    deliveryDate: null,
    orderDate: null,
    registrationExpiryDate: null,
    fitnessExpiryDate: null,
    routePermitExpiryDate: null,
    taxTokenExpiryDate: null,
  });

  const [calendarOpen, setCalendarOpen] = useState<{
    deliveryDate: boolean;
    orderDate: boolean;
    registrationExpiryDate: boolean;
    fitnessExpiryDate: boolean;
    routePermitExpiryDate: boolean;
    taxTokenExpiryDate: boolean;
  }>({
    deliveryDate: false,
    orderDate: false,
    registrationExpiryDate: false,
    fitnessExpiryDate: false,
    routePermitExpiryDate: false,
    taxTokenExpiryDate: false,
  });

  useEffect(() => {
    if (vehicleData?.data) {
      const {
        registrationNo,
        manufacturerCompany,
        model,
        chasisNo,
        engineNo,
        countryOfOrigin,
        lcCode,
        color,
        deliveryToDipo,
        deliveryDate,
        orderDate,
        registrationFile,
        fitnessCertificate,
        taxToken,
        routePermit,
        registrationExpiryDate,
        fitnessExpiryDate,
        routePermitExpiryDate,
        taxTokenExpiryDate,
        coachType,
        seatPlan,
        isActive,
      } = vehicleData.data;

      setValue("registrationNo", registrationNo);
      setValue("manufacturerCompany", manufacturerCompany);
      setValue("model", model);
      setValue("chasisNo", chasisNo);
      setValue("seatPlan", seatPlan);
      setValue("coachType", coachType);
      setValue("engineNo", engineNo);
      setValue("countryOfOrigin", countryOfOrigin);
      setValue("lcCode", lcCode);
      setValue("color", color);
      setValue("deliveryToDipo", deliveryToDipo);
      setValue("registrationFile", registrationFile);
      setValue("fitnessCertificate", fitnessCertificate);
      setValue("taxToken", taxToken);
      setValue("routePermit", routePermit);
      setValue("isActive", isActive ?? true);
      setSelectedDates({
        deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
        orderDate: orderDate ? new Date(orderDate) : null,
        registrationExpiryDate: registrationExpiryDate
          ? new Date(registrationExpiryDate)
          : null,
        fitnessExpiryDate: fitnessExpiryDate
          ? new Date(fitnessExpiryDate)
          : null,
        routePermitExpiryDate: routePermitExpiryDate
          ? new Date(routePermitExpiryDate)
          : null,
        taxTokenExpiryDate: taxTokenExpiryDate
          ? new Date(taxTokenExpiryDate)
          : null,
      });
    }
  }, [vehicleData, setValue]);

  const handleDateChange = (
    field: keyof typeof selectedDates,
    date: Date | null
  ) => {
    setSelectedDates((prev) => ({ ...prev, [field]: date }));
    setValue(field, date ? format(date, "yyyy-MM-dd") : undefined);
    setCalendarOpen((prev) => ({ ...prev, [field]: false }));
  };

  const onSubmit = async (data: AddUpdateVehicleDataProps) => {
    try {
      // Step 1: Upload Photos and Store URLs
      const photoUploads = [
        { field: "registrationFile", value: data.registrationFile },
        { field: "fitnessCertificate", value: data.fitnessCertificate },
        { field: "taxToken", value: data.taxToken },
        { field: "routePermit", value: data.routePermit },
      ];

      const uploadedFiles: Record<string, string> = {};

      for (const photo of photoUploads) {
        if (
          photo.value &&
          typeof photo.value === "string" &&
          photo.value.startsWith("data:")
        ) {
          // Upload new photos
          const result = await uploadPhoto(photo.value).unwrap();
          uploadedFiles[photo.field] = result.data;
        } else {
          // Retain existing URLs
          uploadedFiles[photo.field] = photo.value || "";
        }
      }

      // Step 2: Combine Uploaded File URLs with Other Data
      const cleanedData = {
        ...data,
        ...uploadedFiles, // Include photo URLs
      };

      // Step 3: Submit Data to Backend
      const result = await updateVehicle({ id, data: cleanedData });

      if (result?.data?.success) {
        toast({
          title: translate(
            "যানবাহন সফলভাবে আপডেট হয়েছে",
            "Vehicle updated successfully"
          ),
          description: toastMessage("update", translate("যানবাহন", "vehicle")),
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "ছবি আপলোড করতে বা তথ্য জমা দিতে ব্যর্থ হয়েছে।",
          "Failed to upload photos or submit data."
        ),
      });
    }
  };

  if (vehicleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormWrapper
      heading={translate("যানবাহন আপডেট করুন", "Update Coachs")}
      subHeading={translate(
        "যানবাহনের বিবরণ আপডেট করুন",
        "Update the details of the vehicle."
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-3 gap-4"
      >
        {/* Registration Number */}
        <InputWrapper
          className="col-span-2"
          error={errors?.registrationNo?.message}
          labelFor="registrationNo"
          label={translate("রেজিস্ট্রেশন নম্বর", "Registration Number")}
        >
          <Input
            id="registrationNo"
            type="text"
            {...register("registrationNo")}
            placeholder={translate(
              "রেজিস্ট্রেশন নম্বর লিখুন",
              "Enter registration number"
            )}
          />
        </InputWrapper>

        <InputWrapper
          error={errors?.seatPlan?.message}
          labelFor="seatPlan"
          label={translate("রেজিস্ট্রেশন নম্বর ✼", "Seat Plan ✼")}
        >
          <Input
            id="seatPlan"
            type="text"
            {...register("seatPlan")}
            placeholder={translate(
              "রেজিস্ট্রেশন নম্বর লিখুন",
              "Enter seat plan"
            )}
          />
        </InputWrapper>

        {/* SEAT PLANS */}
        <InputWrapper
          labelFor="coachType"
          error={errors?.coachType?.message}
          label={"Coach Type"}
        >
          <Select
            value={watch("coachType") || ""}
            onValueChange={(value: string) => {
              setValue("coachType", value);
              setError("coachType", { type: "custom", message: "" });
            }}
          >
            <SelectTrigger id="coachType" className="w-full">
              <SelectValue placeholder={"Enter coach type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Double Deck">Double Deck</SelectItem>
              <SelectItem value="Single Deck">Single Deck</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>

        {/* ACTIVE */}
        <InputWrapper
          labelFor="active"
          error={errors?.isActive?.message}
          label={translate("", "Active")}
        >
          <RadioGroup
            className="flex flex-row items-center gap-4"
            value={watch("isActive")?.toString() || "true"}
            onValueChange={(value) => setValue("isActive", value === "true")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="active_false" />
              <Label htmlFor="active_false">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="active_true" />
              <Label htmlFor="active_true">Yes</Label>
            </div>
          </RadioGroup>
        </InputWrapper>
        {/* registrationExpiryDate Date */}
        <InputWrapper
          label={translate(
            "নিবন্ধনের মেয়াদ তারিখ*",
            "Registration expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.registrationExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({
                ...prev,
                registrationExpiryDate: open,
              }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.registrationExpiryDate
                  ? format(selectedDates.registrationExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.registrationExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("registrationExpiryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Registration File */}
        <InputWrapper
          error={errors?.registrationFile?.message}
          labelFor="registrationFile"
          label={translate("রেজিস্ট্রেশন ফাইল", "Registration File")}
        >
          <PhotoCropper
            ratio={3 / 4}
            id="registrationFile"
            photo={watch("registrationFile") || undefined}
            setPhoto={(value: string | undefined) =>
              setValue("registrationFile", value || "")
            }
          />
        </InputWrapper>
        {/* fitnessExpiryDate Date */}
        <InputWrapper
          label={translate("ফিটনেস মেয়াদ তারিখ*", "Fitness expiry date*")}
        >
          <Popover
            open={calendarOpen.fitnessExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({
                ...prev,
                fitnessExpiryDate: open,
              }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.fitnessExpiryDate
                  ? format(selectedDates.fitnessExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.fitnessExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("fitnessExpiryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Fitness Certificate */}
        <InputWrapper
          error={errors?.fitnessCertificate?.message}
          labelFor="fitnessCertificate"
          label={translate("ফিটনেস সার্টিফিকেট", "Fitness Certificate")}
        >
          <PhotoCropper
            ratio={3 / 4}
            id="fitnessCertificate"
            photo={watch("fitnessCertificate") || undefined}
            setPhoto={(value: string | undefined) =>
              setValue("fitnessCertificate", value || "")
            }
          />
        </InputWrapper>
        {/* taxtoken Date */}
        <InputWrapper
          label={translate(
            "ট্যাক্স টোকেন মেয়াদ তারিখ*",
            "Tax Token expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.taxTokenExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({
                ...prev,
                taxTokenExpiryDate: open,
              }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.taxTokenExpiryDate
                  ? format(selectedDates.taxTokenExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.taxTokenExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("taxTokenExpiryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Tax Token */}
        <InputWrapper
          error={errors?.taxToken?.message}
          labelFor="taxToken"
          label={translate("ট্যাক্স টোকেন", "Tax Token")}
        >
          <PhotoCropper
            ratio={3 / 4}
            id="taxToken"
            photo={watch("taxToken") || undefined}
            setPhoto={(value: string | undefined) =>
              setValue("taxToken", value || "")
            }
          />
        </InputWrapper>
        {/* fitnessExpiryDate Date */}
        <InputWrapper
          label={translate(
            "রুট পারমিট মেয়াদ তারিখ*",
            "Route Permit expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.routePermitExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({
                ...prev,
                routePermitExpiryDate: open,
              }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.routePermitExpiryDate
                  ? format(selectedDates.routePermitExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.routePermitExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("routePermitExpiryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Route Permit */}
        <InputWrapper
          error={errors?.routePermit?.message}
          labelFor="routePermit"
          label={translate("রুট পারমিট", "Route Permit")}
        >
          <PhotoCropper
            ratio={3 / 4}
            id="routePermit"
            photo={watch("routePermit") || undefined}
            setPhoto={(value: string | undefined) =>
              setValue("routePermit", value || "")
            }
          />
        </InputWrapper>

        {/* Manufacturer Company */}
        <InputWrapper
          error={errors?.manufacturerCompany?.message}
          labelFor="manufacturerCompany"
          label={translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company")}
        >
          <Input
            id="manufacturerCompany"
            type="text"
            {...register("manufacturerCompany")}
            placeholder={translate(
              "প্রস্তুতকারক কোম্পানি লিখুন",
              "Enter manufacturer company"
            )}
          />
        </InputWrapper>

        {/* Model */}
        <InputWrapper
          error={errors.model?.message}
          labelFor="model"
          label={translate("মডেল", "Model")}
        >
          <Input
            id="model"
            type="text"
            {...register("model")}
            placeholder={translate("মডেল লিখুন", "Enter model")}
          />
        </InputWrapper>

        {/* Chassis Number */}
        <InputWrapper
          error={errors.chasisNo?.message}
          labelFor="chasisNo"
          label={translate("চেসিস নম্বর", "Chassis Number")}
        >
          <Input
            id="chasisNo"
            type="text"
            {...register("chasisNo")}
            placeholder={translate("চেসিস নম্বর লিখুন", "Enter chassis number")}
          />
        </InputWrapper>

        {/* Engine Number */}
        <InputWrapper
          error={errors.engineNo?.message}
          labelFor="engineNo"
          label={translate("ইঞ্জিন নম্বর", "Engine Number")}
        >
          <Input
            id="engineNo"
            type="text"
            {...register("engineNo")}
            placeholder={translate("ইঞ্জিন নম্বর লিখুন", "Enter engine number")}
          />
        </InputWrapper>

        {/* Country of Origin */}
        <InputWrapper
          error={errors.countryOfOrigin?.message}
          labelFor="countryOfOrigin"
          label={translate("উৎপত্তির দেশ", "Country of Origin")}
        >
          <Input
            id="countryOfOrigin"
            type="text"
            {...register("countryOfOrigin")}
            placeholder={translate(
              "উৎপত্তির দেশ লিখুন",
              "Enter country of origin"
            )}
          />
        </InputWrapper>

        {/* LC Code */}
        <InputWrapper
          error={errors.lcCode?.message}
          labelFor="lcCode"
          label={translate("এলসি কোড", "LC Code")}
        >
          <Input
            id="lcCode"
            type="text"
            {...register("lcCode")}
            placeholder={translate("এলসি কোড লিখুন", "Enter LC code")}
          />
        </InputWrapper>

        {/* Color */}
        <InputWrapper
          error={errors.color?.message}
          labelFor="color"
          label={translate("রং", "Color")}
        >
          <Input
            id="color"
            type="text"
            {...register("color")}
            placeholder={translate("রং লিখুন", "Enter color")}
          />
        </InputWrapper>

        {/* Delivery to Depot */}
        <InputWrapper
          error={errors.deliveryToDipo?.message}
          labelFor="deliveryToDipo"
          label={translate("ডিপোতে ডেলিভারি", "Delivery to Depot")}
        >
          <Input
            id="deliveryToDipo"
            type="text"
            {...register("deliveryToDipo")}
            placeholder={translate(
              "ডিপোতে ডেলিভারি লিখুন",
              "Enter delivery to depot"
            )}
          />
        </InputWrapper>

        {/* Delivery Date */}
        {/* Delivery Date */}
        <InputWrapper label={translate("ডেলিভারি তারিখ", "Delivery Date")}>
          <Popover
            open={calendarOpen.deliveryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, deliveryDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.deliveryDate
                  ? format(selectedDates.deliveryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.deliveryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("deliveryDate", date ?? null)
                } // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        {/* Order Date */}
        <InputWrapper label={translate("অর্ডার তারিখ", "Order Date")}>
          <Popover
            open={calendarOpen.orderDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, orderDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.orderDate
                  ? format(selectedDates.orderDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={selectedDates.orderDate || new Date()}
                onSelect={(date) => handleDateChange("orderDate", date ?? null)} // Fallback to null if date is undefined
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        <Submit
          loading={updateVehicleLoading || uploadPhotoLoading}
          errors={updateVehicleError}
          submitTitle={translate("আপডেট যানবাহন", "Update Coachs")}
          errorTitle={translate(
            "যানবাহন আপডেট করতে ত্রুটি",
            "Error updating vehicle"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateVehicle;
