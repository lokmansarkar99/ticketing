import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetAboutUsListQuery } from "@/store/api/aboutUs/aboutUsApi";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { FC } from "react";
import HomeLoader from "./HomeLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
// import SisterConcern from "@/sections/home/SisterConcern";
import { CoreValue } from "./CoreValue";
import { Statistics } from "./Statistics";

const AboutUs: FC = () => {
  const { data: aboutData, isLoading: aboutLoading } = useGetAboutUsListQuery(
    {}
  );
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );

  if (aboutLoading || singleCmsLoading) return <HomeLoader />;

  const aboutUsContent = singleCms?.data?.aboutUsContent ?? "";
  return (
    <PageWrapper>
      <div className=" pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start justify-items-center gap-4 md:gap-10 max-w-7xl mx-auto  px-2 md:px-4">
          {/* ======= About Us Header ======= */}
          <div className="text-left mb-10 pt-5">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary border-b pb-1 border-secondary">
              About Us
            </h1>
            {aboutUsContent && (
              <div
                className="text-gray-700 dark:text-gray-300 mt-4 mx-auto max-w-3xl leading-7 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: aboutUsContent }}
              />
            )}
          </div>

          {/* ======= About Us Image Section (Swiper) ======= */}
          {aboutData?.data?.length > 0 && (
            <div className="w-full md:flex-1 md:mt-5">
              <Swiper
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
                className="w-full"
              >
                {aboutData?.data?.map((about: any, index: number) => (
                  <>
                    {" "}
                    <SwiperSlide key={index}>
                      <div className="h-[290px]">
                        <div className="w-full mx-auto h-[250px] rounded-lg shadow-lg ">
                          <img
                            src={about.image}
                            alt={`About Image ${index + 1}`}
                            className="w-full  object-contain"
                          />
                        </div>
                      </div>
                    </SwiperSlide>
                  </>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {/* ======= Core Values Section ======= */}
        <div className="mt-10 max-w-7xl mx-auto  px-2 md:px-4">
          <CoreValue />
        </div>
        <div className="mt-10 bg-gray-200 dark:bg-transparent">
          <Statistics />
        </div>
        {/* <div className="mt-10 max-w-7xl mx-auto  px-2 md:px-4"> */}
          {/* ======= Sister Concern Section ======= */}
          {/* <SisterConcern /> */}
        {/* </div> */}
      </div>
    </PageWrapper>
  );
};

export default AboutUs;
