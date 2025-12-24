import { cn } from "@/lib/utils";
import { fallback } from "@/utils/constants/common/fallback";
import { FC } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface IPhotoViewWrapperProps {
  src: string;
  alt: string;
  className?: string;
}

const PhotoViewer: FC<IPhotoViewWrapperProps> = ({ src, className, alt }) => {
  return (
    <PhotoProvider>
      <PhotoView src={src || fallback.photo}>
        <img
          src={src || fallback.photo}
          className={cn("cursor-pointer object-cover", className)}
          alt={alt || fallback.notFound.en}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = fallback.photo;
          }}
        />
      </PhotoView>
    </PhotoProvider>
  );
};

export default PhotoViewer;
