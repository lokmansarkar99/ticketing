import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
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
  AddUpdateCoachDataProps,
  addUpdateCoachSchema,
} from "@/schemas/vehiclesSchedule/addUpdateCoachSchema";
import {
  useGetSingleCoachQuery,
  useUpdateCoachMutation,
} from "@/store/api/vehiclesSchedule/coachApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
import { useGetStationsQuery } from "@/store/api/vehiclesSchedule/stationApi";
import { addUpdateCoachForm } from "@/utils/constants/form/addUpdateCoachForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";

interface IUpdateCoachProps {
  id: number | null;
}

const UpdateCoach: FC<IUpdateCoachProps> = ({ id }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateCoachDataProps>({
    resolver: zodResolver(addUpdateCoachSchema),
  });

  const [selectedStations, setSelectedStations] = useState<any[]>([]);

  const { data: coachData, isLoading: coachLoading } = useGetSingleCoachQuery(id);

  const [updateCoach, { isLoading: updateCoachLoading, error: updateCoachError }] = useUpdateCoachMutation();

  const { data: schedulesData, isLoading: schedulesLoading } = useGetSchedulesQuery({});
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery({});
  const { data: stationsData, isLoading: stationsLoading } = useGetStationsQuery({});

  
  const routeId = watch("routeId");

  
useEffect(() => {
  if (coachData?.data) {
    const data = coachData.data;
    setValue("coachNo", data.coachNo);
    setValue("noOfSeat", data.noOfSeat);
    setValue("routeId", data.routeId);
    setValue("schedule", data.schedule);
    
    
    if (data?.CoachViaRoute && Array.isArray(data?.CoachViaRoute)) {
    
      setSelectedStations(data.CoachViaRoute.map((route: any) => ({
        ...route,
        id: route.stationId,
        name: route.station?.name || `Station ${route.stationId}`
      })));
      
      
      setValue("routes", data.CoachViaRoute.map((route: any) => ({
        stationId: route.stationId,
        isBoardingPoint: route.isBoardingPoint || false,
        isDroppingPoint: route.isDroppingPoint || false,
        schedule: route.schedule || "",
        active: route.active !== false 
      })));
      
    }
  }
}, [coachData, setValue]);


  // Handle route selection change
useEffect(() => {
  if (routeId && routesData?.data) {
    const selectedRoute = routesData.data.find((r: any) => r.id === +routeId);
    
    if (selectedRoute) {
      // Only initialize if we don't already have stations
      if (!selectedStations.length) {
        const stations = selectedRoute.viaRoute.map((via: any) => ({
          ...via.station,
          viaRouteId: via.id,
          schedule: via.schedule
        }));
        
        setSelectedStations(stations);
        
        // Initialize the routes form value
        setValue("routes", selectedRoute.viaRoute.map((via: any) => ({
          stationId: via.station.id.toString(),
          isBoardingPoint: false, 
          isDroppingPoint: false, 
          schedule: via.schedule || "",
          active: true
        })));
      }
    }
  }
}, [routeId, routesData, selectedStations.length, setValue]);


  // Add station to route
  const addStationToRoute = (stationId: string) => {
    const station = stationsData?.data?.find((s: any) => s.id === +stationId);
    if (station) {
      setSelectedStations((prev) => [...prev, station]);
      setValue("routes", [
        ...(watch("routes") || []),
        {
          stationId: station.id.toString(),
          isBoardingPoint: false,
          isDroppingPoint: false,
          schedule: "",
          active: true,
        },
      ]);
    }
  };


  // Remove station from route
  const removeStationFromRoute = (index: number) => {
    setSelectedStations((prev) => prev.filter((_, i) => i !== index));
    const updatedRoutes = [...(watch("routes") || [])];
    updatedRoutes.splice(index, 1);
    setValue("routes", updatedRoutes);
  };

  // Update route station properties
  const updateRouteStation = (index: number, field: string, value: any) => {
    const updatedRoutes = [...(watch("routes") || [])];
    updatedRoutes[index] = {
      ...updatedRoutes[index],
      [field]: value,
    };
    setValue("routes", updatedRoutes);
  };
  

  const onSubmit = async (data: AddUpdateCoachDataProps) => {
   
    const result = await updateCoach({ id, data });
    if (result?.data?.success) {
      toast({
        title: translate("কোচ সম্পাদনা করার বার্তা", "Message for updating coach"),
        description: toastMessage("update", translate("কোচ", "coach")),
      });
    }
  };

  if (coachLoading || routesLoading || stationsLoading) return <SelectSkeleton />;

  return (
    <FormWrapper
      heading={translate("কোচ সম্পাদনা করুন", "Update Coach")}
      subHeading={translate(
        "সিস্টেমে কোচ সম্পাদন করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update existing coach to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {/* COACH NUMBER */}
          <InputWrapper
            error={errors.coachNo?.message}
            labelFor="coachNo"
            label={translate(
              addUpdateCoachForm?.coachNo.label.bn,
              addUpdateCoachForm.coachNo.label.en
            )}
          >
            <Input
              id="coachNo"
              {...register("coachNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.coachNo.placeholder.bn,
                addUpdateCoachForm.coachNo.placeholder.en
              )}
            />
          </InputWrapper>

          {/* NUMBER OF SEATS */}
          <InputWrapper
            labelFor="noOfSeat"
            error={errors?.noOfSeat?.message}
            label={translate(
              addUpdateCoachForm.noOfSeat.label.bn,
              addUpdateCoachForm.noOfSeat.label.en
            )}
          >
            <Select
              value={watch("noOfSeat")?.toString() || ""}
              onValueChange={(value) => {
                setValue("noOfSeat", parseInt(value));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.noOfSeat.placeholder.bn,
                    addUpdateCoachForm.noOfSeat.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="28">Ac Business Class (28 seats)</SelectItem>
                <SelectItem value="30">Sleeper Coach (30 Seats)</SelectItem>
                <SelectItem value="41">Ac Economy Class (41 Seats)</SelectItem>
                <SelectItem value="43">Suite Class (43 Seats)</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* MAIN SCHEDULE */}
          <InputWrapper
            error={errors?.schedule?.message}
            label={`Schedule`}
            labelFor={`schedule`}
          >
            <Select
              value={watch(`schedule`)}
              onValueChange={(value: string) => {
                setValue(`schedule`, value);
              }}
            >
              <SelectTrigger id={`schedule`} className="w-full">
                <SelectValue placeholder="Select a schedule" />
              </SelectTrigger>
              <SelectContent>
                {!schedulesLoading &&
                  schedulesData?.data?.map((schedule: any, i: number) => (
                    <SelectItem key={i} value={schedule?.time}>
                      {schedule?.time}
                    </SelectItem>
                  ))}
                {schedulesLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ROUTE */}
          <InputWrapper
            error={errors?.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateCoachForm.routeId.label.bn,
              addUpdateCoachForm.routeId.label.en
            )}
          >
            <Select
              value={watch("routeId")?.toString()}
              onValueChange={(value: string) => {
                setValue("routeId", +value);
              }}
            >
              <SelectTrigger id="routeId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachForm.routeId.placeholder.bn,
                    addUpdateCoachForm.routeId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!routesLoading &&
                  routesData?.data?.map((route: any, idx: any) => (
                    <SelectItem key={idx} value={route.id.toString()}>
                      {route.routeName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </InputWrapper>

          {/* ADD STATION TO ROUTE */}
          <InputWrapper label="Add Station" labelFor="addStation">
            <Select
              onValueChange={(value: string) => addStationToRoute(value)}
              disabled={!routeId}
            >
              <SelectTrigger id="addStation" className="w-full">
                <SelectValue placeholder="Select a station" />
              </SelectTrigger>
              <SelectContent>
                {!stationsLoading &&
                  stationsData?.data?.map((station: any, i: number) => (
                    <SelectItem key={i} value={station.id.toString()}>
                      {station.name}
                    </SelectItem>
                  ))}
                {stationsLoading && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper>
        </div>

        {/* SELECTED STATIONS */}
        {selectedStations?.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium">Route Stations</h3>
            {selectedStations.map((station, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1 flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      id={`routes.${index}.active`}
                      checked={watch(`routes.${index}.active`)}
                      onChange={(e) =>
                        updateRouteStation(index, "active", e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                  </div>
                  <span>{station.name}</span>
                </div>
                <div className="flex-2">
                  <div className="flex items-center gap-1">
                    <label>Schedules</label>
                    <Select
                      value={watch(`routes.${index}.schedule`)}
                      onValueChange={(value: string) =>
                        updateRouteStation(index, "schedule", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {!schedulesLoading &&
                          schedulesData?.data?.map((s: any, i: number) => (
                            <SelectItem key={i} value={s.time}>
                              {s.time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="checkbox"
                    id={`routes.${index}.isBoardingPoint`}
                    checked={watch(`routes.${index}.isBoardingPoint`)}
                    onChange={(e) =>
                      updateRouteStation(
                        index,
                        "isBoardingPoint",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                  <label htmlFor="">Boarding Point</label>
                </div>

                <div className="flex-1 flex items-center gap-1">
                  <input
                    type="checkbox"
                    id={`routes.${index}.isDroppingPoint`}
                    checked={watch(`routes.${index}.isDroppingPoint`)}
                    onChange={(e) =>
                      updateRouteStation(
                        index,
                        "isDroppingPoint",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4"
                  />
                  <label htmlFor="">Dropping Point</label>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => removeStationFromRoute(index)}
                    className="ml-2 text-red-500 text-xl"
                  >
                    <RxCross2 className="text-red-600 text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Submit
          loading={updateCoachLoading}
          errors={updateCoachError}
          submitTitle={translate("কোচ সম্পাদনা করুন", "Update Coach")}
          errorTitle={translate("কোচ সম্পাদনা করতে ত্রুটি", "Update Coach Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdateCoach;