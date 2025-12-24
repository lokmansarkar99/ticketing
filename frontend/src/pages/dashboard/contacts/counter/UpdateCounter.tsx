import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateCounterDataProps,
  addUpdateCounterSchema,
} from "@/schemas/contact/addUpdateCounterSchema";
import {
  useGetSingleCounterQuery,
  useUpdateCounterMutation,
} from "@/store/api/contact/counterApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { addUpdateCounterForm } from "@/utils/constants/form/addUpdateCounterForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

interface IUpdateCounterProps {
  id: number | null;
}

const UpdateCounter: FC<IUpdateCounterProps> = ({ id }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateCounterDataProps>({
    resolver: zodResolver(addUpdateCounterSchema),
    defaultValues:{
      commission:0
    }
  });
  const counterType = watch("type");

  const { data: counterData, isLoading: counterLoading } =
    useGetSingleCounterQuery(id);

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({}) as any;

  const [
    updateCounter,
    { isLoading: updateCounterLoading, error: updateCounterError },
  ] = useUpdateCounterMutation({});

  useEffect(() => {
    setValue("address", counterData?.data?.address || "");
    setValue(
      "bookingAllowClass",
      counterData?.data?.bookingAllowClass?.toLowerCase() === "n/a"
        ? ""
        : counterData?.data?.bookingAllowClass
    );
    setValue(
      "bookingAllowStatus",
      counterData?.data?.bookingAllowStatus?.toLowerCase() === "n/a"
        ? ""
        : counterData?.data?.bookingAllowStatus
    );
    setValue("country", counterData?.data?.country);
    setValue(
      "email", counterData?.data?.email || ""
    );
    setValue("fax", counterData?.data?.fax || "");
    setValue("isSmsSend", counterData?.data?.isSmsSend);
    setValue("landMark", counterData?.data?.landMark || "");
    setValue("locationUrl", counterData?.data?.locationUrl || "");
    setValue("mobile", counterData?.data?.mobile || "");
    setValue("name", counterData?.data?.name || "");
    setValue("phone", counterData?.data?.phone || "");
    setValue(
      "primaryContactPersonName",
      counterData?.data?.primaryContactPersonName || ""
    );
    setValue("stationId", counterData?.data?.station?.id);
    setValue("status", counterData?.data?.status);
    setValue("type", counterData?.data?.type);
    setValue("commissionType", counterData?.data?.commissionType);
    setValue("commission", counterData?.data?.commission);
    setValue("zone", counterData?.data?.zone || "");
  }, [counterData, setValue]);

  const onSubmit = async (data: AddUpdateCounterDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "landMark",
      "locationUrl",
      "phone",
      "fax",
      "email",
      "country",
      "bookingAllowStatus",
      "bookingAllowClass",
      "zone",
    ]) as AddUpdateCounterDataProps;

    const result = await updateCounter({ id, data: updateData });
    if (result?.data?.success) {
      toast({
        title: translate(
          "কাউন্টার সম্পাদনা করার বার্তা",
          "Message for updating counter"
        ),
        description: toastMessage("update", translate("ব্যবহারকারী", "user")),
      });
    }
  };

  if (counterLoading) {
    return <FormSkeleton columns={3} inputs={17} />;
  }

  return (
    <FormWrapper
      heading={translate("কাউন্টার সম্পাদনা করুন", "Update Counter")}
      subHeading={translate(
        "সিস্টেমে নতুন কাউন্টার সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing counter to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* FULL NAME */}
          <InputWrapper
            labelFor="name"
            error={errors?.name?.message}
            label={translate(
              addUpdateCounterForm?.name.label.bn,
              addUpdateCounterForm.name.label.en
            )}
          >
            <Input
              {...register("name")}
              id="name"
              type="text"
              placeholder={translate(
                addUpdateCounterForm.name.placeholder.bn,
                addUpdateCounterForm.name.placeholder.en
              )}
            />
          </InputWrapper>
          {/* TYPE */}
          <InputWrapper
            error={errors?.type?.message}
            labelFor="type"
            label={translate(
              addUpdateCounterForm?.type.label.bn,
              addUpdateCounterForm.type.label.en
            )}
          >
            <Select
              value={watch("type") || ""}
              onValueChange={(
                value: "Own_Counter" | "Commission_Counter" | "Head_Office"
              ) => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id=" type" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.isSmsSend.placeholder.bn,
                    addUpdateCounterForm.isSmsSend.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own_Counter">
                  {translate("নিজস্ব কাউন্টার", "Own Counter")}
                </SelectItem>
                <SelectItem value="Commission_Counter">
                  {translate("কমিশন কাউন্টার", "Commission Counter")}
                </SelectItem>
                <SelectItem value="Head_Office">
                  {translate("হেড অফিস", "Head Office")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {counterType === "Commission_Counter" && (
            <>
              <InputWrapper
                error={errors?.commissionType?.message}
                labelFor="commissionType"
                label={translate(
                  addUpdateCounterForm?.commissionType.label.bn,
                  addUpdateCounterForm.commissionType.label.en
                )}
              >
                <Select
                  value={watch("commissionType") || ""}
                  onValueChange={(value: "Fixed" | "Percentage") => {
                    setValue("commissionType", value);
                    setError("commissionType", { type: "custom", message: "" });
                  }}
                >
                  <SelectTrigger id="commissionType" className="w-full">
                    <SelectValue
                      placeholder={translate(
                        addUpdateCounterForm.commissionType.placeholder.bn,
                        addUpdateCounterForm.commissionType.placeholder.en
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">
                      {translate("স্থায়ী", "Fixed")}
                    </SelectItem>
                    <SelectItem value="Percentage">
                      {translate("শতাংশ", "Percentage")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </InputWrapper>

              {/* commission amount */}
              <InputWrapper
                labelFor="commission"
                error={errors?.commission?.message}
                label="Commission"
              >
                <Input
                  {...register("commission", { valueAsNumber: true })}
                  type="number"
                  id="commission"
                  placeholder="Enter Commission Amount"
                />
              </InputWrapper>
            </>
          )}
          {/* ADDRESS */}
          <InputWrapper
            labelFor="address"
            error={errors?.address?.message}
            label={translate(
              addUpdateCounterForm?.address.label.bn,
              addUpdateCounterForm.address.label.en
            )}
          >
            <Input
              id="address"
              {...register("address")}
              type="text"
              placeholder={translate(
                addUpdateCounterForm.address.placeholder.bn,
                addUpdateCounterForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* LAND MARK */}
          <InputWrapper
            error={errors?.landMark?.message}
            labelFor="landMark"
            label={translate(
              addUpdateCounterForm?.landMark.label.bn,
              addUpdateCounterForm.landMark.label.en
            )}
          >
            <Input
              id="landMark"
              {...register("landMark")}
              type="text"
              placeholder={translate(
                addUpdateCounterForm.landMark.placeholder.bn,
                addUpdateCounterForm.landMark.placeholder.en
              )}
            />
          </InputWrapper>
          {/* LOCATION URL */}
          <InputWrapper
            labelFor="locationUrl"
            error={errors?.locationUrl?.message}
            label={translate(
              addUpdateCounterForm?.locationUrl.label.bn,
              addUpdateCounterForm.locationUrl.label.en
            )}
          >
            <Input
              id="locationUrl"
              {...register("locationUrl")}
              type="text"
              placeholder={translate(
                addUpdateCounterForm.locationUrl.placeholder.bn,
                addUpdateCounterForm.locationUrl.placeholder.en
              )}
            />
          </InputWrapper>
          {/* PHONE */}
          <InputWrapper
            labelFor="phone"
            error={errors?.phone?.message}
            label={translate(
              addUpdateCounterForm?.phone.label.bn,
              addUpdateCounterForm.phone.label.en
            )}
          >
            <Input
              {...register("phone")}
              id="phone"
              type="tel"
              placeholder={translate(
                addUpdateCounterForm.phone.placeholder.bn,
                addUpdateCounterForm.phone.placeholder.en
              )}
            />
          </InputWrapper>
          {/* MOBILE */}
          <InputWrapper
            labelFor="mobile"
            error={errors?.mobile?.message}
            label={translate(
              addUpdateCounterForm?.mobile.label.bn,
              addUpdateCounterForm.mobile.label.en
            )}
          >
            <Input
              id="mobile"
              {...register("mobile")}
              type="tel"
              placeholder={translate(
                addUpdateCounterForm.mobile.placeholder.bn,
                addUpdateCounterForm.mobile.placeholder.en
              )}
            />
          </InputWrapper>
          {/* FAX */}
          <InputWrapper
            labelFor="fax"
            error={errors?.fax?.message}
            label={translate(
              addUpdateCounterForm?.fax.label.bn,
              addUpdateCounterForm.fax.label.en
            )}
          >
            <Input
              id="fax"
              {...register("fax")}
              type="text"
              placeholder={translate(
                addUpdateCounterForm.fax.placeholder.bn,
                addUpdateCounterForm.fax.placeholder.en
              )}
            />
          </InputWrapper>
          {/* EMAIL */}
          <InputWrapper
            labelFor="email"
            error={errors?.email?.message}
            label={translate(
              addUpdateCounterForm?.email.label.bn,
              addUpdateCounterForm.email.label.en
            )}
          >
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder={translate(
                addUpdateCounterForm.email.placeholder.bn,
                addUpdateCounterForm.email.placeholder.en
              )}
            />
          </InputWrapper>
          {/* PRIMARY CONTACT PERSON NAME */}
          <InputWrapper
            labelFor="primaryContactPersonName"
            error={errors?.primaryContactPersonName?.message}
            label={translate(
              addUpdateCounterForm?.primaryContactPersonName.label.bn,
              addUpdateCounterForm.primaryContactPersonName.label.en
            )}
          >
            <Input
              {...register("primaryContactPersonName")}
              id="primaryContactPersonName"
              type="text"
              placeholder={translate(
                addUpdateCounterForm.primaryContactPersonName.placeholder.bn,
                addUpdateCounterForm.primaryContactPersonName.placeholder.en
              )}
            />
          </InputWrapper>
          {/* COUNTRY */}
          <InputWrapper
            labelFor="country"
            error={errors?.country?.message}
            label={translate(
              addUpdateCounterForm?.country.label.bn,
              addUpdateCounterForm.country.label.en
            )}
          >
            <Input
              {...register("country")}
              id="country"
              type="text"
              placeholder={translate(
                addUpdateCounterForm.country.placeholder.bn,
                addUpdateCounterForm.country.placeholder.en
              )}
            />
          </InputWrapper>
          {/* STATION */}
          <InputWrapper
            labelFor="stationId"
            error={errors?.stationId?.message}
            label={translate(
              addUpdateCounterForm?.stationId.label.bn,
              addUpdateCounterForm.stationId.label.en
            )}
          >
            <Select
              value={watch("stationId")?.toString() || ""} // Convert to string for display
              onValueChange={(value: string) => {
                setValue("stationId", Number(value)); // Parse the value to number on selection
                setError("stationId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="stationId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.stationId.placeholder.bn,
                    addUpdateCounterForm.stationId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.length > 0 &&
                  stationsData.data.map((singleStation: any) => (
                    <SelectItem
                      key={singleStation.id}
                      value={singleStation.id.toString()}
                    >
                      {singleStation.name}
                    </SelectItem>
                  ))}

                {stationsLoading && !stationsData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* STATUS */}
          <InputWrapper
            labelFor="status"
            error={errors?.status?.message}
            label={translate(
              addUpdateCounterForm?.status.label.bn,
              addUpdateCounterForm.status.label.en
            )}
          >
            <Select
              value={watch("status") ? "Activated" : "Deactivated"}
              onValueChange={(value: "Activated" | "Deactivated") => {
                setValue(
                  "status",
                  value?.toLowerCase() === "activated" ? true : false
                );
                setError("status", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.status.placeholder.bn,
                    addUpdateCounterForm.status.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activated">
                  {translate("সক্রিয়", "Activated")}
                </SelectItem>
                <SelectItem value="Deactivated">
                  {translate("নিষ্ক্রিয়", "Deactivate")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* BOOKING ALLOW STATUS */}
          <InputWrapper
            labelFor="bookingAllowStatus"
            error={errors?.bookingAllowStatus?.message}
            label={translate(
              addUpdateCounterForm?.bookingAllowStatus.label.bn,
              addUpdateCounterForm.bookingAllowStatus.label.en
            )}
          >
            <Select
              value={watch("bookingAllowStatus") || ""}
              onValueChange={(value: "Coach_Wish" | "Route_Wish" | "Total") => {
                setValue("bookingAllowStatus", value);
                setError("bookingAllowStatus", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="bookingAllowStatus" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.bookingAllowStatus.placeholder.bn,
                    addUpdateCounterForm.bookingAllowStatus.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Coach_Wish">
                  {translate("কোচের দ্বারা", "By Coach")}
                </SelectItem>
                <SelectItem value="Route_Wish">
                  {translate("রুটের দ্বারা", "Route Wish")}
                </SelectItem>
                <SelectItem value="Total">
                  {translate("সর্বমোট", "Total")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* BOOKING ALLOW CLASS */}
          <InputWrapper
            error={errors?.bookingAllowClass?.message}
            labelFor="bookingAllowClass"
            label={translate(
              addUpdateCounterForm?.bookingAllowClass.label.bn,
              addUpdateCounterForm.bookingAllowClass.label.en
            )}
          >
            <Select
              value={watch("bookingAllowClass") || ""}
              onValueChange={(
                value: "B_Class" | "E_Class" | "Revolving" | "Sleeper"
              ) => {
                setValue("bookingAllowClass", value);
                setError("bookingAllowClass", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="bookingAllowClass" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.bookingAllowClass.placeholder.bn,
                    addUpdateCounterForm.bookingAllowClass.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B_Class">
                  {translate("বি ক্লাস", "B Class")}
                </SelectItem>
                <SelectItem value="E_Class">
                  {translate("ই ক্লাস", "E Class")}
                </SelectItem>
                <SelectItem value="Revolving">
                  {translate("রিভলভিং", "Revolving")}
                </SelectItem>
                <SelectItem value="Sleeper">
                  {translate("স্লীপার", "Sleeper")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ZONE */}
          <InputWrapper
            error={errors?.zone?.message}
            labelFor="zone"
            label={translate(
              addUpdateCounterForm?.zone.label.bn,
              addUpdateCounterForm.zone.label.en
            )}
          >
            <Input
              {...register("zone")}
              type="text"
              placeholder={translate(
                addUpdateCounterForm.zone.placeholder.bn,
                addUpdateCounterForm.zone.placeholder.en
              )}
            />
          </InputWrapper>

          {/* SMS SENDING PERMISSION */}
          <InputWrapper
            error={errors?.isSmsSend?.message}
            labelFor="isSmsSend"
            label={translate(
              addUpdateCounterForm?.isSmsSend.label.bn,
              addUpdateCounterForm.isSmsSend.label.en
            )}
          >
            <Select
              value={watch("isSmsSend") ? "Yes" : "No"}
              onValueChange={(value: "Yes" | "No") => {
                setValue(
                  "isSmsSend",
                  value?.toLowerCase() === "yes" ? true : false
                );
                setError("isSmsSend", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id=" isSmsSend" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCounterForm.isSmsSend.placeholder.bn,
                    addUpdateCounterForm.isSmsSend.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">{translate("হ্যাঁ", "Yes")}</SelectItem>
                <SelectItem value="No">{translate("না", "No")}</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
        </div>
        <Submit
          loading={updateCounterLoading}
          errors={updateCounterError}
          submitTitle={translate("কাউন্টার সম্পাদনা করুন", "Update Counter")}
          errorTitle={translate(
            "কাউন্টার সম্পাদনা করতে ত্রুটি",
            "Update Counter Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCounter;
