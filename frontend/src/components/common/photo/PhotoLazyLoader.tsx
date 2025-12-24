"use client";
import { cn } from "@/lib/utils";
import { FC } from "react";
import LazyLoad from "react-lazy-load";
interface IPhotoLazyLoadWrapperProps {
  src: any;
  alt?: string;
  className?: string;
}

const PhotoLazyLoadWrapper: FC<IPhotoLazyLoadWrapperProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <LazyLoad>
      <img
        className={cn("object-cover", className)}
        src={src}
        width={2000}
        height={2000}
        alt={alt || "thumbnail"}
      />
    </LazyLoad>
  );
};

export default PhotoLazyLoadWrapper;
