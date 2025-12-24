import { useGetAllPostsQuery } from "@/store/api/blog/blogApi";
import { FC } from "react";
import HomeLoader from "./HomeLoader";
import { useGetSingleCMSQuery } from "@/store/api/cms/contentManagementApi";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface IBlogProps {}

const Blog: FC<IBlogProps> = () => {
  const { data: blogs, isLoading: blogLoading } = useGetAllPostsQuery({});
  const { data: singleCms, isLoading } = useGetSingleCMSQuery({});
  const aboutUsContent = singleCms?.data?.blogImage ?? "";

  if (blogLoading || isLoading) return <HomeLoader />;
  return (
    <section>
      {" "}
      {/* Top Banner */}
      <div className="w-full h-60 pt-9">
        <img
          src={aboutUsContent}
          alt="Banner"
          className="w-full h-60 object-cover"
        />
      </div>
      <div className="max-w-7xl px-3 lg:px-4 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-20">
        {blogs?.data?.map((blog: any) => (
          <div
            key={blog.id}
            className="rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition overflow-hidden group"
          >
            <Link className="" to={`/blogs/${blog?.slug}`}>
              {" "}
              {/* Blog Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover group-hover:scale-105 duration-300"
              />
              {/* Blog Content */}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-3 line-clamp-2">
                  {blog.title}
                </h2>

                {/* Continue Reading */}
                <a
                  href={`/blog/${blog.slug}`}
                  className="text-primary font-semibold uppercase tracking-wide text-sm flex items-center gap-2 group-hover:translate-x-2 duration-300"
                >
                  Continue Reading
                  <span>
                    <FaArrowRightLong />
                  </span>
                </a>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
