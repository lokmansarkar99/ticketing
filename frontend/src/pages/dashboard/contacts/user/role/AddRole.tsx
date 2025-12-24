import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AddPermissionDataProps } from "@/schemas/contact/addPermissionSchema";
import { addRoleSchema } from "@/schemas/contact/addRoleSchema";
import { useAddRoleMutation } from "@/store/api/contact/roleApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IRoleStateProps } from "./UserRoleList";

interface IAddRoleProps {
  setRoleState: (
    permissionState: (prevState: IRoleStateProps) => IRoleStateProps
  ) => void;
}

const AddRole: FC<IAddRoleProps> = ({ setRoleState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddPermissionDataProps>({
    resolver: zodResolver(addRoleSchema),
  });
  // const {
  //   handleSubmit,
  //   register,
  //   control, // For controlling select component with react-hook-form
  //   formState: { errors },
  // } = useForm<AddRoleDataProps>({
  //   resolver: zodResolver(addRoleSchema),
  // });

  // Fetch permission types

  const [addRole, { isLoading: addRoleLoading, error: addRoleError }] =
    useAddRoleMutation();
  const onSubmit = async (data: AddPermissionDataProps) => {
    try {
      // Manually validate the form data using Zod
      const validatedData = addRoleSchema.parse(data);

      // If validation passes, proceed with submitting the form
      const result = await addRole(validatedData);

      if (result?.data?.success) {
        toast({
          title: translate("ভূমিকা যোগ করার বার্তা", "Message for adding role"),
          description: toastMessage("add", translate("ভূমিকা", "role")),
        });

        // Update the PermissionList state to include the new permission
        setRoleState((prevState: IRoleStateProps) => ({
          ...prevState,
          roleList: [...prevState.roleList, result.data], // Add new permission
          addRoleOpen: false, // Close the dialog
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
  //   if (addRoleLoading) {
  //     return <FormSkeleton columns={7} />;
  //   }

  return (
    <FormWrapper
      heading={translate("ভূমিকা যোগ করুন", "Add Role")}
      subHeading={translate(
        "সিস্টেমে নতুন ভূমিকা যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new role to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* PERMISSION NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="role"
            label={translate("ভূমিকা নাম ✼", "Role Name ✼")}
          >
            <Input
              type="text"
              id="role"
              {...register("name")}
              placeholder={translate("ভূমিকা নাম লিখুন", "Enter role name")}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={addRoleLoading}
          errors={addRoleError}
          submitTitle={translate("ভূমিকা যুক্ত করুন", "Add Role")}
          errorTitle={translate("ভূমিকা যোগ করতে ত্রুটি", "Add Role Error")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddRole;
