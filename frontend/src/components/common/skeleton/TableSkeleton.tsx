import { FC } from "react";
import SectionWrapper from "../wrapper/SectionWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import PageTransition from "../effect/PageTransition";

interface ITableSkeletonProps {
  columns?: number;
  rows?: number;
}

const TableSkeleton: FC<ITableSkeletonProps> = ({ columns = 6, rows = 10 }) => {
  return (
    <PageTransition variant="fade">
      <SectionWrapper className="w-full my-8">
        <div className="flex flex-col justify-start w-full items-start">
          <Skeleton
            variant="primary"
            shape="rounded"
            typography="h3"
            className="w-4/12"
          />
          <Skeleton
            className="mt-2 w-8/12"
            variant="primary"
            shape="rounded"
            typography="paragraph_sm"
          />
        </div>
        <div className="w-full flex justify-end mt-8 mb-2">
          <div className="flex gap-x-2 w-1/2 justify-end">
            <Skeleton
              className="w-5/12"
              variant="primary"
              shape="rounded"
              input="default"
            />
            <Skeleton variant="primary" shape="rounded" button="icon" />
            <Skeleton
              className="w-2/12"
              variant="primary"
              shape="rounded"
              button="sm"
            />
          </div>
        </div>
        <div className="rounded-md border-2 border-border/30 overflow-hidden w-full">
          <Table>
            <TableHeader>
              <TableRow className="!border-0 bg-background hover:bg-background/90 !rounded-md">
                {Array(columns)
                  .fill(null)
                  .map((_, index) => (
                    <TableHead key={index} className="!h-10 leading-6 truncate">
                      <Skeleton
                        className={cn(columns >= 5 ? "w-9/12" : "w-3/12")}
                        variant="primary"
                        shape="rounded"
                        typography="paragraph_sm"
                      />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y-0 border-0">
              {Array(rows)
                .fill(null)
                .map((_, index) => (
                  <TableRow
                    key={index}
                    className={cn(
                      index % 2 === 0 ? "bg-background/30" : "bg-background/60",
                      "divide-y-0 border-0  !py-0 !mt-0"
                    )}
                  >
                    {Array(columns - 1)
                      .fill(null)
                      .map((_, index) => (
                        <TableHead
                          key={index}
                          className="!h-10 leading-6 truncate"
                        >
                          <Skeleton
                            className={cn(columns >= 5 ? "w-9/12" : "w-3/12")}
                            variant="primary"
                            shape="rounded"
                            typography="paragraph_sm"
                          />
                        </TableHead>
                      ))}
                    <TableCell className="!h-10 py-0 w-40">
                      <Skeleton
                        className="!size-8"
                        variant="primary"
                        shape="rounded"
                        button="icon"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="flex w-full px-4 items-center py-1 justify-between">
            <div className="w-full">
              <Skeleton
                className="w-7/12"
                variant="primary"
                shape="rounded"
                typography="paragraph_sm"
              />
            </div>
            <div className="w-full flex gap-x-1.5 items-center justify-end">
              <Skeleton
                className="w-2/12"
                variant="primary"
                shape="rounded"
                button="sm"
              />
              <Skeleton
                className="w-1/12"
                variant="primary"
                shape="rounded"
                button="icon"
              />
              <Skeleton
                className="w-1/12"
                variant="primary"
                shape="rounded"
                button="icon"
              />
              <Skeleton className="w-5 h-3" variant="primary" />

              <Skeleton
                className="w-2/12"
                variant="primary"
                shape="rounded"
                button="default"
              />
              <Skeleton
                className="w-1/12"
                variant="primary"
                shape="rounded"
                button="icon"
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageTransition>
  );
};

export default TableSkeleton;
