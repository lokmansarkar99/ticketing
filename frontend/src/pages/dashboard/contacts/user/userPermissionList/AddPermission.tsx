import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AddPermissionDataProps,
  addPermissionSchema,
} from "@/schemas/contact/addPermissionSchema";
import { useGetPermissionTypeListQuery } from "@/store/api/contact/userApi";
import { useAddPermissionbyIdMutation } from "@/store/api/contact/userPermissionApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { IPermissionStateProps } from "../PermissionList";

interface IAddPermissionProps {
  setPermissionState: (
    permissionState: (prevState: IPermissionStateProps) => IPermissionStateProps
  ) => void;
}

const AddPermission: FC<IAddPermissionProps> = ({ setPermissionState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    control, // For controlling select component with react-hook-form
    formState: { errors },
  } = useForm<AddPermissionDataProps>({
    resolver: zodResolver(addPermissionSchema),
  });

  // Fetch permission types
  const { data: permissionTypeData, isLoading: permissionTypeLoading } =
    useGetPermissionTypeListQuery({});

  const [
    addPermissionbyId,
    { isLoading: addPermissionLoading, error: addPermissionError },
  ] = useAddPermissionbyIdMutation();

  const onSubmit = async (data: AddPermissionDataProps) => {
    try {
      // Manually validate the form data using Zod
      const validatedData = addPermissionSchema.parse(data);

      // If validation passes, proceed with submitting the form
      const result = await addPermissionbyId(validatedData);

      if (result?.data?.success) {
        toast({
          title: translate(
            "অনুমতি যোগ করার বার্তা",
            "Message for adding permission"
          ),
          description: toastMessage("add", translate("অনুমতি", "permission")),
        });

        // Update the PermissionList state to include the new permission
        setPermissionState((prevState: IPermissionStateProps) => ({
          ...prevState,
          PermissionList: [...prevState.PermissionList, result.data], // Add new permission
          addPermissionOpen: false, // Close the dialog
        }));
      } else {
        // Log error if the API call does not return success
        console.error("Backend error (no success):", result?.data);
      }
    } catch (error) {
      // Log full error for both Zod validation or backend issues
      if (error instanceof z.ZodError) {
        // Log Zod validation errors to help identify the issue
        console.error("Zod validation failed:", error.errors);
      } else {
        // Log backend/API errors and responses
        console.error("Error adding permission (API or network):", error);
        // if (error.data) {
        //   console.error("Backend response data:", error.data);
        // }
        // if (error.response) {
        //   console.error("Backend response:", error.response);
        // }
      }
    }
  };

  // Display loading skeleton if permission types are still loading
  if (permissionTypeLoading) {
    return <FormSkeleton columns={7} />;
  }

  return (
    <FormWrapper
      heading={translate("অনুমতি যোগ করুন", "Add Permission")}
      subHeading={translate(
        "সিস্টেমে নতুন অনুমতি যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new permission to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* PERMISSION NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="permission"
            label={translate("অনুমতি নাম ✼", "Permission Name ✼")}
          >
            <Input
              type="text"
              id="permission"
              {...register("name")}
              placeholder={translate(
                "অনুমতির নাম লিখুন",
                "Enter permission name"
              )}
            />
          </InputWrapper>

          {/* PERMISSION TYPE DROPDOWN */}
          <InputWrapper
            error={errors?.permissionTypeId?.message}
            labelFor="permissionType"
            label={translate("অনুমতির ধরন ✼", "Permission Type ✼")}
          >
            <Controller
              name="permissionTypeId" // This is the key in the form data
              control={control} // React Hook Form control
              render={({ field }) => (
                <Select
                  // Convert the string value (id) to a number before updating the form
                  onValueChange={(value) => {
                    const numberValue = Number(value); // Convert the string value to a number

                    field.onChange(numberValue); // Update form's state with numeric id
                  }}
                  value={field.value?.toString() || ""} // Convert the numeric value back to a string for display
                >
                  <SelectTrigger id="permissionType" className="w-full">
                    {/* Display the selected name or placeholder */}
                    <SelectValue>
                      {permissionTypeData?.data?.find(
                        (type: any) => type.id === field.value
                      )?.name ||
                        translate(
                          "অনুমতির ধরন নির্বাচন করুন",
                          "Select Permission Type"
                        )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {/* Safely access permissionTypeData and map through the items */}
                    {Array.isArray(permissionTypeData?.data) &&
                    permissionTypeData.data.length > 0 ? (
                      permissionTypeData.data.map((type: any) => (
                        // Ensure the value is a string but the id is sent as a number
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-permission">
                        {translate(
                          "কোনও অনুমতির ধরন উপলব্ধ নেই",
                          "No Permission Types Available"
                        )}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={addPermissionLoading}
          errors={addPermissionError}
          submitTitle={translate("অনুমতি যুক্ত করুন", "Add Permission")}
          errorTitle={translate(
            "অনুমতি যোগ করতে ত্রুটি",
            "Add Permission Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddPermission;
