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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AddUpdateDriverDataProps,
  addUpdateDriverSchema,
} from "@/schemas/contact/addUpdateDriverSchema";
import {
  useGetSingleDriverQuery,
  useUpdateDriverMutation,
} from "@/store/api/contact/driverApi";
import {
  bloodGroupOptions,
  IBloodGroupsProps,
} from "@/utils/constants/common/bloodGroupOptions";
import {
  genderOptions,
  IGenderOptionsProps,
} from "@/utils/constants/common/genderOptions";
import {
  IMaritalStatusOptionsProps,
  maritalStatusOptions,
} from "@/utils/constants/common/maritalStatusOptions";
import { addUpdateDriverForm } from "@/utils/constants/form/addUpdateDriver";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";

interface IUpdateDriverProps {
  id: number | null;
}

interface IUpdateDriverFormStateProps {
  photo: string;
  licensePhoto: string;
  dateOfBirth: Date | null;
  issueDate: Date | null;
  expireDate: Date | null;
  dateOfBirthOpen: boolean;
  issueDateOpen: boolean;
  expireDateOpen: boolean;
}

const UpdateDriver: FC<IUpdateDriverProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [updateDriverFormState, setUpdateDriverFormState] =
    useState<IUpdateDriverFormStateProps>({
      photo: "",
      licensePhoto: "",
      dateOfBirth: null,
      issueDate: null,
      expireDate: null,
      dateOfBirthOpen: false,
      issueDateOpen: false,
      expireDateOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateDriverDataProps>({
    resolver: zodResolver(addUpdateDriverSchema),
  });

  const { data: driverData, isLoading: driverLoading } =
    useGetSingleDriverQuery(id);

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});

  useEffect(() => {
    setValue("address", driverData?.data?.address || "");
    setValue("bloodGroup", driverData?.data?.bloodGroup || "");
    setValue("contactNo", driverData?.data?.contactNo || "");
    setValue(
      "dateOfBirth",
      driverData?.data?.dateOfBirth?.toLowerCase() === "n/a"
        ? null
        : new Date(driverData?.data?.dateOfBirth)
    );
    setValue(
      "email",
      driverData?.data?.email?.toLowerCase() === "n/a"
        ? ""
        : driverData?.data?.email
    );
    setValue("gender", driverData?.data?.gender || "");
    setValue("maritalStatus", driverData?.data?.maritalStatus);
    setValue("name", driverData?.data?.name || "");
    setValue("licenseNumber", driverData?.data?.licenseNumber || "");
    setValue("licenseIssueDate", driverData?.data?.licenseIssueDate || "");
    setValue("licenseExpDate", driverData?.data?.licenseExpDate || "");
    setValue("emergencyNumber", driverData?.data?.emergencyNumber || "");
    setValue("referenceBy", driverData?.data?.referenceBy || "");
    setValue("licensePhoto", driverData?.data?.licensePhoto || "");
    setValue("avatar", driverData?.data?.avatar || "");

    setUpdateDriverFormState((prevState: IUpdateDriverFormStateProps) => ({
      ...prevState,

      dateOfBirth:
        driverData?.data?.dateOfBirth?.toLowerCase() === "n/a"
          ? null
          : driverData?.data?.dateOfBirth,
      expireDate:
        driverData?.data?.licenseExpDate?.toLowerCase() === "n/a"
          ? null
          : driverData?.data?.licenseExpDate,
      issueDate:
        driverData?.data?.licenseIssueDate?.toLowerCase() === "n/a"
          ? null
          : driverData?.data?.licenseIssueDate,
      licensePhoto: driverData?.data?.licensePhoto || "",
      photo: driverData?.data?.avatar || "",
    }));

    
  }, [driverData, setValue]);

  const [
    updateDriver,
    { isLoading: updateDriverLoading, error: addDriverError },
  ] = useUpdateDriverMutation();

  const onSubmit = async (data: AddUpdateDriverDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "email",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
    ]) as AddUpdateDriverDataProps;

    if (updateData?.avatar?.toString().includes("data:image/jpeg;base64")) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    if (
      updateData?.licensePhoto?.toString().includes("data:image/jpeg;base64")
    ) {
      const result = await uploadPhoto(updateData?.licensePhoto).unwrap();
      if (result?.success) {
        updateData.licensePhoto = result?.data;
      }
    }

    const result = await updateDriver({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "গাড়ি চালক সম্পাদনা করার বার্তা",
          "Message for updating driver"
        ),
        description: toastMessage("update", translate("ড্রাইভার", "driver")),
      });
    }
  };

  if (driverLoading) {
    return <FormSkeleton inputs={15} columns={3} />;
  }

  return (
    <FormWrapper
      heading={translate("ড্রাইভার সম্পাদনা করুন", "Update Driver")}
      subHeading={translate(
        "সিস্টেমে ড্রাইভার সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing driver to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* FULL NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="name"
            label={translate(
              addUpdateDriverForm.name.label.bn,
              addUpdateDriverForm.name.label.en
            )}
          >
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder={translate(
                addUpdateDriverForm.name.placeholder.bn,
                addUpdateDriverForm.name.placeholder.en
              )}
            />
          </InputWrapper>
          {/* EMAIL */}
          <InputWrapper
            error={errors?.email?.message}
            labelFor="email"
            label={translate(
              addUpdateDriverForm.email.label.bn,
              addUpdateDriverForm.email.label.en
            )}
          >
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder={translate(
                addUpdateDriverForm.email.placeholder.bn,
                addUpdateDriverForm.email.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            error={errors?.contactNo?.message}
            labelFor="contact_number"
            label={translate(
              addUpdateDriverForm?.contactNo.label.bn,
              addUpdateDriverForm.contactNo.label.en
            )}
          >
            <Input
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateDriverForm.contactNo.placeholder.bn,
                addUpdateDriverForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* LICENSE NUMBER */}
          <InputWrapper
            error={errors?.licenseNumber?.message}
            labelFor="licenseNumber"
            label={translate(
              addUpdateDriverForm?.licenseNumber.label.bn,
              addUpdateDriverForm.licenseNumber.label.en
            )}
          >
            <Input
              {...register("licenseNumber")}
              id="licenseNumber"
              type="text"
              placeholder={translate(
                addUpdateDriverForm.licenseNumber.placeholder.bn,
                addUpdateDriverForm.licenseNumber.placeholder.en
              )}
            />
          </InputWrapper>

          {/* ISSUE DATE */}
          <InputWrapper
            error={errors?.licenseIssueDate?.message}
            labelFor="licenseIssueDate"
            label={translate(
              addUpdateDriverForm.licenseIssueDate.label.bn,
              addUpdateDriverForm.licenseIssueDate.label.en
            )}
          >
            <Popover
              open={updateDriverFormState.issueDateOpen}
              onOpenChange={(open) =>
                setUpdateDriverFormState(
                  (prevState: IUpdateDriverFormStateProps) => ({
                    ...prevState,
                    issueDateOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger
                className="w-full truncate"
                id="licenseIssueDate"
                asChild
              >
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateDriverFormState.issueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateDriverFormState.issueDate ? (
                    format(updateDriverFormState.issueDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateDriverForm.licenseIssueDate.placeholder.bn,
                        addUpdateDriverForm.licenseIssueDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={updateDriverFormState?.issueDate || new Date()}
                  onSelect={(date) => {
                    setValue("licenseIssueDate", date?.toISOString() || "");
                    setError("licenseIssueDate", {
                      type: "custom",
                      message: "",
                    });
                    setUpdateDriverFormState(
                      (prevState: IUpdateDriverFormStateProps) => ({
                        ...prevState,
                        issueDateOpen: false,
                        issueDate: date || null,
                      })
                    );
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* EXPIRE DATE */}
          <InputWrapper
            error={errors?.licenseExpDate?.message}
            labelFor="licenseExpDate"
            label={translate(
              addUpdateDriverForm.licenseExpDate.label.bn,
              addUpdateDriverForm.licenseExpDate.label.en
            )}
          >
            <Popover
              open={updateDriverFormState.expireDateOpen}
              onOpenChange={(open) =>
                setUpdateDriverFormState(
                  (prevState: IUpdateDriverFormStateProps) => ({
                    ...prevState,
                    expireDateOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger
                className="w-full truncate"
                id="licenseExpDate"
                asChild
              >
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateDriverFormState.expireDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateDriverFormState.expireDate ? (
                    format(
                      updateDriverFormState.expireDate || new Date(),
                      "PPP"
                    )
                  ) : (
                    <span>
                      {translate(
                        addUpdateDriverForm.licenseExpDate.placeholder.bn,
                        addUpdateDriverForm.licenseExpDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={updateDriverFormState?.expireDate || new Date()}
                  onSelect={(date) => {
                    setValue("licenseExpDate", date?.toISOString() || "");
                    setError("licenseExpDate", {
                      type: "custom",
                      message: "",
                    });
                    setUpdateDriverFormState(
                      (prevState: IUpdateDriverFormStateProps) => ({
                        ...prevState,
                        expireDateOpen: false,
                        expireDate: date || null,
                      })
                    );
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* EMERGENCY NUMBER */}
          <InputWrapper
            error={errors?.emergencyNumber?.message}
            labelFor="emergencyNumber"
            label={translate(
              addUpdateDriverForm.emergencyNumber.label.bn,
              addUpdateDriverForm.emergencyNumber.label.en
            )}
          >
            <Input
              {...register("emergencyNumber")}
              id="emergencyNumber"
              type="tel"
              placeholder={translate(
                addUpdateDriverForm.emergencyNumber.placeholder.bn,
                addUpdateDriverForm.emergencyNumber.placeholder.en
              )}
            />
          </InputWrapper>

          {/* LICENSE PHOTO */}
          <InputWrapper
            labelFor="licensePhoto"
            error={errors?.licensePhoto?.message}
            label={translate(
              addUpdateDriverForm.licensePhoto.label.bn,
              addUpdateDriverForm.licensePhoto.label.en
            )}
          >
            <PhotoCropper
              id="licensePhoto"
              setPhoto={(value: string | undefined) => {
                setUpdateDriverFormState(
                  (prevState: IUpdateDriverFormStateProps) => ({
                    ...prevState,
                    licensePhoto: value || "",
                  })
                );
                setValue("licensePhoto", value || "");
                setError("licensePhoto", { type: "", message: "" });
              }}
              photo={updateDriverFormState.licensePhoto}
              placeholder={translate(
                addUpdateDriverForm.licensePhoto.placeholder.bn,
                addUpdateDriverForm.licensePhoto.placeholder.en
              )}
            />
          </InputWrapper>
          {/* REFERENCE BY */}

          <InputWrapper
            error={errors?.referenceBy?.message}
            labelFor="referenceBy"
            label={translate(
              addUpdateDriverForm.referenceBy.label.bn,
              addUpdateDriverForm.referenceBy.label.en
            )}
          >
            <Input
              {...register("referenceBy")}
              id="referenceBy"
              type="text"
              placeholder={translate(
                addUpdateDriverForm.referenceBy.placeholder.bn,
                addUpdateDriverForm.referenceBy.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ADDRESS */}

          <InputWrapper
            error={errors?.address?.message}
            labelFor="address"
            label={translate(
              addUpdateDriverForm.address.label.bn,
              addUpdateDriverForm.address.label.en
            )}
          >
            <Input
              {...register("address")}
              id="address"
              type="text"
              placeholder={translate(
                addUpdateDriverForm.address.placeholder.bn,
                addUpdateDriverForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* AVATAR */}
          <InputWrapper
            labelFor="avatar"
            error={errors?.avatar?.message}
            label={translate(
              addUpdateDriverForm.avatar.label.bn,
              addUpdateDriverForm.avatar.label.en
            )}
          >
            <PhotoCropper
              ratio={3 / 4}
              id="avatar"
              setPhoto={(value: string | undefined) => {
                setUpdateDriverFormState(
                  (prevState: IUpdateDriverFormStateProps) => ({
                    ...prevState,
                    photo: value || "",
                  })
                );
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={updateDriverFormState.photo}
              placeholder={translate(
                addUpdateDriverForm.avatar.placeholder.bn,
                addUpdateDriverForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
          {/* GENDER */}
          <InputWrapper
            labelFor="gender"
            error={errors?.gender?.message}
            label={translate(
              addUpdateDriverForm.gender.label.bn,
              addUpdateDriverForm.gender.label.en
            )}
          >
            <Select
              value={watch("gender") || ""}
              onValueChange={(value: "Male" | "Female") => {
                setValue("gender", value);
                setError("gender", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="gender" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateDriverForm?.gender.placeholder.bn,
                    addUpdateDriverForm.gender.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {genderOptions?.length > 0 &&
                  genderOptions?.map(
                    (
                      singleGender: IGenderOptionsProps,
                      genderIndex: number
                    ) => (
                      <SelectItem key={genderIndex} value={singleGender.key}>
                        {translate(
                          singleGender.label.bn,
                          singleGender.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* BLOOD GROUP */}
          <InputWrapper
            error={errors?.bloodGroup?.message}
            labelFor="blood_group"
            label={translate(
              addUpdateDriverForm.bloodGroup.label.bn,
              addUpdateDriverForm.bloodGroup.label.en
            )}
          >
            <Select
              value={watch("bloodGroup") || ""}
              onValueChange={(value: string) => {
                setValue("bloodGroup", value);
                setError("bloodGroup", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="blood_group" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateDriverForm?.bloodGroup.placeholder.bn,
                    addUpdateDriverForm.bloodGroup.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions?.length > 0 &&
                  bloodGroupOptions?.map(
                    (singleGroup: IBloodGroupsProps, bloodIndex: number) => (
                      <SelectItem key={bloodIndex} value={singleGroup.key}>
                        {translate(singleGroup.label.bn, singleGroup.label.en)}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* MARITAL STATUS */}
          <InputWrapper
            error={errors?.maritalStatus?.message}
            labelFor="marital_status"
            label={translate(
              addUpdateDriverForm.maritalStatus.label.bn,
              addUpdateDriverForm.maritalStatus.label.en
            )}
          >
            <Select
              value={watch("maritalStatus") || ""}
              onValueChange={(value: "Married" | "Unmarried") => {
                setValue("maritalStatus", value);
                setError("maritalStatus", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="marital_status" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateDriverForm?.maritalStatus.placeholder.bn,
                    addUpdateDriverForm.maritalStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusOptions?.length > 0 &&
                  maritalStatusOptions?.map(
                    (
                      singleMaritalStatus: IMaritalStatusOptionsProps,
                      maritalStatusIndex: number
                    ) => (
                      <SelectItem
                        key={maritalStatusIndex}
                        value={singleMaritalStatus.key}
                      >
                        {translate(
                          singleMaritalStatus.label.bn,
                          singleMaritalStatus.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* DATE OF BIRTH */}
          <InputWrapper
            error={errors?.dateOfBirth?.message}
            labelFor="date_of_birth"
            label={translate(
              addUpdateDriverForm.dateOfBirth.label.bn,
              addUpdateDriverForm.dateOfBirth.label.en
            )}
          >
            <Popover
              open={updateDriverFormState.dateOfBirthOpen}
              onOpenChange={(open) =>
                setUpdateDriverFormState(
                  (prevState: IUpdateDriverFormStateProps) => ({
                    ...prevState,
                    dateOfBirthOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateDriverFormState.dateOfBirth &&
                      "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateDriverFormState?.dateOfBirth ? (
                    format(updateDriverFormState?.dateOfBirth, "PPP")
                  ) : (
                    <span>
                      {translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  selected={updateDriverFormState?.dateOfBirth || new Date()}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date);
                    setError("dateOfBirth", { type: "custom", message: "" });
                    setUpdateDriverFormState(
                      (prevState: IUpdateDriverFormStateProps) => ({
                        ...prevState,
                        dateOfBirthOpen: false,
                        dateOfBirth: date || null,
                      })
                    );
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
        </GridWrapper>
        <Submit
          loading={updateDriverLoading || uploadPhotoLoading}
          errors={addDriverError}
          submitTitle={translate("ড্রাইভার সম্পাদনা করুন", "Update Driver")}
          errorTitle={translate(
            "ড্রাইভার সম্পাদনা করতে ত্রুটি",
            "Update Driver Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateDriver;
