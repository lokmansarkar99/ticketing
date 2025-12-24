/* eslint-disable react-refresh/only-export-components */
"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBlogCategoriesQuery } from "@/store/api/blog/blogCategoryApi";
import { useUploadPhotoMutation } from "@/store/api/fileApi";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ButtonLoader from "@/components/common/typography/ButtonLoader";
import { InputWrapper } from "@/components/common/form/InputWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ContentEditor from "../pages/ContentEditor";
import { useCustomTranslator } from "@/utils/hooks/useCustomTranslator";
import { useAddPostMutation } from "@/store/api/blog/blogApi";
import FileInputArray from "@/components/common/form/FileInputArray";

// Zod Schema
export const blogSchema = z.object({
  status: z.enum(["Draft", "Trust", "Published"]),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  categoryId: z.number().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  alt: z.string().optional(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  onSuccess?: () => void;
}

const BlogFormModal = ({ onSuccess }: BlogFormProps) => {
  const { toast } = useToast();
  const { translate } = useCustomTranslator();
  const [addPost, { isLoading: postLoading }] = useAddPostMutation();
  const [addThumbnail, { isLoading: uploadLoading }] = useUploadPhotoMutation();

  const [imagePreview, setImagePreview] = useState<string>("");
  const [offerFile, setOfferFile] = useState<File | null>(null);

  // @ts-ignore
  const [searchQuery, setSearchQuery] = useState({ category: "" });

  const { data: categoryList } = useGetBlogCategoriesQuery({});
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
    reset,
    trigger,
    getValues,
  } = useForm<BlogFormData>({
    defaultValues: {
      status: "Published",
      title: "",
      author: "",
      categoryId: undefined,
      content: "",
      image: "",
      seoTitle: "",
      seoDescription: "",
      alt: "",
    },
  });

  const handleReset = () => {
    reset();
    setSearchQuery({ category: "" });
    onSuccess?.();
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      // Validate with Zod first
      const validatedData = blogSchema.parse(data);
      let imageUrl = "";

      if (offerFile) {
        try {
          const uploadResponse = await addThumbnail(offerFile).unwrap();
          if (uploadResponse && "data" in uploadResponse) {
            imageUrl = uploadResponse.data;
          }
        } catch (error) {
          toast({
            title: translate("ছবি আপলোড করতে ব্যর্থ", "Failed to upload image"),
            description: translate(
              "ফাইল আপলোড করার সময় একটি ত্রুটি ঘটেছে।",
              "An error occurred while uploading the file."
            ),
            variant: "destructive",
          });
          return;
        }
      }

      const payload = {
        status: validatedData.status,
        title: validatedData.title,
        author: validatedData.author,
        categoryId: validatedData.categoryId,
        content: validatedData.content,
        image: imageUrl,
        seoTitle: validatedData.seoTitle,
        seoDescription: validatedData.seoDescription,
      };

      await addPost(payload).unwrap();
      toast({
        title: "Blog post created successfully",
      });
      handleReset();
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as keyof BlogFormData;
          setError(fieldName, {
            type: "manual",
            message: issue.message,
          });
        });
      } else {
        const apiError = error as any;
        toast(apiError?.data?.message || "Failed to create blog post");
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await trigger();

    if (isValid) {
      handleSubmit(onSubmit)().catch((error) => {
        console.error("Form submission error:", error);
      });
    } else {
      toast({
        title: "Please fill in all required fields correctly",
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Publish Your Blog</h1>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={uploadLoading || postLoading}
            className="px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit {(uploadLoading || postLoading) && <ButtonLoader />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputWrapper
          label="Status"
          labelFor="status"
          error={errors.status?.message}
        >
          <Select
            value={watch("status")}
            onValueChange={(val: "Draft" | "Published" | "Trust") => {
              setValue("status", val);
              clearErrors("status");
            }}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper
          label="Title"
          labelFor="title"
          error={errors.title?.message}
        >
          <Input
            placeholder="Enter blog title"
            value={watch("title")}
            onChange={(e) => {
              setValue("title", e.target.value);
              clearErrors("title");
            }}
          />
        </InputWrapper>

        <InputWrapper
          label="Author"
          labelFor="author"
          error={errors.author?.message}
        >
          <Input
            placeholder="Enter author name"
            value={watch("author")}
            onChange={(e) => {
              setValue("author", e.target.value);
              clearErrors("author");
            }}
          />
        </InputWrapper>

        <InputWrapper
          label="Category"
          labelFor="category"
          error={errors.categoryId?.message}
        >
          <Select
            value={watch("categoryId")?.toString()}
            onValueChange={(value) => {
              setValue("categoryId", Number(value));
              clearErrors("categoryId");
            }}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent>
              {categoryList?.data?.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>

        <InputWrapper
          label="SEO Title"
          labelFor="seoTitle"
          error={errors.seoTitle?.message}
        >
          <Input
            placeholder="Enter SEO title"
            value={watch("seoTitle") || ""}
            onChange={(e) => {
              setValue("seoTitle", e.target.value);
              clearErrors("seoTitle");
            }}
          />
        </InputWrapper>

        <InputWrapper
          label="SEO Description"
          labelFor="seoDescription"
          error={errors.seoDescription?.message}
        >
          <Textarea
            placeholder="Enter SEO description"
            value={watch("seoDescription") || ""}
            onChange={(e) => {
              setValue("seoDescription", e.target.value);
              clearErrors("seoDescription");
            }}
          />
        </InputWrapper>

        <div>
          <InputWrapper
            label={"Upload Image (1240×300px"}
            error={errors.image?.message}
          >
            <FileInputArray
              className={"w-[150px] lg:w-[232px]"}
              id="companyLogoBangla"
              label={translate(
                "কোম্পানির লোগো নির্বাচন করুন(বাংলা)",
                "Select Company Logo (Bangla)"
              )}
              value={imagePreview || ""}
              setFile={setOfferFile}
              onChange={(file) => {
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  setImagePreview(previewUrl);
                  setValue("image", previewUrl);
                } else {
                  setImagePreview("");
                  setValue("image", "");
                }
              }}
            />
          </InputWrapper>
        </div>

        <InputWrapper
          label="Alt Text (Optional)"
          labelFor="alt"
          error={errors.alt?.message}
        >
          <Input
            placeholder="Enter alt text for image (optional)"
            value={watch("alt") || ""}
            onChange={(e) => {
              setValue("alt", e.target.value);
              clearErrors("alt");
            }}
          />
        </InputWrapper>
      </div>

      <div className="mt-10">
        <InputWrapper
          label="Content"
          labelFor="content"
          error={errors.content?.message}
        >
          <ContentEditor
            setValue={setValue}
            getValues={getValues}
            fieldName="content"
            label={translate("বিষয়বস্তু", "Content")}
            errors={errors}
            error={""}
          />
        </InputWrapper>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={uploadLoading || postLoading}
          className="px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit {(uploadLoading || postLoading) && <ButtonLoader />}
        </Button>
      </div>
    </form>
  );
};

export default BlogFormModal;
