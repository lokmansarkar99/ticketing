import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const headingVariants = cva(
  "font-semibold leading-tight transition-colors py-2 w-full",
  {
    variants: {
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        tertiary: "text-tertiary",
        destructive: "text-destructive",
        success: "text-success",
        warning: "text-warning",
        muted: "text-muted",
        accent: "text-accent",
      },
      gradient: {
        default: "",
        primary:
          "bg-gradient-to-tr from-primary to-white bg-clip-text text-transparent",
        secondary:
          "bg-gradient-to-tr from-secondary to-white bg-clip-text text-transparent",
        tertiary:
          "bg-gradient-to-tr from-tertiary to-white bg-clip-text text-transparent",
        success:
          "bg-gradient-to-tr from-success to-white bg-clip-text text-transparent",
        destructive:
          "bg-gradient-to-tr from-destructive to-white bg-clip-text text-transparent",
        warning:
          "bg-gradient-to-tr from-warning to-white bg-clip-text text-transparent",
      },
      size: {
        default: "text-[100px] font-[700] leading-[100%]",
        h1: "text-[100px] font-[700] leading-[100%]",
        h2: "text-[64px] font-[700] leading-[110%]",
        h3: "text-[40px] font-[700] leading-[110%] text-opacity-90",
        h4: "text-[24px] font-[600] leading-[110%] tracking-wide text-opacity-90",
        h5: "text-[20px] font-[500] leading-[110%] text-opacity-90",
        h6: "text-[20px] font-[500] leading-[110%] text-opacity-90",
        responsiveH3H4: "text-[40px] md:text-[40px] text-[24px] font-[700]",
      },
      position: {
        default: "text-start",
        start: "text-start",
        center: "text-center",
        end: "text-end",
      },
    },
    defaultVariants: {
      position: "default",
      variant: "default",
      size: "default",
      gradient: "default",
    },
  }
);

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      className,
      variant,
      size,
      gradient,
      asChild = false,

      level = 1,
      ...props
    },
    ref
  ) => {
    const Comp: React.ElementType = asChild
      ? Slot
      : (`h${level}` as keyof JSX.IntrinsicElements);
    return (
      <Comp
        className={cn(
          headingVariants({ variant, size, gradient }),
          useFontShifter(),
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
