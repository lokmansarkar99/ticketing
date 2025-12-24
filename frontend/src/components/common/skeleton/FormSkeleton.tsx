import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "../effect/PageTransition";
import SectionWrapper from "../wrapper/SectionWrapper";
import { cn } from "@/lib/utils";
import { GridWrapper } from "../wrapper/GridWrapper";

interface IFormSkeletonProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  inputs?: number;
  className?: React.CSSProperties;
}

const FormSkeleton: FC<IFormSkeletonProps> = ({
  columns = 3,
  inputs = 6,
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
          {Array(inputs)
            .fill("")
            .map((_: unknown, index: number) => (
              <div className="w-full flex-col space-y-2" key={index}>
                <Skeleton
                  className="w-10/12"
                  variant="primary"
                  shape="rounded"
                  typography="paragraph_sm"
                />
                <Skeleton
                  className="w-full"
                  variant="primary"
                  shape="rounded"
                  input="default"
                />
              </div>
            ))}
        </GridWrapper>
        <div className="w-full flex justify-end mt-4">
          <Skeleton
            className="w-48"
            variant="primary"
            shape="rounded"
            button="default"
          />
        </div>
      </SectionWrapper>
    </PageTransition>
  );
};

export default FormSkeleton;
