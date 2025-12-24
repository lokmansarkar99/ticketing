import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface FileInputArrayProps {
  id: string;
  label: string;
  value?: string;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string; 
  setFile?:(file: any) => void;
}

const FileInputArray: React.FC<FileInputArrayProps> = ({
  id,
  label,
  value,
  onChange,
  disabled,
  className,
  setFile
}) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
      if (setFile) {
        setFile(file);
      }
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  return (
    <div className="">
      <label
        htmlFor={id}
        className={cn(`w-full flex flex-col items-center p-3 ${
          disabled ? "bg-gray-200" : "bg-white"
        } text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer`, className)}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full  object-contain border rounded-md"
          />
        ) : (
          <>
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">{label}</span>
          </>
        )}

        <input
          type="file"
          id={id}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileInputArray;
