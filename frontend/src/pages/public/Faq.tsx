import { useState } from "react";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { FaChevronDown } from "react-icons/fa";
import { useGetFaqAllListQuery } from "@/store/api/faq/faqApi";
import HomeLoader from "./HomeLoader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default
  const { data: faqData, isLoading } = useGetFaqAllListQuery({});
  const { data: singleCms, isLoading: cmsLoading } = useGetSingleCMSQuery({});
  const aboutUsContent = singleCms?.data?.faqImage ?? "";

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading || cmsLoading) return <HomeLoader />;

  return (
    <PageWrapper>
      <div className="w-full h-60 pt-9">
        <img
          src={aboutUsContent}
          alt="Banner"
          className="w-full h-60 object-cover"
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 my-10">
        <h1 className="text-2xl pb-1 pt-10 font-bold w-4/5 lg:w-1/3 border-b-2 border-secondary">
          FAQ
        </h1>

        <div className="mt-6 space-y-3">
          {faqData?.data?.length > 0 &&
            faqData?.data?.map((item: any, index: number) => (
              <div key={item.id} className="border rounded-md">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full items-center flex gap-1 p-3 text-left font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaChevronDown
                    className={`transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                  {item.question}
                </button>

                {openIndex === index && (
                  <div className="p-4 text-sm text-gray-700 border-t">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Faq;
