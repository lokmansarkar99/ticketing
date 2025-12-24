import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  AddUpdateFareDataProps,
  addUpdateFareSchema,
} from "@/schemas/vehiclesSchedule/addUpdateFareSchema";
import {
  useGetSingleFareQuery,
  useUpdateFareMutation,
} from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSeatPlansQuery } from "@/store/api/vehiclesSchedule/seatPlanApi";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IFareStateProps } from "./FareList";
import { buildPairs, Station } from "./buldFare";

interface IUpdateFareProps {
  setFareState: (
    driverState: (prevState: IFareStateProps) => IFareStateProps
  ) => void;
  id: number | undefined;
}

interface IUpdateFareFromStateProps {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateCalendarOpen: boolean;
  toDateCalendarOpen: boolean;
}

interface FareRow {
  id?: number;
  from: Station;
  isActive: boolean;
  to: Station;
  amount: number | "";
  e_class_amount: number | "";
  b_class_amount: number | "";
  sleeper_class_amount: number | "";
}

const UpdateFare: FC<IUpdateFareProps> = ({ setFareState, id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [updateFareFormState, setUpdateFareFormState] =
    useState<IUpdateFareFromStateProps>({
      fromDate: null,
      toDate: null,
      fromDateCalendarOpen: false,
      toDateCalendarOpen: false,
    });

  const {
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<AddUpdateFareDataProps>({
    resolver: zodResolver(addUpdateFareSchema),
    defaultValues: {
      routeId: 0,
      type: "AC",
      seatPlanId: 0,
      fromDate: undefined,
      toDate: undefined,
      segmentFare: [],
    },
  });

  const [updateFare, { isLoading: updateFareLoading, error: updateFareError }] =
    useUpdateFareMutation();
  const { data: fareData, isLoading: fareLoading } = useGetSingleFareQuery(id);
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: seatPlans, isLoading: seatPlanLoading } = useGetSeatPlansQuery(
    {}
  ) as any;

  const [selectedPair, setSelectedPair] = useState<string>("");
  const [fares, setFares] = useState<FareRow[]>([]);

  const findRoute = routesData?.data?.find(
    (r: any) => r.id === watch("routeId")
  );
  const pairs = buildPairs(findRoute?.viaRoute || []);

  useEffect(() => {
    if (fareData?.data) {
      setValue("routeId", fareData.data.routeId);
      setValue("type", fareData.data.type);
      setValue("seatPlanId", fareData.data.seatPlanId);
      setValue(
        "fromDate",
        fareData.data.fromDate ? new Date(fareData.data.fromDate) : undefined
      );
      setValue(
        "toDate",
        fareData.data.toDate ? new Date(fareData.data.toDate) : undefined
      );
      setValue(
        "segmentFare",
        fareData.data.SegmentFare?.map((segment: any) => ({
          id: segment?.id || 0,
          isActive: segment?.isActive,
          fromStationId: segment.fromStationId,
          toStationId: segment.toStationId,
          amount: segment.amount || 0,
          e_class_amount: segment.e_class_amount || 0,
          b_class_amount: segment.b_class_amount || 0,
          sleeper_class_amount: segment.sleeper_class_amount || 0,
        })) || []
      );

      setUpdateFareFormState((prevState: IUpdateFareFromStateProps) => ({
        ...prevState,
        fromDate: fareData.data.fromDate
          ? new Date(fareData.data.fromDate)
          : null,
        toDate: fareData.data.toDate ? new Date(fareData.data.toDate) : null,
      }));

      const initialFares =
        fareData.data.SegmentFare?.map((segment: any) => {
          const fromStation = findRoute?.viaRoute?.find(
            (v: any) => v.station.id === segment.fromStationId
          )?.station || {
            id: segment.fromStationId,
            name: `Station ${segment.fromStationId}`,
          };
          const toStation = findRoute?.viaRoute?.find(
            (v: any) => v.station.id === segment.toStationId
          )?.station || {
            id: segment.toStationId,
            name: `Station ${segment.toStationId}`,
          };
          return {
            id: segment?.id || 0,
            isActive: segment?.isActive,
            from: fromStation,
            to: toStation,
            amount: segment.amount || "",
            e_class_amount: segment.e_class_amount || "",
            b_class_amount: segment.b_class_amount || "",
            sleeper_class_amount: segment.sleeper_class_amount || "",
          };
        }) || [];
      setFares(initialFares);
    }
  }, [fareData, setValue, findRoute]);

  const handleAdd = () => {
    if (!selectedPair) return;
    const [fromIdStr, toIdStr] = selectedPair.split("-");
    const fromId = Number(fromIdStr);
    const toId = Number(toIdStr);

    const fromStation = findRoute?.viaRoute?.find(
      (v: any) => v.station.id === fromId
    )?.station || { id: fromId, name: `Station ${fromId}` };
    const toStation = findRoute?.viaRoute?.find(
      (v: any) => v.station.id === toId
    )?.station || { id: toId, name: `Station ${toId}` };

    if (fares.some((f) => f.from.id === fromId && f.to.id === toId)) {
      setSelectedPair("");
      return;
    }

    setFares((prev) => [
      ...prev,
      {
        isActive: true,
        from: fromStation,
        to: toStation,
        amount: "",
        e_class_amount: "",
        b_class_amount: "",
        sleeper_class_amount: "",
      },
    ]);
    setSelectedPair("");
  };

 const handleFareChange = (
  index: number,
  field:
    | "amount"
    | "e_class_amount"
    | "b_class_amount"
    | "sleeper_class_amount"
    | "isActive"
    | "id",
  value: string | number | boolean
) => {
  setFares((prev) => {
    const next = [...prev];
    const current = next[index];

    next[index] = {
      ...current,
      [field]:
        typeof value === "boolean"
          ? value 
          : value === ""
          ? ""
          : Number(value), 
    } as FareRow;

    return next;
  });
};


  const handleRemove = (index: number) => {
    setFares((prev) => prev.filter((_, i) => i !== index));
  };
  
  const onSubmit = async (data: AddUpdateFareDataProps) => {
    const mappedSegmentFare = fares.map((fare) => ({
      id: fare?.id || 0,
      isActive: fare.isActive,
      fromStationId: fare.from.id,
      toStationId: fare.to.id,
      amount: Number(fare.amount) || 0,
      e_class_amount: Number(fare.e_class_amount) || 0,
      b_class_amount: Number(fare.b_class_amount) || 0,
      sleeper_class_amount: Number(fare.sleeper_class_amount) || 0,
    }));

    const update: AddUpdateFareDataProps = {
      ...data,
      segmentFare: mappedSegmentFare,
    };

    const updateData = removeFalsyProperties(update, ["fromDate", "toDate"]);
   
    const result = await updateFare({ data: updateData, id });

    if (result?.data?.success) {
      toast({
        title: translate(
          "ভাড়া সম্পাদনা করার বার্তা",
          "Message for updating fare"
        ),
        description: toastMessage("update", translate("ভাড়া", "fare")),
      });

      setFareState((prevState: IFareStateProps) => ({
        ...prevState,
        addFareOpen: false,
        faresList: prevState.faresList.map((fare) =>
          fare?.data?.id === id ? result.data : fare
        ),
      }));
    }
  };

  if (fareLoading) {
    return <FormSkeleton columns={2} inputs={6} />;
  }

  return (
    <FormWrapper
      heading={translate("ভাড়া সম্পাদনা করুন", "Update Fare")}
      subHeading={translate(
        "সিস্টেমে ভাড়া সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the existing fare to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper columns={4}>
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
                  seatPlans?.data?.map((singlePlan: any, planIndex: number) => (
                    <SelectItem
                      key={planIndex}
                      value={singlePlan?.id.toString()}
                    >
                      {singlePlan?.name}
                    </SelectItem>
                  ))}
                {seatPlanLoading && !seatPlans?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* COACH TYPE */}
          <InputWrapper
            labelFor="type"
            error={errors?.type?.message}
            label={translate(
              addUpdateFareForm?.type.label.bn,
              addUpdateFareForm.type.label.en
            )}
          >
            <Select
              value={watch("type") || ""}
              onValueChange={(value: "AC" | "NON AC") => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="routeType" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateFareForm.type.placeholder.bn,
                    addUpdateFareForm.type.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">
                  {translate("শীতাতপ নিয়ন্ত্রিত", "Air Condition")}
                </SelectItem>
                <SelectItem value="NON AC">
                  {translate(
                    "শীতাতপ নিয়ন্ত্রিত বিহীন",
                    "Without Air Condition"
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* STARTING DATE (FROM DATE) */}
          <InputWrapper
            error={errors?.fromDate?.message}
            labelFor="fromDate"
            label={translate(
              addUpdateFareForm.fromDate.label.bn,
              addUpdateFareForm.fromDate.label.en
            )}
          >
            <Popover
              open={updateFareFormState.fromDateCalendarOpen}
              onOpenChange={(open) =>
                setUpdateFareFormState(
                  (prevState: IUpdateFareFromStateProps) => ({
                    ...prevState,
                    fromDateCalendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateFareFormState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateFareFormState.fromDate ? (
                    format(updateFareFormState.fromDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateFareForm.fromDate.placeholder.bn,
                        addUpdateFareForm.fromDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  style={{ pointerEvents: "auto" }}
                  className="cursor-pointer"
                  mode="single"
                  selected={updateFareFormState?.fromDate || new Date()}
                  onSelect={(date) => {
                    setValue("fromDate", date);
                    setError("fromDate", { type: "custom", message: "" });
                    setUpdateFareFormState(
                      (prevState: IUpdateFareFromStateProps) => ({
                        ...prevState,
                        fromDate: date || new Date(),
                        fromDateCalendarOpen: false,
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

          {/* ENDING DATE (TO DATE) */}
          <InputWrapper
            error={errors?.toDate?.message}
            labelFor="toDate"
            label={translate(
              addUpdateFareForm.toDate.label.bn,
              addUpdateFareForm.toDate.label.en
            )}
          >
            <Popover
              open={updateFareFormState.toDateCalendarOpen}
              onOpenChange={(open) =>
                setUpdateFareFormState(
                  (prevState: IUpdateFareFromStateProps) => ({
                    ...prevState,
                    toDateCalendarOpen: open,
                  })
                )
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !updateFareFormState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {updateFareFormState.toDate ? (
                    format(updateFareFormState.toDate, "PPP")
                  ) : (
                    <span>
                      {translate(
                        addUpdateFareForm.toDate.placeholder.bn,
                        addUpdateFareForm.toDate.placeholder.en
                      )}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <Calendar
                  style={{ pointerEvents: "auto" }}
                  className="cursor-pointer"
                  mode="single"
                  selected={updateFareFormState?.toDate || new Date()}
                  onSelect={(date) => {
                    setValue("toDate", date);
                    setError("toDate", { type: "custom", message: "" });
                    setUpdateFareFormState(
                      (prevState: IUpdateFareFromStateProps) => ({
                        ...prevState,
                        toDate: date || new Date(),
                        toDateCalendarOpen: false,
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
        </GridWrapper>

        <>
          <h4 className="text-lg font-semibold mt-5 mb-2">
            {translate("সেগমেন্ট সমূহ", "District wise fare")}
          </h4>
          <div>
            {/* Dropdown + Add */}
            <div className="flex gap-3 items-center mb-6">
              <select
                className="border rounded-lg px-3 py-2 w-72"
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                <option value="">Select Route</option>
                {pairs?.map((pair, idx) => (
                  <option key={idx} value={`${pair.from.id}-${pair.to.id}`}>
                    {pair.from.name} → {pair.to.name}
                  </option>
                ))}
              </select>
              <button
                className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60"
                onClick={handleAdd}
                disabled={!selectedPair}
              >
                Add
              </button>
            </div>
          </div>
          <div className="py-4">
            {/* Added Routes */}
            <div>
              {/* Header Row */}
              <div className="flex justify-between items-center gap-4 p-3 bg-gray-100 font-medium">
                <div className="w-52">Status</div>
                <div className="w-52">Route</div>
                <div className="flex gap-3">
                  <p className="w-40 text-center">Fare</p>
                  <p className="w-52 text-center">Sleeper Fare</p>
                  <p className="w-52 text-center">B-class Fare</p>
                  <p className="w-52 text-center">E-class Fare</p>
                  <div className="w-16">Action</div>
                </div>
              </div>
              {/* Data Rows */}
              <div className="flex flex-col gap-3">
                {fares?.map((fare, index) => (
                  <div
                    key={`${fare.from.id}-${fare.to.id}`}
                    className="flex justify-between items-center gap-4 border rounded-lg p-3 bg-gray-50"
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="border px-2 py-1 rounded"
                        checked={fare.isActive}
                        onChange={(e) =>
                          handleFareChange(index, "isActive", e.target.checked)
                        }
                      />
                    </div>
                    <div className="font-medium">
                      {fare.from.name} → {fare.to.name}
                    </div>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Amount"
                        className="border px-2 py-1 rounded"
                        value={fare.amount}
                        onChange={(e) =>
                          handleFareChange(index, "amount", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Sleeper Amount"
                        className="border px-2 py-1 rounded"
                        value={fare.sleeper_class_amount}
                        onChange={(e) =>
                          handleFareChange(
                            index,
                            "sleeper_class_amount",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="B-class Amount"
                        className="border px-2 py-1 rounded"
                        value={fare.b_class_amount}
                        onChange={(e) =>
                          handleFareChange(
                            index,
                            "b_class_amount",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="number"
                        placeholder="E-class Amount"
                        className="border px-2 py-1 rounded"
                        value={fare.e_class_amount}
                        onChange={(e) =>
                          handleFareChange(
                            index,
                            "e_class_amount",
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-600 hover:underline w-20 text-center"
                        aria-label={`Remove ${fare.from.name} to ${fare.to.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>

        <Submit
          loading={updateFareLoading}
          errors={updateFareError}
          submitTitle={translate("ভাড়া সম্পাদনা করুন", "Update Fare")}
          errorTitle={translate(
            "ভাড়া সম্পাদনা করতে ত্রুটি",
            "Update Fare Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateFare;
