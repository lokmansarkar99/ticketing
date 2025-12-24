"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const PassengersAboutUs = () => {
  const reviews = [
    {
      id: 1,
      name: "Md. Waliullah",
      avatar: "/avatar.jpg", // replace with your image path
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 2,
      name: "Md. Yousuf",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 3,
      name: "Md. Naim",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 4,
      name: "Md. Rifat",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 5,
      name: "Md. Kawser",
      avatar: "/avatar.jpg", // replace with your image path
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 6,
      name: "Md. Mostofa",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 7,
      name: "Md. Shakil",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
    {
      id: 8,
      name: "Md. Rasel Sir",
      avatar: "/avatar.jpg",
      rating: 5,
      text: "আমাদের দেশের বাস পরিবহন ক্ষেত্রে অত্যন্ত সুপরিচিত ও স্বনামধন্য একটি প্রতিষ্ঠান। অতুলনীয় দক্ষ ও পেশাদারিত্বের শুরু থেকেই যাত্রীসেবা দিয়ে আসছে।",
    },
  ];

  return (
    <div className="w-full pb-5 pt-10">
      <h1 className="text-center  mb-5 font-bold text-xl lg:text-3xl w-full lg:w-3/6 mx-auto">
        Here's what a few of our passenger have said about us
      </h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: true, 
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        modules={[Pagination, Autoplay]}
        className="pb-10"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <div className="bg-white dark:bg-background border rounded-xl shadow-sm p-6 flex flex-col gap-3 h-full">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="rounded-full bg-cover object-cover w-10 h-10"
                />
                <div>
                  <h3 className="font-semibold text-primary">
                    {review.name}
                  </h3>
                  <div className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-200 text-sm leading-relaxed">
                “{review.text}”
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PassengersAboutUs;
