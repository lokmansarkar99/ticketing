/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appConfiguration } from "@/utils/constants/common/appConfiguration";
import {
  INationalityOptionsProps,
  nationalitiesOptions,
} from "@/utils/constants/common/nationalitiesOptions";
import { addBookingSeatForm } from "@/utils/constants/form/addBookingForm";
import { dynamicSeatAllocation } from "@/utils/helpers/dynamicSeatAllocation";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

import PageTransition from "@/components/common/effect/PageTransition";
import Submit from "@/components/common/form/Submit";
import { Paragraph } from "@/components/common/typography/Paragraph";
import {
  AddBookingSeatDataProps,
  addBookingSeatSchema,
} from "@/schemas/booking/addBookingSeatSchema";
import {
  useAddBookingMutation,
  useAddBookingSeatMutation,
  useCheckingSeatMutation,
  useGetTickitInfoByPhoneQuery,
  useRemoveBookingSeatMutation,
} from "@/store/api/bookingApi";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import SeatLayoutSelector from "@/components/common/busSeatLayout/SeatLayoutSelector";
import { VanishListTable } from "@/components/common/form/VanishListTable";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { playSound } from "@/utils/helpers/playSound";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { shareWithLocal } from "@/utils/helpers/shareWithLocal";
import { LuRefreshCw } from "react-icons/lu";
import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useGetSingleCustomerByIdQuery } from "@/store/api/authenticationApi";

interface IBookingFormProps {
  bookingCoach: any;
  sharedFormState: any; // Renamed state
  setSharedFormState: (formState: any) => void;
  bookedSeatList: any[];
  stationId: any;
}
interface IBookingFormStateProps {
  targetedSeat: number | null;
  selectedSeats: any[];
  redirectLink: string | null;
  customerName: string | null;
  redirectConfirm: boolean;
}

const BookingForm: FC<IBookingFormProps> = ({
  bookingCoach,
  sharedFormState,
  setSharedFormState,
  bookedSeatList,
  stationId,
}) => {
  const { translate } = useCustomTranslator();
  const [phoneNumber, setPhoneNumber] = useState("");
  //
  const [bookingFormState, setBookingFormState] =
    useState<IBookingFormStateProps>({
      selectedSeats: [],
      targetedSeat: null,
      redirectLink: null,
      customerName: null,
      redirectConfirm: false,
    });
  const [
    addBooking,
    { data: bookingInfo, isLoading: addBookingLoading, error: addBookingError },
  ] = useAddBookingMutation({}) as any;

  const [addBookingSeat, { isLoading: addBookingSeatLoading }] =
    useAddBookingSeatMutation({}) as any;

  const [
    checkingSeat,
    { isLoading: checkingSeatLoading, error: checkingSeatError },
  ] = useCheckingSeatMutation({}) as any;

  const totalAmount =
    totalCalculator(bookingFormState?.selectedSeats, "currentAmount") || 0;

  const totalSeats = bookingFormState?.selectedSeats?.length || 0;
  const seatsAllocation = (() => {
    switch (bookingCoach?.coach?.coachClass) {
      case "E_Class":
        return dynamicSeatAllocation(bookingCoach?.coach?.CoachConfigSeats);
      case "B_Class":
        return dynamicSeatAllocation(bookingCoach?.coach?.CoachConfigSeats);
      case "Sleeper":
        return dynamicSeatAllocation(bookingCoach?.coach?.CoachConfigSeats);
      case "S_Class":
        return dynamicSeatAllocation(bookingCoach?.coach?.CoachConfigSeats);
      default:
        return { left: [], right: [], lastRow: [], middle: [] };
    }
  })();

  const {
    register,
    setValue,

    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBookingSeatDataProps>({
    resolver: zodResolver(addBookingSeatSchema),
    defaultValues: useMemo(
      () => ({
        paymentType: "FULL",
        gender: "Male",
        ...sharedFormState,
      }),
      [sharedFormState]
    ),
  });
  const handleFieldUpdate = (fieldName: string, value: any) => {
    setSharedFormState((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
    setValue(fieldName as keyof AddBookingSeatDataProps, value);
  };
  const { data: partialInfoData } = useGetPartialInfoAllQuery({});
  const paymentType = watch("paymentType");
  const partialAmount = watch("paymentAmount");
  //const amount = watch("amount");

  const dueAmount = partialAmount ? totalAmount - partialAmount : 0;
  const minimumPartialPayment = useMemo(() => {
    if (partialInfoData?.data?.partialPercentage) {
      return (totalAmount * partialInfoData.data.partialPercentage) / 100;
    }
    return 0;
  }, [totalAmount, partialInfoData]);

  // useEffect(() => {
  //   if (paymentType === "PARTIAL") {
  //     setValue("paymentAmount", minimumPartialPayment);
  //   }
  // }, [paymentType, minimumPartialPayment, setValue]);
  useEffect(() => {
    if (paymentType === "PARTIAL") {
      setValue("paymentAmount", minimumPartialPayment);
    } else if (paymentType === "FULL") {
      setValue("paymentAmount", totalAmount);
    }
  }, [paymentType, minimumPartialPayment, totalAmount, setValue]);

  const handleBookingSeat = async (seatData: any) => {
    const isSeatAlreadySelected = bookingFormState.selectedSeats.some(
      (current: any) => current.seat === seatData.seat
    );

    if (isSeatAlreadySelected) {
      // Remove the seat if it's already selected
      const result = await removeBookingSeat({
        coachConfigId: bookingCoach?.id,
        fromStationId: stationId?.fromStationId,
        destinationStationId: stationId?.toStationId,
        seat: seatData?.seat,
      });

      if (result?.data?.success) {
        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: prevState.selectedSeats.filter(
            (seat) => seat.seat !== seatData.seat
          ),
        }));
      }
    } else {
      // Add the seat if it's not already selected
      const result = await addBookingSeat({
        coachConfigId: bookingCoach?.id,
        fromStationId: stationId?.fromStationId,
        destinationStationId: stationId?.toStationId,
        seat: seatData?.seat,
      });

      if (result?.data?.data?.available) {
        

        setBookingFormState((prevState) => ({
          ...prevState,
          selectedSeats: [
            ...prevState.selectedSeats,
            {
              ...seatData,
              currentAmount: getAmountInBookingFromByClass(
                              bookingCoach.coach,
                              bookingCoach.coach.coachType,
                              bookingCoach.coach.coachClass,
                              stationId
                            ),
              previousAmount: bookingCoach?.coach?.discount,
              coachConfigId: bookingCoach.id,
            },
          ],
        }));
      }
    }
  };

  const [updateLocal, setUpdateLocal] = useState<boolean>(false);

  // UPDATE THE COMPONENT VIA REFERENCE
  useEffect(() => {
    if (bookingInfo && updateLocal) {
      shareWithLocal("set", `${appConfiguration.appName}`, {
        bookingInfo,
      });
      setUpdateLocal(false);
    }
  }, [bookingInfo, updateLocal]);

  useEffect(() => {
    //@ts-ignore
    setValue("coachConfigId", bookingCoach?.id);
    //@ts-ignore
    setValue("schedule", bookingCoach?.coach?.schedule);
    setValue("amount", totalAmount);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);
    setValue("paymentMethod", "cash");
    // if (paymentType === "PARTIAL") {
    //   setValue("paymentAmount", dueAmount);
    // }
    if (bookingFormState?.selectedSeats?.length) {
      setValue(
        "seats",
        bookingFormState.selectedSeats.map((singleSeat: any) => singleSeat.seat)
      );
    }
  }, [
    bookingCoach?.departureDate,
    bookingCoach?.id,
    bookingCoach?.coach?.schedule,
    bookingFormState?.selectedSeats,
    dueAmount,
    paymentType,
    setValue,
    totalAmount,
    totalSeats,
  ]);

  // const [errorMessage, setErrorMessage] = useState("");
  //const [submitted, setSubmitted] = useState(false);
  const [removeBookingSeat, { isLoading: removeBookingSeatLoading }] =
    useRemoveBookingSeatMutation({}) as any;

  const { id } = shareAuthentication();

  const { data: customerData } = useGetSingleCustomerByIdQuery(id);

  const { data: userInfoData, refetch } = useGetTickitInfoByPhoneQuery(
    phoneNumber,
    {
      skip: phoneNumber.length !== 11,
    }
  ) as any;
  useEffect(() => {
    if (phoneNumber.length === 11) {
      refetch();
    }
  }, [phoneNumber, refetch]);

  // const handleFormSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!phoneNumber) {
  //     setErrorMessage("Please enter a valid phone number.");
  //     return;
  //   }

  //   await refetch();
  // };

  // Pre-fill customer data when available
  useEffect(() => {
    if (customerData?.data) {
      const {
        name,
        phone,
        email,
        address,
        // You can also extract other fields if available in the response
        // gender, nationality, nid, etc.
      } = customerData.data;

      const updatedFields = {
        customerName: name || "",
        phone: phone || "",
        email: email || "",
        address: address || "",
        // Add other fields if needed
      };

      setSharedFormState((prevState: any) => ({
        ...prevState,
        ...updatedFields,
      }));

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key as keyof AddBookingSeatDataProps, value);
      });
    }
  }, [customerData, setValue, setSharedFormState]);

  useEffect(() => {
    if (userInfoData?.data) {
      const {
        name,
        phone,
        gender,
        email,
        address,
        nationality,
        nid,
        boardingPoint,
        droppingPoint,
      } = userInfoData.data;

      const updatedFields = {
        customerName: name || "",
        phone: phone || "",
        gender: gender || "",
        email: email || "",
        address: address || "",
        nationality: nationality || "",
        nid: nid || "",
        boardingPoint: boardingPoint || "",
        droppingPoint: droppingPoint || "",
      };

      setSharedFormState((prevState: any) => ({
        ...prevState,
        ...updatedFields,
      }));

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key as keyof AddBookingSeatDataProps, value);
      });
    }
  }, [userInfoData, setValue, setSharedFormState]);

  const onSubmit = async (data: AddBookingSeatDataProps) => {
    const cleanedData = removeFalsyProperties(data, [
      "nid",
      "email",
      "nationality",
      "address",
      "customerName",
      "gender",
    ]);

    const finalData = {
      ...cleanedData,
      coachConfigId: bookingCoach?.id,
      bookingType: "SeatIssue",
      fromStationId: stationId?.fromStationId,
      orderType: "One_Trip",
      destinationStationId: stationId?.toStationId,
      date: bookingCoach?.departureDate,
      seats: bookingFormState.selectedSeats.map((seat) => {
        const matchedRoute = bookingCoach?.coach?.CoachViaRoute?.find(
          (s: any) => s?.counter?.stationId === stationId?.fromStationId
        );

        return {
          seat: seat?.seat,
          coachConfigId: bookingCoach?.id,
          schedule:
            matchedRoute?.boardingTime || matchedRoute?.droppingTime || null,
          date: bookingCoach?.departureDate,
          fare: seat?.currentAmount,
          fromStationId: stationId?.fromStationId,
          destinationStationId: stationId?.toStationId,
        };
      }),
    };

    shareWithLocal("set", `${appConfiguration.appName}`, {
      bookingData: finalData,
      timestamp: Date.now(),
    });

 
    const booking = await addBooking(finalData);

    //    if (booking?.data?.success) {
    //     setUpdateLocal(true);
    //   // Update with payment response
    //   const existingData = shareWithLocal("get", `${appConfiguration.appName}`) || {};
    //   shareWithLocal("set", `${appConfiguration.appName}`, {
    //     ...existingData,
    //     paymentResponse: booking.data
    //   });j
    // }

    // return;

    if (booking.data?.success) {
      if (bookingInfo && updateLocal) {
        shareWithLocal("set", `${appConfiguration.appName}`, {
          bookingInfo,
        });
        setUpdateLocal(false);
      }
      playSound("success");
      window.location.href = booking.data.url;
      // if (bookingFormState?.redirectLink && bookingFormState?.redirectConfirm) {
      //   toast.success(
      //     translate(
      //       `প্রিয় ${bookingFormState?.customerName}, আপনার সিট সফলভাবে বুক করা হয়েছে! আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ।`,
      //       `Dear ${bookingFormState?.customerName}, your seat has been successfully booked! Thank you for choosing our service.`
      //     )
      //   );

      //   setTimeout(() => {
      //     const paymentPromise = new Promise((resolve) =>
      //       setTimeout(resolve, 2000)
      //     );

      //     toast.promise(paymentPromise, {
      //       loading: translate("পুনঃনির্দেশিত হচ্ছে...", "Redirecting..."),
      //       success: () => {
      //         setTimeout(() => {
      //           if (bookingFormState.redirectLink) {
      //             window.location.href = bookingFormState.redirectLink;
      //           }
      //         }, 1500);
      //         return translate(
      //           "পেমেন্টের জন্য পুনঃনির্দেশনা সম্পন্ন হয়েছে।",
      //           "Redirecting is complete for payment."
      //         );
      //       },
      //       error: translate("ত্রুটি ঘটেছে", "Error occurred"),
      //     });
      //   }, 3000);

      // }
    }
  };
  const ResetDataOfForm = async () => {
    try {
      if (!bookingFormState.selectedSeats.length) {
        toast.warning(
          translate(
            "No seats selected to reset.",
            "রিসেট করার জন্য কোনো আসন নির্বাচন করা হয়নি।"
          )
        );
        return;
      }

      // Iterate over selected seats and call `removeBookingSeat` for each
      const promises = bookingFormState.selectedSeats.map((seat) =>
        removeBookingSeat({
          coachConfigId: bookingCoach?.id,
          fromStationId: stationId?.fromStationId,
          destinationStationId: stationId?.toStationId,
          seat: seat?.seat,
        })
      );

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      // Check if all API calls were successful
      const allSuccessful = results.every((result) => result?.data?.success);

      if (allSuccessful) {
        toast.success(
          translate(
            "All seats reset successfully.",
            "সব আসন সফলভাবে রিসেট হয়েছে।"
          )
        );

        // Reset the form state
        setBookingFormState({
          targetedSeat: null,
          selectedSeats: [],
          redirectLink: null,
          customerName: null,
          redirectConfirm: false,
        });
      } else {
        toast.error(
          translate(
            "Some seats could not be reset. Please try again.",
            "কিছু আসন রিসেট করা যায়নি। আবার চেষ্টা করুন।"
          )
        );
      }
    } catch (error) {
      console.error("Error resetting seats:", error);
      toast.error(
        translate(
          "Error resetting the seats. Please try again.",
          "আসন রিসেট করার সময় ত্রুটি হয়েছে। আবার চেষ্টা করুন।"
        )
      );
    }
  };

  const viaRoute = bookingCoach?.coach?.CoachViaRoute || [];

  const fromIndex = viaRoute.findIndex(
    (item: any) => item?.counter?.stationId === stationId?.fromStationId
  );
  const toIndex = viaRoute.findIndex(
    (item: any) => item?.counter?.stationId === stationId?.toStationId
  );
  const slicedViaRoute =
    fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex
      ? viaRoute.slice(fromIndex, toIndex + 1)
      : [];

  return (
    <PageTransition>
      {/* find tickit */}
      <div className="md:flex  lg:justify-center justify-between lg:items-center items-center">
        {/* <div className="lg:w-[65%] w-full ">
          <PageTransition>
            <form
              onSubmit={handleFormSubmit}
              className="ml-4 flex md:justify-start md:items-center"
            >
              <InputWrapper
                className="lg:w-4/12"
                labelFor="FinfTickit"
                error=" "
                label={translate(
                  "ফোন নম্বর দ্বারা টিকিট খুঁজুন",
                  "Find Ticket By Phone Number"
                )}
              >
                <Input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e: any) => setPhoneNumber(e.target.value)}
                  id="phoneNumber"
                  placeholder={translate(
                    "ফোন নম্বর দ্বারা টিকিট খুঁজুন",
                    "Find Ticket By Phone Number"
                  )}
                />
              </InputWrapper>
              <Button type="submit" className="lg:mt-4 md:mt-5 mt-9 ml-2">
                <span>
                  {userInfoLoading && (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 ..."
                      viewBox="0 0 24 24"
                    ></svg>
                  )}
                </span>
                Search
              </Button>
            </form>
            {errorMessage && (
              <div className="text-red-500 mt-1 ml-5">{errorMessage}</div>
            )}
          </PageTransition>
        </div> */}
      </div>

      {/*end find tickit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-5 my-0 h-full mt-1 px-4">
          {/* COUCH SEAT PLAN CONTAINER */}
          <PageTransition className="lg:col-span-4 col-span-12 w-full flex items-center flex-col border-2 rounded-md justify-center  border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300 max-w-[330px]">
            <SeatLayoutSelector
              checkingSeat={checkingSeat}
              bookingCoach={bookingCoach}
              coachClass={bookingCoach?.coach?.coachClass}
              //@ts-ignore
              seatsAllocation={seatsAllocation}
              handleBookingSeat={handleBookingSeat}
              bookingFormState={bookingFormState}
              addBookingSeatLoading={addBookingSeatLoading}
              removeBookingSeatLoading={removeBookingSeatLoading}
              bookedSeatList={bookedSeatList}
            />
          </PageTransition>

          {/* CUSTOMER & PAYMENT INFORMATION */}
          <PageTransition className="lg:col-span-8 col-span-12 flex flex-col justify-between h-full w-full">
            <div className="lg:mb-8 mb-6">
              {/* <h2 className="lg:text-2xl text-base font-semibold">
                {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
              </h2> */}
              <div>
                {bookingFormState.selectedSeats?.length > 0 ? (
                  <div className="relative w-full  border">
                    <h2 className="absolute border border-[#e57bf3] -top-3 left-2   px-2 bg-[#e074ee]">
                      {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
                    </h2>
                    <div className="px-3  h-auto">
                      <div className="mt-5 mb-2">
                        <div>
                          {bookingFormState.selectedSeats?.length > 0 ? (
                            <VanishListTable
                              listItems={bookingFormState.selectedSeats
                                .slice()
                                .reverse()}
                              handleBookingSeat={handleBookingSeat}
                              couponInputs={{}}
                              handleCouponChange={() => {}}
                            />
                          ) : (
                            <div className="flex justify-center text-center">
                              <Paragraph variant="destructive" size="sm">
                                {translate(
                                  "আপনি এখনো কোনো আসন নির্বাচন করেননি। বুকিং সম্পূর্ণ করতে দয়া করে একটি আসন নির্বাচন করুন।",
                                  "You haven't selected a seat yet. Please choose a seat to proceed with your booking."
                                )}
                              </Paragraph>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center pb-1">
                      <h2 className="text-sm  lg:font-semibold font-medium">
                        Reset Seat
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              className="text-muted-foreground h-5 w-5 p-0.5 bg-primary hover:bg-primary/80"
                              onClick={ResetDataOfForm}
                              variant="outline"
                              size="icon"
                            >
                              <span className="sr-only">Refresh Button</span>
                              <LuRefreshCw className="size-[18px] text-white" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p> {translate("ফিল্টার রিসেট", "Reset Filter")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center text-center">
                    <Paragraph variant="destructive" size="sm">
                      {translate(
                        "আপনি এখনো কোনো আসন নির্বাচন করেননি। বুকিং সম্পূর্ণ করতে দয়া করে একটি আসন নির্বাচন করুন।",
                        "You haven't selected a seat yet. Please choose a seat to proceed with your booking."
                      )}
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>

            <div className="border mt-0 relative py-2 px-1">
              <h2 className="absolute border border-[#e57bf3] -top-3 left-2 px-2 bg-[#e074ee]">
                {translate(
                  "গ্রাহকের ব্যক্তিগত তথ্য",
                  "Client Personal Information"
                )}
              </h2>

              <div className="w-full pt-3">
                <table className="table-auto border-collapse border  w-full">
                  <tbody>
                    {/* Row 1: Name and Phone */}
                    <tr className="border ">
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("নাম", "Name")}
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          {...register("customerName")}
                          type="text"
                          id="name"
                          value={sharedFormState.customerName || ""}
                          onChange={(e) =>
                            handleFieldUpdate("customerName", e.target.value)
                          }
                          placeholder={translate(
                            addBookingSeatForm.name.placeholder.bn,
                            addBookingSeatForm.name.placeholder.en
                          )}
                          className="w-full h-7 text-[13px]"
                        />
                        {errors.customerName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.customerName.message}
                          </p>
                        )}
                      </td>
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("ফোন", "Phone")}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          {...register("phone")}
                          type="tel"
                          id="phone"
                          value={sharedFormState.phone || ""}
                          disabled={customerData?.data?.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPhoneNumber(value);
                            handleFieldUpdate("phone", value);
                          }}
                          placeholder={translate(
                            addBookingSeatForm.phone.placeholder.bn,
                            addBookingSeatForm.phone.placeholder.en
                          )}
                          className="w-full h-7 text-[13px]"
                          maxLength={11}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </td>
                    </tr>
                    {/* Boarding Point */}
                    <tr className="border">
                      <td className="border px-1 py-1 font-medium text-sm">
                        {translate(
                          addBookingSeatForm.boardingPoint.label.bn,
                          addBookingSeatForm.boardingPoint.label.en
                        )}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border px-2 py-1">
                        <Select
                          value={sharedFormState.boardingPoint || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("boardingPoint", value)
                          }
                        >
                          <SelectTrigger
                            id="boardingPoint"
                            className="w-full h-7 text-[13px]"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.boardingPoint.placeholder.bn,
                                addBookingSeatForm.boardingPoint.placeholder.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {slicedViaRoute
                              ?.filter((r: any) => r.isBoardingPoint === true)
                              ?.map((singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint?.counter?.name}
                                  value={singlePoint?.counter?.name}
                                >
                                  {formatter({
                                    type: "words",
                                    words: `${singlePoint?.counter?.name}  (${singlePoint?.boardingTime})`,
                                  })}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errors.boardingPoint && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.boardingPoint.message}
                          </p>
                        )}
                      </td>

                      {/* Dropping Point */}

                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate(
                          addBookingSeatForm.droppingPoint.label.bn,
                          addBookingSeatForm.droppingPoint.label.en
                        )}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border px-2 py-1">
                        <Select
                          value={sharedFormState.droppingPoint || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("droppingPoint", value)
                          }
                        >
                          <SelectTrigger
                            id="droppingPoint"
                            className="w-full h-7 text-[13px]"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.droppingPoint.placeholder.bn,
                                addBookingSeatForm.droppingPoint.placeholder.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {" "}
                            {slicedViaRoute
                              ?.filter(
                                (target: any) =>
                                  target?.station?.name !==
                                    watch("boardingPoint") &&
                                  target?.isDroppingPoint === true
                              )
                              ?.map((singlePoint: any) => (
                                <SelectItem
                                  key={singlePoint?.counter?.name}
                                  value={singlePoint?.counter?.name}
                                >
                                  {formatter({
                                    type: "words",
                                    words: `${singlePoint?.counter?.name}  (${singlePoint?.droppingTime})`,
                                  })}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {errors.droppingPoint && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.droppingPoint.message}
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Row 2: Gender and Email */}
                    <tr className="border ">
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("লিঙ্গ", "Gender")}
                      </td>
                      <td className="border px-2 py-1">
                        <Select
                          value={sharedFormState.gender || "Male"}
                          onValueChange={(value) =>
                            handleFieldUpdate("gender", value)
                          }
                        >
                          <SelectTrigger
                            id="gender"
                            className="w-full h-7 text-[13px]"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.gender.placeholder.bn,
                                addBookingSeatForm.gender.placeholder.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">
                              {translate("পুরুষ", "Male")}
                            </SelectItem>
                            <SelectItem value="Female">
                              {translate("মহিলা", "Female")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("ইমেইল", "Email")}
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          {...register("email")}
                          type="email"
                          id="email"
                          value={sharedFormState.email || ""}
                          onChange={(e) =>
                            handleFieldUpdate("email", e.target.value)
                          }
                          placeholder={translate(
                            addBookingSeatForm.email.placeholder.bn,
                            addBookingSeatForm.email.placeholder.en
                          )}
                          className="w-full h-7 text-[13px]"
                        />
                      </td>
                    </tr>

                    {/* Row 3: Nationality and Passport/NID */}
                    <tr className="border ">
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("জাতীয়তা", "Nationality")}
                      </td>
                      <td className="border px-2 py-1">
                        <Select
                          value={sharedFormState.nationality || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("nationality", value)
                          }
                        >
                          <SelectTrigger
                            id="nationality"
                            className="w-full h-7 text-[13px]"
                          >
                            <SelectValue
                              placeholder={translate(
                                addBookingSeatForm.nationality.label.bn,
                                addBookingSeatForm.nationality.label.en
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {nationalitiesOptions?.map(
                              (singleNationality: INationalityOptionsProps) => (
                                <SelectItem
                                  key={singleNationality.en}
                                  value={singleNationality.key}
                                >
                                  {translate(
                                    singleNationality.bn,
                                    singleNationality.en
                                  )}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("পাসপোর্ট বা এনআইডি", "Passport/NID")}
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          {...register("nid")}
                          type="text"
                          value={sharedFormState.nid || ""}
                          onChange={(e) =>
                            handleFieldUpdate("nid", e.target.value)
                          }
                          id="pass/nid"
                          placeholder={translate(
                            addBookingSeatForm.passportOrNID.placeholder.bn,
                            addBookingSeatForm.passportOrNID.placeholder.en
                          )}
                          className="w-full h-7 text-[13px]"
                        />
                      </td>
                    </tr>

                    {/* Row 4: Address */}
                    <tr className="border ">
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate("ঠিকানা", "Address")}
                      </td>
                      <td colSpan={3} className="border px-2 py-1">
                        <Input
                          {...register("address")}
                          type="text"
                          id="address"
                          value={sharedFormState.address || ""}
                          onChange={(e) =>
                            handleFieldUpdate("address", e.target.value)
                          }
                          placeholder={translate(
                            addBookingSeatForm.address.placeholder.bn,
                            addBookingSeatForm.address.placeholder.en
                          )}
                          className="w-full h-7 text-[13px]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-3 text-start">
              <h2 className="lg:text-xl text-sm font-semibold">
                {translate("পেমেন্ট বিবরণ:", "Payment Details:")}
              </h2>
            </div>

            <div className="lg:mt-2 mt-1">
              <table className="table-auto border-collapse border w-full">
                <tbody>
                  {/* Payment Type */}
                  <tr className="border">
                    <td className="border px-2 py-1 font-medium text-sm">
                      {translate(
                        addBookingSeatForm?.paymentType.label.bn,
                        addBookingSeatForm?.paymentType.label.en
                      )}{" "}
                      <span className="text-red-600 font-semibold">✼</span>
                    </td>
                    <td className="border px-2 py-1">
                      <Select
                        value={sharedFormState.paymentType || "FULL"}
                        onValueChange={(value) =>
                          handleFieldUpdate("paymentType", value)
                        }
                      >
                        <SelectTrigger
                          id="paymentType"
                          className="w-full h-7 text-[13px]"
                        >
                          <SelectValue
                            placeholder={translate(
                              addBookingSeatForm.paymentType.placeholder.bn,
                              addBookingSeatForm.paymentType.placeholder.en
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULL">
                            {translate("পূর্ণ", "FULL")}
                          </SelectItem>
                          <SelectItem value="PARTIAL">
                            {translate("আংশিক", "PARTIAL")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.paymentType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.paymentType.message}
                        </p>
                      )}
                    </td>
                  </tr>

                  {/* Payment Partial Amount (if applicable) */}
                  {paymentType === "PARTIAL" && (
                    <tr className="border">
                      <td className="border px-2 py-1 font-medium text-sm">
                        {translate(
                          addBookingSeatForm.paymentAmount.label.bn,
                          addBookingSeatForm.paymentAmount.label.en
                        )}
                      </td>
                      <td className="border px-2 py-1">
                        <Input
                          {...register("paymentAmount")}
                          type="number"
                          id="paymentAmount"
                          placeholder={translate(
                            addBookingSeatForm.paymentAmount.placeholder.bn,
                            addBookingSeatForm.paymentAmount.placeholder.en
                          )}
                          onChange={(e) =>
                            setValue(
                              "paymentAmount",
                              parseFloat(e.target.value)
                            )
                          }
                          value={minimumPartialPayment}
                          disabled={true}
                          className="w-full h-7 text-[13px]"
                        />
                        {errors.paymentAmount && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.paymentAmount.message}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}

                  {/* Payment Method */}
                  {/* <tr className="border">
                    <td className="border px-2 py-1 font-medium">
                      {translate(
                        addBookingSeatForm.paymentMethod.label.bn,
                        addBookingSeatForm.paymentMethod.label.en
                      )}<span className="text-red-600 font-semibold">✼</span>
                    </td>
                    <td className="border px-2 py-1">
                      <Select
                        value={sharedFormState.paymentMethod || ""}
                        onValueChange={(value) =>
                          handleFieldUpdate("paymentMethod", value)
                        }
                      >
                        <SelectTrigger id="paymentMethod" className="w-full">
                          <SelectValue
                            placeholder={translate(
                              addBookingSeatForm.paymentMethod.placeholder.bn,
                              addBookingSeatForm.paymentMethod.placeholder.en
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethodOptions?.map(
                            (method: IPaymentMethodOptions, index: number) => (
                              <SelectItem key={index} value={method.key}>
                                {translate(method.bn, method.en)}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      {errors.paymentMethod && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.paymentMethod.message}
                        </p>
                      )}
                    </td>
                  </tr> */}
                </tbody>
              </table>

              {paymentType === "PARTIAL" && (
                <div className="flex justify-center text-center mt-4">
                  <Paragraph variant="destructive" size="sm">
                    {translate(
                      `যাত্রীকে অবশ্যই প্রস্থানের সময় কমপক্ষে ${partialInfoData.data.time} আগে বকেয়া অর্থ প্রদান করতে হবে। অন্যথায় আপনার টিকিট বাতিল বলে বিবেচিত হবে।`,
                      `The passenger must pay the due amount at least ${partialInfoData.data.time} before the departure time. Otherwise, your ticket will be considered canceled.`
                    )}
                  </Paragraph>
                </div>
              )}
            </div>
            <div className="mt-3">
              <ul className="flex justify-between">
                <li className="text-sm tracking-tight">
                  <label>{translate("মোট আসনঃ ", "Total Seats: ")}</label>
                  <b className="lg:font-[500] font-normal">
                    {translate(
                      convertToBnDigit(totalSeats?.toString()),
                      totalSeats?.toString()
                    )}
                  </b>
                </li>

                <li className="text-sm tracking-tight">
                  <label>{translate("প্রদত্ত বিল: ", "Paid Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: partialAmount?.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: partialAmount?.toString(),
                      })
                    )}
                  </b>
                </li>
                <li className="text-sm tracking-tight">
                  <label>{translate("বকেয়া বিল:", "Due Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: dueAmount.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: dueAmount.toString(),
                      })
                    )}
                  </b>
                </li>
                <li className="text-sm tracking-tight">
                  <label>{translate("মোট বিল: ", "Total Amount: ")}</label>
                  <b className="lg:font-[500] font-normal font-anek">
                    {translate(
                      convertToBnDigit(
                        formatter({
                          type: "amount",
                          amount: totalAmount?.toString(),
                        })
                      ),
                      formatter({
                        type: "amount",
                        amount: totalAmount?.toString(),
                      })
                    )}
                  </b>
                </li>
              </ul>
            </div>
            <Submit
              loading={addBookingLoading || checkingSeatLoading}
              errors={addBookingError || checkingSeatError}
              submitTitle={translate("আসন নিশ্চিত করুন", "Confirm")}
              errorTitle={translate(
                "আসন বুক করতে ত্রুটি হয়েছে",
                "Seat Booking Error"
              )}
            />
          </PageTransition>
        </div>
      </form>
    </PageTransition>
  );
};

export default BookingForm;
