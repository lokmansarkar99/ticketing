import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function OfferSlider() {
  const { data: singleCms } = useGetSingleCMSQuery({});
  
  return (
    <div>
      <Swiper
        loop={true}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        speed={1500}
        modules={[Pagination, Autoplay]}
        breakpoints={{
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
          0: {
            slidesPerView: 1.4,
            spaceBetween: 10,
          },
        }}
        className="rounded-lg mx-auto"
      >
        {singleCms?.data?.offeredImageOne && (
          <SwiperSlide>
            <img
              src={singleCms.data.offeredImageOne}
              alt="Slider one"
              className="w-full h-40 object-cover rounded-lg"
            />
          </SwiperSlide>
        )}
        {singleCms?.data?.offeredImageTwo && (
          <SwiperSlide>
            <img
              src={singleCms.data.offeredImageTwo}
              alt="Slider two"
              className="w-full h-40 object-cover rounded-lg"
            />
          </SwiperSlide>
        )}
        {singleCms?.data?.offeredImageThree && (
          <SwiperSlide>
            <img
              src={singleCms.data.offeredImageThree}
              alt="Slider three"
              className="w-full h-40 object-cover rounded-lg"
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}