import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleRouteQuery } from "@/store/api/vehiclesSchedule/routeApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";

interface IDetailsRouteProps {
  id: number | null;
}

const DetailsRoute: FC<IDetailsRouteProps> = ({ id }) => {
  const { data: routeData, isLoading: routeLoading } =
    useGetSingleRouteQuery(id);
  const { translate } = useCustomTranslator();

  if (routeLoading) {
    return <DetailsSkeleton columns={3} items={11} />;
  }

  return (
    <DetailsWrapper
      heading={translate("রুট ওভারভিউ", "Route Overview")}
      subHeading={translate(
        "আপনার রুট তথ্য এবং সাম্প্রতিক কার্যকলাপের সারসংক্ষেপ।",
        "Summary of your route information and recent activities."
      )}
    >
      <GridWrapper>
        <LabelDescription
          heading={translate("রুটের নাম", "Route Name")}
          paragraph={routeData?.data?.routeName}
        />
        <LabelDescription
          heading={translate("রুটের ধরন", "Route Type")}
          paragraph={routeData?.data?.routeType}
        />
        <LabelDescription
          heading={translate("রুট নির্দেশনা", "Route Direction")}
          paragraph={routeData?.data?.routeDirection.replace("_", " ")}
        />
        <LabelDescription
          heading={translate("দূরত্ব (কিলো)", "Distance (kilo)")}
          paragraph={routeData?.data?.kilo}
        />
        <LabelDescription
          heading={translate(
            "যাত্রী তথ্যের জন্য অনুমতি",
            "Permission For Passenger Info"
          )}
          paragraph={routeData?.data?.isPassengerInfoRequired ? "Yes" : "No"}
        />
        <LabelDescription
          heading={translate("মাধ্যমে", "Via")}
          paragraph={routeData?.data?.via}
        />

        <LabelDescription
          heading={translate("শুরুর পয়েন্ট", "Starting Point")}
          paragraph={formatter({
            type: "words",
            words: routeData?.data?.fromStation?.name,
          })}
        />
        <LabelDescription
          heading={translate("শেষ পয়েন্ট", "Ending Point")}
          paragraph={formatter({
            type: "words",
            words: routeData?.data?.toStation?.name,
          })}
        />
        <LabelDescription
          heading={translate("মাধ্যমে স্টেশনগুলি", "Via Stations")}
          paragraph={formatter({
            type: "words",
            words: routeData?.data?.viaRoute
              ?.map((singleRoute: any) => singleRoute?.station?.name)
              ?.join(" ➜ "),
          })}
        />
        <LabelDescription
          heading={translate("তৈরি হয়েছে", "Create At")}
          paragraph={formatter({
            type: "date&time",
            dateTime: routeData?.data?.createdAt,
          })}
        />
      </GridWrapper>
    </DetailsWrapper>
  );
};

export default DetailsRoute;
