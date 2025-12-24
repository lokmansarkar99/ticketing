import PageTransition from "@/components/common/effect/PageTransition";
import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetSingleCoachConfigurationQuery,
  useUpdateCoachConfigurationMutation,
} from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { useLocation } from "react-router-dom";

const AcceptCochBySupervisorOrHelperDriver = () => {
  const { translate } = useCustomTranslator();
  const location = useLocation();

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("coachConfigId");
  const supervisors = queryParams.get("supervisor");
  const drivers = queryParams.get("driver");
  const helpers = queryParams.get("helper");
  const [updateCoachConfiguration] = useUpdateCoachConfigurationMutation();

  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const AcceptRequest = () => {
    const handleAcceptRequest = async () => {
      try {
        // Construct the payload
        const payload: any = { id, data: {} };

        // Determine which status to update
        if (supervisors) {
          payload.data.supervisorStatus = "Accepted";
        } else if (drivers) {
          payload.data.driverStatus = "Accepted";
        } else if (helpers) {
          payload.data.helperStatus = "Accepted";
        }


        // Make the API call
        const result = await updateCoachConfiguration(payload);

        if (result?.data?.success) {
          toast({
            title: translate(
              "কোচ অনুরোধ সফলভাবে গৃহীত!",
              "Request accepted successfully!"
            ),
            description: toastMessage(
              "update",
              translate(
                "কোচ অনুরোধ সফলভাবে গৃহীত!",
                "Request accepted successfully!"
              )
            ),
          });
        } else {
          throw new Error("Failed to update coach configuration.");
        }
      } catch (error) {
        console.error("Error during accept request:", error);
        toast({
          title: translate("অনুমোদন ব্যর্থ", "Error accepting request"),
          description: translate(
            "দয়া করে আবার চেষ্টা করুন।",
            "Please try again."
          ),
          variant: "destructive",
        });
      }
    };

    handleAcceptRequest();
  };
  // Fetch data using coachConfigId
  const {
    data: coachDetails,
    error,
    isLoading,
  } = useGetSingleCoachConfigurationQuery(id);

  if (isLoading) return <DetailsSkeleton />;
  if (error)
    return (
      <p>
        {translate(
          "কোচ বিবরণ লোড করতে ত্রুটি!",
          "Error loading coach details!"
        )}
      </p>
    );

  if (!coachDetails?.data)
    return (
      <p>
        {translate(
          "এই কোচের জন্য কোন বিবরণ নেই।",
          "No details found for this coach."
        )}
      </p>
    );

  const {
    coachNo,
    registrationNo,
    schedule,
    departureDate,

    seatAvailable,
    tokenAvailable,
    coachClass,
    coachType,
    fare,
    fromCounter,
    destinationCounter,
    supervisor,
    driver,
    helper,
  } = coachDetails.data;

  return (
    <PageTransition className="max-w-5xl mx-auto p-6 mt-10 shadow-lg border-2 rounded-md border-primary/50 border-dashed bg-primary/5 backdrop-blur-[2px] duration-300">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {translate("কোচ বিবরণ", "Coach Details")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {translate("সাধারণ তথ্য", "General Information")}
          </h2>
          <p>
            <strong>{translate("কোচ নম্বর:", "Coach Number:")}</strong>{" "}
            {coachNo}
          </p>
          <p>
            <strong>
              {translate("নিবন্ধন নম্বর:", "Registration Number:")}
            </strong>{" "}
            {registrationNo}
          </p>
          <p>
            <strong>{translate("সময়সূচী:", "Schedule:")}</strong> {schedule}
          </p>
          <p>
            <strong>{translate("প্রস্থানের তারিখ:", "Departure Date:")}</strong>{" "}
            {departureDate}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {translate("প্রাপ্যতা", "Availability")}
          </h2>
          <p>
            <strong>{translate("সিট প্রাপ্যতা:", "Seats Available:")}</strong>{" "}
            {seatAvailable}
          </p>
          <p>
            <strong>
              {translate("টোকেন প্রাপ্যতা:", "Tokens Available:")}
            </strong>{" "}
            {tokenAvailable}
          </p>
          <p>
            <strong>{translate("শ্রেণি:", "Class:")}</strong> {coachClass}
          </p>
          <p>
            <strong>{translate("প্রকার:", "Type:")}</strong> {coachType}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {translate("ভাড়ার তথ্য", "Fare Information")}
          </h2>
          <p>
            <strong>{translate("পথ:", "Route:")}</strong> {fare?.route}
          </p>
          <p>
            <strong>{translate("পরিমাণ:", "Amount:")}</strong> {fare?.amount}
          </p>
          <p>
            <strong>{translate("প্রকার:", "Type:")}</strong> {fare?.type}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {translate("কাউন্টার তথ্য", "Counter Information")}
          </h2>
          <p>
            <strong>{translate("কাউন্টার থেকে:", "From Counter:")}</strong>{" "}
            {fromCounter?.name} ({fromCounter?.address})
          </p>
          <p>
            <strong>
              {translate("গন্তব্য কাউন্টার:", "Destination Counter:")}
            </strong>{" "}
            {destinationCounter?.name} ({destinationCounter?.address})
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {translate("স্টাফ তথ্য", "Staff Information")}
          </h2>
          <p className={`${supervisors && "text-green-400"}`}>
            <strong>{translate("পর্যবেক্ষক:", "Supervisor:")}</strong>{" "}
            {supervisor?.userName} ({supervisor?.contactNo})
          </p>
          <p className={`${drivers && "text-green-400"}`}>
            <strong>{translate("ড্রাইভার:", "Driver:")}</strong> {driver?.name}{" "}
            ({driver?.contactNo})
          </p>
          <p className={`${helpers && "text-green-400"}`}>
            <strong>{translate("হেল্পার:", "Helper:")}</strong> {helper?.name} (
            {helper?.contactNo})
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={AcceptRequest}
          className="px-6 py-3 rounded-md font-semibold  border-green-500 hover:bg-green-500 hover:text-white"
        >
          {translate("গ্রহণ করুন", "Accept")}
        </Button>
        <Button className="px-6 py-3 rounded-md bg-red-500 font-semibold border border-red-500 hover:bg-red-500 hover:text-white">
          {translate("প্রত্যাখ্যান করুন", "Reject")}
        </Button>
      </div>
    </PageTransition>
  );
};

export default AcceptCochBySupervisorOrHelperDriver;
