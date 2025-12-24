import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
import { useAddFareMutation } from "@/store/api/vehiclesSchedule/fareApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { addUpdateFareForm } from "@/utils/constants/form/addUpdateFareForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { IFareStateProps } from "./FareList";
import { buildPairs, Station } from "./buldFare";
import { useGetSeatPlansQuery } from "@/store/api/vehiclesSchedule/seatPlanApi";

interface IAddFareProps {
  setFareState: (
    driverState: (prevState: IFareStateProps) => IFareStateProps
  ) => void;
}

interface IAddFareFromStateProps {
  fromDate: Date | null;
  toDate: Date | null;
  fromDateCalendarOpen: boolean;
  toDateCalendarOpen: boolean;
}

interface FareRow {
  from: Station;
  to: Station;
  amount: number | "";
  e_class_amount: number | "";
  b_class_amount: number | "";
  sleeper_class_amount: number | "";
}

const AddFare: FC<IAddFareProps> = ({ setFareState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [addFareFormState, setAddFareFormState] =
    useState<IAddFareFromStateProps>({
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
      segmentFare: [
        {
          fromStationId: 0,
          toStationId: 0,
          amount: 0,
          sleeper_class_amount: 0,
          b_class_amount: 0,
          e_class_amount: 0,
        },
      ],
    },
  });

  const [addFare, { isLoading: addFareLoading, error: addFareError }] =
    useAddFareMutation();

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
    {}
  ) as any;
  const { data: seatPlans, isLoading:seatPlanLoading } = useGetSeatPlansQuery(
    {}
  ) as any;

  const [selectedPair, setSelectedPair] = useState<string>("");
  const [fares, setFares] = useState<FareRow[]>([]);


  const findRoute = routesData?.data?.find(
    (r: any) => r.id === watch("routeId")
  );

  const pairs = buildPairs(findRoute?.viaRoute || []);

  const handleAdd = () => {
    if (!selectedPair) return;
    const [fromIdStr, toIdStr] = selectedPair.split("-");
    const fromId = Number(fromIdStr);
    const toId = Number(toIdStr);

    const fromStation = findRoute?.viaRoute?.find(
      (v: any) => v.station.id === fromId
    )!.station;
    const toStation = findRoute?.viaRoute?.find(
      (v: any) => v.station.id === toId
    )!.station;

    // Prevent duplicate
    if (fares.some((f) => f.from.id === fromId && f.to.id === toId)) {
      setSelectedPair("");
      return;
    }

    setFares((prev) => [
      ...prev,
      { from: fromStation, to: toStation, amount: "", e_class_amount: "", b_class_amount:"", sleeper_class_amount:"" },
    ]);

    setSelectedPair("");
  };

  const handleFareChange = (
    index: number,
    field: "amount" | "e_class_amount" | "b_class_amount" | "sleeper_class_amount",
    value: string
  ) => {
    setFares((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value === "" ? "" : Number(value),
      } as FareRow;
      return next;
    });
  };

  const handleRemove = (index: number) => {
    setFares((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AddUpdateFareDataProps) => {
    const mappedSegmentFare = fares.map((fare) => ({
      
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
    const result = await addFare(updateData);

    if (result?.data?.success) {
      toast({
        title: translate("ভাড়া যোগ করার বার্তা", "Message for adding fare"),
        description: toastMessage("add", translate("ভাড়া", "fare")),
      });

      setFareState((prevState: IFareStateProps) => ({
        ...prevState,
        addFareOpen: false,
        faresList: [...prevState.faresList, result.data],
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("ভাড়া যোগ করুন", "Add Fare")}
      subHeading={translate(
        "সিস্টেমে নতুন ভাড়া যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new fare to the system."
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
                setValue("routeId", Number(value)); // convert back to number
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
            labelFor="route"
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
              open={addFareFormState.fromDateCalendarOpen}
              onOpenChange={(open) =>
                setAddFareFormState((prevState: IAddFareFromStateProps) => ({
                  ...prevState,
                  fromDateCalendarOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addFareFormState.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addFareFormState.fromDate ? (
                    format(addFareFormState.fromDate, "PPP")
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
                  selected={addFareFormState?.fromDate || new Date()}
                  onSelect={(date) => {
                    setValue("fromDate", date);
                    setError("fromDate", { type: "custom", message: "" });
                    setAddFareFormState(
                      (prevState: IAddFareFromStateProps) => ({
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
              open={addFareFormState.toDateCalendarOpen}
              onOpenChange={(open) =>
                setAddFareFormState((prevState: IAddFareFromStateProps) => ({
                  ...prevState,
                  toDateCalendarOpen: open,
                }))
              }
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm h-9",
                    !addFareFormState.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {addFareFormState.toDate ? (
                    format(addFareFormState.toDate, "PPP")
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
                  selected={addFareFormState?.toDate || new Date()}
                  onSelect={(date) => {
                    setValue("toDate", date);
                    setError("toDate", { type: "custom", message: "" });
                    setAddFareFormState(
                      (prevState: IAddFareFromStateProps) => ({
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
                <div className="w-52">Route</div>
                <div className="flex gap-3">
                  <p className="w-52 text-center">Fare</p>
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
                  <div className=" font-medium">
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
                        handleFareChange(index, "sleeper_class_amount", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="B-class Amount"
                      className="border px-2 py-1 rounded"
                      value={fare.b_class_amount}
                      onChange={(e) =>
                        handleFareChange(index, "b_class_amount", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="E-class Amount"
                      className="border px-2 py-1 rounded"
                      value={fare.e_class_amount}
                      onChange={(e) =>
                        handleFareChange(index, "e_class_amount", e.target.value)
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
          loading={addFareLoading}
          errors={addFareError}
          submitTitle={translate("ভাড়া যুক্ত করুন", "Add Fare")}
          errorTitle={translate("ভাড়া যোগ করতে ত্রুটি", "Add Fare Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddFare;
