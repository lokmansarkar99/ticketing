import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateVehicleDataProps,
  addUpdateVehicleSchema,
} from "@/schemas/vehiclesSchedule/addUpdateVehicleSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useAddVehicleMutation } from "@/store/api/vehiclesSchedule/vehicleApi";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IVehicleStateProps } from "./VehiclesList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IAddVehicleProps {
  setVehicleState: (
    vehicleState: (prevState: IVehicleStateProps) => IVehicleStateProps
  ) => void;
}

const AddVehicles: FC<IAddVehicleProps> = ({ setVehicleState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [addVehicle, { isLoading: addVehicleLoading, error: addVehicleError }] =
    useAddVehicleMutation();
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<AddUpdateVehicleDataProps>({
    resolver: zodResolver(addUpdateVehicleSchema),
    defaultValues:{
      isActive:true
    }
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
        if (photo.value) {
          const result = await uploadPhoto(photo.value).unwrap();
          uploadedFiles[photo.field] = result.data; // Store the URL returned by the API
        }
      }

      // Step 2: Combine Uploaded File URLs with Other Data
      const cleanedData = {
        ...removeFalsyProperties(data, [
          "orderDate",
          "deliveryDate",
          "deliveryToDipo",
          "color",
          "lcCode",
          "countryOfOrigin",
          "engineNo",
          "manufacturerCompany",
          "chasisNo",
          "model",
        ]),
        ...uploadedFiles, // Add uploaded file URLs
      };

      // Step 3: Submit Data to Backend
      const result = await addVehicle(cleanedData);

      if (result?.data?.success) {
        toast({
          title: translate(
            "যানবাহন যোগ করার বার্তা",
            "Message for adding vehicle"
          ),
          description: toastMessage("add", translate("যানবাহন", "vehicle")),
        });
        setVehicleState((prevState: IVehicleStateProps) => ({
          ...prevState,
          addVehicleOpen: false, // Close the modal after success
        }));
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "ছবি আপলোড করতে বা তথ্য জমা দিতে ব্যর্থ হয়েছে।",
          "Failed to upload photos or submit data."
        ),
      });
    }
  };

  return (
    <FormWrapper
      heading={translate("যানবাহন যোগ করুন", "Add Coachs")}
      subHeading={translate(
        "সিস্টেমে নতুন যানবাহন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new coachs to the system."
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center justify-items-center"
      >
        {/* Registration Number */}
        <InputWrapper
          className="sm:col-span-2"
          error={errors?.registrationNo?.message}
          labelFor="registrationNo"
          label={translate("রেজিস্ট্রেশন নম্বর ✼", "Registration Number ✼")}
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
        {/* rgistraiton date */}

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
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.registrationExpiryDate
                  ? format(selectedDates.registrationExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.registrationExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("registrationExpiryDate", date || new Date())
                }
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* photo registrationFile uplaod */}
        <InputWrapper
          error={errors?.registrationFile?.message}
          labelFor="registrationFile"
          label={translate("রেজিস্ট্রেশন ফাইল ✼", "Registration File ✼")}
        >
          <PhotoCropper
            id="registrationFile"
            photo={watch("registrationFile") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("registrationFile", value || "");
            }}
          />
        </InputWrapper>
        {/* Fitness expire date */}
        <InputWrapper
          label={translate("ফিটনেস মেয়াদ তারিখ*", "Fitness expiry date*")}
        >
          <Popover
            open={calendarOpen.fitnessExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, fitnessExpiryDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.fitnessExpiryDate
                  ? format(selectedDates.fitnessExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.fitnessExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("fitnessExpiryDate", date || new Date())
                }
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Fitness Certificate */}
        <InputWrapper
          error={errors?.fitnessCertificate?.message}
          labelFor="fitnessCertificate"
          label={translate("ফিটনেস সার্টিফিকেট ✼", "Fitness Certificate ✼")}
        >
          <PhotoCropper
            photo={watch("fitnessCertificate") || undefined}
            id="fitnessCertificate"
            setPhoto={(value: string | undefined) => {
              setValue("fitnessCertificate", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>
        {/* tax token expire date */}

        <InputWrapper
          label={translate(
            "ট্যাক্স টোকেন মেয়াদ তারিখ*",
            "Tax Token expiry date*"
          )}
        >
          <Popover
            open={calendarOpen.taxTokenExpiryDate}
            onOpenChange={(open) =>
              setCalendarOpen((prev) => ({ ...prev, taxTokenExpiryDate: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.taxTokenExpiryDate
                  ? format(selectedDates.taxTokenExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.taxTokenExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("taxTokenExpiryDate", date || new Date())
                }
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Tax Token */}
        <InputWrapper
          error={errors?.taxToken?.message}
          labelFor="taxToken"
          label={translate("ট্যাক্স টোকেন ✼", "Tax Token ✼")}
        >
          <PhotoCropper
            id="taxToken"
            photo={watch("taxToken") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("taxToken", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>
        {/* ROute permit expire date */}
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
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.routePermitExpiryDate
                  ? format(selectedDates.routePermitExpiryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.routePermitExpiryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("routePermitExpiryDate", date || new Date())
                }
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>
        {/* Route Permit */}
        <InputWrapper
          error={errors?.routePermit?.message}
          labelFor="routePermit"
          label={translate("রুট পারমিট ✼", "Route Permit ✼")}
        >
          <PhotoCropper
            id="routePermit"
            photo={watch("routePermit") || undefined}
            setPhoto={(value: string | undefined) => {
              setValue("routePermit", value || ""); // Ensure the value is a string
            }}
          />
        </InputWrapper>

        {/* Manufacturer Company */}
        <InputWrapper
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
        <InputWrapper labelFor="model" label={translate("মডেল", "Model")}>
          <Input
            id="model"
            type="text"
            {...register("model")}
            placeholder={translate("মডেল লিখুন", "Enter model")}
          />
        </InputWrapper>

        {/* Chassis Number */}
        <InputWrapper
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
        <InputWrapper labelFor="color" label={translate("রং", "Color")}>
          <Input
            id="color"
            type="text"
            {...register("color")}
            placeholder={translate("রং লিখুন", "Enter color")}
          />
        </InputWrapper>

        {/* Delivery to Depot */}
        <InputWrapper
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
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.deliveryDate
                  ? format(selectedDates.deliveryDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.deliveryDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("deliveryDate", date || new Date())
                }
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
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
                className="w-full justify-start text-left font-normal text-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDates.orderDate
                  ? format(selectedDates.orderDate, "PPP")
                  : translate("তারিখ নির্বাচন করুন", "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <Calendar
                style={{ pointerEvents: "auto" }}
                className="cursor-pointer"
                mode="single"
                selected={selectedDates.orderDate || new Date()}
                onSelect={(date) =>
                  handleDateChange("orderDate", date || new Date())
                }
                fromYear={1900}
                toYear={new Date().getFullYear() + 75}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
        </InputWrapper>

        <Submit
          loading={addVehicleLoading || uploadPhotoLoading}
          errors={addVehicleError}
          submitTitle={translate("যানবাহন যুক্ত করুন", "Add Coachs")}
          errorTitle={translate(
            "যানবাহন যোগ করতে ত্রুটি",
            "Error Adding Vehicle"
          )}
          className="mt-2 sm:col-span-2 md:col-span-4 w-full"
        />
      </form>
    </FormWrapper>
  );
};

export default AddVehicles;
