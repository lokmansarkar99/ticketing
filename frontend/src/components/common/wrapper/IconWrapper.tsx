import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconWrapperVariants = cva(
  "transition-all flex justify-center items-center",
  {
    variants: {
      variant: {
        default: "bg-background/30",
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        tertiary: "bg-tertiary/10",
        destructive: "bg-destructive/10",
        success: "bg-success/10",
        warning: "bg-warning/10",
        muted: "bg-muted/10",
        accent: "bg-accent/10",
      },
      gradient: {
        default: "",
        primary: "bg-gradient-to-tr from-primary to-white",
        secondary: "bg-gradient-to-tr from-secondary to-white",
        tertiary: "bg-gradient-to-tr from-tertiary to-white",
        success: "bg-gradient-to-tr from-success to-white",
        destructive: "bg-gradient-to-tr from-destructive to-white",
        warning: "bg-gradient-to-tr from-warning to-white",
      },
      blur: {
        none: "",
        sm: "backdrop-blur-[5px]",
        md: "backdrop-blur-md",
        lg: "backdrop-blur-lg",
        xl: "backdrop-blur-xl",
      },
      size: {
        default: "",
        sm: "size-[116px]",
        md: "size-[116px]",
        lg: "size-[116px]",
        xl: "size-[116px]",
      },
      shape: {
        default: "rounded-none",
        rounded: "rounded-xl",
        circle: "rounded-full",
        square: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      gradient: "default",
      blur: "none",
      shape: "default",
      size: "default",
    },
  }
);
interface IIconWrapperProps extends VariantProps<typeof iconWrapperVariants> {
  children: React.ReactNode;
  className?: string;
}

const IconWrapper: React.FC<IIconWrapperProps> = ({
  children,
  className,
  variant,
  gradient,
  shape,
  size,
  blur,
}) => {
  return (
    <div
      className={cn(
        iconWrapperVariants({ variant, blur, gradient, size, shape }),
        className
      )}
    >
      {children}
    </div>
  );
};

export default IconWrapper;
