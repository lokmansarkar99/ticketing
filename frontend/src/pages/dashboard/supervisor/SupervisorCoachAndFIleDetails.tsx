import { FC } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface ISupervisorDetailsProps {
  item: any;
}

const SupervisorCoachAndFIleDetails: FC<ISupervisorDetailsProps> = ({
  item,
}) => {
  const vehicleFiles = [
    { label: "Fitness Certificate", src: item.vehicle.fitnessCertificate },
    { label: "Registration File", src: item.vehicle.registrationFile },
    { label: "Route Permit", src: item.vehicle.routePermit },
    { label: "Tax Token", src: item.vehicle.taxToken },
  ];

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Coach Details</h2>
      <p className="mb-2">
        <strong>Coach Number:</strong> {item.coachNo}
      </p>
      <p className="mb-4">
        <strong>Registration Number:</strong> {item.registrationNo}
      </p>

      <h3 className="text-lg font-semibold mb-3">Vehicle Files</h3>
      <PhotoProvider>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {vehicleFiles.map((file, index) => (
            <div
              key={index}
              className="relative rounded-md overflow-hidden shadow-md bg-gray-200"
            >
              <PhotoView src={file.src}>
                <img
                  src={file.src}
                  alt={file.label}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </PhotoView>
              <p className="absolute bottom-0 w-full text-sm text-center bg-black bg-opacity-50 text-white py-1">
                {file.label}
              </p>
            </div>
          ))}
        </div>
      </PhotoProvider>
    </div>
  );
};

export default SupervisorCoachAndFIleDetails;
