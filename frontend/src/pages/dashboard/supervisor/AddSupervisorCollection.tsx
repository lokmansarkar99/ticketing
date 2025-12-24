/* eslint-disable @typescript-eslint/ban-ts-comment */
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
// import {
//   AddUpdateCollectionDataProps,
//   addUpdateCollectionSchema,
// } from "@/schemas/addUpdateCollectionSchema";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useAddCollectionOfSupervisorMutation } from "@/store/api/superviosr/supervisorCollectionApi";
import { playSound } from "@/utils/helpers/playSound";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
// import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface IAddSupervisorCollectionProps {
  setCollectionState: (state: (prevState: any) => any) => void;
  counterId: number;
  coachDetailsData: any;
}

const AddSupervisorCollection: FC<IAddSupervisorCollectionProps> = ({
  setCollectionState,
  counterId,
  coachDetailsData,
}) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const { toastMessage } = useMessageGenerator();
  const user = useSelector((state: any) => state.user);
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation();

  const [addCollectionOfSupervisor, { isLoading, error }] =
    useAddCollectionOfSupervisorMutation();

  // const { data: coachConfigs, isLoading: coachConfigLoading } =
  //   useGetTodaysCoachConfigListQuery({});
  // const { data: counters, isLoading: counterLoading } = useGetCountersQuery({
  //   size: 1000,
  //   page: 1,
  // });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    // formState: { errors },
  } = useForm();
  const [file, setFile] = useState<File | null>(null);
  const counterInfo = coachDetailsData.data.counterWiseReport.find(
    (c: any) => c.counterId === counterId
  );
  const collectionType = watch("collectionType");

  // Effect to handle changes in collectionType
  useEffect(() => {
    if (collectionType === "OpeningBalance") {
      setValue("noOfPassenger", 0); // Set to 0 for OpeningBalance
    }
  }, [collectionType, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      //@ts-ignore
      setValue("file", e.target.files[0].name); // Sync with form
    }
  };
  
  useEffect(() => {
    setValue("counterId", counterId); // Sync with form
    setValue("coachConfigId", coachDetailsData?.data?.coachInfo?.id); // Sync with form
    setValue("collectionType", "CounterCollection"); // Sync with form
    setValue(
      "routeDirection",
      coachDetailsData?.data?.coachInfo?.coach?.route?.routeDirection
    ); // Sync with form
    setValue("date", coachDetailsData?.data?.coachInfo?.departureDate); // Sync with form
    setValue("noOfPassenger", counterInfo?.totalSeat); // Sync with form
    setValue("amount", counterInfo?.totalAmountWithoutCommission); // Sync with form
    //setValue("file", counterInfo.totalAmountWithoutCommission); // Sync with form
  }, [collectionType, setValue, counterId, user]);
  const onSubmit = async (data: any) => {
    
    if (!file) {
      toast({
        title: "ফাইল নির্বাচন করুন",
        description: "Please select a file.",
      });
      return;
    }
    const uploadResult = await uploadPhoto(file).unwrap();
    if (uploadResult?.data) {
      const cleadData = removeFalsyProperties(data, ["token"]);
      const result = await addCollectionOfSupervisor({
        ...cleadData,
        file: uploadResult.data,
        supervisorId: user.id,
      });
      if (result.data?.success) {
        const localData = localStorage.getItem("collection");
        const findCollection = localData ? JSON.parse(localData) : [];
        const uniqueId = `${coachDetailsData?.data?.coachInfo?.id}-${counterId}`;
        if (!findCollection?.length) {
          const collection = [uniqueId];
          localStorage.setItem("collection", JSON.stringify(collection));
        } else {
          findCollection.push(uniqueId);
          localStorage.setItem("collection", JSON.stringify(findCollection));
        }
        toast({
          title: translate(
            "সংগ্রহ যোগ করা হয়েছে",
            "Collection Added Successfully"
          ),
          description: toastMessage("add", translate("সংগ্রহ", "Collection")),
        });
        playSound("add");
        //@ts-ignore
        setCollectionState();
      }
    }
  };

  return (
    <FormWrapper
      heading={translate("সংগ্রহ যোগ করুন", "Add Collection")}
      subHeading={translate(
        "নতুন সংগ্রহ যোগ করতে নিচের তথ্য পূরণ করুন।",
        "Fill in the details below to add a new collection."
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-green-500">{`This counter ${counterInfo.counterName} has toal seats ${counterInfo.totalSeat} with total taka ${counterInfo.totalAmountWithoutCommission}, date ${coachDetailsData?.data?.coachInfo?.departureDate}`}</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
          {/* Token */}
          <InputWrapper
            labelFor="token"
            // error={errors.token?.message}
            label={translate("টোকেন", "Token")}
          >
            <Input
              {...register("token", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
              type="number"
            />
          </InputWrapper>

          {/* File Upload */}
          <InputWrapper
            label={
              <>
                {translate("ফাইল নির্বাচন করুন", "Select File")}{" "}
                <span className="text-red-600 font-semibold">✼</span>
              </>
            }
          >
            <Button asChild variant="outline" className="w-full">
              <label htmlFor="file-upload" className="flex items-center">
                <UploadIcon className="mr-2" />
                {file
                  ? file.name
                  : translate("ফাইল নির্বাচন করুন", "Select File")}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
            </Button>
          </InputWrapper>
        </div>

        <Submit
          loading={isLoading || uploadPhotoLoading}
          errors={error}
          errorTitle="Add Collection failed"
          submitTitle={translate("সংগ্রহ যোগ করুন", "Add Collection")}
        />
      </form>
    </FormWrapper>
  );
};

export default AddSupervisorCollection;
