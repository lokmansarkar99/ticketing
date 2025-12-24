import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import { Paragraph } from "@/components/common/typography/Paragraph";
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
  addUpdateResurbSchema,
  ReservationDataProps,
} from "@/schemas/resurb/addUpdateResurbSchema";
import {
  useGetSingleReserveQuery,
  useUpdateReserveMutation,
} from "@/store/api/reserve/reserveApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import { addUpdateResurbForm } from "@/utils/constants/form/addUpdateResurbForm";
import { convertTimeStringToISO } from "@/utils/helpers/convertTimeStringToISO";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";


const coachClassOptions = [
  { label: "Economy Class", value: "E_Class" },
  { label: "Business Class", value: "B_Class" },
  { label: "Suit Class", value: "S_Class" },
  { label: "Sleeper Class", value: "Sleeper" },
] as const;

type CoachClassType = (typeof coachClassOptions)[number]["value"];

interface IUpdateReserveProps {
  id: number | null;
}
interface IUpdateReserveFormStateProps {
  calenderFromOpen: boolean;
  calenderToOpen: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  fromDateTime: Date | string | null;
  toDateTime: Date | null;
}

const UpdateReserve: FC<IUpdateReserveProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [updateReserveFormState, setUpdateReserveFormState] =
    useState<IUpdateReserveFormStateProps>({
      calenderFromOpen: false,
      calenderToOpen: false,
      fromDate: null,
      toDate: null,
      fromDateTime: null,
      toDateTime: null,
    });

  const [fromDateTime, setFromDateTime] = useState<Date | undefined>(
    new Date()
  );
  const [toDateTime, setToDateTime] = useState<Date | undefined>(new Date());
  const [dueAmount, setDueAmount] = useState<number>(0);
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;

  const { data: vehiclesData, isLoading: vehiclesLoading } =
    useGetVehiclesQuery({});
  const { data: reserveData, isLoading: reserveLoading } =
    useGetSingleReserveQuery(id);

  const [
    updateReserve,
    { isLoading: updateReserveLoading, error: updateReserveError },
  ] = useUpdateReserveMutation();
  const { data: stations } = useGetStationsQuery({
      size: 999999,
      page: 1,
    });

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservationDataProps>({
    resolver: zodResolver(addUpdateResurbSchema),
  });

  useEffect(() => {
    if (reserveData?.data?.fromDateTime) {
      const fromDateTime = convertTimeStringToISO(
        reserveData.data.fromDateTime
      );
      const toDateTime = convertTimeStringToISO(reserveData.data.toDateTime);
      if (fromDateTime && toDateTime) {
        setFromDateTime(fromDateTime);
        setToDateTime(toDateTime);
      } else {
        console.error("Invalid time format received from backend.");
      }
    }
  }, [reserveData]);
  useEffect(() => {
    if (reserveData?.data) {
      setValue("registrationNo", reserveData?.data?.registrationNo || "");
      setValue("routeId", reserveData.data.routeId || "");
      setValue("noOfSeat", reserveData.data.noOfSeat || "");
      setValue("passengerName", reserveData.data.passengerName || "");
      setValue("contactNo", reserveData.data.contactNo || "");
      setValue("address", reserveData.data.address || "");
      setValue("amount", reserveData.data.amount || 0);
      setValue("paidAmount", reserveData.data.paidAmount || 0);
      setValue("remarks", reserveData.data.remarks || "");
      setValue("fromDate", reserveData.data.fromDate || "");
      setValue("toDate", reserveData.data.toDate || "");
      setValue("isConfirm", reserveData?.data?.isConfirm || false);
      setValue("coachClass", reserveData?.data?.coachClass || "");
      setValue("fromStationId", reserveData?.data?.fromStationId || "")
      setValue("destinationStationId", reserveData?.data?.destinationStationId || "")

      // setUpdateReserveFormState((prevState: IUpdateReserveFormStateProps) => ({
      //   ...prevState,
      //   fromDate: reserveData.data.fromDate
      //     ? new Date(reserveData.data.fromDate)
      //     : null,
      //   toDate: reserveData.data.toDate
      //     ? new Date(reserveData.data.toDate)
      //     : null,
      // }));
      // if (fromDateTime && toDateTime) {
      //   setValue(
      //     "fromDateTime",
      //     fromDateTime.toLocaleTimeString([], {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     })
      //   );
      //   setValue(
      //     "toDateTime",
      //     toDateTime.toLocaleTimeString([], {
      //       hour: "2-digit",
      //       minute: "2-digit",
      //     })
      //   );
      // }
    }
  }, [fromDateTime, reserveData, setValue, toDateTime]);
  const totalAmount = watch("amount");
  const paidAmount = watch("paidAmount");

  useEffect(() => {
    if (totalAmount && paidAmount) {
      setDueAmount(totalAmount - paidAmount);
    }
  }, [paidAmount, totalAmount]);

  const onSubmit = async (data: ReservationDataProps) => {
    const withoutRemarks = {
      ...data,
      amount: data.amount,
      fromDate: updateReserveFormState?.fromDate?.toISOString(), // Convert Date object to string if necessary
      toDate: updateReserveFormState?.toDate?.toISOString(),
      paidAmount: data?.paidAmount,
      dueAmount: (data.amount ?? 0) - (data?.paidAmount ?? 0),
    };
    const updateData = removeFalsyProperties(withoutRemarks, ["remarks", "dueAmount", "paidAmount", "amount"]);

    const result = await updateReserve({ id, updateData });
    if (result?.data?.success) {
      toast({
        title: translate(
          "রিজার্ভ যোগ করার বার্তা",
          "Message for adding reserve"
        ),
        description: toastMessage("add", translate("রিজার্ভ", "Reserve")),
      });
    }
  };

  if (reserveLoading) {
    return <TableSkeleton columns={6} />;
  }

  return (
    <FormWrapper
      heading={translate("রিজার্ভ হালনাগাত করুন", "Update Reserve")}
      subHeading={translate(
        "সিস্টেমে নতুন রিজার্ভ হালনাগাত করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new reserve to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <div>
            <Paragraph size={"md"}>
              <span className="text-base font-bold pr-2">Total Amount:</span>
              {totalAmount || 0}
            </Paragraph>
          </div>

          <div>
            <Paragraph size={"md"}>
              <span className="text-base font-bold pr-2">Paid Amount:</span>
              {paidAmount || 0}
            </Paragraph>
          </div>
          <div>
            <Paragraph size={"md"}>
              <span className="text-base font-bold pr-2">Due Amount:</span>
              {dueAmount}
            </Paragraph>
          </div>
          {/* PASSANGER NAME */}
          <InputWrapper
            labelFor="passengerName"
            error={errors.passengerName?.message}
            label={translate(
              addUpdateResurbForm?.passengerName.label.bn,
              addUpdateResurbForm.passengerName.label.en
            )}
          >
            <Input
              defaultValue={reserveData?.data?.passengerName}
              id="passengerName"
              type="text"
              {...register("passengerName")}
              placeholder={translate(
                addUpdateResurbForm.passengerName.placeholder.bn,
                addUpdateResurbForm.passengerName.placeholder.en
              )}
            />
          </InputWrapper>
          {/* CONTACT NUMBER */}
          <InputWrapper
            error={errors?.contactNo?.message}
            labelFor="contact_number"
            label={translate(
              addUpdateResurbForm?.contactNo.label.bn,
              addUpdateResurbForm.contactNo.label.en
            )}
          >
            <Input
              defaultValue={reserveData?.contactNo || ""}
              {...register("contactNo")}
              id="contact_number"
              type="tel"
              placeholder={translate(
                addUpdateResurbForm.contactNo.placeholder.bn,
                addUpdateResurbForm.contactNo.placeholder.en
              )}
            />
          </InputWrapper>
          {/* Address Field */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm.address.label.bn,
              addUpdateResurbForm.address.label.en
            )}
            labelFor="address"
            error={errors.address?.message}
          >
            <Input
              defaultValue={reserveData?.address || ""}
              {...register("address")}
              placeholder={translate(
                addUpdateResurbForm.address.placeholder.bn,
                addUpdateResurbForm.address.placeholder.en
              )}
            />
          </InputWrapper>
          {/* Registration NUMBER */}
          <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              addUpdateResurbForm?.registrationNo.label.bn,
              addUpdateResurbForm?.registrationNo.label.en
            )}
          >
            <Select
              value={watch("registrationNo") || ""}
              onValueChange={(value: string) => {
                setValue("registrationNo", value);
                setError("registrationNo", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="registrationNo" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.registrationNo.placeholder.bn,
                    addUpdateResurbForm.registrationNo.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!vehiclesLoading &&
                  vehiclesData?.data?.length > 0 &&
                  vehiclesData.data.map((coach: any, index: number) => (
                    <SelectItem
                      key={index}
                      value={coach.registrationNo?.toString()} // Use registrationNo as the value
                    >
                      {formatter({
                        type: "words",
                        words: coach.registrationNo,
                      })}
                    </SelectItem>
                  ))}

                {vehiclesLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ROUTE */}
          <InputWrapper
            error={errors?.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateResurbForm?.routeId.label.bn,
              addUpdateResurbForm.routeId.label.en
            )}
          >
            <Select
              value={watch("routeId")?.toString()}
              onValueChange={(value: string) => {
                setValue("routeId", +value);
                setError("routeId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.routeId.placeholder.bn,
                    addUpdateResurbForm.routeId.placeholder.en
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
                        value={singleRoute?.id?.toString()}
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
            error={errors.coachClass?.message}
            labelFor="coachClass"
            label={translate(
              addUpdateResurbForm?.coachClass?.label?.bn,
              addUpdateResurbForm?.coachClass?.label?.en
            )}
          >
            <Select
              value={watch("coachClass") || ""}
              onValueChange={(value) => {
                setValue("coachClass", value as CoachClassType);
                setError("coachClass", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachClass" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm?.coachClass?.placeholder?.bn,
                    addUpdateResurbForm?.coachClass?.placeholder?.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {coachClassOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* NUMBER OF SEATS */}
          <InputWrapper
            labelFor="noOfSeat"
            error={errors?.noOfSeat?.message}
            label={translate(
              addUpdateResurbForm.noOfSeat.label.bn,
              addUpdateResurbForm.noOfSeat.label.en
            )}
          >
            <Select
              value={watch("noOfSeat")?.toString() || ""}
              onValueChange={(value) => {
                setValue("noOfSeat", parseInt(value));
                setError("noOfSeat", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm.noOfSeat.placeholder.bn,
                    addUpdateResurbForm.noOfSeat.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {/* Options for 28, 30, 41, and 43 */}

                <SelectItem value="28">Ac Business Class (28 seats)</SelectItem>
                <SelectItem value="30">Sleeper Coach (30 Seats)</SelectItem>
                <SelectItem value="41">Ac Economy Class (41 Seats)</SelectItem>
                <SelectItem value="43">Suite Class (43 Seats)</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          <InputWrapper
            error={errors.fromStationId?.message}
            labelFor="coachClass"
            label={translate(
              addUpdateResurbForm?.fromStationId?.label?.bn,
              addUpdateResurbForm?.fromStationId?.label?.en
            )}
          >
            <Select
             value={watch("fromStationId")?.toString()}
              onValueChange={(value) => {
                setValue("fromStationId", +value);
                setError("fromStationId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="fromStationId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm?.fromStationId?.placeholder?.bn,
                    addUpdateResurbForm?.fromStationId?.placeholder?.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {stations?.data?.length>0 && stations?.data.map((option:any) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>
          <InputWrapper
            error={errors.destinationStationId?.message}
            labelFor="coachClass"
            label={translate(
              addUpdateResurbForm?.destinationStationId?.label?.bn,
              addUpdateResurbForm?.destinationStationId?.label?.en
            )}
          >
            <Select
             value={watch("destinationStationId")?.toString()}
              onValueChange={(value) => {
                setValue("destinationStationId", +value);
                setError("destinationStationId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="destinationStationId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateResurbForm?.destinationStationId?.placeholder?.bn,
                    addUpdateResurbForm?.destinationStationId?.placeholder?.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {stations?.data?.length>0 && stations?.data.map((option:any) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* FROM DATE */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm?.fromDate.label.bn,
              addUpdateResurbForm.fromDate.label.en
            )}
          >
            <Popover
              open={updateReserveFormState.calenderFromOpen}
              onOpenChange={(open) =>
                setUpdateReserveFormState(
                  (prevState: IUpdateReserveFormStateProps) => ({
                    ...prevState,
                    calenderFromOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                    !updateReserveFormState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateReserveFormState.fromDate ? (
                    format(updateReserveFormState.fromDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        "রিজার্ভ তারিখ নির্বাচন করুন",
                        "Pick The Reserve From Date"
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  // captionLayout="dropdown-buttons"
                  selected={updateReserveFormState?.fromDate || new Date()}
                  onSelect={(date) => {
                    const formattedDate = date ? date.toISOString() : "";
                    setValue("fromDate", formattedDate);
                    setError("fromDate", { type: "custom", message: "" });
                    setUpdateReserveFormState(
                      (prevState: IUpdateReserveFormStateProps) => ({
                        ...prevState,
                        calenderFromOpen: false,
                        fromDate: date || null,
                      })
                    );
                  }}
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* TO DATE */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm?.toDate.label.bn,
              addUpdateResurbForm.toDate.label.en
            )}
          >
            <Popover
              open={updateReserveFormState.calenderToOpen}
              onOpenChange={(open) =>
                setUpdateReserveFormState(
                  (prevState: IUpdateReserveFormStateProps) => ({
                    ...prevState,
                    calenderToOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[240.16px] text-muted-foreground hover:bg-background text-sm h-9",
                    !updateReserveFormState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateReserveFormState.toDate ? (
                    format(updateReserveFormState.toDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        "রিজার্ভ তারিখ নির্বাচন করুন",
                        "Pick The Reserve To Date"
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  mode="single"
                  // captionLayout="dropdown-buttons"
                  selected={updateReserveFormState?.toDate || new Date()}
                  onSelect={(date) => {
                    const formattedDate = date ? date.toISOString() : "";
                    setValue("toDate", formattedDate);
                    setError("toDate", { type: "custom", message: "" });
                    setUpdateReserveFormState(
                      (prevState: IUpdateReserveFormStateProps) => ({
                        ...prevState,
                        calenderToOpen: false,
                        toDate: date || null,
                      })
                    );
                  }}
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  captionLayout="dropdown-buttons"
                />
              </PopoverContent>
            </Popover>
          </InputWrapper>

          {/* REMARKS */}
          <InputWrapper
            label={translate(
              addUpdateResurbForm.remarks.label.bn,
              addUpdateResurbForm.remarks.label.en
            )}
            labelFor="remarks"
            error={errors.remarks?.message}
          >
            <Input
              defaultValue={reserveData?.data?.remarks || ""}
              {...register("remarks")}
              placeholder={translate(
                addUpdateResurbForm.remarks.placeholder.bn,
                addUpdateResurbForm.remarks.placeholder.en
              )}
            />
          </InputWrapper>

          {/* Amount */}
          <InputWrapper
            error={errors?.amount?.message}
            label={translate(
              addUpdateResurbForm.amount.label.bn,
              addUpdateResurbForm.amount.label.en
            )}
            labelFor="amount"
          >
            <Input
              defaultValue={reserveData?.data?.amount || ""}
              id="amount"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("amount", inputValue);
                if (inputValue) {
                  setError("amount", { type: "custom", message: "" });
                } else {
                  setError("amount", {
                    type: "custom",
                    message: "Amount is required",
                  });
                }
              }}
              placeholder={translate(
                addUpdateResurbForm.amount.placeholder.bn,
                addUpdateResurbForm.amount.placeholder.en
              )}
            />
          </InputWrapper>

          {/* Paid Amount */}
          <InputWrapper
            error={errors?.paidAmount?.message}
            label={translate(
              addUpdateResurbForm.paidAmount.label.bn,
              addUpdateResurbForm.paidAmount.label.en
            )}
            labelFor="paidAmount"
          >
            <Input
              defaultValue={reserveData?.data?.paidAmount || ""}
              id="paidAmount"
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const inputValue = +e.target.value;
                setValue("paidAmount", inputValue);
                if (inputValue) {
                  setError("paidAmount", { type: "custom", message: "" });
                } else {
                  setError("paidAmount", {
                    type: "custom",
                    message: "Paid amount is required",
                  });
                }
              }}
              placeholder={translate(
                addUpdateResurbForm.paidAmount.placeholder.bn,
                addUpdateResurbForm.paidAmount.placeholder.en
              )}
            />
          </InputWrapper>
          <div className="flex items-center gap-2 mt-2">
            <input
              defaultValue={reserveData?.data?.isConfirm || false}
              type="checkbox"
              id="isConfirm"
              onChange={(e) => setValue("isConfirm", e.target.checked)}
              className="w-6 h-6"
            />
            <label htmlFor="isConfirm" className="text-sm">
              {translate("নিশ্চিত?", "Confirm?")}
            </label>
          </div>

          {/*  FROM DATE TIME */}
          {/* <InputWrapper
            error={errors?.fromDateTime?.message}
            labelFor="time"
            label={translate(
              addUpdateResurbForm?.fromDateTime.label.bn,
              addUpdateResurbForm.fromDateTime.label.en
            )}
          >
            <TimePicker date={fromDateTime} setDate={setFromDateTime} />
            <div className="mt-3">
              {translate("নির্বাচিত সময়সূচীঃ ", " Selected Time: ")}
              {
                //@ts-ignore
                fromDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            </div>
          </InputWrapper> */}
          {/*  TO DATE TIME */}
          {/* <InputWrapper
            error={errors?.toDateTime?.message}
            labelFor="time"
            label={translate(
              addUpdateResurbForm?.toDateTime.label.bn,
              addUpdateResurbForm.toDateTime.label.en
            )}
          >
            <TimePicker
              date={toDateTime}
              setDate={(date) => {
                setToDateTime(date);
                setValue("toDateTime", date ? date.toISOString() : "");
              }}
            />
            <div className="mt-3">
              {translate("নির্বাচিত সময়সূচীঃ ", " Selected Time: ")}
              {
                //@ts-ignore
                toDateTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            </div>
          </InputWrapper> */}
        </div>
        <Submit
          loading={updateReserveLoading}
          errors={updateReserveError}
          submitTitle={translate("রিজার্ভ যোগ করুন", "Update Reserve")}
          errorTitle={translate(
            "রিজার্ভ যোগ করতে ত্রুটি",
            "Update Reserve Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateReserve;
