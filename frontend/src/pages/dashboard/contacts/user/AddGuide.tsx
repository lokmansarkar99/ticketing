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
import {
  AddUserDataProps,
  addUserSchema,
} from "@/schemas/contact/addUpdateUserSchema";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetAllUserRoleListQuery } from "@/store/api/contact/roleApi";
import { useAddUserMutation } from "@/store/api/contact/userApi";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LucideEye, LucideEyeOff } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IUserStateProps } from "./UserList";
interface IAddUserProps {
  setUserState: (
    userState: (prevState: IUserStateProps) => IUserStateProps
  ) => void;
}
interface IAddUserFormStateProps {
  photo: string;
  date: Date | null;
  calendarOpen: boolean;
  password: boolean;
  rePassword: boolean;
  fromDate: Date | null;
  endDate: Date | null;
  startCalendarOpen: boolean;
  endCalendarOpen: boolean;
}

(date: Date) => {
  // Reset to local midnight
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return local.toISOString();
};

const AddGuide: FC<IAddUserProps> = ({ setUserState }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  //const { toastMessage } = useMessageGenerator();
  const [addUserFormState, setAddUserFormState] =
    useState<IAddUserFormStateProps>({
      photo: "",
      date: null,
      calendarOpen: false,
      startCalendarOpen: false,
      endCalendarOpen: false,
      password: false,
      rePassword: false,
      fromDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddUserDataProps>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      permission: {
        board: false,
        canViewAllCoachInvoice: false,
        bookingPermission: false,
        ticketCancel: false,
        seatTransfer: false,
        coachActiveInActive: false,
        blockDiscount: false,
        showDiscountMenu: false,
        vipSeatAllowToSale: false,
        isPrepaid: false,
        showOwnCounterBoardingPoint: false,
        showOwnCounterSalesInTripSheet: false,
        aifs: false,
        showDiscountFromDate: new Date().toISOString(),
        showDiscountEndDate: new Date(
          new Date().setDate(new Date().getDate() + 1)
        ).toISOString(),
      },
    },
  });
  const { data: roleListData, isLoading: roleLoading } =
    useGetAllUserRoleListQuery({});
  const { data: counterList, isLoading: counterLoading } = useGetCountersQuery(
    {}
  );
  const [addUser, { isLoading: addUserLoading, error: addUserError }] =
    useAddUserMutation({});

  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});

  const onSubmit = async (data: AddUserDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "contactNo",
      "dateOfBirth",
      "gender",
      "maritalStatus",
      "bloodGroup",
      "address",
      "avatar",
      "email",
    ]) as AddUserDataProps;

    if (updateData?.avatar) {
      const result = await uploadPhoto(updateData?.avatar).unwrap();
      if (result?.success) {
        updateData.avatar = result?.data;
      }
    }

    const result = await addUser(updateData);
    if (result?.data?.success) {
      toast({
        title: translate("ব্যবহারকারী যোগ করা হয়েছে", "Guide Added"),
        description: translate(
          "ব্যবহারকারী সফলভাবে যোগ করা হয়েছে।",
          "Guide added successfully."
        ),
      });

      setUserState((prevState: IUserStateProps) => ({
        ...prevState,
        addUserOpen: false,
      }));
    }
  };

  useEffect(() => {
    const supervisorRole = roleListData?.data?.find(
      (role: any) => role?.name?.toLowerCase() === "supervisor"
    );
    if (supervisorRole) {
      setValue("roleId", supervisorRole?.id);
    }
  }, [roleListData?.data]);

  //
  if (roleLoading || counterLoading) {
    <FormSkeleton columns={7} />;
  }
  return (
    <FormWrapper
      heading={translate("ব্যবহারকারী যোগ করুন", "Add Guide")}
      subHeading={translate(
        "সিস্টেমে নতুন ব্যবহারকারী যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new user to the system."
      )}
      className="max-h-[70vh] overflow-auto scrollbar-thin"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
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
          {/* selec counter */}
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
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="counterId" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addUpdateUserForm.counterId.placeholder.bn,
                        addUpdateUserForm.counterId.placeholder.en
                      )}
                    >
                      {field.value
                        ? counterList?.data?.find(
                            (counter: any) => counter.id === Number(field.value)
                          )?.name
                        : null}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {counterList?.data && counterList.data.length > 0 ? (
                      counterList.data.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-counter">
                        {translate(
                          "কোনও কাউন্টার ধরন উপলব্ধ নেই",
                          "No Counter Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
          {/* selec role */}
          <InputWrapper
            error={errors?.roleId?.message}
            labelFor="permissionType"
            label={translate("ভূমিকা ✼", "Role ✼")}
          >
            <Controller
              name="roleId"
              control={control}
              defaultValue={
                roleListData?.data?.find(
                  (role: any) => role.name === "supervisor"
                )?.id ?? ""
              } // set default to Supervisor
              render={({ field }) => {
                const supervisorRole = roleListData?.data?.find(
                  (role: any) => role?.name?.toLowerCase() === "supervisor"
                );

                return (
                  <Select
                    value={supervisorRole?.id?.toString() || ""}
                    disabled // disable the whole select
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="roleId" className="w-full">
                      <SelectValue>
                        {supervisorRole?.name ||
                          translate(
                            addUpdateUserForm.roleId.placeholder.bn,
                            addUpdateUserForm.roleId.placeholder.en
                          )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roleListData?.data && roleListData.data.length > 0 ? (
                        roleListData.data.map((type: any) => (
                          <SelectItem
                            key={type.id}
                            value={type.id.toString()}
                            disabled={type.name === "supervisor"} // keep Supervisor disabled
                          >
                            {type.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-role">
                          {translate(
                            "কোনও ভূমিকা ধরন উপলব্ধ নেই",
                            "No Role Types Available"
                          )}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                );
              }}
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
              maxLength={11}
              placeholder={translate(
                addUpdateUserForm.contactNo.placeholder.bn,
                addUpdateUserForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ACCOUNT PASSWORD */}
          <InputWrapper
            labelFor="password"
            label={translate(
              addUpdateUserForm.password.label.bn,
              addUpdateUserForm.password.label.en
            )}
            error={errors?.password?.message}
          >
            <div className="relative">
              <Input
                {...register("password")}
                className="pr-10"
                id="password"
                type={addUserFormState.password ? "password" : "text"}
                placeholder={translate(
                  addUpdateUserForm.password.placeholder.bn,
                  addUpdateUserForm.password.placeholder.en
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                    ...prevState,
                    password: !prevState.password,
                  }))
                }
              >
                {addUserFormState.password ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
          {/* ACCOUNT RE_PASSWORD  */}
          <InputWrapper
            labelFor="re_password"
            label={translate(
              addUpdateUserForm.rePassword.label.bn,
              addUpdateUserForm.rePassword.label.en
            )}
            error={errors?.rePassword?.message}
          >
            <div className="relative">
              <Input
                {...register("rePassword")}
                type={addUserFormState.password ? "password" : "text"}
                id="re_password"
                placeholder={translate(
                  addUpdateUserForm.rePassword.placeholder.bn,
                  addUpdateUserForm.rePassword.placeholder.en
                )}
              />
              <button
                type="button"
                className="text-lg absolute top-1/2 -translate-y-1/2 right-1 cursor-pointer whitespace-nowrap rounded-md p-1 hover:bg-muted"
                onClick={() =>
                  setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                    ...prevState,
                    rePassword: !prevState.rePassword,
                  }))
                }
              >
                {addUserFormState.rePassword ? (
                  <LucideEye className="h-5 w-5" />
                ) : (
                  <LucideEyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </InputWrapper>
          {/* ACCOUNT EMAIL */}
          <InputWrapper
            error={errors?.email?.message}
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

          {/* ACTIVITY ROLE */}

          {/* DATE OF BIRTH */}
          <InputWrapper
            labelFor="dateOfBirth"
            label="Date of Birth"
            error={errors?.dateOfBirth?.message}
          >
            <Popover
              open={addUserFormState.calendarOpen}
              onOpenChange={(open) =>
                setAddUserFormState((prevState) => ({
                  ...prevState,
                  calendarOpen: open,
                }))
              }
            >
              <PopoverTrigger id="dateOfBirth" asChild>
                <Button variant="outline" className="text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addUserFormState.date
                    ? format(addUserFormState.date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  captionLayout="dropdown-buttons"
                  style={{ pointerEvents: "auto" }}
                  mode="single"
                  selected={addUserFormState.date || undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = date.toISOString().split("T")[0]; // Format to "YYYY-MM-DD"

                      setAddUserFormState((prevState) => ({
                        ...prevState,
                        date, // Keep the Date object in state for further use (e.g., UI display)
                        calendarOpen: false,
                      }));

                      setValue("dateOfBirth", formattedDate); // Pass the formatted string to the form
                      setError("dateOfBirth", { type: "custom", message: "" }); // Clear validation errors
                    }
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
                setAddUserFormState((prevState: IAddUserFormStateProps) => ({
                  ...prevState,
                  photo: value || "",
                }));
                setValue("avatar", value);
                setError("avatar", { type: "", message: "" });
              }}
              photo={addUserFormState.photo}
              placeholder={translate(
                addUpdateUserForm.avatar.placeholder.bn,
                addUpdateUserForm.avatar.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>
        {/* <GridWrapper className="mt-5">
          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.board")}
              className="w-5 h-5"
            />
            {translate("বোর্ড", "Board")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.canViewAllCoachInvoice")}
              className="w-5 h-5"
            />
            {translate("সব কোচ ইনভয়েস দেখুন", "View All Coach Invoice")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.bookingPermission")}
              className="w-5 h-5"
            />
            {translate("বুকিং অনুমতি", "Booking Permission")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.ticketCancel")}
              className="w-5 h-5"
            />
            {translate("টিকিট বাতিল", "Ticket Cancel")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.seatTransfer")}
              className="w-5 h-5"
            />
            {translate("সিট স্থানান্তর", "Seat Transfer")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.coachActiveInActive")}
              className="w-5 h-5"
            />
            {translate("কোচ সক্রিয়/নিষ্ক্রিয়", "Coach Active/Inactive")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.blockDiscount")}
              className="w-5 h-5"
            />
            {translate("ডিসকাউন্ট ব্লক করুন", "Block Discount")}
          </label>

          <label className="flex items-center gap-1.5">
            <Input
              type="checkbox"
              {...register("permission.showDiscountMenu")}
              className="w-5 h-5"
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
                  open={addUserFormState.startCalendarOpen}
                  onOpenChange={(open) =>
                    setAddUserFormState((prevState) => ({
                      ...prevState,
                      startCalendarOpen: open,
                    }))
                  }
                >
                  <PopoverTrigger id="discountFromDate" asChild>
                    <Button variant="outline" className="text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {addUserFormState.fromDate
                        ? format(addUserFormState.fromDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      style={{ pointerEvents: "auto" }}
                      mode="single"
                      selected={addUserFormState.fromDate || new Date()} // default today
                      onSelect={(date) => {
                        if (date) {
                          const isoDate = toLocalISODate(date); // <-- use helper
                          setAddUserFormState((prevState) => ({
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
                  open={addUserFormState.endCalendarOpen}
                  onOpenChange={(open) =>
                    setAddUserFormState((prevState) => ({
                      ...prevState,
                      endCalendarOpen: open,
                    }))
                  }
                >
                  <PopoverTrigger id="discountEndDate" asChild>
                    <Button variant="outline" className="text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {addUserFormState.endDate
                        ? format(addUserFormState.endDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end">
                    <Calendar
                      captionLayout="dropdown-buttons"
                      style={{ pointerEvents: "auto" }}
                      mode="single"
                      selected={
                        addUserFormState.endDate ||
                        new Date(new Date().setDate(new Date().getDate() + 1))
                      }
                      onSelect={(date) => {
                        if (date) {
                          const isoDate = toLocalISODate(date);
                          setAddUserFormState((prevState) => ({
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
              className="w-5 h-5"
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
          loading={addUserLoading || uploadPhotoLoading}
          errors={addUserError}
          submitTitle={translate("ব্যবহারকারী যুক্ত করুন", "Add User")}
          errorTitle={translate(
            "ব্যবহারকারী যোগ করতে ত্রুটি",
            "Add User Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddGuide;
