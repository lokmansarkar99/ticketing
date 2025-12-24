import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import { Button } from "@/components/ui/button";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

interface Props {
  //register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  editStates: Record<string, boolean>;
  toggleEditState: (field: string) => void;
  errors: FieldErrors<any>;
  isLoading: boolean;
  uploadPhotoLoading: boolean;
  error: any;
  translate: (bn: string, en: string) => string;
}

const HomePageDescription: React.FC<Props> = ({
  setValue,
  getValues,
  editStates,
  toggleEditState,
  errors,
  isLoading,
  uploadPhotoLoading,
  error,
  translate,
}) => {
  const [homePageDescription, setHomePageDescription] = useState<string>("");
  const [homePageDescriptionBangla, setHomePageDescriptionBangla] =
    useState<string>("");

  // Populate initial values if provided
  useEffect(() => {
    const initialEnglish = getValues("homePageDescription") || "";
    const initialBangla = getValues("homePageDescriptionBangla") || "";
    setHomePageDescription(initialEnglish);
    setHomePageDescriptionBangla(initialBangla);
  }, [getValues]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-5 gap-y-2">
      {/* CKEditor for English Description */}
      <InputWrapper
        key="homePageDescription"
        error={(errors?.homePageDescription as any)?.message}
        labelFor="homePageDescription"
        label={translate("হোমপেজের বর্ণনা", "Homepage Description")}
        className="relative mt-10"
      >
        <div className="flex flex-col items-center gap-3">
          <CKEditor
            //@ts-ignore
            editor={ClassicEditor}
            data={homePageDescription}
            onChange={(_, editor) => {
              const data = editor.getData();
              setHomePageDescription(data);
              setValue("homePageDescription", data);
            }}
            disabled={!editStates.homePageDescription}
          />
          <div className="flex items-center lg:gap-3 gap-1 absolute -top-4 right-1">
            <Button
              onClick={() => toggleEditState("homePageDescription")}
              variant="outline"
              size="sm"
              type="button"
            >
              {editStates.homePageDescription ? (
                <span className="text-red-600">Close</span>
              ) : (
                <span className="text-green-600">Edit</span>
              )}
            </Button>
            {editStates.homePageDescription && (
              <Submit
                className="mt-0 pt-0"
                loading={isLoading || uploadPhotoLoading}
                errors={error}
                icon={
                  <span className="flex items-center text-white lg:text-lg text-base lg:gap-1">
                    {" "}
                    <Save className="h-4 w-4 " />
                    Save
                  </span>
                }
                errorTitle={translate(
                  "সিএমএস আপডেট করতে ত্রুটি",
                  "Error updating CMS"
                )}
              />
            )}
          </div>
        </div>
      </InputWrapper>

      {/* CKEditor for Bangla Description */}
      <InputWrapper
        key="homePageDescriptionBangla"
        error={(errors?.homePageDescriptionBangla as any)?.message}
        labelFor="homePageDescriptionBangla"
        label={translate(
          "হোমপেজের বর্ণনা (বাংলা)",
          "Homepage Description (Bangla)"
        )}
        className="relative mt-10"
      >
        <div className="flex flex-col items-center gap-3">
          <CKEditor
            //@ts-ignore
            editor={ClassicEditor}
            data={homePageDescriptionBangla}
            onChange={(_, editor) => {
              const data = editor.getData();
              setHomePageDescriptionBangla(data);
              setValue("homePageDescriptionBangla", data);
            }}
            disabled={!editStates.homePageDescriptionBangla}
          />
          <div className="flex items-center lg:gap-3 gap-1 absolute -top-4 right-1">
            <Button
              onClick={() => toggleEditState("homePageDescriptionBangla")}
              variant="outline"
              size="sm"
              type="button"
            >
              {editStates.homePageDescriptionBangla ? (
                <span className="text-red-600">Close</span>
              ) : (
                <span className="text-green-600">Edit</span>
              )}
            </Button>
            {editStates.homePageDescriptionBangla && (
              <Submit
                className="mt-0 pt-0"
                loading={isLoading || uploadPhotoLoading}
                errors={error}
                icon={
                  <span className="flex items-center text-white lg:text-lg text-base lg:gap-1">
                    {" "}
                    <Save className="h-4 w-4 " />
                    Save
                  </span>
                }
                errorTitle={translate(
                  "সিএমএস আপডেট করতে ত্রুটি",
                  "Error updating CMS"
                )}
              />
            )}
          </div>
        </div>
      </InputWrapper>
    </div>
  );
};

export default HomePageDescription;
