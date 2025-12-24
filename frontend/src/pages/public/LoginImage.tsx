import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import HomeLoader from "./HomeLoader";

const LoginImage = () => {
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );

  if (singleCmsLoading) return <HomeLoader />;
  return (
    <div className="w-full flex items-center justify-center mx-auto px-3 lg:px-5">
      <img
        src={singleCms?.data?.loginPageImage}
        alt="iconicBusImg"
        className="w-full h-auto lg:h-[450px] object-contain mx-auto rounded-md"
      />
    </div>
  );
};

export default LoginImage;
