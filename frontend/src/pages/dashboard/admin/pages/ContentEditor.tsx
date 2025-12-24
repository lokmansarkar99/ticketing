import { InputWrapper } from "@/components/common/form/InputWrapper";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

interface Props {
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  fieldName: string;
  label: string;
  errors: FieldErrors<any>;
  error: any;
}

const ContentEditor: React.FC<Props> = ({
  setValue,
  getValues,
  fieldName,
  errors,
}) => {
  const [content, setContent] = useState<string>("");

  // Load initial value from form
  useEffect(() => {
    const initialValue = getValues(fieldName) || "";
    setContent(initialValue);
  }, [getValues, fieldName]);

  return (
    <InputWrapper
      key={fieldName}
      error={(errors?.[fieldName] as any)?.message}
      labelFor={fieldName}
      label={""}
      className="relative mt-10"
    >
      <div className="flex flex-col items-center gap-3">
        <CKEditor
          //@ts-ignore
          editor={ClassicEditor}
          data={content}
          onChange={(_, editor) => {
            const data = editor.getData();
            setContent(data);
            setValue(fieldName, data);
          }}
        />
      </div>
    </InputWrapper>
  );
};

export default ContentEditor;
