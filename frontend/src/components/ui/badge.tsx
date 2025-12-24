import { cn } from "@/lib/utils";
import { useFontShifter } from "@/utils/hooks/useFontShifter";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva(
  "inline-flex items-center justify-center border select-none backdrop-blur-sm  tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      size: {
        default: "px-2 pt-[1.5px] pb-[2px] text-xs font-light",
        sm: "px-2 pt-[1.5px] pb-[2px] text-sm font-light",
        md: "px-4 pt-[2.5px] pb-[3px] text-base",
        lg: "px-4 pt-[3px] pb-[3.5px] text-lg",
        responsivesize:
          "px-2 pt-[1.5px] pb-[2px] md:text-sm text-xs font-light",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-lg",
        square: "rounded-none",
        pill: "rounded-full",
        responsivepill: "md:rounded-full rounded-md",
      },
      variant: {
        default:
          "border-primary bg-primary/70 dark:bg-primary/50 text-primary-foreground",
        primary:
          "border-primary bg-primary/70 dark:bg-primary/50text-primary-foreground",
        secondary:
          "border-secondary bg-secondary/70 dark:bg-secondary/50 text-secondary-foreground",
        tertiary:
          "border-tertiary bg-tertiary/70 dark:bg-tertiary/50 text-tertiary-foreground",
        warning:
          "border-warning bg-warning/70 dark:bg-warning/50 text-warning-foreground",
        success:
          "border-success bg-success/70 dark:bg-success/50 text-success-foreground",
        green:
          "border-success bg-green-500 dark:bg-success/50 text-success-foreground",
        destructive:
          "border-destructive bg-destructive/70 dark:bg-destructive/50 text-destructive-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, size, shape }),
        className,
        useFontShifter()
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
