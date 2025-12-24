import PageWrapper from "@/components/common/wrapper/PageWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAddPageMutation } from "@/store/api/page/pageApi";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { removeFalsyProperties } from "@/utils/helpers/removeEmptyStringProperties";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ButtonLoader from "@/components/common/typography/ButtonLoader";
import {
  addEditPageSchema,
  PageFormData,
} from "@/schemas/page/addEditPagesSchema";
import ContentEditor from "./ContentEditor";
import { zodResolver } from "@hookform/resolvers/zod";

const AddPages = () => {
  const navigate = useNavigate();
  const { translate } = useCustomTranslator();
  const { toast } = useToast();
  const [addPage, { isLoading, error }] = useAddPageMutation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
    setError,
    getValues
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

  const handleAddPage = async (data: PageFormData) => {
    try {
      const updateData = removeFalsyProperties(data, [
        "seoTitle",
        "seoDescription",
      ]);

      const result = await addPage(updateData);

      if ("data" in result && result.data?.success) {
        toast({
          title: "Add Page Message",
          description: translate(
            "ফাইল আপলোড করার সময় একটি ত্রুটি ঘটেছে।",
            "An error occurred while uploading the file."
          ),
        });

        navigate("/admin/pages-list");
        reset();
      }
    } catch (err) {
      console.error("Error adding page:", err);
    }
  };

  return (
    <PageWrapper className="bg-white shadow-lg p-4 rounded-md overflow-hidden">
      <form onSubmit={handleSubmit(handleAddPage)} className="overflow-hidden">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status */}
          <InputWrapper
            label={"Select a Status"}
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
                <SelectValue placeholder="Select a type..." />
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
            label={"Title ✽"}
            labelFor="title"
            error={errors?.title?.message}
          >
            <Input
              placeholder="Enter title"
              value={watch("title")}
              onChange={(e: any) => setValue("title", e.target.value)}
            />
          </InputWrapper>

          {/* Slug */}
          <InputWrapper
            label={"Slug ✽"}
            labelFor="slug"
            error={errors?.slug?.message}
          >
            <Input
              placeholder="Enter slug"
              value={watch("slug")}
              onChange={(e: any) => setValue("slug", e.target.value)}
            />
          </InputWrapper>

          {/* SEO Title */}
          <InputWrapper
            label={"SEO Title"}
            labelFor="seoTitle"
            error={errors?.seoTitle?.message}
          >
            <Input
              placeholder="Enter SEO title"
              value={watch("seoTitle") ?? ""}
              onChange={(e: any) => setValue("seoTitle", e.target.value)}
            />
          </InputWrapper>
            <InputWrapper
            label={"SEO Description"}
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


        {/* Section 3: Content */}
        <div className="">
          
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
                <AlertTitle>Add page error</AlertTitle>
                <AlertDescription>
                  {(error.data as { message?: string })?.message ||
                    "Something went wrong! Please try again."}
                </AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 flex items-center py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:opacity-70"
            >
              {isLoading && <ButtonLoader />}
              Submit
            </button>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
};

export default AddPages;
