import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
// import taka from "../../assets/trade.png";
import { useGetOfferAllListQuery } from "@/store/api/offer/offerApi";
import HomeLoader from "@/pages/public/HomeLoader";
import { toast } from "sonner";

const OfferPromos = ({ setBookingState, setSearchTriggered }: any) => {
  // ✅ Fetch dynamic offers
  const { data: offerData, isLoading } = useGetOfferAllListQuery({});

  // ✅ Helper: check if offer expired
  const getOfferStatus = (endDate: string) => {
    const now = new Date();
    const expiry = new Date(endDate);
    return now > expiry ? "Expired" : "Available";
  };

  // ✅ Loading fallback (optional)
  if (isLoading) return <HomeLoader />;

  // ✅ Defensive check
  const offers = offerData?.data || [];

  return (
    <div className="w-full pt-3">
      <h1 className="text-center mt-3 mb-5 font-bold text-xl lg:text-3xl">
        Offers & Promos
      </h1>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500 pb-10">
          No active offers found.
        </p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Pagination, Autoplay]}
          className="pb-10"
        >
          {offers?.map((offer: any) => {
            const status = getOfferStatus(offer.endDate);
            const isExpired = status === "Expired";

            return (
              <SwiperSlide key={offer.id}>
                <div className="bg-white dark:bg-background h-[260px] rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-400 overflow-hidden">
                  {/* Header */}
                  <div
                    onClick={() => {
                      setBookingState((prevState: any) => ({
                        ...prevState,
                        fromStationId: offer?.route?.from,
                        toStationId: offer?.route?.to,
                        coachType: "AC",
                        date: new Date(),
                      }));
                      setSearchTriggered(true);
                      // Scroll to top smoothly
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="cursor-pointer"
                  >
                    <div className="w-full flex justify-between items-center px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-black dark:text-gray-200 truncate">
                          {offer.title || "Untitled Offer"}
                        </p>
                        <p className="text-xs text-gray-800 dark:text-gray-200 font-semibold flex items-center">
                          {offer.description}
                        </p>
                      </div>

                      <p
                        className={`text-xs font-semibold ${
                          isExpired ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {status}
                      </p>
                    </div>

                    {/* Image */}
                    <img
                      src={
                        offer.image ||
                        "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={offer.title}
                      className="w-full h-40 object-contain"
                    />
                  </div>

                  {/* Coupon Code Section - Show Only If Available & Not Expired */}
                  {!isExpired && offer?.couponCode && (
                    <div className="w-full px-3 mt-[4px]">
                      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {offer.couponCode}
                        </span>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(offer.couponCode);
                            toast("Coupon code copied!")
                          }}
                          className="text-xs font-semibold bg-secondary text-white px-3 py-1 rounded-md"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default OfferPromos;
