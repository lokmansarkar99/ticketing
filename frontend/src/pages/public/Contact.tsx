import { FC } from "react";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import HomeLoader from "./HomeLoader";
import { SlEarphonesAlt } from "react-icons/sl";
import { TfiEmail } from "react-icons/tfi";
import { MdLocationOn } from "react-icons/md";

interface IContactProps {}

const Contact: FC<IContactProps> = () => {
  const { data: singleCms, isLoading } = useGetSingleCMSQuery({});
  const aboutUsContent = singleCms?.data?.contactUsImage ?? "";
  const googleMap = singleCms?.data?.googleMap ?? "";

  if (isLoading) return <HomeLoader />;

  return (
    <PageWrapper>
      <div className="flex flex-col items-center bg-white dark:bg-background">
        {/* Top Banner */}
        <div className="w-full h-60 pt-9">
          <img
            src={aboutUsContent}
            alt="Banner"
            className="w-full h-60 object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="w-11/12 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 p-2 lg:p-8 mt-16 rounded-md shadow">
          {/* Help Center */}
          <div>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">
              Help Center
            </h2>
            <p className="text-sm flex items-center justify-start gap-1.5 px-0.5">
              <SlEarphonesAlt className="text-secondary"/> +880 1833 303622

            </p>
            <p className="text-sm flex items-center justify-start gap-1.5 py-1 px-0.5">
              <TfiEmail className="text-secondary"/> info@updatedcicdsetup.com

            </p>
            <p className="text-sm flex items-start justify-start gap-1">
              <MdLocationOn size={18} className="text-secondary"/> Updated AWS CI/CD Address 
            </p>
          </div>

          {/* Send a Message */}
          <div>
            <h2 className="text-lg font-semibold mb-2 border-b pb-2">
              Send A Message
            </h2>
            <form className="flex flex-col space-y-3">
              <div>
                <label className="text-sm font-medium block">
                  Full Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:[#c004d4] dark:bg-background"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block">
                  Mobile: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Mobile"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:[#c004d4] dark:bg-background"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block">
                  Email: <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:[#c004d4] dark:bg-background"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block">
                  Subject: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:[#c004d4] dark:bg-background"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium block">
                  Details: <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-[#c004d4] dark:bg-background h-24"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#c004d4] text-white py-2 rounded hover:bg-[#8d039c] transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Map Section */}
        {googleMap && (
          <div className="w-full mt-6">
            <iframe
              src={googleMap}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
              className="rounded-md shadow-md dark:bg-background"
            ></iframe>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Contact;
