// import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
// import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateCoachDataProps,
  addUpdateCoachSchema,
} from "@/schemas/vehiclesSchedule/addUpdateCoachSchema";
import { useAddCoachMutation } from "@/store/api/vehiclesSchedule/coachApi";
// import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
// import { useGetSchedulesQuery } from "@/store/api/vehiclesSchedule/scheduleApi";
// import { addUpdateCoachConfigurationForm } from "@/utils/constants/form/addUpdateCoachConfigurationForm";
// import { addUpdateCoachForm } from "@/utils/constants/form/addUpdateCoachForm";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ICoachStateProps } from "./CoachList";

interface IAddCoachProps {
  setCoachState: (
    userState: (prevState: ICoachStateProps) => ICoachStateProps
  ) => void;
}

const AddCoach: FC<IAddCoachProps> = ({ setCoachState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    // register,
    // setValue,
    // setError,
    // watch,
    handleSubmit,
    // formState: { errors },
  } = useForm<AddUpdateCoachDataProps>({
    resolver: zodResolver(addUpdateCoachSchema),
  });

  const [addCoach, { isLoading: addCoachLoading, error: addCoachError }] =
    useAddCoachMutation();
  // const { data: schedulesData, isLoading: schedulesLoading } =
  //   useGetSchedulesQuery({}) as any;

  // const { data: countersData, isLoading: countersLoading } =
  //   useGetCountersQuery({}) as any;

  // const { data: faresData, isLoading: faresLoading } = useGetFaresQuery(
  //   {}
  // ) as any;

  // const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery(
  //   {}
  // ) as any;

  // const routeId = watch("routeId");

  // const selectedRoute = routesData?.data?.find((r: any) => r.id === +routeId);
  // const segmentStations = selectedRoute?.viaRoute?.filter(
  //   (v: any) => v?.station?.isSegment
  // );

  // useEffect(() => {
  //   if (segmentStations?.length) {
  //     segmentStations.forEach((via: any, index: number) => {
  //       setValue(`schedules.${index}.viaRouteId`, via.id.toString());
  //     });
  //   }
  // }, [routeId, segmentStations, setValue]);

  const onSubmit = async (data: AddUpdateCoachDataProps) => {
    const result = await addCoach(data);
    if (result?.data?.success) {
      toast({
        title: translate("কোচ যোগ করার বার্তা", "Message for adding coach"),
        description: toastMessage("add", translate("কোচ", "coach")),
      });
      setCoachState((prevState: ICoachStateProps) => ({
        ...prevState,
        addCoachOpen: false,
      }));
    }
  };
  return (
    <FormWrapper
      heading={translate("কোচ যোগ করুন", "Add Coach")}
      subHeading={translate(
        "সিস্টেমে নতুন কোচ যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new coach to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          
          {/* <InputWrapper
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
                setError("noOfSeat", { type: "custom", message: "" });
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
              <SelectTrigger
                id={`schedule`}
                className="w-full"
              >
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
          </InputWrapper> */}
          {/* ROUTE */}
          {/* <InputWrapper
            error={errors?.routeId?.message}
            labelFor="routeId"
            label={translate(
              addUpdateCoachConfigurationForm?.routeId.label.bn,
              addUpdateCoachConfigurationForm.routeId.label.en
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
                    addUpdateCoachConfigurationForm.routeId.placeholder.bn,
                    addUpdateCoachConfigurationForm.routeId.placeholder.en
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
          </InputWrapper> */}

          {/* {segmentStations?.map((via: any, index: number) => (
            <div key={via.id} className="-mt-0.5 space-y-1 flex items-center">
           
              <InputWrapper
                label={`Station ${index + 1}`}
                labelFor={`station-${index}`}
              >
                <input
                  id={`station-${index}`}
                  className="w-full px-3 py-2 border rounded bg-gray-100 text-sm"
                  value={via?.station?.name}
                  readOnly
                />
              </InputWrapper>

              <input
                type="hidden"
                {...register(`schedules.${index}.viaRouteId`)}
              />

              <InputWrapper
                error={errors?.schedules?.[index]?.schedule?.message}
                label={`Schedule for ${via?.station?.name}`}
                labelFor={`schedules.${index}.schedule`}
              >
                <Select
                  value={watch(`schedules.${index}.schedule`)}
                  onValueChange={(value: string) => {
                    setValue(`schedules.${index}.schedule`, value);
                  }}
                >
                  <SelectTrigger
                    id={`schedules.${index}.schedule`}
                    className="w-full"
                  >
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
            </div>
          ))} */}

          {/* STARTING COUNTER */}
          {/* <InputWrapper
            error={errors?.fromCounterId?.message}
            labelFor="fromCounterId"
            label={translate(
              addUpdateCoachConfigurationForm?.fromCounterId.label.bn,
              addUpdateCoachConfigurationForm.fromCounterId.label.en
            )}
          >
            <Select
              value={watch("fromCounterId")?.toString()}
              onValueChange={(value: string) => {
                setValue("fromCounterId", +value);
                setError("fromCounterId", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="fromCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.fromCounterId.placeholder
                      .bn,
                    addUpdateCoachConfigurationForm.fromCounterId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!countersLoading &&
                  countersData?.data?.length > 0 &&
                  countersData?.data?.map(
                    (singleCounter: any, counterIndex: number) => (
                      <SelectItem
                        key={counterIndex}
                        value={singleCounter?.id?.toString()}
                      >
                        {singleCounter?.name}
                      </SelectItem>
                    )
                  )}

                {countersLoading && !countersData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper> */}

          {/* ENDING COUNTER */}
          {/* <InputWrapper
            error={errors?.destinationCounterId?.message}
            labelFor="destinationCounterId"
            label={translate(
              addUpdateCoachConfigurationForm?.destinationCounterId.label.bn,
              addUpdateCoachConfigurationForm.destinationCounterId.label.en
            )}
          >
            <Select
              value={watch("destinationCounterId")?.toString()}
              onValueChange={(value: string) => {
                setValue("destinationCounterId", +value);
                setError("destinationCounterId", {
                  type: "custom",
                  message: "",
                });
              }}
            >
              <SelectTrigger id="destinationCounterId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.destinationCounterId
                      .placeholder.bn,
                    addUpdateCoachConfigurationForm.destinationCounterId
                      .placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!countersLoading &&
                  countersData?.data?.length > 0 &&
                  countersData?.data
                    .filter(
                      (target: any) => target?.id !== +watch("fromCounterId")
                    )
                    ?.map((singleCounter: any, counterIndex: number) => (
                      <SelectItem
                        key={counterIndex}
                        value={singleCounter?.id?.toString()}
                      >
                        {singleCounter?.name}
                      </SelectItem>
                    ))}

                {countersLoading && !countersData?.data?.length && (
                  <SelectSkeleton />
                )}
              </SelectContent>
            </Select>
          </InputWrapper> */}

          {/* REGISTRATION NUMBER */}
          {/* <InputWrapper
            error={errors.registrationNo?.message}
            labelFor="registrationNo"
            label={translate(
              addUpdateCoachForm?.registrationNo.label.bn,
              addUpdateCoachForm.registrationNo.label.en
            )}
          >
            <Input
              id="registrationNo"
              {...register("registrationNo")}
              type="text"
              placeholder={translate(
                addUpdateCoachForm.registrationNo.placeholder.bn,
                addUpdateCoachForm.registrationNo.placeholder.en
              )}
            />
          </InputWrapper> */}

          {/* FARE AMOUNT */}
          {/* <InputWrapper
            error={errors?.fareId?.message}
            labelFor="fareId"
            label={translate(
              addUpdateCoachConfigurationForm?.fareId.label.bn,
              addUpdateCoachConfigurationForm.fareId.label.en
            )}
          >
            <Select
              value={watch("fareId") ? watch("fareId")?.toString() : ""}
              onValueChange={(value: string) => {
                setValue("fareId", +value);
                setError("fareId", {
                  type: "custom",
                  message: "",
                });
              }}
            >
              <SelectTrigger id="fareId" className="w-full">
                <SelectValue
                  placeholder={translate(
                    addUpdateCoachConfigurationForm.fareId.placeholder.bn,
                    addUpdateCoachConfigurationForm.fareId.placeholder.en
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {!faresLoading &&
                  faresData?.data?.length > 0 &&
                  faresData?.data?.map((singleFare: any, fareIndex: number) => (
                    <SelectItem
                      key={fareIndex}
                      value={singleFare?.id?.toString()}
                    >
                      {singleFare?.amount}
                    </SelectItem>
                  ))}

                {faresLoading && !faresData?.data?.length && <SelectSkeleton />}
              </SelectContent>
            </Select>
          </InputWrapper> */}
        </div>
        <Submit
          loading={addCoachLoading}
          errors={addCoachError}
          submitTitle={translate("কোচ যুক্ত করুন", "Add Coach")}
          errorTitle={translate("কোচ যোগ করতে ত্রুটি", "Add Coach Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddCoach;
