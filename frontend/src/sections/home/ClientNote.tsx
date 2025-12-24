import { Heading } from "@/components/common/typography/Heading";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

const ClientNote = () => {
  const { translate } = useCustomTranslator();
  const { data: singleCms } = useGetSingleCMSQuery({});

  // Get the translated description
  const description = translate(
    singleCms?.data?.homePageDescriptionBangla,
    singleCms?.data?.homePageDescription
  );

  return (
    <div className="h-auto mx-auto border-2 rounded-lg border-secondary p-5 lg:p-3 w-full flex flex-col items-center justify-between">
      <Heading size={"h4"} className="text-center">
        "Iconic Express"
      </Heading>

      {/* Render HTML content safely */}
      <div
        className=" w-full "
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default ClientNote;
