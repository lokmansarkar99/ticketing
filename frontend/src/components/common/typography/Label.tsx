import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none transition-colors",
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
      size: {
        default: "text-[18px] font-[500] leading-[110%]",
        lg: "text-[18px] font-[600] leading-[110%]",
        md: "text-[18px] font-[500] leading-[110%]",
        sm: "text-[16px] font-[400] leading-[110%]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  asChild?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "label";
    return (
      <Comp
        className={cn(labelVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label, labelVariants };
