import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Assuming this is a utility to concatenate class names

const tagVariants = cva(
  "text-base font-light px-4 py-2 leading-none transition-colors select-none drop-shadow-sm transition-colors duration-300 text-foreground",
  {
    variants: {
      variant: {
        default: "bg-foreground/5 hover:bg-foreground/10",
        primary: "bg-primary/5 hover:bg-primary/10",
        secondary: "bg-secondary/5 hover:bg-secondary/10",
        tertiary: "bg-tertiary/5 hover:bg-tertiary/10",
        destructive: "bg-destruction/5 hover:bg-destruction/10",
        success: "bg-success/5 hover:bg-success/10",
        warning: "bg-warning/5 hover:bg-warning/10",
        muted: "bg-muted/5 hover:bg-muted/10",
        accent: "bg-accent/5 hover:bg-accent/10",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-lg",
        square: "rounded-none",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      shape: "default",
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  asChild?: boolean;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, shape, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(tagVariants({ variant, shape }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Tag.displayName = "Tag";

export { Tag, tagVariants };
