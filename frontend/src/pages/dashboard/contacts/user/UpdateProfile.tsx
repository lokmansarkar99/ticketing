import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
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
  UpdateUserProfileDataProps,
  updateUserProfileSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useUpdateUserMutation } from "@/store/api/contact/userApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
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
import addUpdateUserForm from "@/utils/constants/form/addUpdateUserForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IUpdateProfileProps {
  userData: any;
  userLoading: boolean;
}

interface IUpdateUserFormStateProps {
  photo: string;
  date: Date | undefined;
  calendarOpen: boolean;
}

const UpdateProfile: FC<IUpdateProfileProps> = ({ userData, userLoading }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [updateUserProfileFormState, setUpdateUserProfileFormState] =
    useState<IUpdateUserFormStateProps>({
      photo: "",
      date: undefined,
      calendarOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserProfileDataProps>({
    resolver: zodResolver(updateUserProfileSchema),
  });
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  //
  const [updateUser, { isLoading: updateUserLoading, error: updateUserError }] =
    useUpdateUserMutation({});
  //
  const onSubmit = async (data: UpdateUserProfileDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "contactNo",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
    ]) as UpdateUserProfileDataProps;

    if (updateData?.avatar) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await updateUser({ data: updateData, id: userData.id });

    //
    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী সম্পাদনা করার বার্তা",
          "Message for updating user"
        ),
        description: toastMessage("update", translate("ব্যবহারকারী", "user")),
      });
    }
  };

  useEffect(() => {
    setValue("address", userData?.address || "");
    setValue("userName", userData?.userName || "");
    setValue("email", userData?.email || "");
    setValue("gender", userData?.gender || "");
    setValue("bloodGroup", userData?.bloodGroup || "");
    setValue("contactNo", userData?.contactNo || "");
    //const birthDate = new Date(userData?.dateOfBirth);
    //setValue("dateOfBirth", isNaN(birthDate.getTime()) ? undefined : birthDate);
    //setValue("dateOfBirth", new Date(userData?.dateOfBirth) || "");
    setValue("maritalStatus", userData?.maritalStatus || "");
    if (userData && userData.dateOfBirth) {
      const birthDate = new Date(userData.dateOfBirth);
      // Check if the birthDate is a valid date
      if (!isNaN(birthDate.getTime())) {
        setValue("dateOfBirth", birthDate);
        setUpdateUserProfileFormState((prev) => ({
          ...prev,
          date: birthDate,
        }));
      }
    }
  }, [userData, setValue]);

  if (userLoading) {
    return <FormSkeleton columns={2} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate("আপনার প্রোফাইল সম্পাদনা করুন", "Update Your Profile")}
      subHeading={translate(
        "সিস্টেমে আপনার তথ্য সম্পাদনা করতে নিচের নির্দেশনা গুলো অনুসরণ করুন।",
        "Follow the instructions to update your profile information in the system"
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-x-4 gap-y-2">
          {/* FULL NAME */}
          <InputWrapper
            labelFor="userName"
            label={translate(
              addUpdateUserForm.userName.label.bn,
              addUpdateUserForm.userName.label.en
            )}
            error={errors?.userName?.message}
          >
            <Input
              {...register("userName")}
              id="userName"
              type="text"
              placeholder={translate(
                addUpdateUserForm.userName.placeholder.bn,
                addUpdateUserForm.userName.placeholder.en
              )}
            />
          </InputWrapper>

          {/* EMAIL */}

          <InputWrapper
            labelFor="email"
            label={translate(
              addUpdateUserForm.email.label.bn,
              addUpdateUserForm.email.label.en
            )}
          >
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder={translate(
                addUpdateUserForm.email.placeholder.bn,
                addUpdateUserForm.email.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            labelFor="contact_number"
            label={translate(
              addUpdateUserForm.contactNo.label.bn,
              addUpdateUserForm.contactNo.label.en
            )}
            error={errors?.contactNo?.message}
          >
            <Input
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateUserForm.contactNo.placeholder.bn,
                addUpdateUserForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* DATE OF BIRTH */}
          <InputWrapper
            labelFor="date_of_birth"
            label={translate(
              addUpdateUserForm.dateOfBirth.label.bn,
              addUpdateUserForm.dateOfBirth.label.en
            )}
          >
            <Popover
              open={updateUserProfileFormState.calendarOpen}
              onOpenChange={(open) =>
                setUpdateUserProfileFormState((prevState) => ({
                  ...prevState,
                  calendarOpen: open,
                }))
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateUserProfileFormState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateUserProfileFormState.date instanceof Date &&
                  !isNaN(updateUserProfileFormState.date.getTime()) ? (
                    format(updateUserProfileFormState.date, "PPP")
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
                  selected={updateUserProfileFormState.date}
                  onSelect={(date) => {
                    setValue("dateOfBirth", date ?? undefined); // Ensure it's Date or undefined
                    setUpdateUserProfileFormState((prevState) => ({
                      ...prevState,
                      calendarOpen: false,
                      date, // Assign directly without fallback
                    }));
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>
          {/* GENDER */}
          <InputWrapper
            error={errors?.gender?.message}
            labelFor="gender"
            label={translate(
              addUpdateUserForm.gender.label.bn,
              addUpdateUserForm.gender.label.en
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
                    addUpdateUserForm.gender.placeholder.bn,
                    addUpdateUserForm.gender.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {genderOptions?.length > 0 &&
                  genderOptions.map((singleGender: IGenderOptionsProps) => (
                    <SelectItem key={singleGender.key} value={singleGender.key}>
                      {translate(singleGender.label.bn, singleGender.label.en)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* MARITAL STATUS */}
          <InputWrapper
            labelFor="marital_status"
            label={translate(
              addUpdateUserForm.maritalStatus.label.bn,
              addUpdateUserForm.maritalStatus.label.en
            )}
            error={errors?.maritalStatus?.message}
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
                    addUpdateUserForm.maritalStatus.placeholder.bn,
                    addUpdateUserForm.maritalStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {maritalStatusOptions?.length > 0 &&
                  maritalStatusOptions.map(
                    (singleStatus: IMaritalStatusOptionsProps) => (
                      <SelectItem
                        key={singleStatus.key}
                        value={singleStatus.key}
                      >
                        {translate(
                          singleStatus.label.bn,
                          singleStatus.label.en
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
              addUpdateUserForm.bloodGroup.label.bn,
              addUpdateUserForm.bloodGroup.label.en
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
                    addUpdateUserForm.bloodGroup.placeholder.bn,
                    addUpdateUserForm.bloodGroup.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions?.length > 0 &&
                  bloodGroupOptions.map(
                    (singleBloodGroup: IBloodGroupsProps) => (
                      <SelectItem
                        key={singleBloodGroup.key}
                        value={singleBloodGroup.key}
                      >
                        {translate(
                          singleBloodGroup.label.bn,
                          singleBloodGroup.label.en
                        )}
                      </SelectItem>
                    )
                  )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ADDRESS */}
          <InputWrapper
            error={errors?.address?.message}
            labelFor="address"
            label={translate(
              addUpdateUserForm.address.label.bn,
              addUpdateUserForm.address.label.en
            )}
          >
            <Input
              {...register("address")}
              id="address"
              type="text"
              placeholder={translate(
                addUpdateUserForm.address.placeholder.bn,
                addUpdateUserForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* AVATAR */}

          <InputWrapper
            labelFor="avatar"
            label={translate(
              addUpdateUserForm.avatar.label.bn,
              addUpdateUserForm.avatar.label.en
            )}
          >
            <PhotoCropper
              ratio={3 / 4}
              id="avatar"
              setPhoto={(value: string | undefined) => {
                setUpdateUserProfileFormState(
                  (prevState: IUpdateUserFormStateProps) => ({
                    ...prevState,
                    photo: value || "",
                  })
                );
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={updateUserProfileFormState.photo}
              placeholder={translate(
                addUpdateUserForm.avatar.placeholder.bn,
                addUpdateUserForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updateUserLoading || uploadPhotoLoading}
          errors={updateUserError}
          submitTitle={translate("ব্যবহারকারী সম্পাদনা করুন", "Update User")}
          errorTitle={translate(
            "ব্যবহারকারী সম্পাদনা করতে ত্রুটি",
            "Update User Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateProfile;
