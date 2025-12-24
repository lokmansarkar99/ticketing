import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddPermissionTypeDataProps,
  addPermissionTypeSchema,
} from "@/schemas/contact/addPermissionTypeSchema";

import {
  useGetSinglePermissionTypeQuery,
  useUpdatePermissionTypeMutation,
} from "@/store/api/contact/userApi";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

// interface IUpdatePermissionFormStateProps {
//   id: number;
//   name: string;
//   addPermissionOpen: boolean;
// }
interface IUpdatePermissionProps {
  id: number | null;
  onUpdateSuccess?: (updatedPermission: Permissions) => void; // Add this prop
}

const UpdatePermissionType: FC<IUpdatePermissionProps> = ({
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
    formState: { errors },
  } = useForm<AddPermissionTypeDataProps>({
    resolver: zodResolver(addPermissionTypeSchema),
  });

  const { data: singlePermissionTypeData, isLoading: permissionTypeLoading } =
    useGetSinglePermissionTypeQuery(id);

  const [
    updatePermissionType,
    {
      isLoading: updatePermissionTypeLoading,
      error: updatePermissionTypeError,
    },
  ] = useUpdatePermissionTypeMutation();

  useEffect(() => {
    setValue("name", singlePermissionTypeData?.data?.name || "");
  }, [singlePermissionTypeData, setValue]);

  const onSubmit = async (data: AddPermissionTypeDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "name",
    ]) as AddPermissionTypeDataProps;

    const result = await updatePermissionType({ data: updateData, id });

    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী অনুমতি সম্পাদনা করার বার্তা",
          "Message for updating permission"
        ),
        description: toastMessage("update", translate("অনুমতি", "permission")),
      });

      // Call the onUpdateSuccess callback with the updated permission data
      if (onUpdateSuccess) {
        onUpdateSuccess(result.data.data); // Assuming `result.data.data` is the updated permission
      }
    }
  };

  if (permissionTypeLoading) {
    return <FormSkeleton columns={3} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate(
        "অনুমতি ধরন সম্পাদনা যোগ করুন",
        "Update Permission type"
      )}
      subHeading={translate(
        "সিস্টেমে নতুন অনুমতি ধরন সম্পাদনা যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update a new permission type to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
                "অনুমতির সম্পাদনা করুন",
                "Update permission name"
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={updatePermissionTypeLoading}
          errors={updatePermissionTypeError}
          errorTitle="Permission Update Failed"
          submitTitle={translate("অনুমতি সম্পাদনা করুন", "Update Permission")}
        />
      </form>
    </FormWrapper>
  );
};
export default UpdatePermissionType;
