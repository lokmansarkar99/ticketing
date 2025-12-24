import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import * as React from "react";

const InputWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    error?: string;
    label: React.ReactNode;  // changed from string to React.ReactNode
    labelFor?: string;
    isRequired?: boolean;
  }
>(({ className, error, label, isRequired, labelFor, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full flex flex-col p-1", className, useFontShifter())}
    {...props}
  >
    {label && (
      <label
        className="text-xs sm:text-sm font-semibold max-w-none truncate inline-block leading-8"
        htmlFor={labelFor || ""}
      >
        {typeof label === "string" && label.trim() === "#" ? (
          <span className="invisible leading-8">empty</span>
        ) : (
          <span>{label} {isRequired && <span className="text-red-500">*</span>} </span>
        )}
      </label>
    )}
    {children}
    {error && (
      <label
        className="text-sm text-destructive max-w-none block mt-1"
        htmlFor={labelFor || ""}
      >
        {error}
      </label>
    )}
  </div>
));
InputWrapper.displayName = "InputWrapper";

export { InputWrapper };
