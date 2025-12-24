import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC } from "react";
import { MdLocationPin } from "react-icons/md";

interface LocationOfCounterProps {
  viaRoute?: {
    station: {
      name: string;
    };
  }[];
}

const LocationOfCounter: FC<LocationOfCounterProps> = ({ viaRoute }) => {
  
  const fixedWidth = 80; // Fixed width for each station block
  return (
    <div className="flex flex-col items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex flex-col items-center">
              <MdLocationPin
                size={24}
                className="text-primary cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm text-gray-100 bg-[#B642C5] px-2 py-1 rounded">
              {viaRoute && viaRoute.length > 0 ? (
                <div className="flex flex-row items-start gap-4">
                  {viaRoute.map((stop, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative"
                      style={{ width: `${fixedWidth}px` }} // Fixed width for uniformity
                    >
                      {/* Icon and Name */}
                      <div className="flex flex-col items-center text-center">
                        <MdLocationPin size={20} className="text-green-400" />
                        <span className="mt-1 text-xs break-words">
                          {stop.station.name}
                        </span>
                      </div>
                      {/* Top-aligned connecting line */}
                      {index !== viaRoute.length - 1 && (
                        <div
                          className="absolute left-[90px] transform -translate-x-1/2 top-0 w-full h-0.5 bg-red-400"
                          style={{ width: `${fixedWidth}px` }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No route data available</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LocationOfCounter;
