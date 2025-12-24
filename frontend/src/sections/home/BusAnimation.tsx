// import HeroTiltCard from "@/components/common/effect/HeroTiltCard";
import PageTransition from "@/components/common/effect/PageTransition";
import { useGetSliderAllListQuery } from "@/store/api/slider/sliderApi";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function BusAnimation() {
  const { data: sliders } = useGetSliderAllListQuery({});
  return (
    <div className="mt-0">
      <Swiper
        spaceBetween={10}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1500}
        loop={true}
        modules={[Autoplay]}
        className="mx-auto"
      >
        {sliders?.data?.length > 0 &&
          sliders.data.map((item: any) => (
            <SwiperSlide key={item.id}>
              <PageTransition>
                <img
                  className="w-full h-[300px] object-cover"
                  src={item.image}
                  alt="Iconic Car"
                />

                {/* <h2 className="text-center text-xl font-lora font-extralight">
                  <strong className="font-extrabold text-secondary">Iconic</strong>{" "}
                  Express
                </h2> */}
              </PageTransition>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
