import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import PhotoCropper from "@/components/common/photo/PhotoCropper";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
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
  UpdateUserDataProps,
  updateUserSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetAllUserRoleListQuery } from "@/store/api/contact/roleApi";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/store/api/contact/userApi";
import { format } from "date-fns";

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
import { skipToken } from "@reduxjs/toolkit/query"; // Import skipToken
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
interface IUpdateUserProps {
  id: number | null;
}
interface IUpdateUserFormStateProps {
  photo: string;
  date: Date | null;
  calendarOpen: boolean;
  fromDate: Date | null;
  endDate: Date | null;
  startCalendarOpen: boolean;
  endCalendarOpen: boolean;
}

const toLocalISODate = (date: Date) => {
  // Reset to local midnight
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return local.toISOString();
};

const UpdateGuide: FC<IUpdateUserProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const [updateUserFormState, setUpdateUserFormState] =
    useState<IUpdateUserFormStateProps>({
      photo: "",
      date: null,
      calendarOpen: false,
      fromDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      startCalendarOpen: false,
      endCalendarOpen: false,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateUserDataProps>({
    resolver: zodResolver(updateUserSchema),
  });

  const { data: userData, isLoading: userLoading } = useGetSingleUserQuery(
    id ?? skipToken
  );
  const { data: roleListData, isLoading: roleLoading } =
    useGetAllUserRoleListQuery({});
  const { data: counterList, isLoading: counterLoading } = useGetCountersQuery(
    {}
  );
  const [updateUser, { isLoading: updateUserLoading, error: updateUserError }] =
    useUpdateUserMutation({});

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  //
  //
useEffect(() => {
  if (userData?.data) {
    setValue("address", userData?.data.address || "");
    setValue("userName", userData?.data?.userName || "");
    setValue("email", userData?.data?.email || "");
    setValue("gender", userData?.data?.gender || "");
    setValue("bloodGroup", userData?.data?.bloodGroup || "");
    setValue("contactNo", userData?.data?.contactNo || "");

    // ⭐ ALL PERMISSIONS FROM YOUR ZOD SCHEMA
    setValue("permission.board", userData?.data?.permission?.board);
    setValue("permission.canViewAllCoachInvoice", userData?.data?.permission?.canViewAllCoachInvoice);
    setValue("permission.bookingPermission", userData?.data?.permission?.bookingPermission);
    setValue("permission.ticketCancel", userData?.data?.permission?.ticketCancel);
    setValue("permission.seatTransfer", userData?.data?.permission?.seatTransfer);
    setValue("permission.coachActiveInActive", userData?.data?.permission?.coachActiveInActive);
    setValue("permission.blockDiscount", userData?.data?.permission?.blockDiscount);
    setValue("permission.showDiscountMenu", userData?.data?.permission?.showDiscountMenu);
    setValue("permission.vipSeatAllowToSale", userData?.data?.permission?.vipSeatAllowToSale);
    setValue("permission.isPrepaid", userData?.data?.permission?.isPrepaid);
    setValue("permission.showOwnCounterBoardingPoint", userData?.data?.permission?.showOwnCounterBoardingPoint);
    setValue("permission.showOwnCounterSalesInTripSheet", userData?.data?.permission?.showOwnCounterSalesInTripSheet);
    setValue("permission.aifs", userData?.data?.permission?.aifs);

    // ⭐ Discount From Date
    const fromDate = userData?.data?.permission?.showDiscountFromDate
      ? new Date(userData.data.permission.showDiscountFromDate)
      : null;

    if (fromDate && !isNaN(fromDate.getTime())) {
      setValue("permission.showDiscountFromDate", toLocalISODate(fromDate));
      setUpdateUserFormState((prev) => ({ ...prev, fromDate }));
    } else {
      setValue("permission.showDiscountFromDate", "");
      setUpdateUserFormState((prev) => ({ ...prev, fromDate: null }));
    }

    // ⭐ Discount End Date
    const endDate = userData?.data?.permission?.showDiscountEndDate
      ? new Date(userData.data.permission.showDiscountEndDate)
      : null;

    if (endDate && !isNaN(endDate.getTime())) {
      setValue("permission.showDiscountEndDate", toLocalISODate(endDate));
      setUpdateUserFormState((prev) => ({ ...prev, endDate }));
    } else {
      setValue("permission.showDiscountEndDate", "");
      setUpdateUserFormState((prev) => ({ ...prev, endDate: null }));
    }

    // Other fields
    const dateOfBirth = userData?.data?.dateOfBirth ? new Date(userData.data.dateOfBirth) : null;

    if (dateOfBirth && !isNaN(dateOfBirth.getTime())) {
      setValue("dateOfBirth", format(dateOfBirth, "yyyy-MM-dd"));
      setUpdateUserFormState((prev) => ({ ...prev, date: dateOfBirth }));
    } else {
      setValue("dateOfBirth", "");
      setUpdateUserFormState((prev) => ({ ...prev, date: null }));
    }

    setValue("maritalStatus", userData?.data?.maritalStatus || "");

    // Role + Counter
    setValue("roleId", userData?.data?.role?.id || "");
    setValue("counterId", userData?.data?.counter?.id || "");

    // Avatar
    setUpdateUserFormState((prev) => ({
      ...prev,
      photo: userData?.data?.avatar || "",
    }));
  }
}, [userData, setValue]);

  const onSubmit = async (data: UpdateUserDataProps) => {
    const updateData = {
      ...removeFalsyProperties(data, [
        "contactNo",
        "gender",
        "email",
        "maritalStatus",
        "bloodGroup",
        "address",
        "avatar",
        "roleId",
        "counterId",
        "dateOfBirth",
      ]),
    };
    if (updateData?.avatar) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await updateUser({ data: updateData, id });
    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী সম্পাদনা করার বার্তা",
          "Message for updating guide"
        ),
        description: toastMessage("update", translate("ব্যবহারকারী", "guide")),
      });
    }
  };

  if (userLoading || roleLoading || counterLoading) {
    return <FormSkeleton columns={3} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate("ব্যবহারকারীর সম্পাদনা করুন", "Update Guide Profile")}
      subHeading={translate(
        "সিস্টেমে ব্যবহারকারীর তথ্য সম্পাদনা করতে নিচের নির্দেশনা গুলো অনুসরণ করুন।",
        "Follow the instructions to update guide profile information in the system"
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper columns={4}>
          {/* FULL NAME */}
          <InputWrapper
            labelFor="guideName"
            label={translate(
              addUpdateUserForm.guideName.label.bn,
              addUpdateUserForm.guideName.label.en
            )}
            error={errors?.userName?.message}
          >
            <Input
              {...register("userName")}
              id="userName"
              type="text"
              placeholder={translate(
                addUpdateUserForm.guideName.placeholder.bn,
                addUpdateUserForm.guideName.placeholder.en
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
              // value={userData?.email || ""}
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
              open={updateUserFormState.calendarOpen}
              onOpenChange={(open) =>
                setUpdateUserFormState(
                  (prevState: IUpdateUserFormStateProps) => ({
                    ...prevState,
                    calendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger id="date_of_birth" asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateUserFormState.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateUserFormState.date instanceof Date &&
                  !isNaN(updateUserFormState.date.getTime())
                    ? format(updateUserFormState.date, "PPP")
                    : translate("একটি তারিখ নির্বাচন করুন", "Pick a date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  captionLayout="dropdown-buttons"
                  // selected={updateUserFormState?.date || new Date()}
                  selected={updateUserFormState?.date || new Date()}
                  onSelect={(date) => {
                    if (date) {
                      setValue("dateOfBirth", format(date, "yyyy-MM-dd")); // Format as "YYYY-MM-DD"
                      setError("dateOfBirth", { type: "custom", message: "" });
                    } else {
                      setValue("dateOfBirth", "");
                    }
                    setUpdateUserFormState((prevState) => ({
                      ...prevState,
                      calendarOpen: false,
                      date: date || null,
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
          {/* role id */}
          <InputWrapper
            error={errors?.roleId?.message}
            labelFor="roleId"
            label={translate("ভূমিকা ✼", "Role ✼")}
          >
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled
                >
                  <SelectTrigger id="roleId" className="w-full">
                    <SelectValue>
                      {roleListData?.data?.find(
                        (type: any) => type.id === Number(watch("roleId"))
                      )?.name ||
                        translate("কোনও ভূমিকা নেই", "No Role Available")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {roleListData?.data.map((type: any) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
          {/* Counter ID */}
          <InputWrapper
            error={errors?.counterId?.message}
            labelFor="counterId"
            label={translate("কাউন্টার ✼", "Counter ✼")}
          >
            <Controller
              name="counterId"
              control={control}
              render={({ field }) => (
                <Select
                  //@ts-ignore
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="counterId" className="w-full">
                    <SelectValue>
                      {counterList?.data?.find(
                        (type: any) => type.id === Number(field.value)
                      )?.name ||
                        translate("কাউন্টার নির্বাচন করুন", "Select Counter")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {counterList?.data && counterList.data.length > 0 ? (
                      counterList.data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-counter">
                        {translate(
                          "কোনও কাউন্টার উপলব্ধ নেই",
                          "No Counter Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
                setUpdateUserFormState(
                  (prevState: IUpdateUserFormStateProps) => ({
                    ...prevState,
                    photo: value || "",
                  })
                );
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={updateUserFormState.photo}
              placeholder={""}
            />
          </InputWrapper>
        </GridWrapper>
        {/* <GridWrapper columns={4} className="mt-5">
          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.board")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("বোর্ড", "Board")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.canViewAllCoachInvoice")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("সব কোচ ইনভয়েস দেখুন", "View All Coach Invoice")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.bookingPermission")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("বুকিং অনুমতি", "Booking Permission")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.ticketCancel")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("টিকিট বাতিল", "Ticket Cancel")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.seatTransfer")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("সিট স্থানান্তর", "Seat Transfer")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.coachActiveInActive")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("কোচ সক্রিয়/নিষ্ক্রিয়", "Coach Active/Inactive")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.blockDiscount")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("ডিসকাউন্ট ব্লক করুন", "Block Discount")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.showDiscountMenu")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("ডিসকাউন্ট মেনু দেখান", "Show Discount Menu")}
          </label>
          {watch("permission.showDiscountMenu") === true && (
            <>
              <InputWrapper
                labelFor="showDiscountFromDate"
                label="Discount Start Date"
                error={errors?.permission?.showDiscountFromDate?.message}
              >
                <Popover
                  open={updateUserFormState.startCalendarOpen}
                  onOpenChange={(open) =>
                    setUpdateUserFormState((prevState) => ({
                      ...prevState,
                      startCalendarOpen: open,
                    }))
                  }
                >
                  <PopoverTrigger id="discountFromDate" asChild>
                    <Button variant="outline" className="text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {updateUserFormState.fromDate
                        ? format(updateUserFormState.fromDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      style={{ pointerEvents: "auto" }}
                      mode="single"
                      selected={updateUserFormState.fromDate || new Date()} // default today
                      onSelect={(date) => {
                        if (date) {
                          const isoDate = toLocalISODate(date); // <-- use helper
                          setUpdateUserFormState((prevState) => ({
                            ...prevState,
                            fromDate: date,
                            startCalendarOpen: false,
                          }));
                          setValue("permission.showDiscountFromDate", isoDate);
                          setError("permission.showDiscountFromDate", {
                            type: "custom",
                            message: "",
                          });
                        }
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </InputWrapper>

              <InputWrapper
                labelFor="showDiscountEndDate"
                label="Discount End Date"
                error={errors?.permission?.showDiscountEndDate?.message}
              >
                <Popover
                  open={updateUserFormState.endCalendarOpen}
                  onOpenChange={(open) =>
                    setUpdateUserFormState((prevState) => ({
                      ...prevState,
                      endCalendarOpen: open,
                    }))
                  }
                >
                  <PopoverTrigger id="discountEndDate" asChild>
                    <Button variant="outline" className="text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {updateUserFormState.endDate
                        ? format(updateUserFormState.endDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      style={{ pointerEvents: "auto" }}
                      mode="single"
                      selected={
                        updateUserFormState.endDate ||
                        new Date(new Date().setDate(new Date().getDate() + 1)) // default tomorrow
                      }
                      onSelect={(date) => {
                        if (date) {
                          const isoDate = toLocalISODate(date);
                          setUpdateUserFormState((prevState) => ({
                            ...prevState,
                            endDate: date,
                            endCalendarOpen: false,
                          }));
                          setValue("permission.showDiscountEndDate", isoDate);
                          setError("permission.showDiscountEndDate", {
                            type: "custom",
                            message: "",
                          });
                        }
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear() + 10}
                    />
                  </PopoverContent>
                </Popover>
              </InputWrapper>
            </>
          )}

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.vipSeatAllowToSale")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("ভিআইপি সিট বিক্রির অনুমতি", "VIP Seat Allow to Sale")}
          </label>
          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.isPrepaid")}
              className="w-5 h-5"
            />
            {translate("প্রিপেইড অনুমতি", "Is Prepaid")}
          </label>
          <label className="flex items-center gap-1.5 col-span-2">
            <Input
              type="checkbox"
              {...register("permission.showOwnCounterBoardingPoint")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("প্রিপেইড অনুমতি", "Show Own Counter Boarding Point")}
          </label>
          <label className="flex items-center gap-1.5 col-span-2">
            <Input
              type="checkbox"
              {...register("permission.showOwnCounterSalesInTripSheet")}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
            {translate("প্রিপেইড অনুমতি", "Show Own Counter Sales In Trip Sheet")}
          </label>
        </GridWrapper> */}
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

export default UpdateGuide;