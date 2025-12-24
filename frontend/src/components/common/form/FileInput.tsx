import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { FC, useRef } from "react";

interface IFileInputProps {
  setPhoto: (photo: any) => void;
  id?: string;
  photo: string | undefined;
  setCropState: (cropState: any) => void;
  placeholder?: string;
  disabled?: boolean;
}

const FileInput: FC<IFileInputProps> = ({
  setPhoto,
  id,
  photo,
  setCropState,
  placeholder,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { translate } = useCustomTranslator();

  const handleOnChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function () {
        if (reader.result) {
          setPhoto(reader.result as string);
          setCropState((prevState: any) => ({
            ...prevState,
            step: photo !== reader.result ? "crop" : "done",
            restore: reader.result as string,
          }));
        }
      };
    }
  };

  const onChooseImg = () => {
    if (!disabled) {
      inputRef?.current?.click();
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        type="file"
        name="file"
        id={id}
        onChange={handleOnChange}
        className="hidden"
        ref={inputRef}
        disabled={disabled}
      />

      <Button
        onClick={onChooseImg}
        type="button"
        size="sm"
        variant="outline"
        className="relative text-muted-foreground flex gap-1 font-normal mt-[4px] w-full justify-start"
        disabled={disabled}
      >
        {photo && placeholder || translate("ছবি নির্বাচন করুন", "Choose Photo")}

        {photo && (
          <HoverCard>
            <HoverCardTrigger className="absolute top-1/2 w-[30px] h-[30px] bg-transparent text-success-foreground py-0.5 px-1.5 rounded-sm -translate-y-1/2 right-1 ">
              {/* {translate("সম্পন্ন", "Done")} */}
            </HoverCardTrigger>
            <HoverCardContent
              className="w-[250px] h-[250px] justify-center flex items-center"
              side="left"
            >
              <img className="w-full h-full rounded-md" src={photo} alt="" />
            </HoverCardContent>
          </HoverCard>
        )}
        {photo && (
          <img className="w-[30px] h-[30px] rounded-full ml-auto" src={photo} alt="" />
        )}
      </Button>
    </div>
  );
};

export default FileInput;
