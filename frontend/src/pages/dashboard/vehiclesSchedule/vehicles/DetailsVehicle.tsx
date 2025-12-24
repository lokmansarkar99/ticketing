import DetailsSkeleton from "@/components/common/skeleton/DetailsSkeleton";
import LabelDescription from "@/components/common/typography/LabelDescription";
import DetailsWrapper from "@/components/common/wrapper/DetailsWrapper";
import { GridWrapper } from "@/components/common/wrapper/GridWrapper";
import { useGetSingleVehicleQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import formatter from "@/utils/helpers/formatter";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface IDetailsVehicleProps {
  id: number | null;
}

const DetailsVehicle: FC<IDetailsVehicleProps> = ({ id }) => {
  const { data: vehicleData, isLoading } = useGetSingleVehicleQuery(id);
  const { translate } = useCustomTranslator();

  if (isLoading) {
    return <DetailsSkeleton columns={2} items={10} />;
  }

  const vehicle = vehicleData?.data;

  // Helper for rendering image fields with PhotoProvider
  const renderImageField = (label: string, src?: string) => (
    <PhotoProvider>
      <LabelDescription
        heading={label}
        //@ts-ignore
        paragraph={
          src ? (
            <PhotoView src={src}>
              <img
                src={src}
                alt={label}
                className="w-20 h-20 object-cover border border-gray-300 rounded cursor-pointer"
              />
            </PhotoView>
          ) : (
            "N/A"
          )
        }
      />
    </PhotoProvider>
  );

  return (
    <DetailsWrapper
      heading={translate("যানবাহনের তথ্য", "Vehicle Details")}
      subHeading={translate(
        "আপনার যানবাহনের বিস্তারিত তথ্য এবং সাম্প্রতিক আপডেটগুলি দেখুন।",
        "View detailed information and recent updates about your vehicle."
      )}
    >
      <GridWrapper>
        {/* Basic Details */}
        <LabelDescription
          heading={translate("নিবন্ধন নম্বর", "Registration No")}
          paragraph={vehicle?.registrationNo || "N/A"}
        />
        <LabelDescription
          heading={translate("প্রস্তুতকারক কোম্পানি", "Manufacturer Company")}
          paragraph={vehicle?.manufacturerCompany || "N/A"}
        />
        <LabelDescription
          heading={translate("মডেল", "Model")}
          paragraph={vehicle?.model || "N/A"}
        />
        <LabelDescription
          heading={translate("চেসিস নম্বর", "Chassis No")}
          paragraph={vehicle?.chasisNo || "N/A"}
        />
        <LabelDescription
          heading={translate("ইঞ্জিন নম্বর", "Engine No")}
          paragraph={vehicle?.engineNo || "N/A"}
        />
        <LabelDescription
          heading={translate("উৎপত্তি দেশ", "Country of Origin")}
          paragraph={vehicle?.countryOfOrigin || "N/A"}
        />
        <LabelDescription
          heading={translate("এলসি কোড", "LC Code")}
          paragraph={vehicle?.lcCode || "N/A"}
        />
        <LabelDescription
          heading={translate("ডিপোতে ডেলিভারি", "Delivery to Depot")}
          paragraph={vehicle?.deliveryToDipo || "N/A"}
        />
        <LabelDescription
          heading={translate("ডেলিভারি তারিখ", "Delivery Date")}
          paragraph={
            vehicle?.deliveryDate
              ? formatter({ type: "date", dateTime: vehicle?.deliveryDate })
              : "N/A"
          }
        />
        <LabelDescription
          heading={translate("অর্ডার তারিখ", "Order Date")}
          paragraph={
            vehicle?.orderDate
              ? formatter({ type: "date", dateTime: vehicle?.orderDate })
              : "N/A"
          }
        />

        {/* Additional Details */}
        <LabelDescription
          heading={translate("রঙ", "Color")}
          paragraph={vehicle?.color || "N/A"}
        />
        <LabelDescription
          heading={translate("অ্যাক্টিভ", "Active")}
          paragraph={
            vehicle?.active ? translate("হ্যাঁ", "Yes") : translate("না", "No")
          }
        />
      </GridWrapper>
      {/* Two-Column Layout for Expiry Dates and Images */}
      <div className="grid grid-cols-2 gap-4">
        <LabelDescription
          heading={translate(
            "রেজিস্ট্রেশন মেয়াদ শেষের তারিখ",
            "Registration Expiry Date"
          )}
          paragraph={
            vehicle?.registrationExpiryDate
              ? formatter({
                  type: "date",
                  dateTime: vehicle?.registrationExpiryDate,
                })
              : "N/A"
          }
        />
        {renderImageField(
          translate("রেজিস্ট্রেশন ফাইল", "Registration File"),
          vehicle?.registrationFile
        )}

        <LabelDescription
          heading={translate("ফিটনেস মেয়াদ শেষের তারিখ", "Fitness Expiry Date")}
          paragraph={
            vehicle?.fitnessExpiryDate
              ? formatter({
                  type: "date",
                  dateTime: vehicle?.fitnessExpiryDate,
                })
              : "N/A"
          }
        />
        {renderImageField(
          translate("ফিটনেস সার্টিফিকেট", "Fitness Certificate"),
          vehicle?.fitnessCertificate
        )}

        <LabelDescription
          heading={translate(
            "রুট পারমিট মেয়াদ শেষের তারিখ",
            "Route Permit Expiry Date"
          )}
          paragraph={
            vehicle?.routePermitExpiryDate
              ? formatter({
                  type: "date",
                  dateTime: vehicle?.routePermitExpiryDate,
                })
              : "N/A"
          }
        />
        {renderImageField(
          translate("রুট পারমিট", "Route Permit"),
          vehicle?.routePermit
        )}

        <LabelDescription
          heading={translate(
            "ট্যাক্স টোকেন মেয়াদ শেষের তারিখ",
            "Tax Token Expiry Date"
          )}
          paragraph={
            vehicle?.taxTokenExpiryDate
              ? formatter({
                  type: "date",
                  dateTime: vehicle?.taxTokenExpiryDate,
                })
              : "N/A"
          }
        />
        {renderImageField(
          translate("ট্যাক্স টোকেন", "Tax Token"),
          vehicle?.taxToken
        )}
      </div>
    </DetailsWrapper>
  );
};

export default DetailsVehicle;
