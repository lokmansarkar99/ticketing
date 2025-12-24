import FileInputArray from "@/components/common/form/FileInputArray";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import Submit from "@/components/common/form/Submit";
import TableSkeleton from "@/components/common/skeleton/TableSkeleton";
import FormWrapper from "@/components/common/wrapper/FormWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AddUpdateCompanyProps,
  addUpdateCompanySchema,
} from "@/schemas/cms/addEditCmsSchema";
import {
  useGetSingleCMSQuery,
  useUpdateCMSMutation,
} from "@/store/api/cms/contentManagementApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { cmsForm } from "@/utils/constants/form/addUpdateCmsForm";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import useMessageGenerator from "@/utils/hooks/useMessageGenerator";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePenLine, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HomePageDescription from "./HomePageDescription";

const AddContentManagement = () => {
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const { toastMessage } = useMessageGenerator();
  const [editOpen, setEditOpen] = useState<Record<string, boolean>>({
    companyName: false,
    companyNameBangla: false,
    address: false,
    addressBangla: false,
    city: false,
    cityBangla: false,
    postalCode: false,
    supportNumber1: false,
    supportNumber2: false,
    facebook: false,
    instagram: false,
    twitter: false,
    linkedin: false,
    googleMap: false,
    aboutUsContent: false,
  });

  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [companyLogoBanglaFile, setCompanyLogoBanglaFile] =
    useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
  const [footerLogoBanglaFile, setFooterLogoBanglaFile] = useState<File | null>(
    null
  );
  const [offerSliderOne, setOfferSliderOne] = useState<File | null>(null);
  const [offerSliderTwo, setOfferSliderTwo] = useState<File | null>(null);
  const [offerSliderThree, setOfferSliderThree] = useState<File | null>(null);
  const [findTicketBannerImage, setFindTicketBannerImage] =
    useState<File | null>(null);
  const [loginPageImage, setLoginPageImage] = useState<File | null>(null);
  const [contactUsImage, setContactUsImage] = useState<File | null>(null);
  const [locationImage, setLocationImage] = useState<File | null>(null);
  const [faqImage, setFaqImage] = useState<File | null>(null);
  const [policyImage, setPolicyImage] = useState<File | null>(null);
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [blogImage, setBlogImage] = useState<File | null>(null);

  const [editStates, setEditStates] = useState<Record<string, boolean>>({
    companyLogo: false,
    loginImage: false,
    companyLogoBangla: false,
    footerLogo: false,
    footerLogoBangla: false,
    offerSliderOne: false,
    offerSliderTwo: false,
    offerSliderThree: false,
    findTicketBanner: false,
    homePageDescription: false,
    homePageDescriptionBangla: false,
    contactUsImage: false,
    loginPageImage: false,
    locationImage: false,
    faqImage: false,
    policyImage:false,
    qrImage:false,
    blogImage:false
  });
  const [uploadPhoto, { isLoading: uploadPhotoLoading }] =
    useUploadPhotoMutation({});
  const [editCms, { isLoading, error }] = useUpdateCMSMutation();
  const { data: singleCms, isLoading: singleCmsLoading } = useGetSingleCMSQuery(
    {}
  );

  const toggleEditState = (field: string) => {
    setEditStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const toggleEditOpen = (field: string) => {
    setEditOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  const {
    register,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<AddUpdateCompanyProps>({
    resolver: zodResolver(addUpdateCompanySchema),
  });

  useEffect(() => {
    if (singleCms?.data) {
      Object.entries(singleCms?.data).forEach(([key, value]) => {
        setValue(key as keyof AddUpdateCompanyProps, value as string);
      });
    }
  }, [singleCms, setValue]);

  const onSubmit = async (data: AddUpdateCompanyProps) => {
    try {
      let companyLogo = "";
      let companyLogoBangla = "";
      let footerLogo = "";
      let footerLogoBangla = "";
      let offeredImageOne = "";
      let offeredImageTwo = "";
      let offeredImageThree = "";
      let findTicketBanner = "";
      let loginImage = "";
      let contactUsimg = "";
      let locationimg = "";
      let faqimg = "";
      let policyimage = "";
      let qrimage = "";
      let blogimage=""

      if (companyLogoFile) {
        try {
          const uploadResponse = await uploadPhoto(companyLogoFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            companyLogo = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (companyLogoBanglaFile) {
        try {
          const uploadResponse = await uploadPhoto(
            companyLogoBanglaFile
          ).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            companyLogoBangla = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (footerLogoFile) {
        try {
          const uploadResponse = await uploadPhoto(footerLogoFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            footerLogo = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (footerLogoBanglaFile) {
        try {
          const uploadResponse = await uploadPhoto(
            footerLogoBanglaFile
          ).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            footerLogoBangla = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (offerSliderOne) {
        try {
          const uploadResponse = await uploadPhoto(offerSliderOne).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            offeredImageOne = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (offerSliderTwo) {
        try {
          const uploadResponse = await uploadPhoto(offerSliderTwo).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            offeredImageTwo = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (offerSliderThree) {
        try {
          const uploadResponse = await uploadPhoto(offerSliderThree).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            offeredImageThree = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      if (findTicketBannerImage) {
        try {
          const uploadResponse = await uploadPhoto(
            findTicketBannerImage
          ).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            findTicketBanner = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (loginPageImage) {
        try {
          const uploadResponse = await uploadPhoto(loginPageImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            loginImage = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (contactUsImage) {
        try {
          const uploadResponse = await uploadPhoto(contactUsImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            contactUsimg = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (locationImage) {
        try {
          const uploadResponse = await uploadPhoto(locationImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            locationimg = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (faqImage) {
        try {
          const uploadResponse = await uploadPhoto(faqImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            faqimg = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (policyImage) {
        try {
          const uploadResponse = await uploadPhoto(policyImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            policyimage = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (qrImage) {
        try {
          const uploadResponse = await uploadPhoto(qrImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            qrimage = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      if (blogImage) {
        try {
          const uploadResponse = await uploadPhoto(blogImage).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            blogimage = uploadResponse?.data;
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
      const updatedData = {
        ...data,
        companyLogo,
        companyLogoBangla,
        footerLogo,
        footerLogoBangla,
        offeredImageOne,
        offeredImageTwo,
        offeredImageThree,
        findTicketBanner,
        loginPageImage: loginImage,
        contactUsImage: contactUsimg,
        locationImage:locationimg,
        faqImage:faqimg,
        policyImage:policyimage,
        qrImage:qrimage,
        blogImage:blogimage
      };
      const updateData = removeFalsyProperties(updatedData, [
        "companyLogo",
        "companyLogoBangla",
        "footerLogo",
        "footerLogoBangla",
        "companyName",
        "companyNameBangla",
        "address",
        "addressBangla",
        "city",
        "cityBangla",
        "postalCode",
        "supportNumber1",
        "supportNumber2",
        "facebook",
        "instagram",
        "twitter",
        "youtube",
        "linkedin",
        "aboutUsContent",
        "googleMap",
        "offeredImageOne",
        "offeredImageTwo",
        "offeredImageThree",
        "homePageDescription",
        "homePageDescriptionBangla",
        "findTicketBanner",
        "contactUsImage",
        "loginPageImage",
        "locationImage",
        "faqImage",
        "policyImage",
        "qrImage",
        "blogImage"
      ]) as AddUpdateCompanyProps;

      // After processing all images, proceed with CMS update
      const result = await editCms({
        id: singleCms?.data?.id,
        data: updateData,
      }).unwrap();
      if (result?.success) {
        toast({
          title: translate("সিএমএস আপডেট বার্তা", "CMS Update Message"),
          description: toastMessage("update", translate("সিএমএস", "CMS")),
        });
        setEditStates({
          companyLogo: false,
          companyLogoBangla: false,
          footerLogo: false,
          footerLogoBangla: false,
        });
        setEditOpen({
          companyName: false,
          companyNameBangla: false,
          address: false,
          addressBangla: false,
          city: false,
          cityBangla: false,
          postalCode: false,
          supportNumber1: false,
          supportNumber2: false,
          facebook: false,
          instagram: false,
          twitter: false,
          linkedin: false,
          googleMap: false,
          aboutUsContent: false,
        });
      }
    } catch (error) {
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "সিএমএস আপডেট করতে ব্যর্থ হয়েছে।",
          "Failed to update CMS."
        ),
        variant: "destructive",
      });
    }
  };

  if (singleCmsLoading) {
    return <TableSkeleton columns={4} />;
  }

  return (
    <FormWrapper
      heading={translate("সিএমএস দেখুন সম্পাদনা করুন", "View & Edit CMS")}
      subHeading={translate(
        "সিস্টেমে সিএমএস সম্পাদনা করতে নিচের বিস্তারিত পরিবর্তন করুন।",
        "Modify the details below to edit the CMS in the system."
      )}
      className=""
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2 text-center lg:text-start font-semibold">
          <InputWrapper
            labelFor="companyLogo"
            label={`${translate(
              "কোম্পানির লোগো",
              "Company Logo"
            )}(148 x 60 px)`}
            className=""
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="companyLogo"
                label={translate(
                  "কোম্পানির লোগো নির্বাচন করুন",
                  "Select Company Logo"
                )}
                value={singleCms?.data?.companyLogo || ""}
                setFile={setCompanyLogoFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("companyLogo", previewUrl);
                  } else {
                    setValue("companyLogo", "");
                  }
                }}
                disabled={!editStates.companyLogo}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("companyLogo")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.companyLogo ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>

                {/* Conditionally render the Submit button when the edit state is active */}
                {editStates.companyLogo && (
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

          {/* Company Logo Bangla */}
          <InputWrapper
            labelFor="companyLogoBangla"
            label={`${translate(
              "কোম্পানির লোগো(বাংলা)",
              "Company Logo (Bangla)"
            )}(148 x 60 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="companyLogoBangla"
                label={translate(
                  "কোম্পানির লোগো নির্বাচন করুন(বাংলা)",
                  "Select Company Logo (Bangla)"
                )}
                value={singleCms?.data?.companyLogoBangla || ""}
                setFile={setCompanyLogoBanglaFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("companyLogoBangla", previewUrl);
                  } else {
                    setValue("companyLogoBangla", "");
                  }
                }}
                disabled={!editStates.companyLogoBangla}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("companyLogoBangla")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.companyLogoBangla ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.companyLogoBangla && (
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

          {/* Footer Logo */}
          <InputWrapper
            labelFor="footerLogo"
            label={`${translate("ফুটার লোগো", "Footer Logo")}(148 x 60 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="footerLogo"
                label={translate(
                  "ফুটার লোগো নির্বাচন করুন",
                  "Select Footer Logo"
                )}
                value={singleCms?.data?.footerLogo || ""}
                setFile={setFooterLogoFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("footerLogo", previewUrl);
                  } else {
                    setValue("footerLogo", "");
                  }
                }}
                disabled={!editStates.footerLogo}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("footerLogo")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.footerLogo ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.footerLogo && (
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

          {/* Footer Logo Bangla */}
          <InputWrapper
            labelFor="footerLogoBangla"
            label={`${translate(
              "ফুটার লোগো(বাংলা)",
              "Footer Logo (Bangla)"
            )}(148 x 60 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="footerLogoBangla"
                label={translate(
                  "ফুটার লোগো নির্বাচন করুন(বাংলা)",
                  "Select Footer Logo (Bangla)"
                )}
                value={singleCms?.data?.footerLogoBangla || ""}
                setFile={setFooterLogoBanglaFile}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("footerLogoBangla", previewUrl);
                  } else {
                    setValue("footerLogoBangla", "");
                  }
                }}
                disabled={!editStates.footerLogoBangla}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("footerLogoBangla")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.footerLogoBangla ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.footerLogoBangla && (
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
          {/* slider image one */}
          <InputWrapper
            labelFor="offeredImage1"
            label={translate("অফারের ছবি ১", "Offered Image 1")}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="offeredImage1"
                label={`${translate(
                  "অফারের ছবি ১ নির্বাচন করুন(বাংলা)",
                  "Select Offered Image 1"
                )} (1200 x 240 px)`}
                value={singleCms?.data?.offeredImageOne || ""}
                setFile={setOfferSliderOne}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("offeredImageOne", previewUrl);
                  } else {
                    setValue("offeredImageOne", "");
                  }
                }}
                disabled={!editStates.offerSliderOne}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("offerSliderOne")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.offerSliderOne ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.offerSliderOne && (
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

          <InputWrapper
            labelFor="offeredImage2"
            label={`${translate(
              "অফারের ছবি ২",
              "Offered Image 2"
            )} (1200 x 240 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="offeredImage2"
                label={translate(
                  "অফারের ছবি ২ নির্বাচন করুন(বাংলা)",
                  "Select Offered Image 2"
                )}
                value={singleCms?.data?.offeredImageTwo || ""}
                setFile={setOfferSliderTwo}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("offeredImageTwo", previewUrl);
                  } else {
                    setValue("offeredImageTwo", "");
                  }
                }}
                disabled={!editStates.offerSliderTwo}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("offerSliderTwo")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.offerSliderTwo ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.offerSliderTwo && (
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
          <InputWrapper
            labelFor="offeredImage3"
            label={`${translate(
              "অফারের ছবি ৩",
              "Offered Image 3"
            )} (1200 x 240 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="offeredImage3"
                label={translate(
                  "অফারের ছবি ৩ নির্বাচন করুন(বাংলা)",
                  "Select Offered Image 3"
                )}
                value={singleCms?.data?.offeredImageThree || ""}
                setFile={setOfferSliderThree}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("offeredImageThree", previewUrl);
                  } else {
                    setValue("offeredImageThree", "");
                  }
                }}
                disabled={!editStates.offerSliderThree}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("offerSliderThree")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.offerSliderThree ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.offerSliderThree && (
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

          <InputWrapper
            labelFor="findTicketBanner"
            label={`${translate(
              "টিকিট ব্যানার",
              "Find Tickit Banner"
            )} (1200 x 500 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="findTicketBanner"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.findTicketBanner || ""}
                setFile={setFindTicketBannerImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("findTicketBanner", previewUrl);
                  } else {
                    setValue("findTicketBanner", "");
                  }
                }}
                disabled={!editStates.findTicketBanner}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("findTicketBanner")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.findTicketBanner ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.findTicketBanner && (
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
          <InputWrapper
            labelFor="loginPageImage"
            label={`${translate("", "Login Banner")} (800 x 800 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="loginPageImage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.loginPageImage || ""}
                setFile={setLoginPageImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("loginPageImage", previewUrl);
                  } else {
                    setValue("loginPageImage", "");
                  }
                }}
                disabled={!editStates.loginPageImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("loginPageImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.loginPageImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.loginPageImage && (
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
          <InputWrapper
            labelFor="contactusimage"
            label={`${translate("", "Contact Us Banner")} (1200 x 300 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="contactusimage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.contactUsImage || ""}
                setFile={setContactUsImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("contactUsImage", previewUrl);
                  } else {
                    setValue("contactUsImage", "");
                  }
                }}
                disabled={!editStates.contactUsImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("contactUsImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.contactUsImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.contactUsImage && (
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
          <InputWrapper
            labelFor="locationimage"
            label={`${translate("", "Counter Location Banner")} (1920 x 300 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="locationimage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.locationImage || ""}
                setFile={setLocationImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("locationImage", previewUrl);
                  } else {
                    setValue("locationImage", "");
                  }
                }}
                disabled={!editStates.locationImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("locationImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.locationImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.locationImage && (
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
           <InputWrapper
            labelFor="faqimage"
            label={`${translate("", "Faq Banner")} (1920 x 300 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="faqimage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.faqImage || ""}
                setFile={setFaqImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("faqImage", previewUrl);
                  } else {
                    setValue("faqImage", "");
                  }
                }}
                disabled={!editStates.faqImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("faqImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.faqImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.faqImage && (
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
           <InputWrapper
            labelFor="policyimage"
            label={`${translate("", "Policy Banner")} (1920 x 300 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="policyimage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.policyImage || ""}
                setFile={setPolicyImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("policyImage", previewUrl);
                  } else {
                    setValue("policyImage", "");
                  }
                }}
                disabled={!editStates.policyImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("policyImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.policyImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.policyImage && (
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
           <InputWrapper
            labelFor="blogimage"
            label={`${translate("", "Blog Banner")} (1920 x 300 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="blogimage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select banner"
                )}
                value={singleCms?.data?.blogImage || ""}
                setFile={setBlogImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("blogImage", previewUrl);
                  } else {
                    setValue("blogImage", "");
                  }
                }}
                disabled={!editStates.blogImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("blogImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.blogImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.blogImage && (
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
           <InputWrapper
            labelFor="QrImage"
            label={`${translate("", "QR Code")} (300 x 200 px)`}
          >
            <div className="flex flex-col items-center gap-2">
              <FileInputArray
                className={"w-[150px] lg:w-[232px]"}
                id="QrImage"
                label={translate(
                  "ব্যানার নির্বাচন করুন(বাংলা)",
                  "Select QR"
                )}
                value={singleCms?.data?.qrImage || ""}
                setFile={setQrImage}
                onChange={(file) => {
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setValue("qrImage", previewUrl);
                  } else {
                    setValue("qrImage", "");
                  }
                }}
                disabled={!editStates.qrImage}
              />
              <div className="flex lg:gap-3 gap-2 items-center">
                <Button
                  onClick={() => toggleEditState("qrImage")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.qrImage ? (
                    <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                  ) : (
                    <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                  )}
                </Button>
                {editStates.qrImage && (
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-2">
          {/* Dynamically render fields */}
          {Object.entries(cmsForm).map(([key, { label, placeholder }]) => (
            <InputWrapper
              key={key}
              error={(errors as any)[key]?.message}
              labelFor={key}
              label={translate(label.bn, label.en)}
              className="relative lg:mt-10"
            >
              <div className="flex flex-col items-center gap-3">
                <input
                  id={key}
                  {...register(key as keyof AddUpdateCompanyProps)}
                  type="text"
                  placeholder={translate(placeholder.bn, placeholder.en)}
                  className="border p-2 rounded w-full"
                  disabled={!editOpen[key]}
                />
                <div className="flex gap-1 items-center absolute top-0 right-1 bottom-2 z-10">
                  <Button
                    onClick={() => toggleEditOpen(key)}
                    variant="outline"
                    size="sm"
                    type="button"
                  >
                    {editOpen[key] ? (
                      <X className="lg:h-6 lg:w-6 h-4 w-4 text-red-600" />
                    ) : (
                      <FilePenLine className="lg:h-6 lg:w-6 h-4 w-4 text-green-600" />
                    )}
                  </Button>
                  {editOpen[key] && (
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
          ))}
        </div>
        <HomePageDescription
          //register={register}
          setValue={setValue}
          editStates={editStates}
          toggleEditState={toggleEditState}
          errors={errors}
          isLoading={isLoading}
          uploadPhotoLoading={uploadPhotoLoading}
          error={error}
          translate={translate}
          getValues={getValues}
        />

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2">
          <InputWrapper
            key="homePageDescription"
            error={(errors as any)?.homePageDescription?.message}
            labelFor="homePageDescription"
            label={translate(
              "হোমপেজের বর্ণনা",
              "Homepage Description"
            )}
            className="relative mt-10"
          >
            <div className="flex flex-col items-center gap-3">
              <textarea
                id="homePageDescription"
                {...register(
                  "homePageDescription" as keyof AddUpdateCompanyProps
                )}
                placeholder={translate(
                  "হোমপেজের বর্ণনা লিখুন",
                  "Enter homepage description"
                )}
                className="border p-2 rounded w-full resize-none"
                rows={4} // Adjust rows as needed for multiline input
                disabled={!editStates.homePageDescription}
              />
              <div className="flex items-center gap-3 absolute top-19 right-1">
                <Button
                  onClick={() => toggleEditState("homePageDescription")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.homePageDescription ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : (
                    <FilePenLine className="h-6 w-6 text-green-600" />
                  )}
                </Button>
                {editStates.homePageDescription && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>
          <InputWrapper
            key="homePageDescriptionBangla"
            error={(errors as any)?.homePageDescriptionBangla?.message}
            labelFor="homePageDescriptionBangla"
            label={translate(
              "হোমপেজের বর্ণনা (বাংলা)",
              "Homepage Description (Bangla)"
            )}
            className="relative mt-10"
          >
            <div className="flex flex-col items-center gap-3">
              <textarea
                id="homePageDescriptionBangla"
                {...register(
                  "homePageDescriptionBangla" as keyof AddUpdateCompanyProps
                )}
                placeholder={translate(
                  "হোমপেজের বর্ণনা বাংলায় লিখুন",
                  "Enter homepage description in Bangla"
                )}
                className="border p-2 rounded w-full resize-none"
                rows={4} // Adjust rows as needed for multiline input
                disabled={!editStates.homePageDescriptionBangla}
              />
              <div className="flex items-center gap-3 absolute top-19 right-1">
                <Button
                  onClick={() => toggleEditState("homePageDescriptionBangla")}
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  {editStates.homePageDescriptionBangla ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : (
                    <FilePenLine className="h-6 w-6 text-green-600" />
                  )}
                </Button>
                {editStates.homePageDescriptionBangla && (
                  <Submit
                    className="mt-0 pt-0"
                    loading={isLoading || uploadPhotoLoading}
                    errors={error}
                    icon={<FilePenLine className="h-6 w-5 text-gray-100" />}
                    errorTitle={translate(
                      "সিএমএস আপডেট করতে ত্রুটি",
                      "Error updating CMS"
                    )}
                  />
                )}
              </div>
            </div>
          </InputWrapper>
        </div> */}
      </form>
    </FormWrapper>
  );
};

export default AddContentManagement;
