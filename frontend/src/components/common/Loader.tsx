import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const loaderVariants = cva("block rounded-full border-dotted animate-spin", {
  variants: {
    variant: {
      default: "border-primary-foreground",
      destructive: "border-destructive-foreground",
      primary: "border-primary-foreground",
      secondary: "border-secondary-foreground",
      tertiary: "border-tertiary-foreground",
      warning: "border-warning-foreground",
      success: "border-success-foreground",
    },
    size: {
      sm: "size-5 border-x-[3px] mr-2",
      md: "size-10 border-x-[4px] mr-3",
      lg: "size-16 border-x-4 mr-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "sm",
  },
});

interface LoaderProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "size">,
    VariantProps<typeof loaderVariants> {
  asChild?: boolean;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        className={cn(loaderVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      ></Comp>
    );
  }
);

Loader.displayName = "Loader";

export { Loader, loaderVariants as loaderVariants };
