import { LiaFacebook } from "react-icons/lia";
import { FiInstagram } from "react-icons/fi";
import { FiTwitter } from "react-icons/fi";
import { CiLinkedin } from "react-icons/ci";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { Paragraph } from "../typography/Paragraph";
import { PiHeadset } from "react-icons/pi";
import { IoIosMail } from "react-icons/io";
const PublicNavigationTop = () => {
  const { data: singleCms } = useGetSingleCMSQuery({});

  return (
    <header className="sticky z-40 top-0 bg-[#ed1c24] dark:bg-[#1f2128] py-[1px]">
      <section className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Paragraph className="w-6/12 text-sm font-semibold hidden lg:block text-white">
          <div className="flex items-center">
           <span className="flex items-center gap-1"><PiHeadset /> {singleCms?.data?.supportNumber1}</span> | 
           <span className="flex items-center gap-1"><IoIosMail /> {singleCms?.data?.email}</span>
            </div>
        </Paragraph>

        <div className="nav font-semibold text-lg text-white">
         
        </div>

        <div className="w-3/12 flex justify-end text-white">
          <ul className="flex gap-2 lg:gap-3 items-center">
            <li className="p-">
              <a href={singleCms?.data?.facebook}>
                <LiaFacebook className="text-[26px]" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.instagram}>
                <FiInstagram className="text-xl" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.twitter}>
                <FiTwitter className="text-xl" />
              </a>
            </li>
            <li className="">
              <a href={singleCms?.data?.linkedin}>
                <CiLinkedin className="text-2xl" />
              </a>
            </li>
          </ul>
        </div>
      </section>
    </header>
  );
};

export default PublicNavigationTop;
