"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import {
  useGetCoachConfigurationsQuery,
  // useUpdateCoachConfigurationMutation,
} from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActiveCoach from "./ActiveCoach";
const formatDate = (date: Date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

const getTomorrowsDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

const CoachActiveInActiveList: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    getTomorrowsDate()
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [coachSearch, setCoachSearch] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedAction, setSelectedAction] = useState(""); // open / close
  const [filters, setFilters] = useState<any>(null);
  const [activeCoachOpen, setActiveCoachOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [activeDefaultCoachOpen, setActiveDefaultCoachOpen] = useState(false);

  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery({});

  const {
    data: coachConfigData,
    isLoading,
    refetch,
  } = useGetCoachConfigurationsQuery(
    filters || {
      date: format(getTomorrowsDate(), "yyyy-MM-dd"),
    }
  );

  // const [updateCoachConfiguration] = useUpdateCoachConfigurationMutation();
  const [coachConfigurationsList, setCoachConfigurationsList] = useState<any[]>(
    []
  );

  React.useEffect(() => {
    if (coachConfigData?.data) {
      setCoachConfigurationsList(coachConfigData?.data);
    }
  }, [coachConfigData]);

  const handleSearch = () => {
    const params: any = {
      date: selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : format(getTomorrowsDate(), "yyyy-MM-dd"),
    };

    if (selectedRoute) params.route = selectedRoute;
    if (coachSearch) params.coach = coachSearch;
    if (selectedAction) params.active = selectedAction === "open";
    setFilters(params);
    setTimeout(() => refetch(), 300);
  };
  
  if (isLoading) return <FormSkeleton columns={3} inputs={16} />;

  return (
    <FormWrapper
      className="relative"
      heading="Coach Active / Inactive"
      subHeading="View and manage coach active/inactive status."
    >
      <div className="absolute top-0 right-0">
        <Dialog
          open={activeDefaultCoachOpen}
          onOpenChange={setActiveDefaultCoachOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="flex justify-start" size="xs">
              Active Coach
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogTitle className="sr-only">empty</DialogTitle>
            <ActiveCoach setActiveCoachOpen={setActiveCoachOpen} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 mt-3">
        {/* Coach Search */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Coach</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search coach..."
              value={coachSearch}
              onChange={(e) => setCoachSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bus Route */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Bus Route</label>
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select route" />
            </SelectTrigger>
            <SelectContent>
              {routesLoading && (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              )}
              {!routesLoading &&
                routesData?.data?.length > 0 &&
                routesData.data.map((route: any) => (
                  <SelectItem key={route.id} value={route.id.toString()}>
                    {route.routeName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Date</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-left justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "yyyy-MM-dd")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate || new Date()}
                onSelect={(date) => {
                  setSelectedDate(date ?? null);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Action</label>
          <Select value={selectedAction} onValueChange={setSelectedAction}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="close">Close</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Search
          </Button>
        </div>

        {/* action modal */}
        {activeCoachOpen && (
          <Dialog open={activeCoachOpen} onOpenChange={setActiveCoachOpen}>
            <DialogContent size="sm">
              <DialogTitle className="sr-only">empty</DialogTitle>
              <ActiveCoach
                setActiveCoachOpen={setActiveCoachOpen}
                defaultStatus={selectedCoach?.active ?? null}
                selectedCoach={selectedCoach}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full bg-background">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Coach No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Journey Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                From Counter
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Bus Route
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Coach Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Arrival Counter
              </th>
              {/* <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Arrival On
              </th> */}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Sign
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {coachConfigurationsList?.map((item: any, index: number) => (
              <tr
                key={index}
                className={`${
                  item.active ? "bg-white" : "bg-pink-300"
                } border-b transition font-medium`}
              >
                <td className="px-4 py-3 text-sm">{item?.coachNo || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{item?.schedule || "N/A"}</td>
                <td className="px-4 py-3 text-sm">
                  {item?.fromCounter?.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item?.route?.routeName || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item?.coachType || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item?.destinationCounter?.name || "N/A"}
                </td>
                {/* <td className="px-4 py-3 text-sm">
                  {item?.arrival || "N/A"}
                </td> */}
                <td className="px-4 py-3 text-sm">
                  {formatDate(selectedDate as Date) || "N/A"}
                </td>

                {/* Sign */}
                <td className="px-4 py-3 text-center">
                  {item.active ? (
                    <img
                      src="https://static-busbd.bdtickets.com/skins/busbdadmin/default/images/forward.png"
                      alt=""
                      className="w-7 h-7 mx-auto"
                    />
                  ) : (
                    <img
                      src="https://static-busbd.bdtickets.com/skins/busbdadmin/default/images/stop_icon.png"
                      alt=""
                      className="w-7 h-7 mx-auto"
                    />
                  )}
                </td>

                {/* Action text only */}
                <td className="px-4 py-3 text-sm text-center font-semibold">
                  {item.active === true ? (
                    <button
                      onClick={() => {
                        setSelectedCoach({
                          coachNo: item?.coachNo,
                          active: false,
                          departureDate: new Date(), // default today
                        });
                        setActiveCoachOpen(true);
                      }}
                      className="bg-red-600 cursor-pointer hover:underline px-2 py-0.5 rounded-md"
                    >
                      <span className="text-white">CLOSE IT</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCoach({
                          coachNo: item?.coachNo,
                          active: true,
                          departureDate: new Date(), // default today
                        });
                        setActiveCoachOpen(true);
                      }}
                      className="bg-[#008000] cursor-pointer hover:underline px-2 py-0.5 rounded-md"
                    >
                      <span className="text-white">OPEN IT</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-600">
        Page 1 of 9 | Showing {coachConfigurationsList.length} records
      </div>
    </FormWrapper>
  );
};

export default CoachActiveInActiveList;
