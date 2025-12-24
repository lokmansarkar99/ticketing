import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva("animate-pulse", {
  variants: {
    variant: {
      default: "bg-primary/30",
      primary: "bg-primary/30",
      secondary: "bg-secondary/30",
      tertiary: "bg-tertiary/30",
      warning: "bg-warning/30",
      success: "bg-success/30",
      destructive: "bg-destructive/30",
    },
    shape: {
      default: "rounded-md",
      rounded: "rounded-md",
      square: "rounded-none",
      pill: "rounded-full",
    },
    typography: {
      default: "!h-[20px]",
      h1: "!h-[100px]",
      h2: "!h-[72px]",
      h3: "!h-[44px] my-2",
      h4: "!h-[32px]",
      h5: "!h-[20px]",
      h6: "!h-[20px]",
      paragraph: "!h-[20px]",
      paragraph_lg: "!h-[22px]",
      paragraph_md: "!h-[18px]",
      paragraph_sm: "!h-[16px]",
    },
    button: {
      default: "h-9",
      xs: "h-7",
      sm: "!h-9",
      lg: "h-11",
      icon: "!size-9",
      square: "w-[50px] h-[50px] p-0",
    },
    input: {
      default: "!h-9",
    },
    table: {
      default: "h-10",
      sm: "!h-8",
    },
  },
  defaultVariants: {
    variant: "default",
    shape: "default",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({
  className,
  variant,
  shape,
  typography,
  button,
  table,
  input,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        skeletonVariants({
          variant,
          shape,
          typography,
          button,
          table,
          input,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Skeleton, skeletonVariants };
