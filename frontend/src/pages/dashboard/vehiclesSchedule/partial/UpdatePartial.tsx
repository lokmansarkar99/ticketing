import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUpdatePartialInfoMutation } from "@/store/api/vehiclesSchedule/partialApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UpdatePartialProps {
  partialData: {
    id: number | null;
    partialPercentage: number | string;
    time: string;
    counterBookingTime: string;
  };
}

const UpdatePartial: React.FC<UpdatePartialProps> = ({ partialData }) => {
  const { toast } = useToast();

  // Update mutation
  const [updatePartialInfo, { isLoading: isUpdating }] =
    useUpdatePartialInfoMutation();

  // Form setup with react-hook-form
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      partialPercentage: "",
      time: "",
      counterBookingTime: "",
    },
  });

  // Populate default values when data is provided
  useEffect(() => {
    if (partialData) {
      reset({
        partialPercentage: String(partialData.partialPercentage || ""), // Convert to string
        time: partialData.time || "",
        counterBookingTime: partialData.counterBookingTime || "",
      });
    }
  }, [partialData, reset]);

  // Form submit handler
  const onSubmit = async (data: any) => {
    try {
      // Parse `partialPercentage` to an integer
      const formattedData = {
        ...data,
        partialPercentage: parseInt(data.partialPercentage, 10), // Ensure integer type
      };

      const result = await updatePartialInfo({
        id: partialData.id,
        data: formattedData,
      });

      if (result?.data?.success) {
        toast({
          title: "Success",
          description: "Partial Info updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update Partial Info.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Update Partial Info</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Partial Percentage */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Partial Percentage
          </label>
          <Input
            {...register("partialPercentage")}
            type="number"
            placeholder="Enter Partial Percentage"
            required
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-1">Time</label>
          <Input {...register("time")} placeholder="Enter Time" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Counter Booking Time
          </label>
          <Input
            {...register("counterBookingTime")}
            placeholder="Enter Time"
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isUpdating}>
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdatePartial;
