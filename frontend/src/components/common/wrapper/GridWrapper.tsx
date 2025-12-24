import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gridWrapperVariants = cva("grid gap-4", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      7: "grid-cols-7",
      8: "grid-cols-8",
      9: "grid-cols-9",
      10: "grid-cols-10",
      11: "grid-cols-11",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-x-4 gap-y-2",
      lg: "gap-6",
      xl: "gap-8",
    },
    rows: {
      auto: "grid-rows-auto",
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
      4: "grid-rows-4",
      5: "grid-rows-5",
      6: "grid-rows-6",
    },
  },
  defaultVariants: {
    columns: 3,
    gap: "md",
    rows: "auto",
  },
});

export interface GridWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridWrapperVariants> {}

const GridWrapper = ({
  className,
  columns,
  gap,
  rows,
  ...props
}: GridWrapperProps) => {
  return (
    <div
      className={cn(gridWrapperVariants({ columns, gap, rows }), className)}
      {...props}
    />
  );
};

export { GridWrapper, gridWrapperVariants };
