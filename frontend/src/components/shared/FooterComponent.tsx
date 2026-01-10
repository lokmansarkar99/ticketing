import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { SlEarphonesAlt } from "react-icons/sl";
import { MdLocationOn } from "react-icons/md";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import HomeLoader from "@/pages/public/HomeLoader";
import { useGetPagesQuery } from "@/store/api/page/pageApi";
import { Link } from "react-router-dom";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { locale: language } = useCustomTranslator();
  const { data: cmsData, isLoading } = useGetSingleCMSQuery({});
  const { data: pages, isLoading: pagesLoading } = useGetPagesQuery({});
  const phone = cmsData?.data?.supportNumber1 ?? "";
  const address = cmsData?.data?.address ?? "";
  const email = cmsData?.data?.email ?? "";
  const facebook = cmsData?.data?.facebook ?? "";
  const instagram = cmsData?.data?.instagram ?? "";
  const linkedin = cmsData?.data?.linkedin ?? "";
  const logo = cmsData?.data?.footerLogo ?? "";
  const logobangla = cmsData?.data?.footerLogoBangla ?? "";
  const qr = cmsData?.data?.qrImage ?? "";
  const youtube = cmsData?.data?.youtube ?? "";

  const policyPages =
    pages?.data?.filter((page: any) => page?.type === "Policy") || [];

  const otherPages =
    pages?.data?.filter((page: any) => page?.type === "Navigation") || [];

  if (isLoading || pagesLoading) return <HomeLoader />;
  return (
    <footer className="w-full  text-white  pb-14 lg:pb-0">
      {/* Grid Layout */}
      <div className="bg-[#ed1c24]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-b border-white/20 pb-6 max-w-7xl mx-auto px-2 md:px-4 text-center md:text-left">
          {/* Logo + Info */}
          <div className="order-1 flex flex-col items-center md:items-start gap-3">
            <Link to={"/"} className="pb-3">
              {language === "en" ? (
                <img className="h-[60px]" src={logo} alt="logo" />
              ) : (
                <img className="h-[60px]" src={logobangla} alt="logo" />
              )}
            </Link>
            <p className="text-sm flex items-center justify-center md:justify-start gap-3 font-semibold">
              <SlEarphonesAlt className="font-bold" size={20} /> {phone}
            </p>
            <p className="text-sm flex items-center justify-center md:justify-start gap-3 font-semibold">
              <TfiEmail size={18} /> {email}
            </p>
            <p className="text-sm flex items-start justify-center md:justify-start gap-4 font-semibold -ml-0.5 w-5/6 md:w-full">
              <span className="w-3 mr-0.5 -m-[1px]">
                <MdLocationOn size={25} />
              </span>{" "}
              {address}
            </p>
          </div>

          {/* Policies (desktop only) */}
          <div className="order-2 hidden lg:block">
            <h3 className="text-lg font-semibold mb-2 border-b border-white/30 inline-block">
              Policies
            </h3>
            <ul className="space-y-1 mt-2 text-sm">
              {policyPages?.length > 0 &&
                policyPages?.map((page: any) => (
                  <Link to={`/pages/${page?.slug}`}>
                    <li className="text-white transition hover:text-white/75 mb-4">
                      {page?.title}
                    </li>
                  </Link>
                ))}
            </ul>
          </div>

          {/* Navigation (desktop only) */}
          <div className="order-3 hidden lg:block">
            <h3 className="text-lg font-semibold mb-2 border-b border-white/30 inline-block">
              Navigation
            </h3>
            <ul className="space-y-1 mt-2 text-sm">
              <Link to="/blogs">
                <li className="text-white transition hover:text-white/75">
                  Blog
                </li>
              </Link>
              {otherPages?.length > 0 &&
                otherPages?.map((page: any) => (
                  <Link to={`/pages/${page?.slug}`}>
                    <li className="text-white transition hover:text-white/75 my-4">
                      {page?.title}
                    </li>
                  </Link>
                ))}
            </ul>
          </div>

          {/* Policies + Navigation (mobile only) */}
          <div className="block lg:hidden order-2 col-span-1">
            <div className="flex flex-wrap justify-center gap-10">
              {/* Policies */}
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-white/30 inline-block">
                  Policies
                </h3>
                <ul className="space-y-1 mt-2 text-sm">
                  {policyPages?.length > 0 &&
                    policyPages?.map((page: any) => (
                      <Link to={`/pages/${page?.slug}`}>
                        <li className="text-white transition hover:text-white/75 my-4">
                          {page?.title}
                        </li>
                      </Link>
                    ))}
                </ul>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-white/30 inline-block">
                  Navigation
                </h3>
                <ul className="space-y-1 mt-2 text-sm">
                  <Link to="/blogs">
                    <li className="text-white transition hover:text-white/75">
                      Blog
                    </li>
                  </Link>
                  {otherPages?.length > 0 &&
                    otherPages?.map((page: any) => (
                      <Link to={`/pages/${page?.slug}`}>
                        <li className="text-white transition hover:text-white/75 my-4">
                          {page?.title}
                        </li>
                      </Link>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="order-4 flex flex-col items-center lg:items-start">
            <h3 className="text-lg text-start font-semibold mb-2 border-b w-28 border-white/30">
              Social Media
            </h3>
            <div className="flex space-x-3 mt-2">
              <a
                href={facebook}
                className="bg-white/20 p-2 rounded-full hover:bg-[#1877F2] hover:text-white transition"
              >
                <FaFacebookF />
              </a>
              <a
                href={instagram}
                className="bg-white/20 p-2 rounded-full hover:bg-gradient-to-tr from-pink-500 to-orange-400 hover:text-white transition"
              >
                <FaInstagram />
              </a>
              <a
                href={linkedin}
                className="bg-white/20 p-2 rounded-full hover:bg-[#0A66C2] hover:text-white transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={youtube}
                className="bg-white/20 p-2 rounded-full hover:bg-[#FF0000] hover:text-white transition"
              >
                <FaYoutube />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold pb-2">Scan for QR</p>
              <img src={qr} alt="qr-code" className="w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-tertiary">
        <div className="py-5 flex flex-col md:flex-row items-center justify-between text-sm text-white/80 text-center md:text-left gap-3  max-w-7xl mx-auto px-2 md:px-4">
          <div>
            {currentYear} ©{" "}
            <span className="font-semibold text-white">Prantik Paribahan Ltd.</span> —
            All Rights Reserved
          </div>
          <div>
            Powered by:{" "}
            <span className="font-semibold text-white">Iconic Soft Ltd</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
