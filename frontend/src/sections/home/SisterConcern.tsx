import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useGetSisterConcernAllListQuery } from "@/store/api/sisterConcern/sisterConcernApi";
import HomeLoader from "@/pages/public/HomeLoader";

export default function SisterConcern() {
  const {
    data: sisterConcern,
    isLoading: routesLoading,
    error,
  } = useGetSisterConcernAllListQuery({});

  if (routesLoading) return <HomeLoader />;
  if (error) return <div>Error loading routes</div>;
  return (
    <section className="w-full pb-10">
      <div className="">
        {/* Title */}
        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 text-center pb-3">
          Our Sister Concern
        </h2>

        {/* Slider */}
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          modules={[Pagination, Autoplay]}
          className="pb-10 mx-auto flex items-center justify-center"
        >
          {sisterConcern?.data?.length > 0 &&
            sisterConcern?.data?.map((image: any) => (
              <SwiperSlide key={image.id}>
                <div className="flex items-center justify-center">
                  <div className="bg-white bg-background dark:border rounded-xl shadow-sm w-full flex items-center justify-center">
                    <img
                      src={image.image}
                      alt="sister_concern_image"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
}
