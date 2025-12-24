/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  useGetTickitInfoByPhoneQuery,
} from "@/store/api/bookingApi";
import { convertToBnDigit } from "@/utils/helpers/convertToBnDigit";
import formatter from "@/utils/helpers/formatter";
import { totalCalculator } from "@/utils/helpers/totalCalculator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { VanishListPublicRoundTrip } from "@/components/common/form/VanishListPublicRoundTrip";

import { useGetPartialInfoAllQuery } from "@/store/api/vehiclesSchedule/partialApi";
import { playSound } from "@/utils/helpers/playSound";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
// import { format } from "date-fns";
import { toast } from "sonner";
import { getAmountInBookingFromByClass } from "@/utils/helpers/getAmountInBookingFromByClass";
import { shareAuthentication } from "@/utils/helpers/shareAuthentication";
import { useGetSingleCustomerByIdQuery } from "@/store/api/authenticationApi";

interface IBookingFormProps {
  bookingCoach: any;
  bookingFormState: any;
  goViaRoute: any;
  returnViaRoute: any;
  setBookingFormState: any;
  onClose: any;
  sharedFormState: any; // Renamed state
  setSharedFormState: (formState: any) => void;
  stationId: any;
  goReturnCoachId: any;
}
export interface IBookingFormStateProps {
  targetedSeat: number | null;
  selectedSeats: any[];
  redirectLink: string | null;
  customerName: string | null;
  redirectConfirm: boolean;
}

const BoookingFormRoundTripPublic: FC<IBookingFormProps> = ({
  bookingFormState,
  goViaRoute,
  returnViaRoute,
  bookingCoach,
  setBookingFormState,
  sharedFormState,
  setSharedFormState,
  stationId,
  goReturnCoachId,
}) => {
  const { translate } = useCustomTranslator();
  const goingDate = localStorage.getItem("goingDate");
  //const [localState, setLocalState] = useState(bookingFormState);

  const handleFieldUpdate = (fieldName: string, value: any) => {
    setSharedFormState((prevState: any) => ({
      ...prevState,
      [fieldName]: value,
    }));
    setValue(fieldName as keyof AddBookingSeatDataProps, value);
  };
  const [addBooking, { isLoading: addBookingLoading, error: addBookingError }] =
    useAddBookingMutation() as any;

  const totalAmount =
    totalCalculator(bookingFormState?.selectedSeats, "currentAmount") || 0;
  const totalSeats = bookingFormState?.selectedSeats?.length || 0;

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
        ...sharedFormState,
      }),
      [sharedFormState]
    ),
  });
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

  useEffect(() => {
    if (paymentType === "PARTIAL") {
      setValue("paymentAmount", minimumPartialPayment);
    } else if (paymentType === "FULL") {
      setValue("paymentAmount", totalAmount);
    }
  }, [paymentType, minimumPartialPayment, totalAmount, setValue]);

 const handleBookingSeat = (seatData: any) => {
  setBookingFormState((prevState: any) => {
    const isSeatAlreadySelected = prevState.selectedSeats.some(
      (seat: any) => seat.seat === seatData.seat
    );

    if (isSeatAlreadySelected) {
      // Remove seat if already selected
      return {
        ...prevState,
        selectedSeats: prevState.selectedSeats.filter(
          (seat: any) => seat.seat !== seatData.seat
        ),
      };
    } else {
      // Add seat if not already selected
      const currentAmount = getAmountInBookingFromByClass(
        bookingCoach.coach,
        bookingCoach.coachType,
        bookingCoach.coachClass,
        stationId
      );

      // Optional: handle S_Class logic
      let finalAmount = currentAmount;
      if (bookingCoach.coachClass === "S_Class") {
        const segmentFare =
          bookingCoach.coach.route?.Segment?.flatMap(
            (seg: any) => seg?.SegmentFare || []
          ).find(
            (fare: any) =>
              fare.fromStationId === stationId.fromStationId &&
              fare.toStationId === stationId.toStationId
          );

        if (seatData.seat.startsWith("L")) {
          finalAmount = segmentFare?.b_class_amount ?? 0;
        } else if (seatData.seat.startsWith("U")) {
          finalAmount = segmentFare?.sleeper_class_amount ?? 0;
        }
      }

      return {
        ...prevState,
        selectedSeats: [
          ...prevState.selectedSeats,
          {
            ...seatData,
            currentAmount: finalAmount,
            previousAmount: bookingCoach?.discount,
            coachConfigId: bookingCoach?.id,
          },
        ],
      };
    }
  });
};

  useEffect(() => {
    //@ts-ignore
    setValue("coachConfigId", bookingCoach?.id);
    //@ts-ignore
    setValue("schedule", bookingCoach?.coach?.schedule);
    setValue("amount", totalAmount);
    setValue("noOfSeat", totalSeats);
    setValue("date", bookingCoach?.departureDate);
    setValue("paymentMethod", "cash");
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
    bookingFormState.selectedSeats,
    setValue,
    totalAmount,
    totalSeats,
  ]);

  useEffect(() => {
    if (bookingFormState?.redirectLink && bookingFormState?.redirectConfirm) {
      toast.success(
        translate(
          `প্রিয় ${bookingFormState?.customerName}, আপনার সিট সফলভাবে বুক করা হয়েছে! আমাদের সেবা ব্যবহার করার জন্য ধন্যবাদ।`,
          `Dear ${bookingFormState?.customerName}, your seat has been successfully booked! Thank you for choosing our service.`
        )
      );

      setTimeout(() => {
        const paymentPromise = new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        toast.promise(paymentPromise, {
          loading: translate("পুনঃনির্দেশিত হচ্ছে...", "Redirecting..."),
          success: () => {
            setTimeout(() => {
              if (bookingFormState.redirectLink) {
                window.location.href = bookingFormState.redirectLink;
              }
            }, 1500);
            return translate(
              "পেমেন্টের জন্য পুনঃনির্দেশনা সম্পন্ন হয়েছে।",
              "Redirecting is complete for payment."
            );
          },
          error: translate("ত্রুটি ঘটেছে", "Error occurred"),
        });
      }, 3000);

      setBookingFormState((prevState: IBookingFormStateProps) => ({
        ...prevState,
        redirectConfirm: false,
      }));
    }
  }, [
    bookingFormState?.redirectLink,
    bookingFormState?.redirectConfirm,
    bookingFormState?.customerName,
    translate,
    setBookingFormState,
  ]);

  const [phoneNumber, setPhoneNumber] = useState("");

  // const [errorMessage, setErrorMessage] = useState("");
  //const [submitted, setSubmitted] = useState(false);

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

  //   //setSubmitted(true);
  //   await refetch(); // Trigger API call manually
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
    const tripType = localStorage.getItem("tripType");
    const returnDate = localStorage.getItem("returnDate");
    // if (tripType === "Round_Trip" && returnDate) {
    //   const hasReturnSeat = bookingFormState.selectedSeats.some(
    //     (seat: any) => format(new Date(seat.date), "yyyy-MM-dd") === returnDate
    //   );

    //   if (!hasReturnSeat) {
    //     toast.error("Please select a return seat for your round trip.");
    //     return;
    //   }
    // }

    const cleanedData = removeFalsyProperties(data, [
      "nid",
      "email",
      "nationality",
      "address",
      "customerName",
      "gender",
      "droppingPoint",
      "boardingPoint",
    ]);

    const finalData = {
      ...cleanedData,
      coachConfigId: goReturnCoachId?.goCoachConfigId,
      returnCoachConfigId: goReturnCoachId?.returnCoachConfigId,
      fromStationId: stationId?.fromStationId,
      destinationStationId: stationId?.toStationId,
      bookingType: "SeatIssue",
      returnDate: returnDate,
      date: goingDate,
      orderType: tripType,
      seats: bookingFormState.selectedSeats.map((seat: any) => ({
        seat: seat.seat,
        coachConfigId: seat.coachConfigId,
        schedule: seat.schedule,
        fare: seat.currentAmount,
        date: seat.date,
        fromStationId: stationId?.fromStationId,
        destinationStationId: stationId?.toStationId,
      })),
    };

    const booking = await addBooking(finalData);
    if (booking.data?.success) {
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

  return (
    <PageTransition>
      {/* find tickit */}
      <div className="max-h-[60vh] overflow-y-scroll mx-5 px-3 py-8 my-5">
        {/* <div className="">
          <PageTransition>
            <form
              onSubmit={handleFormSubmit}
              className="flex justify-start max-w-3xl items-center"
            >
              <InputWrapper
                className="w-full"
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
              <Button type="submit" className="mt-4 ml-2">
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
        <div className="relative w-full  border my-10">
          <h2 className="absolute border border-[#e57bf3] -top-3 left-2  z-50 px-2 bg-[#e074ee]">
            {translate("আসন সংক্রান্ত তথ্য", "Seat Information")}
          </h2>
          <div className="px-3  h-[200px] overflow-y-scroll">
            <div className="mt-6">
              <div>
                {bookingFormState.selectedSeats?.length > 0 ? (
                  <VanishListPublicRoundTrip
                    listItems={bookingFormState.selectedSeats.slice().reverse()}
                    handleBookingSeat={handleBookingSeat}
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
        </div>
        {/*end find tickit */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row items-start my-0 h-full mt-3 w-full  gap-x-12 ">
            {/* COUCH SEAT PLAN CONTAINER */}

            {/* CUSTOMER & PAYMENT INFORMATION */}
            <PageTransition className="w-full">
              <div className="overflow-x-auto ">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <tbody className="">
                    {/* Name and Phone */}
                    <tr className="border">
                      <td className="p-2 border text-left font-semibold">
                        {translate("নাম", "Name")}
                      </td>
                      <td className="p-2 border">
                        <Input
                          {...register("customerName")}
                          value={sharedFormState.customerName || ""}
                          onChange={(e) =>
                            handleFieldUpdate("customerName", e.target.value)
                          }
                          placeholder={translate("নাম লিখুন", "Enter Name")}
                        />
                        {errors.customerName && (
                          <span className="text-red-500">
                            {errors.customerName.message}
                          </span>
                        )}
                      </td>
                      <td className="p-2 border text-left font-semibold">
                        {translate("ফোন", "Phone")}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="p-2 border">
                        <Input
                          {...register("phone")}
                          value={sharedFormState.phone || ""}
                          disabled={customerData?.data?.phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPhoneNumber(value);
                            handleFieldUpdate("phone", value);
                          }}
                          placeholder={translate("ফোন লিখুন", "Enter Phone")}
                        />
                        {errors.phone && (
                          <span className="text-red-500">
                            {errors.phone.message}
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Gender and Email */}
                    <tr className="border">
                      <td className="p-2 border text-left font-semibold">
                        {translate("লিঙ্গ", "Gender")}
                      </td>
                      <td className="p-2 border">
                        <Select
                          value={sharedFormState.gender || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("gender", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={translate(
                                "লিঙ্গ নির্বাচন করুন",
                                "Select Gender"
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
                      <td className="p-2 border text-left font-semibold">
                        {translate("ইমেইল", "Email")}
                      </td>
                      <td className="p-2 border">
                        <Input
                          {...register("email")}
                          value={sharedFormState.email || ""}
                          onChange={(e) =>
                            handleFieldUpdate("email", e.target.value)
                          }
                          placeholder={translate("ইমেইল লিখুন", "Enter Email")}
                        />
                      </td>
                    </tr>

                    {/* Boarding and Dropping Points */}
                    <tr className="border">
                      {/* Required: Boarding Point */}
                      <td className="border p-2 font-medium">
                        {translate("বোর্ডিং পয়েন্ট", "Boarding Point")}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border p-2">
                        <InputWrapper
                          error={errors?.boardingPoint?.message}
                          label=""
                        >
                          <Select
                            value={sharedFormState.boardingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("boardingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="boardingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  "বোর্ডিং পয়েন্ট নির্বাচন করুন",
                                  "Select Boarding Point"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {goViaRoute?.length > 0 &&
                                goViaRoute
                                  ?.filter(
                                    (r: any) => r.isBoardingPoint === true
                                  )
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
                        </InputWrapper>
                      </td>

                      {/* Required: Dropping Point */}
                      <td className="border p-2 font-medium">
                        {translate("ড্রপিং পয়েন্ট", "Dropping Point")}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border p-2">
                        <InputWrapper
                          error={errors?.droppingPoint?.message}
                          label=""
                        >
                          <Select
                            value={sharedFormState.droppingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("droppingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="droppingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  "ড্রপিং পয়েন্ট নির্বাচন করুন",
                                  "Select Dropping Point"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {returnViaRoute?.length > 0 &&
                                [...returnViaRoute]
                                  ?.reverse()
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
                        </InputWrapper>
                      </td>
                    </tr>

                    <tr className="border">
                      {/* Optional: Return Boarding Point */}
                      <td className="border p-2 font-medium">
                        {translate(
                          "ফেরার বোর্ডিং পয়েন্ট",
                          "Return Boarding Point"
                        )}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border p-2">
                        <InputWrapper
                          error={errors?.returnBoardingPoint?.message}
                          label=""
                        >
                          <Select
                            value={sharedFormState.returnBoardingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("returnBoardingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="returnBoardingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  "ফেরার বোর্ডিং পয়েন্ট নির্বাচন করুন",
                                  "Select Return Boarding Point"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {goViaRoute?.length > 0 &&
                                [...goViaRoute]
                                  .reverse()
                                  ?.filter(
                                    (r: any) => r.isBoardingPoint === true
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
                        </InputWrapper>
                      </td>

                      {/* Optional: Return Dropping Point */}
                      <td className="border p-2 font-medium">
                        {translate(
                          "ফেরার ড্রপিং পয়েন্ট",
                          "Return Dropping Point"
                        )}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="border p-2">
                        <InputWrapper
                          error={errors?.returnDroppingPoint?.message}
                          label=""
                        >
                          <Select
                            value={sharedFormState.returnDroppingPoint || ""}
                            onValueChange={(value) =>
                              handleFieldUpdate("returnDroppingPoint", value)
                            }
                          >
                            <SelectTrigger
                              id="returnDroppingPoint"
                              className="w-full"
                            >
                              <SelectValue
                                placeholder={translate(
                                  "ফেরার ড্রপিং পয়েন্ট নির্বাচন করুন",
                                  "Select Return Droping Point"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {returnViaRoute?.length > 0 &&
                                returnViaRoute
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
                        </InputWrapper>
                      </td>
                    </tr>

                    {/* Payment Type and Method */}
                    <tr className="border">
                      <td className="p-2 border text-left font-semibold">
                        {translate("পেমেন্ট টাইপ", "Payment Type")}{" "}
                        <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="p-2 border">
                        <Select
                          value={sharedFormState.paymentType || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("paymentType", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={translate(
                                "পেমেন্ট টাইপ নির্বাচন করুন",
                                "Select Payment Type"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULL">
                              {translate("পূর্ণ", "Full")}
                            </SelectItem>
                            <SelectItem value="PARTIAL">
                              {translate("আংশিক", "Partial")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      {/* <td className="p-2 border text-left font-semibold">
                        {translate("পেমেন্ট পদ্ধতি", "Payment Method")} <span className="text-red-600 font-semibold">✼</span>
                      </td>
                      <td className="p-2 border">
                        <Select
                          value={sharedFormState.paymentMethod || ""}
                          onValueChange={(value) =>
                            handleFieldUpdate("paymentMethod", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={translate(
                                "পেমেন্ট পদ্ধতি নির্বাচন করুন",
                                "Select Payment Method"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethodOptions.map((method, index) => (
                              <SelectItem key={index} value={method.key}>
                                {translate(method.bn, method.en)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td> */}
                    </tr>

                    {/* Partial Payment Amount */}
                    {watch("paymentType") === "PARTIAL" && (
                      <tr className="border">
                        <td className="p-2 text-left font-semibold">
                          {translate("আংশিক অর্থ", "Partial Amount")}{" "}
                          <span className="text-red-600 font-semibold">✼</span>
                        </td>
                        <td colSpan={3} className="p-2">
                          <Input
                            {...register("paymentAmount")}
                            type="number"
                            placeholder={translate(
                              "আংশিক অর্থ লিখুন",
                              "Enter Partial Amount"
                            )}
                            disabled={true}
                            value={minimumPartialPayment}
                          />
                          {errors.paymentAmount && (
                            <span className="text-red-500">
                              {errors.paymentAmount.message}
                            </span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {paymentType === "PARTIAL" && (
                <div className="flex justify-center text-center">
                  <Paragraph variant="destructive" size="sm">
                    {translate(
                      `যাত্রীকে অবশ্যই প্রস্থানের সময় কমপক্ষে ${partialInfoData.data.time} আগে বকেয়া অর্থ প্রদান করতে হবে। অন্যথায় আপনার টিকিট বাতিল বলে বিবেচিত হবে।`,
                      `passenger must pay the due amount at least ${partialInfoData.data.time} before the departure time.Otherwise your ticket will be considered cancelled`
                    )}
                  </Paragraph>
                </div>
              )}
              <div className="mt-3">
                <ul className="md:flex grid grid-cols-2 justify-between">
                  <li className="lg:text-lg text-sm tracking-tight">
                    <label>{translate("মোট আসনঃ ", "Total Seats: ")}</label>
                    <b className="lg:font-[500] font-normal">
                      {translate(
                        convertToBnDigit(totalSeats?.toString()),
                        totalSeats?.toString()
                      )}
                    </b>
                  </li>

                  <li className="lg:text-lg text-sm tracking-tight">
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
                  <li className="lg:text-lg text-sm tracking-tight">
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
                  <li className="lg:text-lg text-sm tracking-tight">
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
                loading={addBookingLoading}
                errors={addBookingError}
                submitTitle={translate("আসন নিশ্চিত করুন", "Confirm")}
                errorTitle={translate(
                  "আসন বুক করতে ত্রুটি হয়েছে",
                  "Seat Booking Error"
                )}
              />
            </PageTransition>
          </div>
        </form>
      </div>
    </PageTransition>
  );
};

export default BoookingFormRoundTripPublic;
