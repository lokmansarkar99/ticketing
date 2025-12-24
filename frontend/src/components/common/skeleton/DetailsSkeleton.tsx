import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "../effect/PageTransition";
import SectionWrapper from "../wrapper/SectionWrapper";
import { cn } from "@/lib/utils";
import { GridWrapper } from "../wrapper/GridWrapper";

interface IDetailsSkeletonProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  items?: number;
  className?: React.CSSProperties;
}

const DetailsSkeleton: FC<IDetailsSkeletonProps> = ({
  columns = 3,
  items = 6,
  className,
}) => {
  return (
    <PageTransition>
      <SectionWrapper className="w-full my-2">
        <div className="flex flex-col justify-start w-full items-start my-4">
          <Skeleton
            variant="primary"
            shape="rounded"
            typography="h4"
            className="w-4/12"
          />
          <Skeleton
            className="mt-4 w-8/12"
            variant="primary"
            shape="rounded"
            typography="paragraph_sm"
          />
        </div>

        <GridWrapper
          columns={columns}
          className={cn("grid gap-x-4 gap-y-8 w-full my-4", className)}
        >
          {Array(items)
            .fill("")
            .map((_: unknown, index: number) => (
              <div className="w-full flex-col space-y-1.5" key={index}>
                <Skeleton
                  className="w-3/12"
                  variant="primary"
                  shape="rounded"
                  button="sm"
                />
                <Skeleton
                  className="w-full"
                  variant="primary"
                  shape="rounded"
                  typography="paragraph_sm"
                />
              </div>
            ))}
        </GridWrapper>
      </SectionWrapper>
    </PageTransition>
  );
};

export default DetailsSkeleton;
