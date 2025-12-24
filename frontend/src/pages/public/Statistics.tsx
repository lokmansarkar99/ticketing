
import HomeLoader from "./HomeLoader";
import { useGetUserStatisticAllListQuery } from "@/store/api/statistics/statisticsApi";

export const Statistics = () => {
  const { data: coreValue, isLoading } = useGetUserStatisticAllListQuery({});
  if (isLoading) return <HomeLoader />;
  return (
    <div className="max-w-7xl mx-auto  px-2 md:px-4 dark:border p-6">
      <div className="flex flex-wrap justify-between gap-4 items-center">
        {coreValue?.data?.length > 0 &&
          coreValue?.data?.map((value: any) => (
            <>
              <div key={value.id} className="flex items-center gap-1.5">
                <img src={value.image} alt="icon" className="w-20 h-20" />
                <div>
                  <h3 className="text-sm font-semibold">
                    {value.title}
                  </h3>
                  <p className="text-xs">
                    {value.description}
                  </p>
                </div>
              </div>
            </>
          ))}
      </div>
    </div>
  );
};
