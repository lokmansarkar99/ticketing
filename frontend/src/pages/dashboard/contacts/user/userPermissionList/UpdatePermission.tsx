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
  UpdatePermissionDataProps,
  updatePermissionSchema,
} from "@/schemas/contact/updatePermissionSchema";
import { useGetPermissionTypeListQuery } from "@/store/api/contact/userApi";
import {
  useGetSinglePermissionQuery,
  useUpdatePermissionMutation,
} from "@/store/api/contact/userPermissionApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { IPermissionStateProps } from "../PermissionList";
/*
interface IUpdatePermissionsFormStateProps {
  id: number;
  name: string;
  permissionTypeId: number;
  addPermissionOpen: boolean;
}*/

interface IUpdatePermissionsProps {
  id: number; // ID of the permission to update
  onUpdateSuccess: any;
  setPermissionState?: (
    permissionState: (prevState: IPermissionStateProps) => IPermissionStateProps
  ) => void;
}

const UpdatePermission: FC<IUpdatePermissionsProps> = ({
  id,
  onUpdateSuccess,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<UpdatePermissionDataProps>({
    resolver: zodResolver(updatePermissionSchema),
  });

  const { data: permissionTypeData, isLoading: permissionTypeLoading } =
    useGetPermissionTypeListQuery({});
  const { data: singlePermissionData, isLoading: singlePermissionLoading } =
    useGetSinglePermissionQuery(id);

  useEffect(() => {
    if (singlePermissionData?.data) {
      setValue("id", singlePermissionData.data.id || 0); // Ensure ID is set
      setValue("name", singlePermissionData.data.name || ""); // Set the name field
      setValue(
        "permissionTypeId",
        singlePermissionData.data.permissionType?.id || 0
      ); // Set the permission type ID
    }
  }, [singlePermissionData, setValue]);
  //
  const [
    updatePermission,
    { isLoading: updatePermissionLoading, error: updatePermissionError },
  ] = useUpdatePermissionMutation();

  const onSubmit = async (data: UpdatePermissionDataProps) => {
    //

    try {
      const { name, permissionTypeId } = data;

      const result = await updatePermission({
        id, // Send the permission ID in the URL, but not in the body
        data: { name, permissionTypeId },
      });

      //

      if (result?.data?.success) {
        toast({
          title: translate("সফল", "Success"),
          description: toastMessage(
            "update",
            translate("অনুমতি", "Permission")
          ),
        });

        // Call onUpdateSuccess to update the permission in the table
        if (onUpdateSuccess) {
          onUpdateSuccess(result.data.data);
        }

        // Optionally, close the modal or form (if applicable)
      } else {
        console.error("Update failed, backend error:", result?.data);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };
  if (permissionTypeLoading || singlePermissionLoading) {
    return <FormSkeleton columns={7} />;
  }

  return (
    <FormWrapper
      heading={translate("অনুমতি আপডেট করুন", "Update Permission")}
      subHeading={translate(
        "সিস্টেমে অনুমতি আপডেট করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update the permission in the system."
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
              name="permissionTypeId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="permissionType" className="w-full">
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
                    {permissionTypeData?.data &&
                    permissionTypeData.data.length > 0 ? (
                      permissionTypeData.data.map((type: any) => (
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
          loading={updatePermissionLoading}
          errors={updatePermissionError}
          errorTitle="Update Permissions failed"
          submitTitle={translate("অনুমতি আপডেট করুন", "Update Permission")}
        />
      </form>
    </FormWrapper>
  );
};

export default UpdatePermission;
