import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { Link } from "react-router-dom";
import ButtonLoader from "../common/typography/ButtonLoader";

export const DashboardFooter = () => {
  const year = new Date().getFullYear();
  const { locale: language } = useCustomTranslator();
  const { data: cmsData, isLoading } = useGetSingleCMSQuery({});
  const logo = cmsData?.data?.footerLogo ?? "";
  const logobangla = cmsData?.data?.footerLogoBangla ?? "";
  return (
    <footer className="w-full mx-auto border-t bg-secondary backdrop-blur-md mt-10">
      <div className="w-full mx-auto px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <Link to={"/"} className="pb-3">
            {isLoading ? (
              <>
                <ButtonLoader />
              </>
            ) : language === "en" ? (
              <img className="h-[60px]" src={logo} alt="logo" />
            ) : (
              <img className="h-[60px]" src={logobangla} alt="logo" />
            )}
          </Link>
          <p className="text-sm text-gray-200">
            Manage events, sales, routes & reservations effortlessly.
          </p>
        </div>

        {/* Right Section */}
        <div className="text-sm text-gray-200">
          © {year} Iconic Soft Ltd. — All Rights Reserved
        </div>
      </div>
    </footer>
  );
};
