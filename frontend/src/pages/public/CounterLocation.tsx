import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useGetCountersLocationQuery } from "@/store/api/contact/counterApi";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import HomeLoader from "./HomeLoader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";

const CounterLocation = () => {
  const { data: locations, isLoading } = useGetCountersLocationQuery({});
  const { data: singleCms, isLoading: cmsLoading } = useGetSingleCMSQuery({});
  const aboutUsContent = singleCms?.data?.locationImage ?? "";

  if (isLoading || cmsLoading) return <HomeLoader />;
  return (
    <PageWrapper>
      {/* Top Banner */}
      <div className="w-full h-60 pt-9">
        <img
          src={aboutUsContent}
          alt="Banner"
          className="w-full h-60 object-cover"
        />
      </div>
      {/* locations */}
      <div className="max-w-7xl mx-auto  px-2 md:px-4 my-10">
        {locations?.data?.length > 0 &&
          locations?.data?.map((l: any) => (
            <div key={l.id}>
              <h1 className="text-2xl ml-4 pt-10 font-bold border-b-2 border-gray-500 inline-block pb-1 border-secondary text-secondary">
                {l?.name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {l?.Counter?.length > 0 &&
                  l?.Counter?.map((m: any) => (
                    <div key={m.id}>
                      <h1 className="text-[22px] text-gray-500 font-bold border-b pb-1">
                        {m?.name}
                      </h1>
                      <div className="mt-2 space-y-2 text-xs">
                        <p className="flex items-start gap-2 text-base text-gray-500">
                          <FaMapMarkerAlt className="text-fuchsia-600 mt-1" />
                          <span>
                            <span className="font-semibold">Address :</span>{" "}
                            {m?.address}
                          </span>
                        </p>

                        <p className="flex items-start gap-2 text-base text-gray-500">
                          <FaPhoneAlt className="text-purple-600 mt-1" />
                          <span>
                            <span className="font-semibold">Phone :</span>{" "}
                            {m?.mobile}
                          </span>
                        </p>

                        <p className="flex items-start gap-2 text-base text-gray-500">
                          <IoLocationSharp className="text-green-600 mt-1" />
                          <span>
                            <span className="font-semibold">Google Map :</span>{" "}
                            <a
                              href={m?.locationUrl}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Click Here
                            </a>
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </PageWrapper>
  );
};

export default CounterLocation;
