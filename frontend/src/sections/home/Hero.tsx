// import { FlipWords } from "@/components/common/typography/FlipWords";
// import { Heading } from "@/components/common/typography/Heading";
// import { cn } from "@/lib/utils";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
// import { useLocaleContext } from "@/utils/hooks/useLocaleContext";
import { FC, useState } from "react";
import Booking, { IBookingStateProps } from "./Booking";
import BusAnimation from "./BusAnimation";
import SearchResult from "./SearchResult";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import OfferPromos from "./OfferPromos";
import PassengersAboutUs from "./PassengersAboutUs";
import PopularRoutes from "./PopularRoute";
import { PaymentMethod } from "@/components/shared/PaymentMethod";
// import SisterConcern from "./SisterConcern";

interface IHeroProps {
  items: any;
}

const Hero: FC<IHeroProps> = ({ items }) => {
  const { translate } = useCustomTranslator();
  // const { locale } = useLocaleContext();
  const [bookingState, setBookingState] = useState<IBookingStateProps>({
    calenderOpen: false,
    fromStationId: null,
    toStationId: null,
    returnCalenderOpen: false,
    coachType: "AC",
    date: new Date(),
    returnDate: null,
    bookingCoachesList: [],
    bookedSeatList: [],
    roundTripGobookingCoachesList: [],
    roundTripReturnBookingCoachesList: [],
    notFoundMessage: false,
    hasSearched: false,
  });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [tripTypeHome, setTripTypeHome] = useState<"Round_Trip" | "One_Trip">(
    "One_Trip"
  );
  // const { data: singleCms } = useGetSingleCMSQuery(
  //   {}
  // );

  // if (singleCmsLoading) {
  //   return <Loader />;
  // }

  return (
    <>
      <section className="rounded-md bg-white dark:bg-background">
        <div className="bg-[#f3ddf2] dark:bg-background dark:border">
          <div className="w-full mx-auto">
            {/* Left side: Heading and Booking Form */}

            {/* Container for left and right sides */}
            <div className="relative w-full">
              {/* <div className="w-full sticky z-10 flex flex-col-reverse lg:flex-row items-center justify-center ">
              <Heading
                className={cn(
                  locale !== "bn" && "font-lora font-semibold",
                  "text-center text-[clamp(1.5rem,4vw,2.5rem)]",
                  "text-lg md:text-xl lg:text-2xl py-0 pt-2"
                )}
                size="h2"
              >
                {translate("বিশ্বাসের সাথে", "Travel")}
                <FlipWords
                  className="text-primary dark:text-primary font-extrabold tracking-tighter font-lora"
                  words={[
                    "Safely",
                    "Cozily",
                    "Quickly",
                    "Easily",
                    "Happily",
                    "Gently",
                    "Quietly",
                    "Boldly",
                    "Freely",
                    "Neatly",
                    "Calmly",
                    "Softly",
                    "Bravely",
                  ]}
                />
                {translate("যাত্রা করুন", "with Confidence")}
              </Heading>

              <div className="w-72 h-20 border-2 border-secondary rounded-lg bg-gray-300 flex flex-col justify-center items-start p-3">
                <Paragraph size="sm">
                  <span className="font-bold text-secondary">For call:</span>{" "}
                  {singleCms?.data?.supportNumber1},{" "}
                  {singleCms?.data?.supportNumber2}
                </Paragraph>
                <Paragraph size="sm" className="flex items-center gap-1">
                  <span className="font-bold text-secondary">Email: </span>{" "}
                  {singleCms?.data?.email}
                </Paragraph>
              </div>
            </div> */}
              {/* Background container for BusAnimation */}
              <div
                className={`duration-300 min-h-[250px] lg:max-h-[400px] mt-8 ${
                  bookingState?.hasSearched ? "hidden" : "w-full block"
                }`}
              >
                <BusAnimation />
              </div>

              {/* Booking form */}
              <div
                className={`${
                  bookingState?.hasSearched
                    ? "max-w-7xl mx-auto pt-10 px-2 md:px-4"
                    : "absolute z-20 left-0 right-0 top-[15%] lg:top-[60%] flex justify-center items-center"
                }`}
              >
                <Booking
                  bookingState={bookingState}
                  setBookingState={setBookingState}
                  tripTypeHome={tripTypeHome}
                  setTripTypeHome={setTripTypeHome}
                  setSearchTriggered={setSearchTriggered}
                  searchTriggered={searchTriggered}
                />
              </div>
            </div>

            {/* search result */}
            <div className="max-w-7xl mx-auto px-2 md:px-4 py-3">
              {(bookingState?.notFoundMessage === true ||
                bookingState?.hasSearched) && (
                <Helmet>
                  <meta
                    name="viewport"
                    content={
                      user?.role === "counter" || !user?.role
                        ? "width=1450"
                        : "width=device-width, initial-scale=1.0"
                    }
                  />
                </Helmet>
              )}

              {bookingState?.notFoundMessage === true ? (
                <p
                  className={`text-red-600  text-center text-xl lg:text-2xl mt-10 lg:mt-40`}
                >
                  {translate("কোন কোচ পাওয়া যায়নি", "No coaches found !")}
                </p>
              ) : (
                <SearchResult
                  bookingState={bookingState}
                  setBookingState={setBookingState}
                />
              )}
            </div>
          </div>

          {/* <div className="w-full mx-auto px-3 mt-2 lg:mt-28">
          <OfferSlider />
        </div> */}
          <div
            className={`max-w-7xl mx-auto px-2 md:px-4 ${
              bookingState?.notFoundMessage === true
                ? "mt-2 lg:mt-5"
                : "mt-2 lg:mt-5 "
            } ${bookingState?.hasSearched ? "mt-0":"pt-0 lg:pt-24"}`}
          >
            <OfferPromos
              setBookingState={setBookingState}
              setSearchTriggered={setSearchTriggered}
            />
          </div>
          <div className="max-w-7xl mx-auto px-2 md:px-4 mt-2">
            <PopularRoutes
              items={items}
              setBookingState={setBookingState}
              setSearchTriggered={setSearchTriggered}
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-2 md:px-4 mt-2">
          <PassengersAboutUs />
        </div>
        {/* <div className="max-w-7xl mx-auto px-2 md:px-4 mt-2">
          <SisterConcern />
        </div> */}
        <div className="py-8 bg-[#f3ddf2] dark:bg-background">
          <PaymentMethod />
        </div>
      </section>
      {/* <section className="shadow-md rounded-md bg-white dark:bg-background p-3 mt-3">
        <div className=" w-full mx-auto">
          <ClientNote />
        </div>
      </section> */}
    </>
  );
};

export default Hero;
