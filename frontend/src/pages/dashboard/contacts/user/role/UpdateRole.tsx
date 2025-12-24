import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormSkeleton from "@/components/common/skeleton/FormSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  AddRoleDataProps,
  addRoleSchema,
} from "@/schemas/contact/addRoleSchema";
import {
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
} from "@/store/api/contact/roleApi";

import { Role } from "@/types/dashboard/contacts/user";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";

/*interface IUpdateRoleFormStateProps {
  id: number;
  name: string;
  addRoleOpen: boolean;
}*/
interface IUpdateRoleProps {
  id: number | null;
  onUpdateSuccess?: (updatedRole: Role) => void; // Add this prop
}

const UpdateRole: FC<IUpdateRoleProps> = ({ id, onUpdateSuccess }) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<AddRoleDataProps>({
    resolver: zodResolver(addRoleSchema),
  });

  const { data: singleRoleData, isLoading: singleRoleDataLoading } =
    useGetSingleRoleQuery(id);

  const [
    updateRole,
    { isLoading: updateRoleLoading, error: updateRoleTypeError },
  ] = useUpdateRoleMutation();
  //
  useEffect(() => {
    setValue("name", singleRoleData?.data?.name || "");
  }, [singleRoleData, setValue]);

  const onSubmit = async (data: AddRoleDataProps) => {
    const updateData = removeFalsyProperties(data, [
      "name",
    ]) as AddRoleDataProps;

    const result = await updateRole({ data: updateData, id });
    //
    if (result?.data?.success) {
      toast({
        title: translate(
          "ব্যবহারকারী ভূমিকা সম্পাদনা করার বার্তা",
          "Message for updating role"
        ),
        description: toastMessage("update", translate("ভূমিকা", "role")),
      });

      // Call the onUpdateSuccess callback with the updated permission data
      if (onUpdateSuccess) {
        onUpdateSuccess(result.data.data); // Assuming `result.data.data` is the updated permission
      }
    }
  };

  if (singleRoleDataLoading) {
    return <FormSkeleton columns={3} inputs={9} />;
  }

  return (
    <FormWrapper
      heading={translate("ভূমিকা সম্পাদনা করুন", "Update Role")}
      subHeading={translate(
        "সিস্টেমে ভূমিকা সম্পাদনা করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to update a new role to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputWrapper
            error={errors?.name?.message}
            labelFor="role"
            label={translate("ভূমিকা নাম ✼", "Role Name ✼")}
          >
            <Input
              type="text"
              id="role"
              {...register("name")}
              placeholder={translate(
                "ভূমিকা সম্পাদনা করুন",
                "Update role name"
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          errorTitle="Update role failed"
          loading={updateRoleLoading}
          errors={updateRoleTypeError}
          submitTitle={translate("ভূমিকা সম্পাদনা করুন", "Update Role")}
        />
      </form>
    </FormWrapper>
  );
};
export default UpdateRole;
