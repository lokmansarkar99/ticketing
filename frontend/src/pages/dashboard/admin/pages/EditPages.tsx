import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  useGetSinglePageQuery,
  useUpdatePageMutation,
} from "@/store/api/page/pageApi";
import {
  addEditPageSchema,
  PageFormData,
} from "@/schemas/page/addEditPagesSchema";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonLoader from "@/components/common/typography/ButtonLoader";
import { Loader } from "@/components/common/Loader";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import ContentEditor from "./ContentEditor";
import { zodResolver } from "@hookform/resolvers/zod";

const EditPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translate } = useCustomTranslator();

  const { data: singlePage, isLoading: singlePageLoading } =
    useGetSinglePageQuery(slug);

  const [updatePage, { isLoading, error }] = useUpdatePageMutation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    setError,
    reset,
  } = useForm<PageFormData>({
    resolver: zodResolver(addEditPageSchema),
    defaultValues: {
      status: "Draft",
      title: "",
      slug: "",
      seoTitle: "",
      seoDescription: "",
      content: "",
    },
  });

  // ✅ Pre-fill form when singlePage data loads
  useEffect(() => {
    if (singlePage?.data) {
      reset({
        title: singlePage.data.title ?? "",
        slug: singlePage.data.slug ?? "",
        content: singlePage.data.content ?? "",
        seoTitle: singlePage.data.seoTitle ?? "",
        seoDescription: singlePage.data.seoDescription ?? "",
        status: singlePage.data.status ?? "Draft",
        type: singlePage.data.type ?? "Policy",
      });
    }
  }, [singlePage?.data, reset]);

  // ✅ Handle Update
  const handleUpdatePage = async (data: PageFormData) => {
    const cleanedData = removeFalsyProperties(data, [
      "seoTitle",
      "seoDescription",
    ]);

    try {
      const result = await updatePage({
        id: singlePage?.data?.id,
        data: cleanedData,
      });

      if ("data" in result && result.data?.success) {
        toast({
          title: translate("সফল", "Success"),
          description: translate(
            "পৃষ্ঠা আপডেট হয়েছে",
            "Page updated successfully."
          ),
        });
        navigate("/admin/pages-list");
      }
    } catch (err) {
      console.error("Error updating page:", err);
      toast({
        title: translate("ত্রুটি", "Error"),
        description: translate(
          "পৃষ্ঠা আপডেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
          "Failed to update page. Please try again."
        ),
        variant: "destructive",
      });
    }
  };

  if (singlePageLoading) {
    return <Loader />;
  }

  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form
        onSubmit={handleSubmit(handleUpdatePage)}
        className="overflow-hidden"
      >
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status */}
          <InputWrapper
            label={translate("স্ট্যাটাস নির্বাচন করুন", "Select Status")}
            labelFor="page-status"
            error={errors?.status?.message}
          >
            <Select
              value={watch("status")}
              onValueChange={(value: "Draft" | "Trust" | "Published") => {
                setValue("status", value);
                setError("status", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="page-status">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Trust">Trash</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          <InputWrapper
            label={"Select a Type"}
            labelFor="page-type"
            error={errors?.status?.message}
          >
            <Select
              value={watch("type")}
              onValueChange={(value: "Policy" | "Navigation") => {
                setValue("type", value);
                setError("type", { type: "custom", message: "" });
              }}
            >
              <SelectTrigger id="page-type">
                <SelectValue placeholder="Select a type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Policy">Policy</SelectItem>
                <SelectItem value="Navigation">Navigation</SelectItem>
              </SelectContent>
            </Select>
          </InputWrapper>
          {/* Title */}
          <InputWrapper
            label={translate("শিরোনাম ✽", "Title ✽")}
            labelFor="title"
            error={errors?.title?.message}
          >
            <Input
              placeholder="Enter title"
              value={watch("title") ?? ""}
              onChange={(e: any) => setValue("title", e.target.value)}
            />
          </InputWrapper>

          {/* Slug */}
          <InputWrapper
            label={translate("স্লাগ ✽", "Slug ✽")}
            labelFor="slug"
            error={errors?.slug?.message}
          >
            <Input
              placeholder="Enter slug"
              value={watch("slug") ?? ""}
              onChange={(e: any) => setValue("slug", e.target.value)}
            />
          </InputWrapper>

          {/* SEO Title */}
          <InputWrapper
            label={translate("এসইও শিরোনাম", "SEO Title")}
            labelFor="seoTitle"
            error={errors?.seoTitle?.message}
          >
            <Input
              placeholder="Enter SEO title"
              value={watch("seoTitle") ?? ""}
              onChange={(e: any) => setValue("seoTitle", e.target.value)}
            />
          </InputWrapper>

          {/* SEO Description */}
          <InputWrapper
            label={translate("এসইও বিবরণ", "SEO Description")}
            labelFor="seoDescription"
            error={errors?.seoDescription?.message}
          >
            <Textarea
              value={watch("seoDescription") ?? ""}
              onChange={(e: any) => setValue("seoDescription", e.target.value)}
              placeholder="Enter SEO description"
            />
          </InputWrapper>
        </div>

        {/* Section 2: Content */}
        <div className="mt-10">
          <ContentEditor
            setValue={setValue}
            getValues={getValues}
            fieldName="content"
            label={translate("বিষয়বস্তু", "Content")}
            errors={errors}
            error={error}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1 ml-2">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Submit Section */}
        <div className="flex justify-end my-5">
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            {error && "data" in error && (
              <Alert variant="destructive" className="w-full md:w-[400px]">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {translate("পৃষ্ঠা সম্পাদনার ত্রুটি", "Page Edit Error")}
                </AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    translate(
                      "কিছু ভুল হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।",
                      "Something went wrong! Please try again."
                    )}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:opacity-70"
            >
              {isLoading && <ButtonLoader />}
              {translate("আপডেট", "Update")}
            </button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default EditPage;
