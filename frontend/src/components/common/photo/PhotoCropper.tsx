import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/utils/helpers/photoCropper";
import { FC, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import FileInput from "../form/FileInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  photoCropAspectRatio,
  IPhotoCropAspectRatioProps,
} from "@/utils/constants/common/photoCropRatioOptions";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { InputWrapper } from "../form/InputWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IPhotoCropperProps {
  setPhoto: (photo: string | undefined) => void;
  photo: string | undefined;
  id?: string;
  ratio?: number;
  placeholder?: string;
  disabled?: boolean;
}

interface Crop {
  x: number;
  y: number;
}

export interface IPhotoCropStateProps {
  aspectRatio: number;
  crop: Crop;
  rotation: number;
  zoom: number;
  croppedAreaPixels: any;
  open: boolean;
  restore: string | undefined;
  step: "select" | "crop" | "done";
}

const PhotoCropper: FC<IPhotoCropperProps> = ({
  setPhoto,
  id,
  ratio,
  placeholder,
  photo,
  disabled = false, // Default to false if not provided
}) => {
  const { translate } = useCustomTranslator();

  const [cropState, setCropState] = useState<IPhotoCropStateProps>({
    aspectRatio: ratio || 4 / 3,
    crop: { x: 0, y: 0 },
    rotation: 0,
    zoom: 1,
    croppedAreaPixels: null,
    open: false,
    restore: "",
    step: "done",
  });

  const {
    aspectRatio,
    crop,
    rotation,
    zoom,
    croppedAreaPixels,
    open,
    restore,
    step,
  } = cropState;

  const onCropComplete = (_: unknown, croppedAreaPixels: any) => {
    setCropState((prevState) => ({
      ...prevState,
      croppedAreaPixels,
    }));
  };

  const croppedPhoto = async () => {
    if (!photo || !croppedAreaPixels) {
      console.error("No photo or cropped area available");
      return;
    }
    try {
      const croppedImage = await getCroppedImg(
        photo,
        croppedAreaPixels,
        rotation
      );
      setPhoto(croppedImage);
      setCropState((prevState: IPhotoCropStateProps) => ({
        ...prevState,
        crop: { x: 0, y: 0 },
        rotation: 0,
        zoom: 1,
        croppedAreaPixels: null,
        open: false,
        step: "done",
      }));
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  useEffect(() => {
    if (photo && step !== "done") {
      setCropState((prevState) => ({
        ...prevState,
        open: true,
        step: "crop",
      }));
    }
  }, [step]);

  return (
    <div className="h-full overscroll-y-auto">
      <FileInput
        placeholder={placeholder}
        setCropState={setCropState}
        photo={photo}
        id={id}
        setPhoto={setPhoto}
        disabled={disabled}
      />
      {photo && cropState.step === "crop" && (
        <Dialog
          open={open}
          onOpenChange={(open) =>
            setCropState((prevState) => ({ ...prevState, open }))
          }
        >
          <DialogTrigger></DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[85%]">
            <DialogHeader className="hidden">
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div>
              <div className="relative w-full">
                {photo && cropState?.step === "crop" && (
                  <Cropper
                    minZoom={-3}
                    maxZoom={3}
                    image={photo}
                    aspect={aspectRatio}
                    rotation={rotation}
                    crop={crop}
                    zoom={zoom}
                    zoomSpeed={0.2}
                    onCropChange={(crop) =>
                      setCropState((prevState) => ({ ...prevState, crop }))
                    }
                    onZoomChange={(zoom) =>
                      setCropState((prevState) => ({ ...prevState, zoom }))
                    }
                    onCropComplete={onCropComplete}
                    style={{
                      containerStyle: {
                        borderRadius: "5px",
                        margin: "35px auto 0px",
                        height: 350,
                        width: "100%",
                        paddingBottom: 0,
                        marginBottom: 0,
                      },
                    }}
                  />
                )}
              </div>
              <ul className="grid grid-cols-4 mt-[400px] gap-x-6 items-center w-full justify-between">
                <li className="col-span-1">
                  <InputWrapper label={translate("জুম", "Zoom")}>
                    <Slider
                      className="h-9"
                      onValueChange={(value: number[]) =>
                        setCropState((prevState) => ({
                          ...prevState,
                          zoom: value[0],
                        }))
                      }
                      value={[zoom]}
                      min={1}
                      max={3}
                      step={0.1}
                    />
                  </InputWrapper>
                </li>
                <li className="col-span-1">
                  <InputWrapper label={translate("রোটেশন", "Rotation")}>
                    <Slider
                      className="h-9"
                      onValueChange={(value: number[]) =>
                        setCropState((prevState) => ({
                          ...prevState,
                          rotation: value[0],
                        }))
                      }
                      value={[rotation]}
                      min={0}
                      max={360}
                      step={1}
                    />
                  </InputWrapper>
                </li>
                <li
                  className={cn(
                    "col-span-2",
                    ratio && "select-none cursor-none opacity-70"
                  )}
                >
                  <InputWrapper
                    labelFor="ratio"
                    label={translate("এসপেক্ট রেশিও", "Aspect Ratio")}
                  >
                    <Select
                      defaultValue={aspectRatio?.toString()}
                      onValueChange={(value: string) =>
                        setCropState((prevState) => ({
                          ...prevState,
                          aspectRatio: +value,
                        }))
                      }
                    >
                      <SelectTrigger id="ratio" className="w-full">

                        <SelectValue
                          placeholder={translate(
                            "সিলেক্ট এসপেক্ট রেশিও",
                            "Select aspect ratio"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {photoCropAspectRatio?.length > 0 &&
                          photoCropAspectRatio?.map(
                            (singleRatio: IPhotoCropAspectRatioProps) => (
                              <SelectItem
                                key={singleRatio.ratio}
                                value={singleRatio?.ratio?.toString()}
                              >
                                <ul className="flex items-center gap-x-2">
                                  <li>
                                    {translate(
                                      singleRatio.key.bn,
                                      singleRatio.key.en
                                    )}
                                  </li>
                                  <li>
                                    {translate(
                                      singleRatio.title.bn,
                                      singleRatio.title.en
                                    )}
                                  </li>
                                  {singleRatio?.ratio === ratio && (
                                    <li className="font-[500] ">
                                      &#40;
                                      {translate("সুপারিশকৃত", "Recommended")}
                                      &#41;
                                    </li>
                                  )}
                                </ul>
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </InputWrapper>
                </li>
              </ul>
              <ul className="flex justify-center gap-x-2 mt-6">
                <li>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPhoto(restore);
                      setCropState((prevState: IPhotoCropStateProps) => ({
                        ...prevState,
                        crop: { x: 0, y: 0 },
                        rotation: 0,
                        zoom: 1,
                        croppedAreaPixels: null,
                        step: "crop",
                      }));
                    }}
                  >
                    {translate("পুন:স্থাপন করুন", "Reset")}
                  </Button>
                </li>
                <li>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPhoto("");
                      setCropState((prevState: IPhotoCropStateProps) => ({
                        ...prevState,
                        crop: { x: 0, y: 0 },
                        rotation: 0,
                        zoom: 1,
                        croppedAreaPixels: null,
                        step: "done",
                      }));
                    }}
                  >
                    {translate("নতুন ছবি নির্বাচন করুন", "Select New Image")}
                  </Button>
                </li>
                <li>
                  <Button
                    size="sm"
                    onClick={croppedPhoto}
                    disabled={disabled || step === "done"}
                  >
                    {translate("ফটো ক্রপ করুন", "Crop Photo")}
                  </Button>
                </li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PhotoCropper;
