import { useGetPostByIdQuery } from "@/store/api/blog/blogApi";
import { useParams } from "react-router-dom";
import HomeLoader from "./HomeLoader";

export default function SingleBlog() {
  const { slug } = useParams();
  const { data: singlePage, isLoading } = useGetPostByIdQuery(slug);

  if (isLoading) return <HomeLoader />;
  if (!singlePage)
    return <div className="text-center py-10">No blog found.</div>;

  const blog = singlePage.data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{blog.title}</h1>

      {/* Meta */}
      <div className="text-sm text-gray-600 mb-6 flex items-center gap-4">
        <span>Author: {blog.author}</span>
        <span>|</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Image */}
      <div className="w-full mb-6">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-80 object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* SEO Section (optional) */}
      {(blog.seoTitle || blog.seoDescription) && (
        <div className="mt-10 p-5 rounded-xl bg-gray-50 border">
          <h3 className="text-lg font-semibold mb-2">SEO Information</h3>
          {blog.seoTitle && (
            <p>
              <strong>SEO Title:</strong> {blog.seoTitle}
            </p>
          )}
          {blog.seoDescription && (
            <p>
              <strong>SEO Description:</strong> {blog.seoDescription}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
