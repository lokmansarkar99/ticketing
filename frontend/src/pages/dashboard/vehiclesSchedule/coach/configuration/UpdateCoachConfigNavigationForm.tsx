import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
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
import { useToast } from "@/components/ui/use-toast";
import { useGetDriversQuery } from "@/store/api/contact/driverApi";
import { useGetHelpersQuery } from "@/store/api/contact/helperApi";
import { useGetUsersQuery } from "@/store/api/contact/userApi";
import {
  useGetModalCoachInfoByDateQuery,
  useUpdateCoachConfigurationMutation,
} from "@/store/api/vehiclesSchedule/coachConfigurationApi";
import { useGetVehiclesQuery } from "@/store/api/vehiclesSchedule/vehicleApi";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActiveCoach from "./ActiveCoach";

const getTomorrowsDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow;
};

const UpdateCoachConfigNavigationForm: React.FC = () => {
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    getTomorrowsDate()
  );
  const [activeCoachOpen, setActiveCoachOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { toast } = useToast();

  const { data: tomorrowsCoachConfigurationData, isLoading } =
    useGetModalCoachInfoByDateQuery(
      format(selectedDate || getTomorrowsDate(), "yyyy-MM-dd")
    );

  const { data: vehiclesData } = useGetVehiclesQuery({});
  const { data: driverData } = useGetDriversQuery({});
  const { data: helperData } = useGetHelpersQuery({});
  const { data: supervisorsData } = useGetUsersQuery({});
  const [sendOf, setSendOf] = useState<{ key: number | null }>({ key: null });

  const [updateCoachConfiguration] = useUpdateCoachConfigurationMutation();

  const [localData, setLocalData] = useState<any[]>([]);

  useEffect(() => {
    if (tomorrowsCoachConfigurationData?.data) {
      setLocalData(
        tomorrowsCoachConfigurationData.data.map((item: any) => ({
          ...item,
          supervisorId: item.supervisorId ? Number(item.supervisorId) : null,
          driverId: item.driverId ? Number(item.driverId) : null,
          helperId: item.helperId ? Number(item.helperId) : null,
        }))
      );
    }
  }, [tomorrowsCoachConfigurationData]);

  const handleInputChange = (index: number, field: string, value: any) => {
    setLocalData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (index: number) => {
    setSendOf({ key: index });
    const data = localData[index];
    const cleanedData = removeFalsyProperties(data, [
      "discount",
      "registrationNo",
      "supervisorId",
      "driverId",
      "helperId",
      "tokenAvailable",
    ]);
    const payload = {
      discount: cleanedData.discount ? Number(cleanedData.discount) : 0,
      registrationNo: cleanedData.registrationNo,
      supervisorId: cleanedData.supervisorId,
      driverId: cleanedData.driverId,
      helperId: cleanedData.helperId,
      tokenAvailable: cleanedData.tokenAvailable
        ? Number(cleanedData.tokenAvailable)
        : 0,
    };

    const result = await updateCoachConfiguration({
      id: cleanedData.id,
      data: payload,
    });

    if (result?.data?.success) {
      setSendOf({ key: null });
      toast({
        title: "Success",
        description: "Coach configuration updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description:
          result?.data?.message || "Failed to update coach configuration.",
      });
    }
  };

  if (isLoading) {
    return <FormSkeleton columns={3} inputs={16} />;
  }

  return (
    <FormWrapper
      heading="Board"
      subHeading=""
      className=""
    >
      <div className="flex justify-between">
        {/* Date Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className=" text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "yyyy-MM-dd")
                  : "Select a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={selectedDate || new Date()}
                onSelect={(date) => {
                  setSelectedDate(date ?? null); // Handle undefined by setting to null
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Dialog open={activeCoachOpen} onOpenChange={setActiveCoachOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex justify-start"
                size="xs"
              >
                Active Coach
              </Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogTitle className="sr-only">empty</DialogTitle>
              <ActiveCoach setActiveCoachOpen={setActiveCoachOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-background">
        <thead>
          <tr>
            <th className="border px-4 py-1 text-[14px]">Coach Number</th>
            <th className="border px-4 py-1 text-[14px]">Discount</th>
            <th className="border px-4 py-1 text-[14px]">Registration</th>
            <th className="border px-4 py-1 text-[14px]">Supervisor</th>
            <th className="border px-4 py-1 text-[14px]">Driver</th>
            <th className="border px-4 py-1 text-[14px]">Helper</th>
            <th className="border px-4 py-1 text-[14px]">Token Available</th>
            <th className="border px-4 py-1 text-[14px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localData.map((coach, index) => (
            <tr key={index}>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach.coachNo}
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.helperStatus !== "Accepted" ||
                coach?.driverStatus !== "Accepted" ||
                coach?.supervisorStatus !== "Accepted" ? (
                  <Input
                    value={coach.discount}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "discount",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                  />
                ) : (
                  <></>
                )}
                <div className="text-sm capitalize">
                  {coach.discount || "N/A"}
                </div>
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {
                  <Select
                    value={coach.registrationNo || undefined}
                    onValueChange={(value) =>
                      handleInputChange(index, "registrationNo", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Registration" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiclesData?.data.map((vehicle: any) => (
                        <SelectItem
                          key={vehicle.id}
                          value={vehicle.registrationNo}
                        >
                          {vehicle.registrationNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }

                <div className="text-sm capitalize">
                  {coach.registrationNo || "N/A"}
                </div>
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.supervisorStatus !== "Accepted" && (
                  <Select
                    value={
                      coach.supervisorId
                        ? coach.supervisorId.toString()
                        : undefined
                    }
                    onValueChange={(value) =>
                      handleInputChange(index, "supervisorId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisorsData?.data
                        .filter((sup: any) => sup.role.name === "supervisor")
                        .map((supervisor: any) => (
                          <SelectItem
                            key={supervisor.id}
                            value={supervisor.id.toString()}
                          >
                            {supervisor.userName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex justify-between text-center">
                  <div className="text-sm capitalize">
                    {coach?.supervisor?.userName || "N/A"}
                  </div>
                  <div
                    className={`text-sm  ${
                      coach?.supervisorStatus === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {`${coach?.supervisorStatus}`}
                  </div>
                </div>
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.driverStatus !== "Accepted" && (
                  <Select
                    value={
                      coach.driverId ? coach.driverId.toString() : undefined
                    }
                    onValueChange={(value) =>
                      handleInputChange(index, "driverId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {driverData?.data.map((driver: any) => (
                        <SelectItem
                          key={driver.id}
                          value={driver.id.toString()}
                        >
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex justify-between text-center">
                  <div className="text-sm capitalize">
                    {driverData?.data.find(
                      (drv: any) => drv.id === coach.driverId
                    )?.name || "N/A"}
                  </div>
                  <div
                    className={`text-sm   ${
                      coach?.driverStatus === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {`${coach?.driverStatus}`}
                  </div>
                </div>
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.helperStatus !== "Accepted" && (
                  <Select
                    value={
                      coach.helperId ? coach.helperId.toString() : undefined
                    }
                    onValueChange={(value) =>
                      handleInputChange(index, "helperId", parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Helper" />
                    </SelectTrigger>
                    <SelectContent>
                      {helperData?.data.map((helper: any) => (
                        <SelectItem
                          key={helper.id}
                          value={helper.id.toString()}
                        >
                          {helper.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="flex justify-between text-center">
                  <div className="text-sm capitalize">
                    {helperData?.data.find(
                      (hlp: any) => hlp.id === coach.helperId
                    )?.name || "N/A"}
                  </div>
                  <div
                    className={`text-sm ${
                      coach?.helperStatus === "Accepted"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {`${coach?.helperStatus}`}
                  </div>
                </div>
              </td>
              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.helperStatus !== "Accepted" ||
                coach?.driverStatus !== "Accepted" ||
                coach?.supervisorStatus !== "Accepted" ? (
                  <Input
                    value={coach.tokenAvailable}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "tokenAvailable",
                        Number(e.target.value)
                      )
                    }
                    type="number"
                  />
                ) : (
                  <></>
                )}
                <div className="text-sm capitalize">
                  {coach.tokenAvailable || "N/A"}
                </div>
              </td>

              <td className="border align-top px-4 py-1 text-[14px]">
                {coach?.helperStatus !== "Accepted" ||
                coach?.driverStatus !== "Accepted" ||
                coach?.supervisorStatus !== "Accepted" ? (
                  <Button
                    onClick={() => handleSave(index)}
                    variant="green"
                    className="w-full"
                    disabled={sendOf.key === index}
                  >
                    SEND
                  </Button>
                ) : (
                  <h2 className="text-sm text-green-500 font-semibold">
                    Updated
                  </h2>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </FormWrapper>
  );
};

export default UpdateCoachConfigNavigationForm;
