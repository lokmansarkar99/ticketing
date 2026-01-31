import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
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
  addUpdateCoachConfigurationSchema,
  IAddUpdateCoachConfigurationDataProps,
} from "@/schemas/vehiclesSchedule/addUpdateCoachConfigurationSchema";
import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import { useGetCounterByIdQuery } from "@/store/api/contact/counterApi";
import DragList from "./DragList";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { useGetSeatPlansQuery } from "@/store/api/vehiclesSchedule/seatPlanApi";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/common/typography/Label";
import {
  useUpdateCoachMutation,
  useGetSingleCoachQuery,
} from "@/store/api/vehiclesSchedule/coachApi";

interface IUpdateCoachConfigurationProps {
  id: number;
}

const UpdateCoachConfiguration: FC<IUpdateCoachConfigurationProps> = ({
  id,
}) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const coachClasses = [
    { value: "E_Class", bn: "ইকোনমি ক্লাস", en: "Economy Class" },
    { value: "B_Class", bn: "বিজনেস ক্লাস", en: "Business Class" },
    { value: "S_Class", bn: "সুইট ক্লাস", en: "Suite Class" },
    { value: "Sleeper", bn: "স্লিপার ক্লাস", en: "Sleeper Class" },
  ];

  const {
    register,
    setValue,
    setError,
    watch,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IAddUpdateCoachConfigurationDataProps>({
    resolver: zodResolver(addUpdateCoachConfigurationSchema),
    defaultValues: {
      coachNo: "",
      coachType: "AC",
      type: "Daily",
      active: true,
      routeId: undefined,
      fromCounterId: undefined,
      destinationCounterId: undefined,
      seatPlanId: undefined,
      schedule: "",
      coachClass: undefined,
      holdingTime: undefined,
      fareAllowed: undefined,
      vipTimeOut: undefined,
    },
  });

  const { data: coachData, isLoading: coachLoading } =
    useGetSingleCoachQuery(id);
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: seatPlans, isLoading: seatPlanLoading } = useGetSeatPlansQuery(
    {}
  ) as any;
  const { data: schedulesData, isLoading: schedulesLoading } =
    useGetSchedulesQuery({}) as any;

  const counterId = watch("routeId");
  const { data: counters, isLoading: counterLoading } = useGetCounterByIdQuery(
    counterId,
    {
      skip: !counterId,
    }
  ) as any;

  const [
    updateCoachConfiguration,
    {
      isLoading: updateCoachConfigurationLoading,
      error: updateCoachConfigurationError,
    },
  ] = useUpdateCoachMutation();

  const [selectedCounter, setSelectedCounter] = useState<string>("");
  const [allCounters, setAllCounters] = useState<any[]>([]);

  useEffect(() => {
    if (
      coachData?.data &&
      routesData?.data &&
      seatPlans?.data &&
      schedulesData?.data
    ) {
      const d = coachData.data;

      setValue("coachNo", d.coachNo || "");
      setValue("routeId", d.routeId || undefined);
      setValue("seatPlanId", d.seatPlanId || undefined);
      setValue("coachClass", d.coachClass || undefined);
      setValue("coachType", d.coachType || "AC");
      setValue("type", d.type || "");
      setValue("schedule", d.schedule || "");
      setValue("holdingTime", d.holdingTime || undefined);
      setValue("fareAllowed", d.fareAllowed || undefined);
      setValue("vipTimeOut", d.vipTimeOut || undefined);
      setValue("active", d.active ?? true);
    }
  }, [coachData, routesData, seatPlans, schedulesData, setValue]);

  useEffect(() => {
    if (!counters?.data || !coachData?.data) return;

    const d = coachData.data;
    const fromList = counters.data.fromCounter ?? [];
    const toList = counters.data.toCounter ?? [];

    const validFrom = fromList.find((c: any) => c.id === d.fromCounterId);
    const validTo = toList.find((c: any) => c.id === d.destinationCounterId);

    if (validFrom) setValue("fromCounterId", validFrom.id);
    if (validTo) setValue("destinationCounterId", validTo.id);
  }, [counters?.data, coachData?.data, setValue]);

  // fromCounterId
  useEffect(() => {
    const id = getValues("fromCounterId");
    const list = counters?.data?.fromCounter ?? [];
    if (id && !list.some((c: any) => c.id === id)) {
      setValue("fromCounterId", 0);
    }
  }, [counters?.data, getValues, setValue]);

  // destinationCounterId
  useEffect(() => {
    const id = getValues("destinationCounterId");
    const list = counters?.data?.toCounter ?? [];
    if (id && !list.some((c: any) => c.id === id)) {
      setValue("destinationCounterId", 0);
    }
  }, [counters?.data, getValues, setValue]);

  // Initialize allCounters with CoachViaRoute data
  useEffect(() => {
    if (coachData?.data) {
      const data = coachData.data;
      if (data.CoachViaRoute && data.CoachViaRoute.length > 0) {
        setAllCounters(
          data.CoachViaRoute.map((route: any) => ({
            counterId: route.counterId,
            name: route.counter?.name || "Unknown Counter",
            isBoardingPoint: route.isBoardingPoint,
            isDroppingPoint: route.isDroppingPoint,
            boardingTime: route.boardingTime || "",
            droppingTime: route.droppingTime || "",
            active: route.active,
            fixed:
              route.counterId === data.fromCounterId ||
              route.counterId === data.destinationCounterId,
          }))
        );
      } else {
        // Fallback if no CoachViaRoute data
        const fromId = watch("fromCounterId");
        const toId = watch("destinationCounterId");
        const selected = [
          ...(counters?.data?.fromCounter || []),
          ...(counters?.data?.toCounter || []),
          ...(counters?.data?.viaCounter || []),
        ];
        const fromCounter = selected.find((c: any) => c.id === Number(fromId));
        const toCounter = selected.find((c: any) => c.id === Number(toId));

        const countersList = [];
        if (fromCounter) {
          countersList.push({
            counterId: fromCounter.id,
            name: fromCounter.name || "From Counter",
            isBoardingPoint: true,
            isDroppingPoint: false,
            boardingTime: "",
            droppingTime: "",
            active: true,
            fixed: true,
          });
        }
        if (toCounter) {
          countersList.push({
            counterId: toCounter.id,
            name: toCounter.name || "Destination Counter",
            isBoardingPoint: false,
            isDroppingPoint: true,
            boardingTime: "",
            droppingTime: "",
            active: true,
            fixed: true,
          });
        }
        setAllCounters(countersList);
      }
    }
  }, [coachData?.data, counters?.data, watch]);

  // Update allCounters when fromCounterId or destinationCounterId changes
  useEffect(() => {
    const fromId = watch("fromCounterId");
    const toId = watch("destinationCounterId");

    if (fromId && toId && counters?.data) {
      const selected = [
        ...(counters?.data?.fromCounter || []),
        ...(counters?.data?.toCounter || []),
        ...(counters?.data?.viaCounter || []),
      ];

      setAllCounters((prev) => {
        const updated = prev.filter((c) => !c.fixed); // Keep only non-fixed counters (via counters)
        const fromCounter = selected.find((c: any) => c.id === Number(fromId));
        const toCounter = selected.find((c: any) => c.id === Number(toId));

        // Add fromCounter
        if (fromCounter) {
          updated.unshift({
            counterId: fromCounter.id,
            name: fromCounter.name,
            isBoardingPoint: true,
            isDroppingPoint: false,
            boardingTime:
              prev.find((c) => c.isBoardingPoint)?.boardingTime || "",
            droppingTime:
              prev.find((c) => c.isBoardingPoint)?.droppingTime || "",
            active: true,
            fixed: true,
          });
        }

        // Add destinationCounter
        if (toCounter) {
          updated.push({
            counterId: toCounter.id,
            name: toCounter.name,
            isBoardingPoint: false,
            isDroppingPoint: true,
            boardingTime:
              prev.find((c) => c.isDroppingPoint)?.boardingTime || "",
            droppingTime:
              prev.find((c) => c.isDroppingPoint)?.droppingTime || "",
            active: true,
            fixed: true,
          });
        }

        return updated;
      });
    }
  }, [watch("fromCounterId"), watch("destinationCounterId"), counters?.data]);

  // Handle add viaCounter manually
  const handleAdd = () => {
    if (!selectedCounter) return;

    const existing = allCounters.some(
      (c) => c.counterId === Number(selectedCounter)
    );
    if (existing) {
      toast({
        title: translate(
          "কাউন্টার নির্বাচনের ত্রুটি",
          "Counter Selection Error"
        ),
        description: translate(
          "এই কাউন্টারটি ইতিমধ্যে নির্বাচিত হয়েছে।",
          "This counter has already been selected."
        ),
        variant: "destructive",
      });
      return;
    }

    const counter = counters?.data?.viaCounter?.find(
      (c: any) => c.id === Number(selectedCounter)
    );

    if (counter) {
      setAllCounters((prev) => {
        const newVia = {
          counterId: counter.id,
          name: counter.name,
          isBoardingPoint: false,
          isDroppingPoint: false,
          boardingTime: "",
          droppingTime: "",
          active: true,
          fixed: false,
        };
        // Insert before the last element (destinationCounter)
        if (prev.length > 1) {
          return [
            ...prev.slice(0, prev.length - 1),
            newVia,
            prev[prev.length - 1],
          ];
        }
        return [...prev, newVia];
      });
    }
  };

  const onSubmit = async (data: IAddUpdateCoachConfigurationDataProps) => {
    const cleanedData = removeFalsyProperties(data, [
      "holdingTime",
      "note",
      "fareAllowed",
      "vipTimeOut",
    ]);

    const updateData = {
      ...cleanedData,
      routes: allCounters.map((c) => {
        const route: any = {
          counterId: c.counterId,
          isBoardingPoint: c.isBoardingPoint,
          isDroppingPoint: c.isDroppingPoint,
          active: c.active,
        };
        if (c.boardingTime) route.boardingTime = c.boardingTime;
        if (c.droppingTime) route.droppingTime = c.droppingTime;
        return route;
      }),
    };

    const result = await updateCoachConfiguration({ id, data: updateData });
    if (result?.data?.success) {
      toast({
        title: translate(
          "কোচ কনফিগারেইশন আপডেট করার বার্তা",
          "Message for updating coach configuration"
        ),
        description: toastMessage(
          "update",
          translate("কোচ কনফিগারেইশন", "coach configuration")
        ),
      });
    }
  };

  if (coachLoading) {
    return <div>Loading coach data...</div>;
  }

  return (
    <FormWrapper
      heading={translate(
        "কোচ কনফিগারেইশন সম্পাদনা করুন",
        "Update Coach Configuration"
      )}
      subHeading={translate(
        "নিচের বিস্তারিত পূরণ করে কোচ কনফিগারেইশন আপডেট করুন।",
        "Fill out the details below to update the coach configuration."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <GridWrapper columns={5}>
          {/* COACH NO */}
          <InputWrapper
            error={errors?.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachConfigurationForm?.coachNo.label.bn,
              addUpdateCoachConfigurationForm.coachNo.label.en
            )}
          >
            <Input
              id="coachNo"
              {...register("coachNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.coachNo.placeholder.bn,
                addUpdateCoachConfigurationForm.coachNo.placeholder.en
              )}
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
                setValue("fromCounterId", undefined as any);
                setValue("destinationCounterId", undefined as any);
                setValue("routeId", Number(value));

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

          {/* FROM STATION */}
          <InputWrapper
            labelFor="from"
            error={errors?.fromCounterId?.message}
            label={translate("", "From Counter")}
          >
            {/* FROM */}
            <Select
              value={
                watch("fromCounterId") ? watch("fromCounterId")!.toString() : ""
              }
              onValueChange={(v) => {
                setValue("fromCounterId", Number(v));
                setError("fromCounterId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="from" className="w-full">
                <SelectValue placeholder={translate("", "From counter")} />
              </SelectTrigger>
              <SelectContent>
                {!counterLoading &&
                  counters?.data?.fromCounter?.map((c: any, i: number) => (
                    <SelectItem key={i} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                {counterLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* DESTINATION STATION */}
          <InputWrapper
            labelFor="to"
            error={errors?.destinationCounterId?.message}
            label={translate("", "Destination Counter")}
          >
            <Select
              value={
                watch("destinationCounterId")
                  ? watch("destinationCounterId")!.toString()
                  : ""
              }
              onValueChange={(v) => {
                setValue("destinationCounterId", Number(v));
                setError("destinationCounterId", {
                  type: "custom",
                  message: "",
                });
              }}
            >
              <SelectTrigger id="to" className="w-full">
                <SelectValue
                  placeholder={translate("", "Destination counter")}
                />
              </SelectTrigger>
              <SelectContent>
                {!counterLoading &&
                  counters?.data?.toCounter?.map((c: any, i: number) => (
                    <SelectItem key={i} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                {counterLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* SEAT PLANS */}
          <InputWrapper
            labelFor="seatPlan"
            error={errors?.seatPlanId?.message}
            label={translate(
              addUpdateFareForm?.seatPlan.label.bn,
              addUpdateFareForm.seatPlan.label.en
            )}
          >
            <Select
              value={watch("seatPlanId")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("seatPlanId", Number(value));
                setError("seatPlanId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="seatPlan" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateFareForm.seatPlan.placeholder.bn,
                    addUpdateFareForm.seatPlan.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!seatPlanLoading &&
                  seatPlans?.data?.length > 0 &&
                  seatPlans?.data?.map(
                    (singleRoute: any, routeIndex: number) => (
                      <SelectItem
                        key={routeIndex}
                        value={singleRoute?.id.toString()}
                      >
                        {singleRoute?.name}
                      </SelectItem>
                    )
                  )}
                {seatPlanLoading && !seatPlans?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* COACH CLASS */}
          <InputWrapper
            error={errors?.coachClass?.message}
            labelFor="coachClass"
            label={translate(
              addUpdateCoachConfigurationForm?.coachClass.label.bn,
              addUpdateCoachConfigurationForm.coachClass.label.en
            )}
          >
            <Select
              value={watch("coachClass") || ""}
              onValueChange={(
                value: "E_Class" | "B_Class" | "S_Class" | "Sleeper"
              ) => {
                setValue("coachClass", value);
                setError("coachClass", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachClass" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.coachClass.placeholder.bn,
                    addUpdateCoachConfigurationForm.coachClass.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {coachClasses.map((coachClass, index) => (
                  <SelectItem key={index} value={coachClass.value}>
                    {translate(coachClass.bn, coachClass.en)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* COACH TYPE */}
          <InputWrapper
            error={errors?.coachType?.message}
            labelFor="coachType"
            label={translate(
              addUpdateCoachConfigurationForm?.coachType.label.bn,
              addUpdateCoachConfigurationForm.coachType.label.en
            )}
          >
            <Select
              value={watch("coachType") || "AC"}
              onValueChange={(value: "AC" | "Non AC") => {
                setValue("coachType", value);
                setError("coachType", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="coachType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.coachType.placeholder.bn,
                    addUpdateCoachConfigurationForm.coachType.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">
                  {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                </SelectItem>
                <SelectItem value="Non AC">
                  {translate(
                    "শীতাতপ নিয়ন্ত্রিত বিহীন",
                    "Without Air Condition"
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* TYPE */}
          <InputWrapper
            error={errors?.type?.message}
            labelFor="type"
            label={translate("", "Type")}
          >
            <Select
              value={watch("type") || "Daily"}
              onValueChange={(value: "Daily" | "Weekly") => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder={translate("", "Select type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">{translate("", "Daily")}</SelectItem>
                <SelectItem value="Weekly">
                  {translate("", "Weekly")}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ACTIVE */}
          <InputWrapper
            labelFor="active"
            error={errors?.active?.message}
            label={translate("", "Active")}
          >
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={watch("active")?.toString() || "true"}
              onValueChange={(value) => setValue("active", value === "true")}
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

          {/* SCHEDULE */}
          <InputWrapper
            error={errors?.schedule?.message}
            labelFor="schedule"
            label={translate(
              addUpdateCoachConfigurationForm?.schedule.label.bn,
              addUpdateCoachConfigurationForm.schedule.label.en
            )}
          >
            <Select
              value={watch("schedule") || ""}
              onValueChange={(value: string) => {
                setValue("schedule", value);
                setError("schedule", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="schedule" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.schedule.placeholder.bn,
                    addUpdateCoachConfigurationForm.schedule.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!schedulesLoading &&
                  schedulesData?.data?.length > 0 &&
                  schedulesData?.data?.map(
                    (singleSchedule: any, scheduleIndex: number) => (
                      <SelectItem
                        key={scheduleIndex}
                        value={singleSchedule?.time}
                      >
                        {singleSchedule?.time}
                      </SelectItem>
                    )
                  )}
                {schedulesLoading && !schedulesData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* HOLDING TIME */}
          <InputWrapper
            error={errors?.holdingTime?.message}
            labelFor="holdingTime"
            label={translate(
              addUpdateCoachConfigurationForm?.holdingTime.label.bn,
              addUpdateCoachConfigurationForm.holdingTime.label.en
            )}
          >
            <Input
              id="holdingTime"
              {...register("holdingTime")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.holdingTime.placeholder.bn,
                addUpdateCoachConfigurationForm.holdingTime.placeholder.en
              )}
            />
          </InputWrapper>

          {/* FARE ALLOWED */}
          <InputWrapper
            error={errors?.fareAllowed?.message}
            labelFor="fareAllowed"
            label={translate(
              addUpdateCoachConfigurationForm?.fareAllowed.label.bn,
              addUpdateCoachConfigurationForm.fareAllowed.label.en
            )}
          >
            <Input
              id="fareAllowed"
              {...register("fareAllowed")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.fareAllowed.placeholder.bn,
                addUpdateCoachConfigurationForm.fareAllowed.placeholder.en
              )}
            />
          </InputWrapper>

          {/* VIP TIME */}
          <InputWrapper
            error={errors?.vipTimeOut?.message}
            labelFor="vipTimeOut"
            label={translate(
              addUpdateCoachConfigurationForm?.vipTimeOut.label.bn,
              addUpdateCoachConfigurationForm.vipTimeOut.label.en
            )}
          >
            <Input
              id="vipTimeOut"
              {...register("vipTimeOut")}
              type="text"
              placeholder={translate(
                addUpdateCoachConfigurationForm.vipTimeOut.placeholder.bn,
                addUpdateCoachConfigurationForm.vipTimeOut.placeholder.en
              )}
            />
          </InputWrapper>
        </GridWrapper>

        <h4 className="text-lg font-semibold mt-5 mb-2">
          {translate("সেগমেন্ট সমূহ", "Select Via Counter")}
        </h4>
        <div>
          <div className="flex gap-3 items-center mb-6">
            <select
              className="border rounded-lg px-3 py-2 w-72"
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(e.target.value)}
            >
              <option value="">Select Counter</option>
              {counters?.data?.viaCounter?.map((pair: any, idx: any) => (
                <option key={idx} value={pair?.id?.toString()}>
                  {pair?.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60"
              onClick={handleAdd}
              disabled={!selectedCounter}
            >
              Add
            </button>
          </div>
        </div>
        <div className="py-4">
          <DragList routes={allCounters} setRoutes={setAllCounters} />
        </div>

        <Submit
          loading={updateCoachConfigurationLoading}
          errors={updateCoachConfigurationError}
          submitTitle={translate(
            "কোচ কনফিগারেইশন আপডেট করুন",
            "Update Coach Configuration"
          )}
          errorTitle={translate(
            "কোচ কনফিগারেইশন আপডেট করতে ত্রুটি",
            "Update Coach Configuration Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCoachConfiguration;
