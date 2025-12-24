import { FC } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CoachViaRoute {
  counter: { name: string };
  boardingTime: string | null;
  droppingTime: string | null;
}

interface CoachReportingTimeProps {
  viaRoute: CoachViaRoute[];
}

const CoachReportingTime: FC<CoachReportingTimeProps> = ({ viaRoute = [] }) => {
  if (!viaRoute || viaRoute.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <button className="focus:outline-none">
            <AiFillQuestionCircle
              size={22}
              className="text-primary hover:scale-110 transition-transform duration-200"
            />
          </button>
        </TooltipTrigger>

        <TooltipContent className="p-0 border-4 border-primary shadow-2xl">
          <div className="bg-secondary text-white font-bold text-xs leading-tight tracking-wider">
            {/* Header */}
            <div className="bg-primary py-3 text-center text-lg border-b-4 border-primary">
              COACH REPORTING TIME
            </div>

            {/* Body - Grid Layout */}
            <div className="p-4">
              {viaRoute.map((stop, index) => {
                const counterName = stop.counter?.name || "Unknown";
               
                return (
                  <div
                    key={index}
                    className="grid grid-cols-2 border-b border-white last:border-b-0 py-3"
                  >
                    {/* Counter Name */}
                    <div className="pr-4 text-left uppercase">
                      {counterName}
                    </div>

                    {/* Time */}
                    <div className="pl-4 text-right text-yellow-300 font-mono">
                      {stop?.boardingTime || stop?.droppingTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CoachReportingTime;