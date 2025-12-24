import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const subheadingVariants = cva("font-medium leading-tight transition-colors", {
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
    size: {
      h2: "text-[82px] font-[700] leading-[38%] tracking-[1.78px]",
      h3: "text-[10px] font-[700] leading-[38%] tracking-[1.78px]",
      h4: "text-[14px] font-[400] leading-[69%] tracking-[3.36px]",
      h5: "text-[20px] font-[700] leading-[38%] tracking-[1.78px]",
      h6: "text-[16px] font-[700] leading-[38%] tracking-[1.78px]",
    },
    case: {
      upper: "uppercase",
      lower: "lowercase",
      normal: "normal-case",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "h4",
    case: "normal",
  },
});

export interface SubheadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof subheadingVariants> {
  asChild?: boolean;
  level?: 2 | 3 | 4 | 5 | 6;
}

const Subheading = React.forwardRef<HTMLHeadingElement, SubheadingProps>(
  (
    {
      className,
      variant,
      size,
      case: textCase,
      asChild = false,
      level = 3,
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
          subheadingVariants({ variant, size, case: textCase, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Subheading.displayName = "Subheading";

export { Subheading, subheadingVariants };
