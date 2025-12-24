import SectionWrapper from "@/components/common/wrapper/SectionWrapper";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useEffect } from "react";
import { useGetSinglePageQuery } from "@/store/api/page/pageApi";
import HomeLoader from "@/pages/public/HomeLoader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

const Pages = () => {
  const { slug } = useParams();

  const { data: singlePage, isLoading } = useGetSinglePageQuery(slug);
  const { data: singleCms } = useGetSingleCMSQuery({});
  const aboutUsContent = singleCms?.data?.policyImage ?? "";

  const sanitizedDescription = DOMPurify.sanitize(singlePage?.data?.content);

  const filteredContent = sanitizedDescription
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold mb-2">')
    .replace(/<\/h1>/g, "</h1>")
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold mb-2">')
    .replace(/<\/h2>/g, "</h2>")
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold mb-2">')
    .replace(/<\/h3>/g, "</h3>")
    .replace(/<h4>/g, '<h4 class="text-base font-semibold mb-2">')
    .replace(/<\/h4>/g, "</h4>")
    .replace(/<p>/g, '<p class="mb-4 text-base leading-relaxed">')
    .replace(/<\/p>/g, "</p>")
    .replace(/<ul>/g, '<ul class="list-disc pl-5">')
    .replace(/<\/ul>/g, "</ul>")
    .replace(/<ol>/g, '<ol class="list-decimal pl-5">')
    .replace(/<\/ol>/g, "</ol>");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="w-full h-60 pt-9">
        <img
          src={aboutUsContent}
          alt="Banner"
          className="w-full h-60 object-cover"
        />
      </div>
      <div className="container -mt-16 max-w-7xl mx-auto bg-white">
        <SectionWrapper>
          {isLoading ? (
            <>
              <HomeLoader />
            </>
          ) : (
            <>
              {" "}
              <h2 className="text-[24px] font-semibold text-center border-b-2 border-secondary pb-1 inline-block">
                {singlePage?.data?.title}
              </h2>
              <div className=" text-black py-8 px-4">
                <div className="prose prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: filteredContent }}
                    className="w-full [&_img]:w-full [&_img]:h-auto"
                  />
                </div>
              </div>
            </>
          )}
        </SectionWrapper>
      </div>
    </div>
  );
};

export default Pages;
