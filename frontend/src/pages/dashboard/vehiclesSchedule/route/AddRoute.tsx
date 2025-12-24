import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import {
  ITagSelectDataProps,
  TagSelect,
} from "@/components/common/form/TagSelect";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
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
import { cn } from "@/lib/utils";
import { useAddRouteMutation } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { addUpdateRouteForm } from "@/utils/constants/form/addUpdateRouteForm";
import formatter from "@/utils/helpers/formatter";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IRouteStateProps } from "./RouteList";
// import { Minus, Plus } from "lucide-react";
import {
  AddRouteDataProps,
  addRouteSchema,
} from "@/schemas/vehiclesSchedule/addRouteSchema";
import RoutePreview from "./RoutePreview";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/common/typography/Label";

interface IAddRouteProps {
  setRouteState: (
    userState: (routeState: IRouteStateProps) => IRouteStateProps
  ) => void;
}

const AddRoute: FC<IAddRouteProps> = ({ setRouteState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const [tags, setTags] = useState<ITagSelectDataProps[]>([]);
  const [perKilo, setPerKilo] = useState("");

  const {
    setValue,
    setError,
    watch,
    handleSubmit,
    // control,
    register,
    formState: { errors },
  } = useForm<AddRouteDataProps>({
    resolver: zodResolver(addRouteSchema),
    defaultValues: {
      routeType: "Local",
      routeDirection: "Up_Way",
      isPassengerInfoRequired: false,
      kilo: 0,
    },
  });

  const [addRoute, { isLoading: addRouteLoading, error: addRouteError }] =
    useAddRouteMutation({});

  const { data: stationsData, isLoading: stationsLoading } =
    useGetStationsQuery({}) as any;

  useEffect(() => {
    const fromId = watch("from");
    const middleId = watch("middle");
    const toId = watch("to");

    setValue(
      "viaStations",
      [
        fromId,
        ...(tags?.map((singleTag: ITagSelectDataProps) => +singleTag.key) ||
          []),
        toId,
      ].filter(Boolean)
    );
    if (tags?.length > 0) {
      setError("viaStations", { type: "custom", message: "" });
    }

    const fromStation = formatter({
      type: "words",
      words: stationsData?.data?.find((s: any) => s?.id === fromId)?.name,
    });

    const middleStation = formatter({
      type: "words",
      words: stationsData?.data?.find((s: any) => s?.id === middleId)?.name,
    });

    const toStation = formatter({
      type: "words",
      words: stationsData?.data?.find((s: any) => s?.id === toId)?.name,
    });

    let routeName = fromStation;

    if (middleId) {
      routeName += " ➜ " + middleStation;
    }

    if (toId) {
      routeName += " ➜ " + toStation;
    }

    if (fromId && toId) {
      setValue("routeName", routeName);
    }
  }, [
    tags,
    setValue,
    setError,
    stationsData?.data,
    watch,
    watch("middle"),
    watch("to"),
    watch("from"),
  ]);

  // Auto-update trip kilo when per kilo changes
  useEffect(() => {
    if (perKilo) {
      const tripKilo = Number(perKilo) * 2;
      setValue("kilo", tripKilo);
    } else {
      setValue("kilo", 0);
    }
  }, [perKilo, setValue]);

  const onSubmit = async (data: AddRouteDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "routeType",
      "routeDirection",
      "kilo",
      "isPassengerInfoRequired",
      "via",
      "middle",
    ]);

    const result = await addRoute(updateData);
    if (result?.data?.success) {
      toast({
        title: translate("রুট যোগ করার বার্তা", "Message for adding route"),
        description: toastMessage("add", translate("রুট", "route")),
      });
      setRouteState((prevState: IRouteStateProps) => ({
        ...prevState,
        addRouteOpen: false,
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("রুট যোগ করুন", "Add Route")}
      subHeading={translate(
        "সিস্টেমে নতুন রুট যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new route to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <GridWrapper>
          {/* ROUTE TYPE */}
          <InputWrapper
            labelFor="routeType"
            error={errors?.routeType?.message}
            label={translate(
              addUpdateRouteForm?.routeType.label.bn,
              addUpdateRouteForm?.routeType.label.en
            )}
          >
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={watch("routeType") || "Local"}
              onValueChange={(value) =>
                setValue("routeType", value as "Local" | "International")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Local" id="r2" />
                <Label htmlFor="r2">Local</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="International" id="r3" />
                <Label htmlFor="r3">International</Label>
              </div>
            </RadioGroup>
          </InputWrapper>

          {/* ROUTE DIRECTION */}
          <InputWrapper
            labelFor="routeDirection"
            error={errors?.routeDirection?.message}
            label={translate(
              addUpdateRouteForm?.routeDirection.label.bn,
              addUpdateRouteForm?.routeDirection.label.en
            )}
          >
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={watch("routeDirection") || "Up_Way"}
              onValueChange={(value) =>
                setValue("routeDirection", value as "Up_Way" | "Down_Way")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Up_Way" id="r2" />
                <Label htmlFor="r4">Up Way</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Down_Way" id="r3" />
                <Label htmlFor="r5">Down Way</Label>
              </div>
            </RadioGroup>
          </InputWrapper>

          {/* IS PASSENGER INFO REQUIRED */}
          <InputWrapper
            labelFor="isPassengerInfoRequired"
            error={errors?.isPassengerInfoRequired?.message}
            label={translate(
              addUpdateRouteForm?.isPassengerInfoRequired.label.bn,
              addUpdateRouteForm?.isPassengerInfoRequired.label.en
            )}
          >
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={watch("isPassengerInfoRequired")?.toString() || "false"}
              onValueChange={(value) =>
                setValue("isPassengerInfoRequired", value === "true")
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="false"
                  id="isPassengerInfoRequired_false"
                />
                <Label htmlFor="isPassengerInfoRequired_false">No</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="true"
                  id="isPassengerInfoRequired_true"
                />
                <Label htmlFor="isPassengerInfoRequired_true">Yes</Label>
              </div>
            </RadioGroup>
          </InputWrapper>

          {/* KILOMETERS */}
          <InputWrapper
            labelFor="kilo"
            error={errors?.kilo?.message}
            label={translate(
              addUpdateRouteForm?.kilo.label.bn,
              addUpdateRouteForm?.kilo.label.en
            )}
          >
            <div className="flex items-center gap-2">
              {/* Editable per kilo */}
              <Input
                type="number"
                placeholder="Per Kilo"
                className="w-24 border rounded px-2 py-1"
                value={perKilo}
                onChange={(e) => setPerKilo(e.target.value)}
              />

              <span>* 2</span>

              {/* Trip kilo - auto filled, but registered */}
              <Input
                type="number"
                placeholder="Trip Kilo"
                className="w-28 border rounded px-2 py-1"
                {...register("kilo")}
                readOnly
              />
            </div>
          </InputWrapper>

          {/* FROM */}
          <InputWrapper
            labelFor="from"
            error={errors?.from?.message}
            label={translate(
              addUpdateRouteForm?.from.label.bn,
              addUpdateRouteForm?.from.label.en
            )}
          >
            <Select
              value={watch("from")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("from", +value);
                setError("from", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="from" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.from.placeholder.bn,
                    addUpdateRouteForm.from.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.length > 0 &&
                  stationsData?.data
                    ?.filter((target: any) => target.id !== watch("to"))
                    ?.map((singleStation: any, stationIndex: number) => (
                      <SelectItem
                        key={stationIndex}
                        value={singleStation?.id?.toString()}
                      >
                        {singleStation?.name}
                      </SelectItem>
                    ))}

                {stationsLoading && !stationsData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* TO */}
          <InputWrapper
            labelFor="to"
            error={errors?.to?.message}
            label={translate(
              addUpdateRouteForm?.to.label.bn,
              addUpdateRouteForm?.to.label.en
            )}
          >
            <Select
              value={watch("to")?.toString() || ""}
              onValueChange={(value: string) => {
                setValue("to", +value);
                setError("to", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="to" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateRouteForm.to.placeholder.bn,
                    addUpdateRouteForm.to.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.length > 0 &&
                  stationsData?.data
                    ?.filter(
                      (target: any) =>
                        target.id !== watch("from") &&
                        target.id !== watch("middle")
                    )
                    ?.map((singleStation: any, stationIndex: number) => (
                      <SelectItem
                        key={stationIndex}
                        value={singleStation?.id?.toString()}
                      >
                        {singleStation?.name}
                      </SelectItem>
                    ))}

                {stationsLoading && !stationsData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper>
          <InputWrapper
            labelFor="via"
            error={errors?.via?.message}
            label={translate(
              addUpdateRouteForm?.via.label.bn,
              addUpdateRouteForm.via.label.en
            )}
          >
            <Input
              {...register("via")}
              id="via"
              type="text"
              placeholder={translate(
                addUpdateRouteForm.via.placeholder.bn,
                addUpdateRouteForm.via.placeholder.en
              )}
            />
          </InputWrapper>
          {/* ROUTE NAME */}
          <InputWrapper
            labelFor="routeName"
            error={errors.routeName?.message}
            label={translate(
              addUpdateRouteForm?.routeName.label.bn,
              addUpdateRouteForm.routeName.label.en
            )}
          >
            <Input
              className="text-muted-foreground"
              readOnly
              id="routeName"
              type="text"
              value={watch("routeName") || ""}
              placeholder={translate(
                addUpdateRouteForm.routeName.placeholder.bn,
                addUpdateRouteForm.routeName.placeholder.en
              )}
            />
          </InputWrapper>

          {/* VIA STATIONS */}
          {watch("from") && watch("to") && (
            <InputWrapper
              className={cn(tags?.length > 0 && "col-span-3")}
              labelFor="viaStations"
              error={errors?.viaStations?.message}
              label={translate(
                addUpdateRouteForm?.viaStations.label.bn,
                addUpdateRouteForm.viaStations.label.en
              )}
            >
              <TagSelect
                data={stationsData?.data
                  ?.filter(
                    (station: any) =>
                      station.id !== watch("from") && station.id !== watch("to")
                  )
                  .map((station: any) => ({
                    key: station.id,
                    label: station.name,
                  }))}
                loading={stationsLoading}
                placeholder={translate(
                  addUpdateRouteForm?.viaStations.placeholder.bn,
                  addUpdateRouteForm.viaStations.placeholder.en
                )}
                tags={tags}
                className="sm:min-w-[450px]"
                setTags={(newTags) => {
                  setTags(newTags);
                }}
              />
            </InputWrapper>
          )}
        </GridWrapper>
        <div className="mx-1 mt-3">
          {watch("from") && watch("to") && (
            <RoutePreview
              from={
                stationsData?.data.find((s: any) => s.id === watch("from"))
                  ?.name
              }
              to={
                stationsData?.data.find((s: any) => s.id === watch("to"))?.name
              }
              viaStations={tags}
              setViaStations={setTags}
            />
          )}
        </div>

        <Submit
          loading={addRouteLoading}
          errors={addRouteError}
          submitTitle={translate("রুট যুক্ত করুন", "Add Route")}
          errorTitle={translate("রুট যোগ করতে ত্রুটি", "Add Route Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddRoute;
