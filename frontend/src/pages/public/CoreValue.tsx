import { Heading } from "@/components/common/typography/Heading";
import { useGetCoreValueAllListQuery } from "@/store/api/corevalue/coreValueApi";
import HomeLoader from "./HomeLoader";


export const CoreValue = () => {
  const {data:coreValue, isLoading}=useGetCoreValueAllListQuery({})
  if(isLoading) return <HomeLoader/>
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-transparent dark:border p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-300 mb-10">
        Our Core Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-7 lg:gap-5 justify-items-center items-center">
        {coreValue?.data?.length > 0 &&
          coreValue?.data?.map((value: any, index:number) => (
            <>
              <div
                key={value.id}
                className={`relative ${
                  index % 2 === 0
                    ? " border border-secondary bg-[#f3ddf2] dark:bg-background rounded-md"
                    : "border border-blue-600 bg-blue-100 dark:bg-background rounded-md"
                }`}
              >
                <Heading size={"h6"} className="pt-7 pb-3 text-center">
                  {value.title}
                </Heading>
                <p className="px-4 pb-5 text-center text-sm">{value.description}</p>
                <div
                  className={`absolute -top-5 left-0 right-0 flex justify-center items-center`}
                >
                  <div
                    className={`p-2 bg-slate-50 rounded-full ${
                      index % 2 === 0
                        ? "border border-secondary"
                        : " border border-blue-600"
                    }`}
                  >
                    <img src={value.image} alt="icon" className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};
