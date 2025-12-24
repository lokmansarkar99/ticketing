import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AddPermissionTypeDataProps, addPermissionTypeSchema } from "@/schemas/contact/addPermissionTypeSchema";
import { useAddPermissionMutation } from "@/store/api/contact/userApi";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IPermissionStateProps } from "./PermissionList";

interface IAddPermissionProps {
  setPermissionState: (
    permissionState: (prevState: IPermissionStateProps) => IPermissionStateProps
  ) => void;
}

const AddPermissionType: FC<IAddPermissionProps> = ({ setPermissionState }) => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddPermissionTypeDataProps>({
    resolver: zodResolver(addPermissionTypeSchema),
  });

  const [
    addPermission,
    { isLoading: addPermissionLoading, error: addPermissionError },
  ] = useAddPermissionMutation();

  const onSubmit = async (data: AddPermissionTypeDataProps) => {
    const result = await addPermission(data);

    if (result?.data?.success) {
      toast({
        title: translate(
          "অনুমতি ধরন যোগ করার বার্তা",
          "Message for adding permission type"
        ),
        description: toastMessage(
          "add",
          translate("অনুমতি ধরন", "permission type")
        ),
      });

      // Update the PermissionList state to include the new permission
      setPermissionState((prevState: IPermissionStateProps) => ({
        ...prevState,
        PermissionList: [...prevState.PermissionList, result.data], // Add new permission
        addPermissionOpen: false, // Close the dialog
      }));
    }
  };

  return (
    <FormWrapper
      heading={translate("অনুমতি ধরন যোগ করুন", "Add Permission type")}
      subHeading={translate(
        "সিস্টেমে নতুন অনুমতি ধরন যোগ করতে নিচের বিস্তারিত পূরণ করুন।",
        "Fill out the details below to add a new permission type to the system."
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {/* PERMISSION NAME */}
          <InputWrapper
            error={errors?.name?.message}
            labelFor="permission"
            label={translate("অনুমতি ধরন নাম ✼", "Permission Type Name ✼")}
          >
            <Input
              type="text"
              id="permission"
              {...register("name")}
              placeholder={translate(
                "অনুমতি ধরন নাম লিখুন",
                "Enter permission type name"
              )}
            />
          </InputWrapper>
        </div>
        <Submit
          loading={addPermissionLoading}
          errors={addPermissionError}
          submitTitle={translate(
            "অনুমতি ধরন যুক্ত করুন",
            "Add Permission Type"
          )}
          errorTitle={translate(
            "অনুমতি ধরন যোগ করতে ত্রুটি",
            "Add Permission Type Error"
          )}
        />
      </form>
    </FormWrapper>
  );
};

export default AddPermissionType;
