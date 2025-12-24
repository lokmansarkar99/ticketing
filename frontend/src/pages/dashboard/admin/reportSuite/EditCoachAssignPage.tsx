import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SelectSkeleton from "@/components/common/skeleton/SelectSkeleton";
import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useGetUserListQuery } from "@/store/api/adminReport/adminReportApi";
import { useGetCountersQuery } from "@/store/api/contact/counterApi";
import { useGetSingleCoachAssignQuery, useUpdateCoachAssignMutation } from "@/store/api/vehiclesSchedule/coachAssignApi";
import { useGetRoutesQuery } from "@/store/api/vehiclesSchedule/routeApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";

// Props interface
interface EditCoachAssignPageProps {
  id: number;
  user: any;
  setCoachAssignState: Dispatch<SetStateAction<any>>; // Adjust type if needed
}

// Validation schema
const coachAssignSchema = z.object({
  counterId: z.number().min(1, "Counter is required"),
  userId: z.number().min(1, "User is required"),
  day: z.number().min(0).max(6, "Day must be between 0-6"),
  hour: z.number().min(0).max(23, "Hour must be between 0-23"),
  minute: z.number().min(0).max(59, "Minute must be between 0-59"),
  bookingRouteIds: z.array(z.number()).min(1, "At least one booking route is required"),
  sellingRouteIds: z.array(z.number()).min(1, "At least one selling route is required"),
});

type CoachAssignFormData = z.infer<typeof coachAssignSchema>;

const EditCoachAssignPage: FC<EditCoachAssignPageProps> = ({ id, user }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const navigate = useNavigate();

  const [counterIdSelect, setCounterIdSelect] = useState<number | null>(null);
  const [bookingRouteIds, setBookingRouteIds] = useState<number[]>([]);
  const [sellingRouteIds, setSellingRouteIds] = useState<number[]>([]);
  const [selectedBookingRoute, setSelectedBookingRoute] = useState<number | null>(null);
  const [selectedSellingRoute, setSelectedSellingRoute] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(user || null); 

  // Fetch data
  const { data: existingData, isLoading: existingDataLoading } = useGetSingleCoachAssignQuery(Number(id));
  const { data: counterData, isLoading: counterLoading } = useGetCountersQuery({ page: 1, size: 99999 });
  const { data: userList, isLoading: userLoading } = useGetUserListQuery({ page: 1, size: 99999 });
  const { data: routesData, isLoading: routesLoading } = useGetRoutesQuery({});
  const [updateCoachAssign, { isLoading }] = useUpdateCoachAssignMutation();

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<CoachAssignFormData>({
    resolver: zodResolver(coachAssignSchema),
    defaultValues: {
      day: 0,
      hour: 0,
      minute: 0,
      bookingRouteIds: [],
      sellingRouteIds: [],
    },
  });

  // Populate form
  useEffect(() => {
    if (existingData?.data) {
      const data = existingData.data;

      reset({
        counterId: data.counterId,
        userId: data.userId,
        day: data.day,
        hour: data.hour,
        minute: data.minute,
        bookingRouteIds: data.BookingRoutePermission?.map((r: { routeId: number }) => r.routeId) || [],
        sellingRouteIds: data.SellingRoutePermission?.map((r: { routeId: number }) => r.routeId) || [],
      });

      setCounterIdSelect(data.counterId);
         setSelectedUserId(data.userId);
    setSelectedUserName(user);
      setBookingRouteIds(data.BookingRoutePermission?.map((r: { routeId: number }) => r.routeId) || []);
      setSellingRouteIds(data.SellingRoutePermission?.map((r: { routeId: number }) => r.routeId) || []);
    }
  }, [existingData, reset, user]);

  const filteredUsers = userList?.data?.filter((u: any) => +u.counterId === counterIdSelect) || [];

  const onSubmit = async (data: CoachAssignFormData) => {
    try {
      const result = await updateCoachAssign({
        id: Number(id),
        data: {
          ...data,
          bookingRouteIds,
          sellingRouteIds,
        },
      });

      if (result?.data?.success) {
        toast({
          title: translate("কোচ অ্যাসাইনমেন্ট আপডেট করা হয়েছে", "Coach Assignment Updated"),
          description: translate("কোচ অ্যাসাইনমেন্ট সফলভাবে আপডেট করা হয়েছে।", "Coach assignment updated successfully."),
        });
        navigate("/admin/coach_assign_to_counter_master");
      }
    } catch (error) {
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate("কোচ অ্যাসাইনমেন্ট আপডেট করতে সমস্যা হয়েছে।", "There was a problem updating the coach assignment."),
      });
    }
  };

  const addBookingRoute = () => {
    if (selectedBookingRoute && !bookingRouteIds.includes(selectedBookingRoute)) {
      const newRoutes = [...bookingRouteIds, selectedBookingRoute];
      setBookingRouteIds(newRoutes);
      setValue("bookingRouteIds", newRoutes);
      setSelectedBookingRoute(null);
    }
  };

  const removeBookingRoute = (routeId: number) => {
    const newRoutes = bookingRouteIds.filter(id => id !== routeId);
    setBookingRouteIds(newRoutes);
    setValue("bookingRouteIds", newRoutes);
  };

  const addSellingRoute = () => {
    if (selectedSellingRoute && !sellingRouteIds.includes(selectedSellingRoute)) {
      const newRoutes = [...sellingRouteIds, selectedSellingRoute];
      setSellingRouteIds(newRoutes);
      setValue("sellingRouteIds", newRoutes);
      setSelectedSellingRoute(null);
    }
  };

  const removeSellingRoute = (routeId: number) => {
    const newRoutes = sellingRouteIds.filter(id => id !== routeId);
    setSellingRouteIds(newRoutes);
    setValue("sellingRouteIds", newRoutes);
  };

  if (existingDataLoading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">Loading...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* HEADER */}
      <div className="flex justify-between items-center my-4">
        <h3 className="text-xl font-semibold">
          Edit Route Assign To User For Seat Booking / Ticket Selling
        </h3>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white shadow rounded-xl p-6"
      >
        {/* COUNTER SELECT */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {translate("কাউন্টার নির্বাচন করুন", "Select Counter")} *
          </label>
          <Select
            value={counterIdSelect?.toString() || ""}
            onValueChange={(value: string) => {
              const id = +value;
              setCounterIdSelect(id);
              setValue("counterId", id);
            }}
          >
            <SelectTrigger className="bg-background h-10">
              <SelectValue
                placeholder={translate(
                  "কাউন্টার নির্বাচন করুন",
                  "Select Counter"
                )}
              />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {counterLoading && <SelectSkeleton />}
              {!counterLoading &&
                counterData?.data?.map((counter: any) => (
                  <SelectItem key={counter.id} value={counter.id.toString()}>
                    {counter.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.counterId && (
            <p className="text-red-500 text-sm">{errors.counterId.message}</p>
          )}
        </div>

        {/* USER SELECT */}
<div className="flex flex-col gap-2">
  <label className="text-sm font-medium">
    {translate("ব্যবহারকারী নির্বাচন করুন", "Select User")} *
  </label>
  <Select
  value={selectedUserId?.toString() || ""}
  onValueChange={(value: string) => {
    const id = +value;
    setSelectedUserId(id);

    // Find userName from userList
    const userObj = userList?.data?.find((u: { id: number; }) => u.id === id);
    setSelectedUserName(userObj?.userName || "");

    setValue("userId", id);
  }}
  disabled={!counterIdSelect}
>
  <SelectTrigger className="bg-background h-10">
    <SelectValue
      placeholder={selectedUserName || translate("ব্যবহারকারী নির্বাচন করুন", "Select User")}
    />
  </SelectTrigger>
  <SelectContent className="bg-background">
    {userLoading && <SelectSkeleton />}
    {!userLoading &&
      filteredUsers.map((u: { id: number; userName: string }) => (
        <SelectItem key={u.id} value={u.id.toString()}>
          {u.userName}
        </SelectItem>
      ))}
    {!userLoading && filteredUsers.length === 0 && counterIdSelect && (
      <div className="p-2 text-sm text-gray-500">
        {translate("কোন ব্যবহারকারী নেই", "No users found")}
      </div>
    )}
  </SelectContent>
</Select>

  {errors.userId && (
    <p className="text-red-500 text-sm">{errors.userId.message}</p>
  )}
</div>

        {/* BOOKING ROUTE SELECT */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                {translate("রুট নির্বাচন করুন", "Route List for Booking Seat")} *
              </label>
              <Select
                value={selectedBookingRoute?.toString() || ""}
                onValueChange={(value: string) => {
                  const id = +value;
                  setSelectedBookingRoute(id);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "রুট নির্বাচন করুন",
                      "Route List for Booking Seat"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!routesLoading &&
                    routesData?.data?.length > 0 &&
                    routesData?.data?.map((singleRoute: any) => (
                      <SelectItem
                        key={singleRoute?.id}
                        value={singleRoute?.id?.toString()}
                      >
                        {singleRoute?.routeName}
                      </SelectItem>
                    ))}
                  {routesLoading && (
                    <SelectSkeleton />
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* ADD BUTTON */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={addBookingRoute}
                disabled={!selectedBookingRoute}
              >
                Add Route
              </Button>
            </div>
          </div>

          {/* BOOKING ROUTE LIST */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {translate("নির্বাচিত রুটসমূহ", "Selected Routes for Booking")} *
            </label>
            <div className="border rounded-md p-3 min-h-24 bg-gray-50">
              {bookingRouteIds.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {translate(
                    "কোন রুট নির্বাচন করা হয়নি",
                    "No routes selected"
                  )}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bookingRouteIds.map((routeId) => {
                     routesData?.data?.find(
                      (r: any) => r.id === routeId
                    );
                    return (
                      <div
                        key={routeId}
                        className=" rounded-full text-sm flex items-center gap-2"
                      >
                        {`${routeId},`}
                        <button
                          type="button"
                          onClick={() => removeBookingRoute(routeId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {errors.bookingRouteIds && (
              <p className="text-red-500 text-sm">
                {errors.bookingRouteIds.message}
              </p>
            )}
          </div>
        </div>

        {/* SELLING ROUTE SELECT */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                {translate(
                  "রুট নির্বাচন করুন",
                  "Route List for Selling Ticket"
                )} *
              </label>
              <Select
                value={selectedSellingRoute?.toString() || ""}
                onValueChange={(value: string) => {
                  const id = +value;
                  setSelectedSellingRoute(id);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={translate(
                      "রুট নির্বাচন করুন",
                      "Route List for Selling Ticket"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!routesLoading &&
                    routesData?.data?.length > 0 &&
                    routesData?.data?.map((singleRoute: any) => (
                      <SelectItem
                        key={singleRoute?.id}
                        value={singleRoute?.id?.toString()}
                      >
                        {singleRoute?.routeName}
                      </SelectItem>
                    ))}
                  {routesLoading && (
                    <SelectSkeleton />
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* ADD BUTTON */}
            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={addSellingRoute}
                disabled={!selectedSellingRoute}
              >
                Add Route
              </Button>
            </div>
          </div>

          {/* SELLING ROUTE LIST */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {translate("নির্বাচিত রুটসমূহ", "Selected Routes for Selling")} *
            </label>
            <div className="border rounded-md p-3 bg-gray-50">
              {sellingRouteIds.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {translate(
                    "কোন রুট নির্বাচন করা হয়নি",
                    "No routes selected"
                  )}
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {sellingRouteIds.map((routeId) => {
                    routesData?.data?.find(
                      (r: any) => r.id === routeId
                    );
                    return (
                      <div
                        key={routeId}
                        className=" rounded-full text-sm flex items-center gap-2"
                      >
                        {`${routeId},`}
                        <button
                          type="button"
                          onClick={() => removeSellingRoute(routeId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {errors.sellingRouteIds && (
              <p className="text-red-500 text-sm">
                {errors.sellingRouteIds.message}
              </p>
            )}
          </div>
        </div>

        {/* Booking Time Before/After */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {translate("বুকিং সময় আগে/পরে", "Booking Time Before/After")}
          </label>
          <div className="flex gap-4">
            {/* Day Input */}
            <div className="flex flex-col w-1/3">
              <label className="text-xs text-gray-600">DD</label>
              <input
                type="number"
                min={0}
                max={6}
                placeholder="DD"
                className="border rounded-md p-2 text-sm bg-gray-50"
                {...register("day", { valueAsNumber: true })}
              />
              {errors.day && (
                <p className="text-red-500 text-xs">{errors.day.message}</p>
              )}
            </div>
            {/* Hour Input */}
            <div className="flex flex-col w-1/3">
              <label className="text-xs text-gray-600">HH</label>
              <input
                type="number"
                min={0}
                max={23}
                placeholder="HH"
                className="border rounded-md p-2 text-sm bg-gray-50"
                {...register("hour", { valueAsNumber: true })}
              />
              {errors.hour && (
                <p className="text-red-500 text-xs">{errors.hour.message}</p>
              )}
            </div>           {/* Minute Input */}
            <div className="flex flex-col w-1/3">
              <label className="text-xs text-gray-600">MM</label>
              <input
                type="number"
                min={0}
                max={59}
                placeholder="MM"
                className="border rounded-md p-2 text-sm bg-gray-50"
                {...register("minute", { valueAsNumber: true })}
              />
              {errors.minute && (
                <p className="text-red-500 text-xs">{errors.minute.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON (fallback in form, top already has buttons too) */}
        <div className="flex justify-end gap-2">
         
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default EditCoachAssignPage;
