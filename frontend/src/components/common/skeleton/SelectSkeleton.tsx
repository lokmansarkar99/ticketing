import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface ISelectSkeletonProps {
  className?: string;
  rows?: number;
}

const SelectSkeleton: FC<ISelectSkeletonProps> = ({ rows = 2 }) => {
  return (
    <div className="flex flex-col gap-y-1">
      {Array(rows)
        .fill("")
        .map((_: unknown, index: number) => (
          <Skeleton key={index} variant="primary" shape="rounded" table="sm" />
        ))}
    </div>
  );
};

export default SelectSkeleton;
